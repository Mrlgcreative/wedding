import { useState, useEffect } from 'react'
import type { TemplateProps } from '../../types/wedding'
import { formatDate, getCountdown } from '../../utils/helpers'

function LineFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-8">
      <svg className="absolute -top-6 left-1/2 w-72 -translate-x-1/2 opacity-[0.08]" viewBox="0 0 300 160" fill="none" stroke="white" strokeWidth="0.8">
        <rect x="4" y="4" width="292" height="152" rx="2" />
        <rect x="20" y="20" width="260" height="120" rx="1" />
        <line x1="40" y1="80" x2="260" y2="80" />
      </svg>
      {children}
    </div>
  )
}

export default function MinimalistTemplate({ data }: TemplateProps) {
  const { couple, date, events, dressCode, story, photos } = data
  const p = dressCode.palette
  const [cd, setCd] = useState(getCountdown(date))

  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown(date)), 1000)
    return () => clearInterval(t)
  }, [date])

  return (
    <div className="min-h-screen" style={{ backgroundColor: p.background, color: p.text }}>
      <header className="relative h-screen w-full overflow-hidden">
        {photos?.hero ? (
          <>
            <img src={photos.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
            <div className="absolute inset-0 backdrop-brightness-[0.5]" />
          </>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: p.primary }} />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <LineFrame>
            <span className="text-[9px] uppercase tracking-[0.5em] opacity-40">Wedding</span>
            <div className="mt-10 space-y-1">
              <h1 className="font-couple font-light tracking-tight" style={{ fontSize: 'var(--font-couple-size)' }}>
                {couple.partner1}
              </h1>
              <p className="text-xs opacity-30">—</p>
              <h1 className="font-couple font-light tracking-tight" style={{ fontSize: 'var(--font-couple-size)' }}>
                {couple.partner2}
              </h1>
            </div>
            <p className="mt-8 text-xs font-light tracking-[0.3em] uppercase opacity-60">{formatDate(date)}</p>
          </LineFrame>

          <div className="absolute bottom-10">
            <svg className="h-4 w-4 animate-pulse opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-20 sm:px-8">
        {cd.days > 0 && (
          <div className="grid grid-cols-4 gap-2 text-center">
            {[['jours', cd.days], ['heures', cd.hours], ['minutes', cd.minutes], ['secondes', cd.seconds]].map(
              ([label, val]) => (
                <div key={label as string} className="py-3">
                  <span className="block text-3xl font-light tabular-nums tracking-tight">{val as number}</span>
                  <span className="block text-[10px] uppercase tracking-[0.2em] mt-1 opacity-50">{label as string}</span>
                </div>
              ),
            )}
          </div>
        )}

        {story && (
          <section className="mt-16 text-center">
            <p className="text-sm leading-relaxed opacity-70 max-w-md mx-auto">{story}</p>
          </section>
        )}

        <section className="mt-16">
          <div className="space-y-0 divide-y" style={{ borderColor: p.accent }}>
            {events.map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-4 py-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.15em] opacity-40">
                    {event.type}
                  </span>
                  <h3 className="mt-0.5 text-sm font-medium">{event.name}</h3>
                  <p className="mt-0.5 text-xs opacity-50">{event.address}</p>
                  {event.notes && <p className="mt-1 text-xs italic opacity-40">{event.notes}</p>}
                </div>
                <span className="shrink-0 text-xs font-medium tabular-nums" style={{ color: p.secondary }}>
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">Dress Code</span>
          <p className="mt-2 text-sm font-medium">{dressCode.theme}</p>
          <p className="mt-3 text-xs leading-relaxed opacity-60 max-w-xs mx-auto">{dressCode.instructions}</p>
          <div className="mt-5 flex items-center justify-center gap-2">
            {[p.primary, p.secondary, p.accent].map((c) => (
              <span key={c} className="inline-block h-5 w-5 rounded" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>

        <footer className="mt-20 pt-8 text-center text-[10px] uppercase tracking-[0.2em] opacity-30">
          Merci
        </footer>
      </div>
    </div>
  )
}
