import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { SleepCalculator } from "@/components/sleep-calculator"
import { WhyNinety } from "@/components/why-ninety"
import { SiteFooter } from "@/components/site-footer"
import { BreathingTimer } from "@/components/breathing-timer"
import { NaturalSounds } from "@/components/natural-sounds"
import { SleepJournal } from "@/components/sleep-journal"
import { SmartAlarm } from "@/components/smart-alarm"
import { GuidedRest } from "@/components/guided-rest"
import { AnxietyToolkit } from "@/components/anxiety-toolkit"
import { SleepInsights } from "@/components/sleep-insights"

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <Hero />
        <SleepCalculator />
        <BreathingTimer />
        <NaturalSounds />
        <SleepJournal />
        <SmartAlarm />
        <GuidedRest />
        <AnxietyToolkit />
        <WhyNinety />
        <SleepInsights />
      </main>
      <footer className="w-full text-center py-6 px-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
  <p className="text-sm text-gray-600 dark:text-gray-400">
    Built with ❤️ by <span className="font-semibold text-black dark:text-white">Thashan Akesha</span> | 2026
  </p>
</footer>
    </div>
  )
}
