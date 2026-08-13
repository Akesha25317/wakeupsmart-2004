"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bed, Sunrise, Clock, Globe, Sparkles } from "lucide-react"
import {
  bedTimesFromWake,
  formatTime,
  getTimezoneLabel,
  nowTimeString,
  wakeTimesFromBed,
  type SleepResult,
} from "@/lib/sleep"

type Mode = "bed" | "wake"

export function SleepCalculator() {
  const [mode, setMode] = useState<Mode>("bed")
  const [bedTime, setBedTime] = useState(() => nowTimeString())
  const [wakeTime, setWakeTime] = useState("07:00")
  const tz = useMemo(() => getTimezoneLabel(), [])

  const results: SleepResult[] =
    mode === "bed" ? wakeTimesFromBed(bedTime) : bedTimesFromWake(wakeTime)

  return (
    <section id="calculator" className="relative mx-auto max-w-3xl px-5 py-24 sm:py-32">
      <div className="mb-10 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">The Sleep Calculator</h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Tell us one time and we&apos;ll find the three best matches aligned to your cycles.
        </p>
      </div>

      <div className="glass rounded-3xl p-2 shadow-2xl shadow-black/40">
        {/* Tabs */}
        <div className="relative grid grid-cols-2 gap-1 rounded-2xl bg-background/40 p-1">
          <TabButton active={mode === "bed"} onClick={() => setMode("bed")} icon={<Bed className="size-4" />}>
            I go to bed at
          </TabButton>
          <TabButton active={mode === "wake"} onClick={() => setMode("wake")} icon={<Sunrise className="size-4" />}>
            I wake up at
          </TabButton>
        </div>

        <div className="p-4 sm:p-6">
          {/* Time input */}
          <label className="flex flex-col items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {mode === "bed" ? "I want to fall asleep at" : "I need to wake up at"}
            </span>
            <input
              type="time"
              value={mode === "bed" ? bedTime : wakeTime}
              onChange={(e) => (mode === "bed" ? setBedTime(e.target.value) : setWakeTime(e.target.value))}
              className="w-full max-w-[220px] rounded-2xl border border-border bg-background/60 px-4 py-4 text-center text-4xl font-semibold tabular-nums tracking-tight text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/30 [color-scheme:dark]"
            />
          </label>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="size-3.5" aria-hidden="true" />
            Times shown in {tz}
          </p>

          {/* Results */}
          <div className="mt-8">
            <p className="mb-4 text-center text-sm font-medium text-foreground/70">
              {mode === "bed" ? "Best times to wake up" : "Best times to head to bed"}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((r, i) => (
                  <ResultCard key={`${mode}-${r.cycles}`} result={r} index={i} />
                ))}
              </AnimatePresence>
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Assumes ~15 min to fall asleep. Aim for the{" "}
              <span className="text-primary">recommended</span> option for a full night&apos;s rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-colors"
    >
      {active && (
        <motion.span
          layoutId="active-tab"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute inset-0 rounded-xl bg-primary shadow-lg shadow-primary/25"
        />
      )}
      <span className={`relative z-10 flex items-center gap-2 ${active ? "text-primary-foreground" : "text-muted-foreground"}`}>
        {icon}
        {children}
      </span>
    </button>
  )
}

function ResultCard({ result, index }: { result: SleepResult; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border p-4 text-center ${
        result.recommended
          ? "border-primary/50 bg-primary/10"
          : "border-border bg-background/40"
      }`}
    >
      {result.recommended && (
        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
          <Sparkles className="size-3" aria-hidden="true" />
          Best
        </span>
      )}
      <div className="text-2xl font-semibold tabular-nums tracking-tight">{formatTime(result.date)}</div>
      <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <Clock className="size-3" aria-hidden="true" />
        {result.hours} hrs · {result.cycles} cycles
      </div>
    </motion.div>
  )
}
