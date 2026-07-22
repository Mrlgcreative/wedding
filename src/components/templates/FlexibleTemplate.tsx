import { useState, useEffect } from 'react'
import type { TemplateProps } from '../../types/wedding'
import { templateStyles, type TemplateStyle } from '../../types/templates'
import { formatDate, getCountdown } from '../../utils/helpers'

function Decoration({ style, palette }: { style: TemplateStyle; palette: { primary: string; secondary: string; accent: string; background: string; text: string } }) {
  const color = palette.secondary
  switch (style.decoration) {
    case 'arch':
      return (
        <svg className="absolute -top-12 left-1/2 w-72 -translate-x-1/2 opacity-[0.15]" viewBox="0 0 400 120" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M30 120V60C30 27 57 2 90 2h220c33 0 60 25 60 60v58" strokeLinecap="round" />
        </svg>
      )
    case 'floral':
      return (
        <div className="flex items-center gap-3 text-lg" style={{ color: palette.secondary }}>
          <span className="opacity-40">✿</span>
          <span className="opacity-30 text-sm">✦</span>
          <span className="opacity-40">✿</span>
        </div>
      )
    case 'geometric':
      return (
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-2 w-2 rotate-45 border" style={{ borderColor: palette.secondary, opacity: 0.4 - i * 0.1 }} />
          ))}
        </div>
      )
    case 'double-line':
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="h-px w-24" style={{ backgroundColor: palette.secondary }} />
          <div className="h-px w-16" style={{ backgroundColor: palette.secondary, opacity: 0.5 }} />
        </div>
      )
    case 'hearts':
      return (
        <div className="flex items-center gap-2 text-sm" style={{ color: palette.secondary }}>
          <span className="opacity-30">♡</span>
          <span className="opacity-50">❤</span>
          <span className="opacity-30">♡</span>
        </div>
      )
    case 'stars':
      return (
        <div className="flex items-center gap-2 text-xs" style={{ color: palette.secondary }}>
          <span className="opacity-30">✦</span>
          <span className="opacity-50">★</span>
          <span className="opacity-30">✦</span>
        </div>
      )
    case 'waves':
      return (
        <div className="flex gap-0.5" style={{ color: palette.secondary }}>
          {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
            <div key={i} className="w-1 rounded-full" style={{ height: `${h * 3}px`, backgroundColor: palette.secondary, opacity: 0.3 + h * 0.05 }} />
          ))}
        </div>
      )
    case 'dots':
      return (
        <div className="flex gap-1.5" style={{ color: palette.secondary }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.secondary, opacity: 0.5 - i * 0.15 }} />
          ))}
        </div>
      )
    default:
      return null
  }
}

function CoupleNames({ couple, style, palette }: { couple: { partner1: string; partner2: string }; style: TemplateStyle; palette: { primary: string; secondary: string; accent: string; background: string; text: string } }) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-couple font-light tracking-wide text-center" style={{ fontSize: 'var(--font-couple-size)' }}>
        {couple.partner1}
      </h1>
      <span className="my-3 font-serif text-2xl" style={{ color: palette.secondary, opacity: 0.6 }}>
        {style.coupleSeparator}
      </span>
      <h1 className="font-couple font-light tracking-wide text-center" style={{ fontSize: 'var(--font-couple-size)' }}>
        {couple.partner2}
      </h1>
    </div>
  )
}

