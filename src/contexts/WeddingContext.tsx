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
    { id: crypto.randomUUID(), type: 'mairie', name: 'Mairie', address: '', date: '', time: '', notes: '' },
    { id: crypto.randomUUID(), type: 'ceremonie', name: 'Cérémonie', address: '', date: '', time: '', notes: '' },
    { id: crypto.randomUUID(), type: 'reception', name: 'Réception', address: '', date: '', time: '', notes: '' },
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
          const [w, g, photos] = await Promise.all([
            api.wedding.get(weddingId),
            api.guests.list(weddingId),
            api.photos.list(weddingId).catch(() => []),
          ])
          const wedding = w as unknown as WeddingData
          if (photos.length > 0) {
            wedding.photos = {
              hero: photos.find((p: { type: string }) => p.type === 'hero')?.url ?? wedding.photos?.hero ?? '',
              gallery: photos.filter((p: { type: string }) => p.type === 'gallery').map((p: { url: string }) => p.url),
            }
          }
          setWedding(wedding)
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
    console.log('saveWedding - current.photos:', current.photos)
    let weddingId = current.id
    if (!persisted) {
      const created = await api.wedding.save(current) as unknown as WeddingData
      weddingId = created.id
      setPersisted(true)
      setWedding((prev) => ({ ...prev, id: created.id }))
    } else if (current.id) {
      await api.wedding.update(current.id, current)
    }
    if (weddingId && current.photos?.hero) {
      console.log('Tentative sauvegarde photo...')
      try {
        const existing = await api.photos.list(weddingId)
        console.log('Photos existantes:', existing)
        const oldHero = existing.find((p: { type: string }) => p.type === 'hero')
        if (oldHero) {
          console.log('Suppression ancienne photo:', oldHero.id)
          await api.photos.remove(oldHero.id)
        }
        const saved = await api.photos.save(weddingId, current.photos.hero, 'hero', 0)
        console.log('✅ Photo sauvegardée:', saved)
      } catch (e) {
        console.error('⚠️ ERREUR sauvegarde photo:', e)
      }
    } else {
      console.warn('Condition non remplie - weddingId:', weddingId, 'photos?.hero:', current.photos?.hero)
    }
  }

  const updateWedding = async (data: WeddingData) => {
    setWedding(data)
    let weddingId = data.id
    if (!persisted) {
      try {
        const created = await api.wedding.save(data) as unknown as WeddingData
        weddingId = created.id
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
    if (weddingId && data.photos?.hero) {
      try {
        const existing = await api.photos.list(weddingId)
        const oldHero = existing.find((p: { type: string }) => p.type === 'hero')
        if (oldHero) await api.photos.remove(oldHero.id)
        await api.photos.save(weddingId, data.photos.hero, 'hero', 0)
      } catch (e) {
        console.error('Erreur sauvegarde photo:', e)
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
