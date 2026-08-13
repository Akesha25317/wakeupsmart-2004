"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { CloudRain, Pause, Play, Trees, Waves, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const sounds = [
  { id: "rain", label: "Rain", detail: "Soft window rain", icon: CloudRain },
  { id: "ocean", label: "Ocean", detail: "Slow rolling tide", icon: Waves },
  { id: "forest", label: "Forest", detail: "Night breeze", icon: Trees },
] as const

export function NaturalSounds() {
  const [selected, setSelected] = useState<(typeof sounds)[number]["id"]>("rain")
  const [playing, setPlaying] = useState(false)
  const [minutes, setMinutes] = useState(30)
  const [seconds, setSeconds] = useState(1800)
  const [volume, setVolume] = useState(45)
  const audio = useRef<{ ctx: AudioContext; gain: GainNode; sources: AudioNode[] } | null>(null)

  const stop = (fade = true) => {
    const a = audio.current
    if (!a) return
    const now = a.ctx.currentTime
    a.gain.gain.cancelScheduledValues(now)
    a.gain.gain.setValueAtTime(a.gain.gain.value, now)
    a.gain.gain.linearRampToValueAtTime(0, now + (fade ? 2 : 0.05))
    window.setTimeout(() => a.ctx.close().catch(() => {}), fade ? 2100 : 100)
    audio.current = null
    setPlaying(false)
  }

  const start = () => {
    stop(false)
    const ctx = new AudioContext()
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume / 100 * 0.3, ctx.currentTime + 2)
    gain.connect(ctx.destination)
    const sources: AudioNode[] = []
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = selected === "rain" ? "highpass" : "lowpass"
    filter.frequency.value = selected === "rain" ? 1200 : selected === "ocean" ? 500 : 900
    noise.connect(filter); filter.connect(gain); noise.start(); sources.push(noise)
    if (selected !== "rain") {
      const osc = ctx.createOscillator(); const waveGain = ctx.createGain()
      osc.frequency.value = selected === "ocean" ? 0.09 : 0.17
      waveGain.gain.value = 0.09
      osc.connect(waveGain); waveGain.connect(gain.gain); osc.start(); sources.push(osc)
    }
    audio.current = { ctx, gain, sources }
    setSeconds(minutes * 60); setPlaying(true)
  }

  useEffect(() => {
    if (!audio.current) return
    audio.current.gain.gain.setTargetAtTime(volume / 100 * 0.3, audio.current.ctx.currentTime, 0.2)
  }, [volume])
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setSeconds(s => { if (s <= 1) { stop(true); return 0 } return s - 1 }), 1000)
    return () => window.clearInterval(id)
  }, [playing])
  useEffect(() => () => stop(false), [])

  return <section id="sounds" className="mx-auto max-w-6xl px-5 py-20">
    <div className="mb-10 flex flex-col gap-3"><p className="text-sm font-medium text-primary">NATURAL SOUNDS</p><h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Let the day dissolve.</h2><p className="max-w-xl leading-relaxed text-muted-foreground">Generated privately in your browser. Choose a soundscape and let it gently fade when the timer ends.</p></div>
    <div className="glass rounded-3xl p-5 sm:p-8">
      <div className="grid gap-3 sm:grid-cols-3">{sounds.map(sound => <button key={sound.id} onClick={() => { if (playing) stop(); setSelected(sound.id) }} className={`flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition-all ${selected === sound.id ? "border-primary bg-primary/10" : "border-border bg-card/30 hover:bg-card/60"}`}><span className="flex size-11 items-center justify-center rounded-full bg-secondary"><sound.icon className="size-5" /></span><span><strong className="block">{sound.label}</strong><span className="text-sm text-muted-foreground">{sound.detail}</span></span></button>)}</div>
      <div className="mt-7 flex flex-col items-center gap-6 rounded-2xl bg-background/35 p-6 sm:flex-row sm:justify-between">
        <div><p className="font-mono text-4xl tabular-nums">{String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</p><p className="mt-1 text-sm text-muted-foreground">{playing ? `${selected} is playing` : "Ready when you are"}</p></div>
        <div className="flex flex-wrap items-center justify-center gap-3"><select aria-label="Sound timer" value={minutes} onChange={e => { setMinutes(Number(e.target.value)); setSeconds(Number(e.target.value)*60) }} className="h-11 rounded-full border border-border bg-secondary px-4 text-sm"><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select><label className="flex items-center gap-2 text-sm text-muted-foreground"><Volume2 className="size-4"/><input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-24 accent-primary" /></label><Button onClick={() => playing ? stop() : start()} className="h-11 rounded-full px-6">{playing ? <Pause data-icon="inline-start"/> : <Play data-icon="inline-start"/>}{playing ? "Pause" : "Play"}</Button></div>
      </div>
    </div>
  </section>
}
