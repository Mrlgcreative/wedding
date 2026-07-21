import { useState, useEffect } from 'react'
import type { TemplateProps } from '../../types/wedding'
import { formatDate, getCountdown } from '../../utils/helpers'

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L9 9l-7 1 5.5 5L6 22l6-4 6 4-1.5-7L22 10l-7-1-3-7z" />
    </svg>
  )
}

function WreathFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-6">
      <svg className="absolute -top-8 left-1/2 w-80 -translate-x-1/2 opacity-[0.12]" viewBox="0 0 400 200" fill="none" stroke="white" strokeWidth="1.2">
        <path d="M200 10C100 10 20 60 20 130s80 60 180 60 180-10 180-60-80-120-180-120z" strokeLinecap="round" />
        <path d="M100 40c-10 20-5 40 10 50" strokeLinecap="round" />
        <path d="M300 40c10 20 5 40-10 50" strokeLinecap="round" />
        <path d="M60 90c-8 15-3 30 8 35" strokeLinecap="round" />
        <path d="M340 90c8 15 3 30-8 35" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  )
}

export default function BohoTemplate({ data }: TemplateProps) {
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: p.primary }} />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <LeafIcon className="h-6 w-6 opacity-50" />

          <WreathFrame>
            <span className="mt-4 font-serif text-xs tracking-[0.35em] uppercase opacity-70">Save the date</span>
            <h1 className="mt-5 font-couple font-light italic" style={{ fontSize: 'var(--font-couple-size)' }}>
              {couple.partner1}
            </h1>
            <div className="my-3 flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />
              <span className="font-serif text-lg italic opacity-40">&</span>
              <span className="h-px w-8 bg-white/30" />
            </div>
            <h1 className="font-couple font-light italic" style={{ fontSize: 'var(--font-couple-size)' }}>
              {couple.partner2}
            </h1>
            <p className="mt-5 font-serif text-sm tracking-wide opacity-80">{formatDate(date)}</p>
          </WreathFrame>

          <div className="absolute bottom-10 animate-bounce">
            <svg className="h-5 w-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {cd.days > 0 && (
          <div className="grid grid-cols-4 gap-3 text-center">
            {[['jours', cd.days], ['heures', cd.hours], ['minutes', cd.minutes], ['secondes', cd.seconds]].map(
              ([label, val]) => (
                <div key={label as string} className="rounded-full p-3" style={{ backgroundColor: p.accent }}>
                  <span className="block font-serif text-2xl font-light">{val as number}</span>
                  <span className="block text-[10px] uppercase tracking-widest">{label as string}</span>
                </div>
              ),
            )}
          </div>
        )}

        {story && (
          <section className="mt-16 text-center">
            <h2 className="font-serif text-xl font-light italic">Notre histoire</h2>
            <div className="mt-6 leading-relaxed text-sm/relaxed">{story}</div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-center font-serif text-xl font-light italic">Au programme</h2>
          <div className="mt-8 space-y-8">
            {events.map((event) => (
              <div key={event.type} className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: p.secondary }} />
                <div className="absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: p.secondary, backgroundColor: p.background }} />
                <div className="rounded-2xl border p-5" style={{ borderColor: p.accent }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: p.secondary }}>
                        {event.type === 'mairie' ? 'Mairie' : event.type === 'ceremonie' ? 'Cérémonie' : 'Réception'}
                      </span>
                      <h3 className="mt-1 font-serif text-base">{event.name}</h3>
                    </div>
                    <span className="shrink-0 font-serif text-sm" style={{ color: p.secondary }}>{event.time}</span>
                  </div>
                  <p className="mt-2 text-xs">{event.address}</p>
                  {event.notes && <p className="mt-2 text-xs italic opacity-60">{event.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="font-serif text-xl font-light italic">Dress Code</h2>
          <p className="mt-4 font-serif text-base" style={{ color: p.primary }}>{dressCode.theme}</p>
          <p className="mt-4 text-sm leading-relaxed">{dressCode.instructions}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            {[p.primary, p.secondary, p.accent].map((c) => (
              <span key={c} className="inline-block h-10 w-10 rounded-full border-2 shadow-md" style={{ backgroundColor: c, borderColor: p.background }} />
            ))}
          </div>
        </section>

        <footer className="mt-16 text-center text-[11px] opacity-50">
          <LeafIcon className="inline-block h-5 w-5" />
          <p className="mt-2">Avec tout notre amour</p>
        </footer>
      </div>
    </div>
  )
}
