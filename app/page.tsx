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
<footer className="text-center py-6 text-gray-500 text-sm">
  Built with ❤️ by Pramudika thashan  | 2026
</footer>
      </main>
      <SiteFooter />
    </div>
  )
}
