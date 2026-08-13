"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Waves } from "lucide-react"

const PRESETS = [5, 10, 15, 20, 30, 45]
const FADE_SECONDS = 20

export function SleepTimer() {
  const [minutes, setMinutes] = useState(15)
  const [remaining, setRemaining] = useState(15 * 60)
  const [running, setRunning] = useState(false)

  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const endAtRef = useRef<number>(0)

  const total = minutes * 60

  const stopAudio = useCallback((fade = false) => {
    const ctx = ctxRef.current
    const gain = gainRef.current
    if (ctx && gain) {
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0.0001, now + (fade ? 1.5 : 0.15))
    }
    const src = sourceRef.current
    if (src) {
      try {
        src.stop((ctxRef.current?.currentTime ?? 0) + (fade ? 1.6 : 0.2))
      } catch {
        /* already stopped */
      }
    }
    setTimeout(
      () => {
        ctxRef.current?.close().catch(() => {})
        ctxRef.current = null
        gainRef.current = null
        sourceRef.current = null
      },
      fade ? 1800 : 300,
    )
  }, [])

  const startAudio = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    // Generate a few seconds of soft brown noise for a warm ambient bed.
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      lastOut = (lastOut + 0.02 * white) / 1.02
      data[i] = lastOut * 3.5
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Gentle lowpass so it feels like distant waves rather than static.
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 520

    // Slow LFO on the filter for a breathing, tide-like motion.
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.1
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 180
    lfo.connect(lfoGain).connect(filter.frequency)

    const gain = ctx.createGain()
    gain.gain.value = 0.0001
    gainRef.current = gain

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()
    lfo.start()
    sourceRef.current = source

    // Fade in.
    const now = ctx.currentTime
    gain.gain.linearRampToValueAtTime(0.32, now + 2.5)
  }, [])

  // Schedule the auto fade-out near the end.
  const scheduleFade = useCallback((secondsLeft: number) => {
    const ctx = ctxRef.current
    const gain = gainRef.current
    if (!ctx || !gain) return
    if (secondsLeft <= FADE_SECONDS) {
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0.0001, now + secondsLeft)
    }
  }, [])

  const tick = useCallback(() => {
    const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
    setRemaining(left)
    scheduleFade(left)
    if (left <= 0) {
      setRunning(false)
      stopAudio(false)
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [scheduleFade, stopAudio])

  const start = useCallback(() => {
    endAtRef.current = Date.now() + remaining * 1000
    setRunning(true)
    startAudio()
    rafRef.current = requestAnimationFrame(tick)
  }, [remaining, startAudio, tick])

  const pause = useCallback(() => {
    setRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    stopAudio(true)
  }, [stopAudio])

  const reset = useCallback(
    (mins = minutes) => {
      setRunning(false)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      stopAudio(false)
      setRemaining(mins * 60)
    },
    [minutes, stopAudio],
  )

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ctxRef.current?.close().catch(() => {})
    }
  }, [])

  const progress = total > 0 ? 1 - remaining / total : 0
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")

  return (
    <section id="timer" className="relative mx-auto max-w-3xl px-5 py-24 sm:py-32">
      <div className="mb-10 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Ambient Sleep Timer</h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Drift off to soft, tide-like noise that gently fades to silence before it ends.
        </p>
      </div>

      <div className="glass flex flex-col items-center rounded-3xl p-8 shadow-2xl shadow-black/40 sm:p-12">
        {/* Progress ring */}
        <div className="relative flex items-center justify-center">
          <svg width="272" height="272" viewBox="0 0 272 272" className="-rotate-90">
            <circle cx="136" cy="136" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
            <motion.circle
              cx="136"
              cy="136"
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - progress) }}
              transition={{ ease: "linear", duration: 0.3 }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <motion.div
              animate={running ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
              transition={{ duration: 3.5, repeat: running ? Infinity : 0, ease: "easeInOut" }}
              className="mb-1 text-primary"
            >
              <Waves className="size-6" aria-hidden="true" />
            </motion.div>
            <div className="text-6xl font-semibold tabular-nums tracking-tight">
              {mm}:{ss}
            </div>
            <span className="mt-1 text-xs text-muted-foreground">
              {running ? "Playing ambient sound" : "Ready"}
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              disabled={running}
              onClick={() => {
                setMinutes(m)
                reset(m)
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${
                minutes === m
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={running ? pause : start}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-card/60"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Reset</span>
          </button>
        </div>
      </div>
    </section>
  )
}
