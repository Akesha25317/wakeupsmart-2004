"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      {/* Ambient glow */}
      <div aria-hidden="true" className="aura pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 size-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <motion.span
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          Science-backed 90-minute cycles
        </motion.span>

        <motion.h1
          variants={item}
          className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Wake up at the <span className="text-gradient">right time.</span>{" "}
          <span className="text-gradient">Fall asleep calm.</span>
        </motion.h1>

        <motion.p variants={item} className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
          Plan your sleep, settle your nervous system, and keep every private reflection safely in your browser.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex items-center justify-center gap-3">
          <a
            href="#calculator"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
          >
            Calculate my times
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
          <a
            href="#calm"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-card/60"
          >
            Calm my mind
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
