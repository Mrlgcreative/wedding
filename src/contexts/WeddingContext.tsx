import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { WeddingData, Guest, RSVP } from '../types/wedding'
import { api } from '../api/api'

const defaultWedding: WeddingData = {
  id: crypto.randomUUID(),
  template: 'classic',
  fontPair: 'classic',
  coupleFontSize: 2.5,
  couple: { partner1: '', partner2: '' },
  date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  address: '',
  countdown: { enabled: true, label: 'Notre mariage' },
  events: [
    { type: 'mairie', name: '', address: '', date: '', time: '', notes: '' },
    { type: 'ceremonie', name: '', address: '', date: '', time: '', notes: '' },
    { type: 'reception', name: '', address: '', date: '', time: '', notes: '' },
  ],
  dressCode: {
    theme: '',
    instructions: '',
    palette: { primary: '#1a3c34', secondary: '#d4af37', accent: '#e8d5c4', background: '#faf6f1', text: '#2d2d2d' },
  },
}

interface WeddingContextType {
  wedding: WeddingData
  guests: Guest[]
  rsvps: RSVP[]
  loading: boolean
  error: string | null
  persisted: boolean
  setLocalWedding: (data: WeddingData) => void
  saveWedding: () => Promise<void>
  updateWedding: (data: WeddingData) => Promise<void>
  addGuest: (guest: Guest) => Promise<void>
  deleteGuest: (id: string) => Promise<void>
  addRSVP: (rsvp: RSVP) => Promise<void>
}

const WeddingContext = createContext<WeddingContextType | null>(null)

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [wedding, setWedding] = useState<WeddingData>(defaultWedding)
  const [guests, setGuests] = useState<Guest[]>([])
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [persisted, setPersisted] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: weddings } = await api.wedding.list()
        if (weddings?.length) {
          const weddingId = weddings[0].id
          const [w, g] = await Promise.all([
            api.wedding.get(weddingId),
            api.guests.list(weddingId),
          ])
          setWedding(w as unknown as WeddingData)
          setGuests(g.data)
          setPersisted(true)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const setLocalWedding = (data: WeddingData) => {
    setWedding(data)
  }

  const saveWedding = async () => {
    const current = wedding
    if (!persisted) {
      const created = await api.wedding.save(current) as unknown as WeddingData
      setPersisted(true)
      setWedding((prev) => ({ ...prev, id: created.id }))
    } else if (current.id) {
      await api.wedding.update(current.id, current)
    }
  }

  const updateWedding = async (data: WeddingData) => {
    setWedding(data)
    if (!persisted) {
      try {
        const created = await api.wedding.save(data) as unknown as WeddingData
        setPersisted(true)
        setWedding((prev) => ({ ...prev, id: created.id }))
      } catch {
        setError('Impossible de sauvegarder sur forgeconsole.app')
      }
    } else if (data.id) {
      try {
        await api.wedding.update(data.id, data)
      } catch {
        // silencieux
      }
    }
  }

  const addGuest = async (guest: Guest) => {
    const created = await api.guests.save(guest)
    setGuests((prev) => [...prev, { ...guest, id: created.id }])
  }

  const deleteGuest = async (id: string) => {
    await api.guests.delete(id)
    setGuests((prev) => prev.filter((g) => g.id !== id))
  }

  const addRSVP = async (rsvp: RSVP) => {
    await api.rsvp.submit(rsvp)
    setRsvps((prev) => [...prev, rsvp])
  }

  return (
    <WeddingContext value={{ wedding, guests, rsvps, loading, error, persisted, setLocalWedding, saveWedding, updateWedding, addGuest, deleteGuest, addRSVP }}>
      {children}
    </WeddingContext>
  )
}

export function useWeddingContext() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWeddingContext must be used within WeddingProvider')
  return ctx
}