function EventCard({ event, style, palette }: { event: { id: string; type: string; name: string; address: string; time: string; notes?: string }; style: TemplateStyle; palette: { primary: string; secondary: string; accent: string; background: string; text: string } }) {
  switch (style.eventCard) {
    case 'accent-left':
      return (
        <div className="flex gap-4 rounded-lg p-5" style={{ backgroundColor: `${palette.accent}40` }}>
          <div className="w-1 shrink-0 rounded-full" style={{ backgroundColor: palette.secondary }} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: palette.secondary }}>{event.type}</p>
                <h3 className="mt-1 font-serif text-base">{event.name}</h3>
              </div>
              <span className="shrink-0 font-serif text-sm" style={{ color: palette.secondary }}>{event.time}</span>
            </div>
            <p className="mt-2 text-xs">{event.address}</p>
            {event.notes && <p className="mt-2 text-xs italic opacity-60">{event.notes}</p>}
          </div>
        </div>
      )
    case 'filled':
      return (
        <div className="rounded-xl p-5 text-center" style={{ backgroundColor: `${palette.accent}50` }}>
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: palette.secondary }}>{event.type}</p>
          <h3 className="mt-1 font-serif text-base">{event.name}</h3>
          <p className="mt-1 text-xs" style={{ color: palette.secondary }}>{event.time}</p>
          <p className="mt-2 text-xs">{event.address}</p>
          {event.notes && <p className="mt-2 text-xs italic opacity-60">{event.notes}</p>}
        </div>
      )
    case 'minimal':
      return (
        <div className="flex items-start justify-between gap-4 py-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] opacity-40">{event.type}</span>
            <h3 className="mt-0.5 text-sm font-medium">{event.name}</h3>
            <p className="mt-0.5 text-xs opacity-50">{event.address}</p>
            {event.notes && <p className="mt-1 text-xs italic opacity-40">{event.notes}</p>}
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums" style={{ color: palette.secondary }}>{event.time}</span>
        </div>
      )
    default:
      return (
        <div className="rounded-lg border p-6" style={{ borderColor: palette.accent }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: palette.secondary }}>{event.type}</p>
              <h3 className="mt-1 font-serif text-lg">{event.name}</h3>
            </div>
            <p className="shrink-0 font-serif text-sm" style={{ color: palette.secondary }}>{event.time}</p>
          </div>
          <p className="mt-2 text-sm">{event.address}</p>
          {event.notes && <p className="mt-2 text-sm italic opacity-80">{event.notes}</p>}
        </div>
      )
  }
}

function SectionTitle({ children, style, palette }: { children: React.ReactNode; style: TemplateStyle; palette: { primary: string; secondary: string; accent: string; background: string; text: string } }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="font-serif text-xl font-light italic">{children}</h2>
      <Decoration style={style} palette={palette} />
    </div>
  )
}

function PhotoHero({ photo, style, palette, couple }: { photo?: { hero?: string }; style: TemplateStyle; palette: { primary: string; secondary: string; accent: string; background: string; text: string }; couple: { partner1: string; partner2: string } }) {
  const photoUrl = photo?.hero
  switch (style.photo) {
    case 'rounded':
      return photoUrl ? (
        <div className="flex justify-center px-4 pt-8">
          <img src={photoUrl} alt="" className="h-48 w-48 rounded-2xl object-cover shadow-lg" />
        </div>
      ) : (
        <div className="flex justify-center px-4 pt-8">
          <div className="flex h-48 w-48 items-center justify-center rounded-2xl" style={{ backgroundColor: palette.accent }}>
            <span className="font-serif text-4xl opacity-30">{couple.partner1[0]}{couple.partner2[0]}</span>
          </div>
        </div>
      )
    case 'circle':
      return photoUrl ? (
        <div className="flex justify-center px-4 pt-8">
          <img src={photoUrl} alt="" className="h-40 w-40 rounded-full object-cover shadow-lg" />
        </div>
      ) : null
    case 'top-banner':
      return photoUrl ? (
        <div className="h-64 w-full overflow-hidden">
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null
    default:
      return photoUrl ? (
        <div className="relative h-screen w-full overflow-hidden">
          <img src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>
      ) : (
        <div className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundColor: palette.primary }} />
        </div>
      )
  }
}

