import { useState, useEffect } from 'react'
import type { TemplateProps } from '../../types/wedding'
import { formatDate, getCountdown } from '../../utils/helpers'

function ArchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-8">
      <svg className="absolute -top-12 left-1/2 w-72 -translate-x-1/2 opacity-[0.15]" viewBox="0 0 400 120" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M30 120V60C30 27 57 2 90 2h220c33 0 60 25 60 60v58" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  )
}

export default function ClassicTemplate({ data }: TemplateProps) {
  const { couple, date, events, dressCode, story, photos } = data
  const palette = dressCode.palette
  const [countdown, setCountdown] = useState(getCountdown(date))
  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown(date)), 1000)
    return () => clearInterval(timer)
  }, [date])

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: palette.background, color: palette.text }}>
      <header className="relative h-screen w-full overflow-hidden">
        {photos?.hero ? (
          <>
            <img src={photos.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          </>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: palette.primary }} />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <ArchFrame>
            <span className="font-serif text-sm tracking-[0.35em] uppercase opacity-80">Mariage</span>
            <h1 className="mt-5 font-couple font-light tracking-wide" style={{ fontSize: 'var(--font-couple-size)' }}>
              {couple.partner1}
            </h1>
            <span className="my-3 font-serif text-2xl opacity-50">&</span>
            <h1 className="font-couple font-light tracking-wide" style={{ fontSize: 'var(--font-couple-size)' }}>
              {couple.partner2}
            </h1>
            <div className="mt-6 h-px w-16 bg-white/50" />
            <p className="mt-5 font-serif text-base tracking-wide opacity-80">{formatDate(date)}</p>
          </ArchFrame>

          <div className="absolute bottom-10 animate-bounce">
            <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {countdown.days > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4 text-center">
            {(['jours', 'heures', 'minutes', 'secondes'] as const).map((label, i) => {
              const value = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds][i]
              return (
                <div key={label} className="rounded-lg p-4" style={{ backgroundColor: palette.accent }}>
                  <span className="block font-serif text-3xl font-light">{value}</span>
                  <span className="mt-1 block text-xs uppercase tracking-widest">{label}</span>
                </div>
              )
            })}
          </div>
        )}

        {story && (
          <section className="mt-16 text-center">
            <h2 className="font-serif text-2xl font-light">Notre histoire</h2>
            <div className="mt-2 h-px w-16 mx-auto" style={{ backgroundColor: palette.secondary }} />
            <p className="mt-6 leading-relaxed text-base/relaxed">{story}</p>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-center font-serif text-2xl font-light">Au programme</h2>
          <div className="mt-2 h-px w-16 mx-auto" style={{ backgroundColor: palette.secondary }} />
          <div className="mt-8 space-y-6">
            {events.map((event) => (
              <div key={event.type} className="rounded-lg border p-6" style={{ borderColor: palette.accent }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest" style={{ color: palette.secondary }}>
                      {event.type === 'mairie' ? 'Mairie' : event.type === 'ceremonie' ? 'Cérémonie' : 'Réception'}
                    </p>
                    <h3 className="mt-1 font-serif text-lg">{event.name}</h3>
                  </div>
                  <p className="shrink-0 font-serif text-sm" style={{ color: palette.secondary }}>{event.time}</p>
                </div>
                <p className="mt-2 text-sm">{event.address}</p>
                {event.notes && <p className="mt-2 text-sm italic opacity-80">{event.notes}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="font-serif text-2xl font-light">Dress Code</h2>
          <div className="mt-2 h-px w-16 mx-auto" style={{ backgroundColor: palette.secondary }} />
          <p className="mt-4 font-serif text-lg" style={{ color: palette.primary }}>{dressCode.theme}</p>
          <p className="mt-4 text-sm leading-relaxed">{dressCode.instructions}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {[palette.primary, palette.secondary, palette.accent].map((color) => (
              <span key={color} className="inline-block h-8 w-8 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t pt-8 text-center text-xs opacity-60" style={{ borderColor: palette.accent }}>
          <p>Merci d'avoir consulté notre faire-part.</p>
          <p className="mt-1">Nous avons hâte de partager ce jour avec vous.</p>
        </footer>
      </div>
    </div>
  )
}
