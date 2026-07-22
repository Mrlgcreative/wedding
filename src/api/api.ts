const FORGE_BASE = import.meta.env.VITE_FORGE_PROJECT ?? ''
const FORGE_API_KEY = import.meta.env.VITE_FORGE_API_KEY ?? ''

import type { WeddingData, EventInvitation, Guest, RSVP, WeddingPhotos } from '../types/wedding'

function defaultEvent(): EventInvitation {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: '',
    address: '',
    date: '',
    time: '',
    notes: '',
    template: 'classic',
    fontPair: 'classic',
    coupleFontSize: 2.5,
    couple: { partner1: '', partner2: '' },
    story: '',
    photos: { hero: '', gallery: [] },
    dressCode: {
      theme: '',
      instructions: '',
      palette: { primary: '#1a3c34', secondary: '#d4af37', accent: '#e8d5c4', background: '#faf6f1', text: '#2d2d2d' },
    },
    countdown: { enabled: true, label: 'Notre mariage' },
    guests: [],
  }
}

function toForgeWedding(w: WeddingData) {
  return {
    website: w.website ?? '',
    events_json: JSON.stringify(w.events),
  }
}

function migrateEvent(e: Partial<EventInvitation>): EventInvitation {
  const def = defaultEvent()
  return {
    ...def,
    ...e,
    couple: { ...def.couple, ...(e.couple ?? {}) },
    photos: { ...def.photos, ...(e.photos ?? {}) } as WeddingPhotos,
    dressCode: {
      ...def.dressCode,
      ...(e.dressCode ?? {}),
      palette: { ...def.dressCode.palette, ...((e.dressCode?.palette ?? {}) as Record<string, string>) },
    },
    countdown: { ...def.countdown, ...(e.countdown ?? {}) },
    guests: Array.isArray(e.guests) ? e.guests : [],
  }
}

function fromForgeWedding(w: Record<string, unknown>): WeddingData {
  const hasOwnId = !!(w.id as string)
  const item = hasOwnId
    ? w
    : (Array.isArray(w.data) ? w.data[0] : w.data) as Record<string, unknown> | undefined
  const fields = (item?.data && typeof item.data === 'object' && !Array.isArray(item.data)
    ? item.data
    : (item ?? w)) as Record<string, unknown>
  let raw: Partial<EventInvitation>[] = []
  try { raw = JSON.parse((fields.events_json as string) ?? '[]') } catch { raw = [] }
  const events = raw.length ? raw.map(migrateEvent) : [defaultEvent()]
  return {
    id: (item?.id as string) ?? (fields.id as string) ?? '',
    website: (fields.website as string) ?? '',
    events,
  }
}

function toForgeGuest(g: Guest) {
  return {
    wedding_id: '',
    name: g.name,
    email: g.email,
    phone: g.phone ?? null,
    invited_plus_one: g.invitedPlusOne,
    status: g.status,
  }
}

function fromForgeGuest(g: Record<string, unknown>): Guest {
  const hasOwnId = !!(g.id as string)
  const item = hasOwnId ? g : (Array.isArray(g.data) ? g.data[0] : g.data) as Record<string, unknown> | undefined
  const fields = (item?.data && typeof item.data === 'object' && !Array.isArray(item.data) ? item.data : (item ?? g)) as Record<string, unknown>
  return {
    id: (item?.id as string) ?? (fields.id as string) ?? '',
    name: (fields.name as string) ?? '',
    email: (fields.email as string) ?? '',
    phone: (fields.phone as string) ?? '',
    invitedPlusOne: (fields.invited_plus_one as boolean) ?? false,
    status: (fields.status as Guest['status']) ?? 'pending',
  }
}

function toForgeRSVP(r: RSVP) {
  return {
    guest_id: r.guestId,
    confirmed: r.confirmed,
    plus_one: r.plusOne,
    plus_one_name: r.plusOneName ?? '',
    dietary_restrictions: r.dietaryRestrictions ?? '',
    allergies: r.allergies ?? '',
    message: r.message ?? '',
    submitted_at: r.submittedAt,
  }
}

function fromForgeRSVP(r: Record<string, unknown>): RSVP {
  return {
    guestId: (r.guest_id as string) ?? '',
    confirmed: (r.confirmed as boolean) ?? false,
    plusOne: (r.plus_one as boolean) ?? false,
    plusOneName: (r.plus_one_name as string) ?? '',
    dietaryRestrictions: (r.dietary_restrictions as string) ?? '',
    allergies: (r.allergies as string) ?? '',
    message: (r.message as string) ?? '',
    submittedAt: (r.submitted_at as string) ?? '',
  }
}

async function request<T>(method: string, table: string, body?: unknown): Promise<T> {
  const res = await fetch(`${FORGE_BASE}/${table}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-api-key': FORGE_API_KEY },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) {
    const bodyText = await res.text().catch(() => '')
    throw new Error(`Forge API error: ${res.status} ${res.statusText} — ${bodyText}`)
  }
  return res.json()
}

export const api = {
  wedding: {
    get: async (id: string) => {
      const w = await request<Record<string, unknown>>('GET', `weddings/${id}`)
      return fromForgeWedding(w)
    },
    list: async () => {
      const res = await request<{ data: Record<string, unknown>[] }>('GET', 'weddings')
      return { data: res.data.map(fromForgeWedding) }
    },
    save: async (data: WeddingData) => {
      const w = await request<Record<string, unknown>>('POST', 'weddings', toForgeWedding(data))
      return fromForgeWedding(w)
    },
    update: async (id: string, data: Partial<WeddingData>) => {
      const w = await request<Record<string, unknown>>('PATCH', `weddings/${id}`, toForgeWedding(data as WeddingData))
      return fromForgeWedding(w)
    },
    delete: (id: string) => request<void>('DELETE', `weddings/${id}`),
  },
  guests: {
    list: async (weddingId: string) => {
      const res = await request<{ data: Record<string, unknown>[] }>('GET', `guests?wedding_id=${weddingId}`)
      return { data: res.data.map(fromForgeGuest) }
    },
    save: async (data: Guest) => {
      const g = await request<Record<string, unknown>>('POST', 'guests', toForgeGuest(data))
      return fromForgeGuest(g)
    },
    delete: (id: string) => request<void>('DELETE', `guests/${id}`),
  },
  rsvp: {
    submit: async (rsvp: RSVP) => {
      const r = await request<Record<string, unknown>>('POST', 'rsvps', toForgeRSVP(rsvp))
      return fromForgeRSVP(r)
    },
    get: async (guestId: string) => {
      const res = await request<{ data: Record<string, unknown>[] }>('GET', `rsvps?guest_id=${guestId}`)
      if (!res.data?.length) return null
      return fromForgeRSVP(res.data[0])
    },
  },
}

export { defaultEvent }