export default function FlexibleTemplate({ data }: TemplateProps) {
  const { couple, date, events, dressCode, story, photos } = data
  const palette = dressCode.palette
  const style = templateStyles.find((s) => s.id === data.template) ?? templateStyles[0]
  const [countdown, setCountdown] = useState(getCountdown(date))
  useEffect(() => {
    if (!style.showCountdown) return
    const timer = setInterval(() => setCountdown(getCountdown(date)), 1000)
    return () => clearInterval(timer)
  }, [date, style.showCountdown])

  const heroPhoto = <PhotoHero photo={photos} style={style} palette={palette} couple={couple} />

  const countdownSection = style.showCountdown && countdown.days > 0 && (
    <div className="grid grid-cols-4 gap-4 text-center">
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
  )

  const storySection = story ? (
    <section className="mt-16 text-center">
      <SectionTitle style={style} palette={palette}>Notre histoire</SectionTitle>
      <p className="mt-6 leading-relaxed text-base/relaxed">{story}</p>
    </section>
  ) : null

  const eventsSection = events.length > 0 ? (
    <section className="mt-16">
      <SectionTitle style={style} palette={palette}>Au programme</SectionTitle>
      <div className={`mt-8 ${style.eventCard === 'minimal' ? 'space-y-0 divide-y' : 'space-y-6'}`} style={style.eventCard === 'minimal' ? { borderColor: palette.accent } : undefined}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} style={style} palette={palette} />
        ))}
      </div>
    </section>
  ) : null

  const dressCodeSection = style.showDressCode ? (
    <section className="mt-16 text-center">
      <SectionTitle style={style} palette={palette}>Dress Code</SectionTitle>
      <p className="mt-4 font-serif text-lg" style={{ color: palette.primary }}>{dressCode.theme}</p>
      <p className="mt-4 text-sm leading-relaxed">{dressCode.instructions}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        {[palette.primary, palette.secondary, palette.accent].map((color) => (
          <span key={color} className="inline-block h-8 w-8 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} />
        ))}
      </div>
    </section>
  ) : null

  const wrapperClass = style.layout === 'left' ? 'mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8' : style.layout === 'modern' ? 'mx-auto max-w-4xl px-4 py-16 sm:px-8 lg:px-12' : 'mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8'

  const footerBg = style.layout === 'modern' || style.layout === 'elegant' ? palette.primary : palette.background

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: palette.background, color: palette.text }}>
      {style.photo === 'fullscreen' || style.photo === 'top-banner' ? (
        <header className={`relative ${style.photo === 'top-banner' ? '' : 'h-screen'} w-full overflow-hidden`}>
          {heroPhoto}
          {(style.photo === 'fullscreen' || !photos?.hero) && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white ${style.showArch ? '' : 'px-6'}`}>
              {style.showArch && (
                <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-8">
                  <Decoration style={style} palette={palette} />
                  <span className="font-serif text-sm tracking-[0.35em] uppercase opacity-80">Mariage</span>
                  <CoupleNames couple={couple} style={style} palette={palette} />
                  <div className="mt-6 h-px w-16 bg-white/50" />
                  <p className="mt-5 font-serif text-base tracking-wide opacity-80">{formatDate(date)}</p>
                </div>
              )}
              {!style.showArch && (
                <>
                  {style.decoration !== 'none' && <Decoration style={style} palette={{ ...palette, secondary: '#ffffff' }} />}
                  <span className="mt-4 font-serif text-sm tracking-[0.35em] uppercase opacity-80">Mariage</span>
                  <CoupleNames couple={couple} style={style} palette={{ ...palette, secondary: '#ffffff' }} />
                  <div className="mt-6 h-px w-16 bg-white/50" />
                  <p className="mt-5 font-serif text-base tracking-wide opacity-80">{formatDate(date)}</p>
                </>
              )}
              <div className="absolute bottom-10 animate-bounce">
                <svg className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          )}
        </header>
      ) : (
        <div className="text-center pt-12 pb-8" style={{ backgroundColor: palette.accent }}>
          {heroPhoto}
          <div className="mt-6 px-4">
            <span className="font-serif text-sm tracking-[0.35em] uppercase opacity-60">Mariage</span>
            <CoupleNames couple={couple} style={style} palette={palette} />
            <Decoration style={style} palette={palette} />
            <p className="mt-4 font-serif text-base opacity-70">{formatDate(date)}</p>
          </div>
        </div>
      )}

      <div className={wrapperClass}>
        {countdownSection}
        {storySection}
        {eventsSection}
        {dressCodeSection}

        <footer className="mt-16 border-t pt-8 text-center text-xs opacity-60" style={{ borderColor: palette.accent, color: footerBg === palette.primary ? '#ffffff' : undefined }}>          <p>Merci d'avoir consulté notre faire-part.</p>
          <p className="mt-1">Nous avons hâte de partager ce jour avec vous.</p>
        </footer>
      </div>
    </div>
  )
}
