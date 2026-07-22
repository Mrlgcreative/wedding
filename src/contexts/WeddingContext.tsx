import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { WeddingData, EventInvitation, Guest, RSVP } from '../types/wedding'
import { api, defaultEvent } from '../api/api'

interface WeddingContextType {
  wedding: WeddingData
  currentEvent: EventInvitation
  currentIndex: number
  loading: boolean
  error: string | null
  persisted: boolean
  setCurrentEvent: (data: EventInvitation) => void
  addEvent: () => void
  removeEvent: (id: string) => void
  setCurrentIndex: (i: number) => void
  saveWedding: () => Promise<void>
  addGuest: (guest: Guest) => Promise<void>
  deleteGuest: (id: string) => Promise<void>
  addRSVP: (rsvp: RSVP) => Promise<void>
}

const WeddingContext = createContext<WeddingContextType | null>(null)

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [wedding, setWedding] = useState<WeddingData>({ id: crypto.randomUUID(), events: [defaultEvent()] })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [persisted, setPersisted] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: weddings } = await api.wedding.list()
        if (weddings?.length) {
          const w = weddings[0]
          setWedding(w)
          setPersisted(true)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const currentEvent = wedding.events[currentIndex] ?? defaultEvent()

  const setCurrentEvent = (data: EventInvitation) => {
    const events = wedding.events.map((e) => (e.id === data.id ? data : e))
    setWedding({ ...wedding, events })
  }

  const addEvent = () => {
    const ev = defaultEvent()
    const events = [...wedding.events, ev]
    setWedding({ ...wedding, events })
    setCurrentIndex(events.length - 1)
  }

  const removeEvent = (id: string) => {
    if (wedding.events.length <= 1) return
    const events = wedding.events.filter((e) => e.id !== id)
    const newIndex = Math.min(currentIndex, events.length - 1)
    setWedding({ ...wedding, events })
    setCurrentIndex(newIndex)
  }

  const saveWedding = async () => {
    const current = wedding
    if (!persisted) {
      const created = await api.wedding.save(current)
      setPersisted(true)
      setWedding((prev) => ({ ...prev, id: created.id }))
    } else if (current.id) {
      await api.wedding.update(current.id, current)
    }
  }

  const addGuest = async (guest: Guest) => {
    const ev = { ...currentEvent, guests: [...currentEvent.guests, guest] }
    setCurrentEvent(ev)
  }

  const deleteGuest = async (id: string) => {
    const ev = { ...currentEvent, guests: currentEvent.guests.filter((g) => g.id !== id) }
    setCurrentEvent(ev)
  }

  const addRSVP = async (rsvp: RSVP) => {
    await api.rsvp.submit(rsvp)
  }

  return (
    <WeddingContext value={{ wedding, currentEvent, currentIndex, loading, error, persisted, setCurrentEvent, addEvent, removeEvent, setCurrentIndex, saveWedding, addGuest, deleteGuest, addRSVP }}>
      {children}
    </WeddingContext>
  )
}

export function useWeddingContext() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWeddingContext must be used within WeddingProvider')
  return ctx
}
