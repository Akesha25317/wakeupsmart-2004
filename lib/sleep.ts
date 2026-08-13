export const CYCLE_MINUTES = 90
export const FALL_ASLEEP_MINUTES = 15

export type SleepResult = {
  /** Date object for the computed time */
  date: Date
  /** Number of complete 90-min cycles */
  cycles: number
  /** Total sleep duration in hours (e.g. 7.5) */
  hours: number
  /** Whether this is the most recommended option */
  recommended: boolean
}

/**
 * Parse a "HH:MM" 24h string into hours/minutes.
 */
function parseTime(value: string): { h: number; m: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return { h, m }
}

function baseDate(h: number, m: number): Date {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

/**
 * Given a bedtime, return the best wake-up times.
 * We add the fall-asleep buffer, then step through full cycles.
 * Cycles 6 (9h), 5 (7.5h) and 4 (6h) are considered ideal.
 */
export function wakeTimesFromBed(bedTime: string): SleepResult[] {
  const parsed = parseTime(bedTime)
  if (!parsed) return []
  const start = baseDate(parsed.h, parsed.m)
  const cycles = [6, 5, 4]
  return cycles.map((c, i) => {
    const date = new Date(start)
    date.setMinutes(date.getMinutes() + FALL_ASLEEP_MINUTES + c * CYCLE_MINUTES)
    return {
      date,
      cycles: c,
      hours: (c * CYCLE_MINUTES) / 60,
      recommended: i === 0,
    }
  })
}

/**
 * Given a desired wake-up time, return the best times to go to bed.
 * We subtract full cycles plus the fall-asleep buffer.
 */
export function bedTimesFromWake(wakeTime: string): SleepResult[] {
  const parsed = parseTime(wakeTime)
  if (!parsed) return []
  const wake = baseDate(parsed.h, parsed.m)
  const cycles = [6, 5, 4]
  return cycles.map((c, i) => {
    const date = new Date(wake)
    date.setMinutes(date.getMinutes() - FALL_ASLEEP_MINUTES - c * CYCLE_MINUTES)
    return {
      date,
      cycles: c,
      hours: (c * CYCLE_MINUTES) / 60,
      recommended: i === 0,
    }
  })
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function getTimezoneLabel(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')
  } catch {
    return 'your timezone'
  }
}

/** Current local time as an "HH:MM" string for input defaults. */
export function nowTimeString(offsetMinutes = 0): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() + offsetMinutes)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
