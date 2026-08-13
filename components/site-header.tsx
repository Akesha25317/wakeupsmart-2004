"use client"

import { Moon } from "lucide-react"
import { motion } from "framer-motion"

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Moon className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            WakeUp<span className="text-primary">Smart</span>
          </span>
        </a>

        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <a href="#calculator" className="hidden rounded-full px-3 py-1.5 transition-colors hover:text-foreground sm:block">
            Calculator
          </a>
          <a href="#calm" className="hidden rounded-full px-3 py-1.5 transition-colors hover:text-foreground md:block">Calm</a>
          <a href="#sounds" className="hidden rounded-full px-3 py-1.5 transition-colors hover:text-foreground md:block">Sounds</a>
          <a href="#journal" className="hidden rounded-full px-3 py-1.5 transition-colors hover:text-foreground lg:block">Journal</a>
          <a href="#anxiety" className="hidden rounded-full px-3 py-1.5 transition-colors hover:text-foreground lg:block">Grounding</a>
          {/* Language toggle — Sinhala coming soon */}
          <div className="ml-1 flex items-center gap-1 rounded-full border border-border bg-card/50 p-0.5 text-xs backdrop-blur">
            <span className="rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground">EN</span>
            <span
              className="cursor-not-allowed rounded-full px-2.5 py-1 text-muted-foreground/60"
              title="Sinhala coming soon"
            >
              SI
            </span>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
