"use client"

import { FormEvent, useMemo, useState } from "react"
import { Heart, LockKeyhole, MoonStar, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/lib/use-local-storage"

type Entry = { id: string; date: string; sleep: string; wake: string; mood: number; gratitude: string; note: string }
const moods = ["Drained", "Low", "Okay", "Good", "Rested"]

export function SleepJournal() {
  const [entries, setEntries, ready] = useLocalStorage<Entry[]>("wakeupsmart-journal", [])
  const [mood, setMood] = useState(3)
  const streak = useMemo(() => { const days = new Set(entries.map(e => e.date)); let n=0; const d=new Date(); while(days.has(d.toISOString().slice(0,10))){ n++; d.setDate(d.getDate()-1) } return n }, [entries])
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    const entry: Entry = { id: crypto.randomUUID(), date: new Date().toISOString().slice(0,10), sleep: String(form.get("sleep")), wake: String(form.get("wake")), mood, gratitude: String(form.get("gratitude")), note: String(form.get("note")) }
    setEntries(current => [entry, ...current.filter(e => e.date !== entry.date)].slice(0,14)); event.currentTarget.reset(); setMood(3)
  }
  return <section id="journal" className="mx-auto max-w-6xl px-5 py-20">
    <div className="mb-10 flex flex-col gap-3"><p className="text-sm font-medium text-primary">SLEEP JOURNAL</p><h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Notice what helps you heal.</h2><p className="max-w-xl leading-relaxed text-muted-foreground">A quiet record of your nights, mornings, and moments of gratitude.</p></div>
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <form onSubmit={save} className="glass flex flex-col gap-6 rounded-3xl p-5 sm:p-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="size-4 text-primary"/>Private on this device. Nothing is uploaded.</div>
        <div className="grid grid-cols-2 gap-3"><label className="flex flex-col gap-2 text-sm">Fell asleep<input required name="sleep" type="time" className="h-12 rounded-xl border border-border bg-secondary/60 px-3"/></label><label className="flex flex-col gap-2 text-sm">Woke up<input required name="wake" type="time" className="h-12 rounded-xl border border-border bg-secondary/60 px-3"/></label></div>
        <fieldset className="flex flex-col gap-3"><legend className="text-sm">How do you feel?</legend><div className="grid grid-cols-5 gap-2">{moods.map((label,i)=><button type="button" key={label} aria-pressed={mood===i+1} onClick={()=>setMood(i+1)} className={`rounded-xl border px-1 py-3 text-xs transition-colors ${mood===i+1 ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground"}`}>{label}</button>)}</div></fieldset>
        <label className="flex flex-col gap-2 text-sm"><span className="flex items-center gap-2"><Heart className="size-4 text-primary"/>One thing I’m grateful for</span><input required name="gratitude" maxLength={140} placeholder="A small moment worth keeping..." className="h-12 rounded-xl border border-border bg-secondary/60 px-4"/></label>
        <label className="flex flex-col gap-2 text-sm">Night notes<textarea name="note" maxLength={400} rows={3} placeholder="What helped, what felt difficult..." className="rounded-xl border border-border bg-secondary/60 p-4 leading-relaxed"/></label>
        <Button className="h-12 rounded-full">Save today’s reflection</Button>
      </form>
      <div className="glass rounded-3xl p-5 sm:p-8"><div className="mb-6 flex items-start justify-between"><div><p className="text-sm text-muted-foreground">Current rhythm</p><p className="mt-1 text-3xl font-semibold">{streak} night streak</p></div><MoonStar className="size-6 text-primary"/></div>
        <div className="flex flex-col gap-3">{ready && entries.length ? entries.slice(0,5).map(entry=><article key={entry.id} className="rounded-2xl bg-secondary/55 p-4"><div className="flex items-center justify-between"><time className="text-sm font-medium">{new Date(entry.date+"T12:00").toLocaleDateString(undefined,{month:"short",day:"numeric"})}</time><button aria-label="Delete entry" onClick={()=>setEntries(x=>x.filter(e=>e.id!==entry.id))} className="text-muted-foreground hover:text-foreground"><Trash2 className="size-4"/></button></div><p className="mt-2 text-sm text-muted-foreground">{entry.sleep} → {entry.wake} · {moods[entry.mood-1]}</p><p className="mt-2 text-sm">“{entry.gratitude}”</p></article>) : <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Your reflections will appear here.</div>}</div>
      </div>
    </div>
  </section>
}
