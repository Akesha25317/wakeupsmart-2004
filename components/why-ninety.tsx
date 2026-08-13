"use client"

import { motion } from "framer-motion"

/** Build a smooth Catmull-Rom path through the given points. */
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return ""
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}

const POINTS: [number, number][] = [
  [10, 24],
  [40, 90],
  [72, 172],
  [112, 148],
  [132, 60],
  [162, 96],
  [196, 166],
  [236, 150],
  [256, 58],
  [286, 100],
  [322, 150],
  [362, 130],
  [382, 56],
  [412, 106],
  [446, 132],
  [486, 122],
  [506, 54],
  [536, 110],
  [566, 122],
  [604, 96],
  [630, 50],
]

const STAGES = [
  { label: "Awake", y: 24 },
  { label: "REM", y: 57 },
  { label: "Light", y: 105 },
  { label: "Deep", y: 168 },
]

const FACTS = [
  {
    title: "One cycle, four stages",
    body: "Each ~90-minute cycle moves from light sleep into deep restorative sleep and finishes in REM, where you dream.",
  },
  {
    title: "Timing beats duration",
    body: "Waking at the end of a cycle — in light sleep — feels effortless. Waking mid-deep-sleep leaves you groggy.",
  },
  {
    title: "Aim for full cycles",
    body: "Five to six complete cycles (7.5–9 hours) is the sweet spot for most adults to feel genuinely rested.",
  },
]

export function WhyNinety() {
  const d = smoothPath(POINTS)

  return (
    <section id="why" className="relative mx-auto max-w-4xl px-5 py-24 sm:py-32">
      <div className="mb-12 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Why 90 minutes?</h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          Sleep isn&apos;t flat — it moves in waves. A single night is really a series of 90-minute cycles.
        </p>
      </div>

      {/* Animated hypnogram */}
      <div className="glass rounded-3xl p-4 shadow-2xl shadow-black/40 sm:p-8">
        <div className="relative">
          <svg viewBox="0 0 660 200" className="w-full" role="img" aria-label="Animated chart of sleep stages across the night">
            <defs>
              <linearGradient id="cycleStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="oklch(0.55 0.16 285)" />
                <stop offset="100%" stopColor="oklch(0.72 0.16 315)" />
              </linearGradient>
              <linearGradient id="cycleFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.19 300 / 0.28)" />
                <stop offset="100%" stopColor="oklch(0.62 0.19 300 / 0)" />
              </linearGradient>
            </defs>

            {/* Stage gridlines */}
            {STAGES.map((s) => (
              <g key={s.label}>
                <line x1="10" y1={s.y} x2="650" y2={s.y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
                <text x="0" y={s.y - 4} fill="var(--muted-foreground)" fontSize="9" fontFamily="var(--font-mono)">
                  {s.label}
                </text>
              </g>
            ))}

            {/* Filled area under the curve */}
            <motion.path
              d={`${d} L 630 200 L 10 200 Z`}
              fill="url(#cycleFill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.4 }}
            />

            {/* The animated line */}
            <motion.path
              d={d}
              fill="none"
              stroke="url(#cycleStroke)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>
        <div className="mt-4 flex items-center justify-between px-2 text-xs text-muted-foreground">
          <span>Fall asleep</span>
          <span className="hidden sm:inline">~90 min per cycle</span>
          <span>Wake up</span>
        </div>
      </div>

      {/* Facts */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {FACTS.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
