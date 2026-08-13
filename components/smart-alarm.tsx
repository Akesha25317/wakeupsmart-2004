"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, BellRing, Play, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/lib/use-local-storage"

type Alarm = { time: string; sound: string; enabled: boolean }
export function SmartAlarm() {
  const [alarm, setAlarm, ready] = useLocalStorage<Alarm>("wakeupsmart-alarm", { time: "07:00", sound: "Morning bells", enabled: false })
  const timer = useRef<number | null>(null)
  const preview = () => {
    const ctx = new AudioContext(); const gain = ctx.createGain(); gain.connect(ctx.destination); gain.gain.setValueAtTime(0,ctx.currentTime); gain.gain.linearRampToValueAtTime(.18,ctx.currentTime+.8); gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+5)
    ;[0,1.2,2.4].forEach((delay,i)=>{ const o=ctx.createOscillator(); o.type="sine"; o.frequency.value=[440,523,659][i]; o.connect(gain); o.start(ctx.currentTime+delay); o.stop(ctx.currentTime+delay+2.5) }); window.setTimeout(()=>ctx.close(),5500)
  }
  useEffect(()=>{ if (!ready || !alarm.enabled) return; timer.current=window.setInterval(()=>{ const now=new Date(); const current=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`; if(current===alarm.time && now.getSeconds()<2){ preview(); new Notification("WakeUpSmart",{body:"Good morning. Wake gently."}) } },1000); return()=>{if(timer.current)clearInterval(timer.current)} },[alarm,ready])
  const toggle=async()=>{ if(!alarm.enabled && "Notification" in window && Notification.permission==="default") await Notification.requestPermission(); setAlarm({...alarm,enabled:!alarm.enabled}) }
  return <section id="alarm" className="mx-auto max-w-6xl px-5 py-20"><div className="grid gap-6 lg:grid-cols-2 lg:items-center"><div className="flex flex-col gap-4"><p className="text-sm font-medium text-primary">SMART WAKE</p><h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Wake gently, not abruptly.</h2><p className="max-w-lg leading-relaxed text-muted-foreground">A soft in-browser alarm designed to bring you back slowly. Keep this page and your device awake for it to sound.</p><div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-primary"/>Your alarm stays on this device.</div></div>
  <div className="glass rounded-3xl p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Next gentle wake</p><input aria-label="Alarm time" type="time" value={alarm.time} onChange={e=>setAlarm({...alarm,time:e.target.value})} className="mt-2 bg-transparent font-mono text-5xl font-medium tracking-tight outline-none"/></div>{alarm.enabled?<BellRing className="size-7 text-primary"/>:<Bell className="size-7 text-muted-foreground"/>}</div><select aria-label="Alarm sound" value={alarm.sound} onChange={e=>setAlarm({...alarm,sound:e.target.value})} className="mt-7 h-12 w-full rounded-xl border border-border bg-secondary px-4"><option>Morning bells</option><option>Soft chimes</option><option>Ocean dawn</option></select><div className="mt-4 flex gap-3"><Button variant="outline" onClick={preview} className="h-11 flex-1 rounded-full"><Play data-icon="inline-start"/>Preview</Button><Button onClick={toggle} className="h-11 flex-1 rounded-full">{alarm.enabled?"Alarm on":"Enable alarm"}</Button></div></div></div></section>
}
