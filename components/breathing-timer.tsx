"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Pause, Play, RotateCcw, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"

const PHASES = [
  { name: "Inhale", seconds: 4, cue: "Breathe in gently through your nose" },
  { name: "Hold", seconds: 7, cue: "Let your body become still" },
  { name: "Exhale", seconds: 8, cue: "Release slowly through your mouth" },
] as const

export function BreathingTimer() {
  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remaining, setRemaining] = useState(PHASES[0].seconds)
  const [cycles, setCycles] = useState(0)
  const phase = PHASES[phaseIndex]

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current > 1) return current - 1

        const nextIndex = (phaseIndex + 1) % PHASES.length
        if (phaseIndex === PHASES.length - 1) setCycles((value) => value + 1)
        setPhaseIndex(nextIndex)
        return PHASES[nextIndex].seconds
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running, phaseIndex])

  const orbScale = useMemo(() => {
    if (phase.name === "Inhale") return 1.18
    if (phase.name === "Exhale") return 0.78
    return 1.18
  }, [phase.name])

  function reset() {
    setRunning(false)
    setPhaseIndex(0)
    setRemaining(PHASES[0].seconds)
    setCycles(0)
  }

  return (
    <section id="calm" className="relative mx-auto max-w-5xl px-5 py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 h-80 bg-primary/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Wind aria-hidden="true" />
            Calm & anxiety tools
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">A quieter mind, one breath at a time.</h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            The 4-7-8 technique can help slow your heart rate and ease your nervous system toward rest.
          </p>
        </div>

        <div className="glass mx-auto max-w-3xl overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
          <div className="flex flex-col items-center px-6 py-10 sm:px-12 sm:py-14">
            <div className="relative flex size-64 items-center justify-center sm:size-72" aria-live="polite">
              <motion.div
                animate={{ scale: orbScale }}
                transition={{ duration: phase.seconds, ease: "easeInOut" }}
                className="absolute size-44 rounded-full bg-primary/20 blur-2xl sm:size-52"
              />
              <motion.div
                animate={{ scale: orbScale }}
                transition={{ duration: phase.seconds, ease: "easeInOut" }}
                className="absolute size-36 rounded-full border border-primary/40 bg-primary/15 shadow-[0_0_70px_color-mix(in_oklch,var(--primary)_35%,transparent)] sm:size-44"
              />
              <div className="relative text-center">
                <motion.p key={phase.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-medium">
                  {phase.name}
                </motion.p>
                <p className="mt-1 text-5xl font-semibold tabular-nums tracking-tight">{remaining}</p>
              </div>
            </div>

            <p className="min-h-6 text-center text-sm text-muted-foreground">{phase.cue}</p>

            <div className="mt-7 flex items-center gap-3">
              <Button
                size="lg"
                className="h-11 rounded-full px-6 shadow-lg shadow-primary/25"
                onClick={() => setRunning((value) => !value)}
              >
                {running ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}
                {running ? "Pause" : cycles ? "Continue" : "Begin breathing"}
              </Button>
              <Button size="icon-lg" variant="outline" className="rounded-full" onClick={reset} aria-label="Reset breathing timer">
                <RotateCcw />
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{cycles} {cycles === 1 ? "cycle" : "cycles"} complete</span>
              <span aria-hidden="true">·</span>
              <span>4 inhale · 7 hold · 8 exhale</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
