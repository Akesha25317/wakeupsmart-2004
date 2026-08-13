"use client"

import { useCallback, useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved !== null) setValue(JSON.parse(saved) as T)
    } catch { /* keep safe default */ }
    setReady(true)
  }, [key])

  const update = useCallback((next: T | ((current: T) => T)) => {
    setValue(current => {
      const resolved = next instanceof Function ? next(current) : next
      try { window.localStorage.setItem(key, JSON.stringify(resolved)) } catch { /* storage unavailable */ }
      return resolved
    })
  }, [key])

  return [value, update, ready] as const
}
