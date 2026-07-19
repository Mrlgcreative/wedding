const FORGE_BASE = import.meta.env.VITE_FORGE_PROJECT ?? ''
const FORGE_API_KEY = import.meta.env.VITE_FORGE_API_KEY ?? ''

import type { WeddingData, Guest, RSVP, EventDetails, DressCode } from '../types/wedding'

function toForgeWedding(w: WeddingData) {
  const dateStr = w.date ? new Date(w.date).toISOString() : new Date().toISOString()
  return {
    template: w.template,
    partner1: w.couple.partner1,
    partner2: w.couple.partner2,
    date: dateStr,
    address: w.address ?? '',
    countdown_enabled: w.countdown.enabled,
    story: w.story ?? '',
    website: w.website ?? '',
  }
}

function fromForgeWedding(w: Record<string, unknown>): WeddingData {
  return {
    id: w.id as string,
    template: (w.template as WeddingData['template']) ?? 'classic',
    couple: { partner1: (w.partner1 as string) ?? '', partner2: (w.partner2 as string) ?? '' },
    date: (w.date as string) ?? '',
    address: (w.address as string) ?? '',
    countdown: { enabled: (w.countdown_enabled as boolean) ?? true, label: 'Notre mariage' },
    events: [],
    dressCode: {
      theme: '',
      instructions: '',
      palette: { primary: '#1a3c34', secondary: '#d4af37', accent: '#e8d5c4', background: '#faf6f1', text: '#2d2d2d' },
    },
    story: (w.story as string) ?? '',
    website: (w.website as string) ?? '',
  }
}

function toForgeGuest(g: Guest) {
  return {
    wedding_id: g.weddingId,
    name: g.name,
    email: g.email,
    phone: g.phone ?? '',
    invited_plus_one: g.invitedPlusOne,
    status: g.status,
  }
}

function fromForgeGuest(g: Record<string, unknown>): Guest {
  return {
    id: (g.id as string) ?? '',
    name: (g.name as string) ?? '',
    email: (g.email as string) ?? '',
    phone: (g.phone as string) ?? '',
    invitedPlusOne: (g.invited_plus_one as boolean) ?? false,
    status: (g.status as Guest['status']) ?? 'pending',
    weddingId: (g.wedding_id as string) ?? '',
  }
}

function toForgeEvent(weddingId: string, e: EventDetails, i: number) {
  return {
    wedding_id: weddingId,
    type: e.type,
    name: e.name,
    address: e.address,
    date: e.date,
    time: e.time,
    notes: e.notes ?? '',
    sort_order: i,
  }
}

function fromForgeEvent(e: Record<string, unknown>): EventDetails {
  return {
    type: (e.type as EventDetails['type']) ?? 'ceremonie',
    name: (e.name as string) ?? '',
    address: (e.address as string) ?? '',
    date: (e.date as string) ?? '',
    time: (e.time as string) ?? '',
    notes: (e.notes as string) ?? '',
  }
}

function toForgeDressCode(weddingId: string, d: DressCode) {
  return {
    wedding_id: weddingId,
    theme: d.theme,
    instructions: d.instructions,
    palette_primary: d.palette.primary,
    palette_secondary: d.palette.secondary,
    palette_accent: d.palette.accent,
    palette_background: d.palette.background,
    palette_text: d.palette.text,
  }
}

function fromForgeDressCode(d: Record<string, unknown>): DressCode {
  return {
    theme: (d.theme as string) ?? '',
    instructions: (d.instructions as string) ?? '',
    palette: {
      primary: (d.palette_primary as string) ?? '#1a3c34',
      secondary: (d.palette_secondary as string) ?? '#d4af37',
      accent: (d.palette_accent as string) ?? '#e8d5c4',
      background: (d.palette_background as string) ?? '#faf6f1',
      text: (d.palette_text as string) ?? '#2d2d2d',
    },
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

function toForgePhoto(weddingId: string, url: string, type: string, sortOrder: number) {
  return { wedding_id: weddingId, url, type, sort_order: sortOrder }
}

function fromForgePhoto(p: Record<string, unknown>) {
  return {
    id: p.id as string,
    weddingId: p.wedding_id as string,
    url: p.url as string,
    type: p.type as string,
    sortOrder: p.sort_order as number,
  }
}

async function request<T>(method: string, table: string, body?: unknown): Promise<T> {
  const res = await fetch(`${FORGE_BASE}/${table}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': FORGE_API_KEY,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) throw new Error(`Forge API error: ${res.status} ${res.statusText}`)
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
    get: async (id: string) => {
      const g = await request<Record<string, unknown>>('GET', `guests/${id}`)
      return fromForgeGuest(g)
    },
    save: async (data: Guest) => {
      const g = await request<Record<string, unknown>>('POST', 'guests', toForgeGuest(data))
      return fromForgeGuest(g)
    },
    update: async (id: string, data: Partial<Guest>) => {
      const g = await request<Record<string, unknown>>('PATCH', `guests/${id}`, toForgeGuest(data as Guest))
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
  events: {
    list: async (weddingId: string) => {
      const res = await request<{ data: Record<string, unknown>[] }>('GET', `events?wedding_id=${weddingId}`)
      return res.data.map(fromForgeEvent)
    },
    save: async (weddingId: string, data: EventDetails, index: number) => {
      const created = await request<Record<string, unknown>>('POST', 'events', toForgeEvent(weddingId, data, index))
      return fromForgeEvent(created)
    },
    update: async (id: string, weddingId: string, data: EventDetails, index: number) => {
      const updated = await request<Record<string, unknown>>('PATCH', `events/${id}`, toForgeEvent(weddingId, data, index))
      return fromForgeEvent(updated)
    },
    remove: (id: string) => request<void>('DELETE', `events/${id}`),
  },
  dressCode: {
    get: async (weddingId: string) => {
      const res = await request<{ data: Record<string, unknown>[] }>('GET', `dress_codes?wedding_id=${weddingId}`)
      if (!res.data?.length) return null
      return fromForgeDressCode(res.data[0])
    },
    save: async (weddingId: string, data: DressCode) => {
      const created = await request<Record<string, unknown>>('POST', 'dress_codes', toForgeDressCode(weddingId, data))
      return fromForgeDressCode(created)
    },
    update: async (id: string, data: DressCode, weddingId: string) => {
      const updated = await request<Record<string, unknown>>('PATCH', `dress_codes/${id}`, toForgeDressCode(weddingId, data))
      return fromForgeDressCode(updated)
    },
  },
  photos: {
    list: async (weddingId: string) => {
      const res = await request<{ data: Record<string, unknown>[] }>('GET', `photos?wedding_id=${weddingId}`)
      return res.data.map(fromForgePhoto)
    },
    save: async (weddingId: string, url: string, type: string, sortOrder: number) => {
      const p = await request<Record<string, unknown>>('POST', 'photos', toForgePhoto(weddingId, url, type, sortOrder))
      return fromForgePhoto(p)
    },
    remove: (id: string) => request<void>('DELETE', `photos/${id}`),
  },
}
