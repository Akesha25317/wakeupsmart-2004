import { Moon } from "lucide-react"

const BLOG_LINKS = [
  "The science of sleep cycles",
  "How to fix a broken sleep schedule",
  "Naps: the 20-minute rule",
  "Why you wake up groggy",
]

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Preferences"]

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <Moon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold tracking-tight">
                WakeUp<span className="text-primary">Smart</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Better mornings, engineered around your natural 90-minute sleep cycles.
            </p>
          </div>

          <nav aria-label="Blog">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Blog</h2>
            <ul className="mt-4 space-y-2.5">
              {BLOG_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legal</h2>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} WakeUpSmart. For general wellness only — not medical advice.</p>
          <p>Made for better mornings</p>
        </div>
      </div>
    </footer>
  )
}
