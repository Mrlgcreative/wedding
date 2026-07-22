import { useState, useEffect } from 'react'
import type { EventInvitation, Guest, RSVP } from '../types/wedding'
import { fontPairs } from '../types/wedding'
import { api } from '../api/api'
import { FlexibleTemplate } from '../components/templates'
import RSVPForm from '../components/guest/RSVPForm'

type Status = 'loading' | 'ready' | 'error'

export default function GuestApp() {
  const [status, setStatus] = useState<Status>('loading')
  const [event, setEvent] = useState<EventInvitation | null>(null)
  const [guest, setGuest] = useState<Guest | null>(null)

  const params = new URLSearchParams(window.location.search)
  const weddingId = params.get('wedding')
  const urlGuestId = params.get('guest')

  useEffect(() => {
    if (!weddingId) { setStatus('error'); return }
    ;(async () => {
      try {
        const w = await api.wedding.get(weddingId)
        const foundEvent = w.events.find((ev) => ev.guests.some((g) => g.id === urlGuestId)) ?? w.events[0]
        setEvent(foundEvent)
        const foundGuest = foundEvent.guests.find((g) => g.id === urlGuestId) ?? foundEvent.guests[0] ?? null
        setGuest(foundGuest)
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    })()
  }, [weddingId, urlGuestId])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf6f1]">
        <p className="font-serif text-lg opacity-50">Chargement...</p>
      </div>
    )
  }

  if (status === 'error' || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf6f1] p-8 text-center">
        <p className="font-serif text-xl opacity-60">Invitation introuvable</p>
        <p className="text-sm opacity-40">Vérifiez le lien ou contactez les mariés.</p>
      </div>
    )
  }

  const palette = event.dressCode.palette
  const font = fontPairs.find((f) => f.id === (event.fontPair ?? 'classic')) ?? fontPairs[0]
  const guestName = guest?.name ?? 'Invité'

  const handleRSVP = (rsvp: RSVP) => {
    api.rsvp.submit(rsvp)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.background, '--font-couple': font.headingStack, '--font-couple-size': `${event.coupleFontSize}rem` } as React.CSSProperties}>
      {guest && (
        <div className="bg-white/80 border-b text-center py-2 text-sm" style={{ borderColor: palette.accent }}>
          Bienvenue, <span className="font-semibold">{guestName}</span>
        </div>
      )}

      <FlexibleTemplate data={event} palette={palette} />

      <div className="mx-auto max-w-3xl space-y-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <RSVPForm guestId={guest?.id ?? ''} onSubmit={handleRSVP} />
      </div>
    </div>
  )
}
