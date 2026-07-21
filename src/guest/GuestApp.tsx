import { useState, useEffect } from 'react'
import type { WeddingData, Guest, RSVP } from '../types/wedding'
import { fontPairs } from '../types/wedding'
import { api } from '../api/api'
import { ClassicTemplate, BohoTemplate, MinimalistTemplate } from '../components/templates'
import RSVPForm from '../components/guest/RSVPForm'
import GuestQRCode from '../components/guest/GuestQRCode'

const templates = { classic: ClassicTemplate, boho: BohoTemplate, minimalist: MinimalistTemplate } as const

type Status = 'loading' | 'ready' | 'error'

export default function GuestApp() {
  const [status, setStatus] = useState<Status>('loading')
  const [wedding, setWedding] = useState<WeddingData | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])

  const params = new URLSearchParams(window.location.search)
  const weddingId = params.get('wedding')
  const urlGuestId = params.get('guest')

  useEffect(() => {
    if (!weddingId) {
      setStatus('error')
      return
    }
    ;(async () => {
      try {
        const [w, g, events, dressCode, photos] = await Promise.all([
          api.wedding.get(weddingId),
          api.guests.list(weddingId),
          api.events.list(weddingId),
          api.dressCode.get(weddingId),
          api.photos.list(weddingId),
        ])
        const heroUrl = photos.find((p: { type: string }) => p.type === 'hero')?.url || w.photos?.hero || ''
        const galleryUrls = photos.filter((p: { type: string }) => p.type === 'gallery').map((p: { url: string }) => p.url)
        setWedding({
          ...(w as unknown as WeddingData),
          events: events.length > 0 ? events : w.events,
          dressCode: dressCode ?? w.dressCode,
          photos: { hero: heroUrl, gallery: galleryUrls },
        } as WeddingData)
        setGuests(g.data)
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    })()
  }, [weddingId])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf6f1]">
        <p className="font-serif text-lg opacity-50">Chargement...</p>
      </div>
    )
  }

  if (status === 'error' || !wedding) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf6f1] p-8 text-center">
        <p className="font-serif text-xl opacity-60">Invitation introuvable</p>
        <p className="text-sm opacity-40">Vérifiez le lien ou contactez les mariés.</p>
      </div>
    )
  }

  const guest = guests.find((g) => g.id === urlGuestId) ?? guests[0]
  const guestId = guest?.id ?? ''
  const guestName = guest?.name ?? 'Invité'
  const palette = wedding.dressCode.palette
  const Template = templates[wedding.template]
  const font = fontPairs.find((f) => f.id === (wedding.fontPair ?? 'classic')) ?? fontPairs[0]

  const addToCalendar = () => {
    const event = wedding.events[0]
    const url =
      `https://www.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(`Mariage de ${wedding.couple.partner1} & ${wedding.couple.partner2}`)}` +
      `&dates=${wedding.date.replace(/[-:]/g, '').replace('T', '')}/${wedding.date.replace(/[-:]/g, '').replace('T', '')}` +
      `&details=${encodeURIComponent('Mariage')}` +
      `&location=${encodeURIComponent(event?.address ?? '')}`
    window.open(url, '_blank')
  }

  const openMap = (address: string) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank')
  }

  const handleRSVP = async (rsvp: RSVP) => {
    await api.rsvp.submit(rsvp)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.background, '--font-couple': font.headingStack, '--font-couple-size': `${wedding.coupleFontSize}rem` } as React.CSSProperties}>
      {guestName !== 'Invité' && (
        <div className="bg-white/80 border-b text-center py-2 text-sm" style={{ borderColor: palette.accent }}>
          Bienvenue, <span className="font-semibold">{guestName}</span>
        </div>
      )}

      <Template data={wedding} />

      <div className="sticky bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-sm" style={{ borderColor: palette.accent }}>
        <div className="mx-auto flex max-w-3xl gap-3 px-4 py-4">
          <button
            onClick={addToCalendar}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: palette.primary, color: palette.primary }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agenda
          </button>
          {wedding.events.map((event) => (
            <button
              key={event.type}
              onClick={() => openMap(event.address)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: palette.primary, color: palette.primary }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.type === 'mairie' ? 'Mairie' : event.type === 'ceremonie' ? 'Église' : 'Réception'}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {guestId && (
          <section>
            <h2 className="mb-6 text-center font-serif text-xl font-light">Votre invitation personnelle</h2>
            <GuestQRCode guestId={guestId} guestName={guestName} wedding={wedding} />
          </section>
        )}

        <RSVPForm guestId={guestId} onSubmit={handleRSVP} />
      </div>
    </div>
  )
}
