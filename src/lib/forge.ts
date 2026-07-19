const FORGE_BASE = import.meta.env.VITE_FORGE_PROJECT ?? ''
const FORGE_API_KEY = import.meta.env.VITE_FORGE_API_KEY ?? ''

export interface ForgeResponse<T> {
  data: T[]
}

export interface ForgeSingleResponse<T> {
  data: T
}

export async function forgeQuery<T>(table: string, query?: string): Promise<ForgeResponse<T>> {
  const url = query ? `${FORGE_BASE}/${table}?${query}` : `${FORGE_BASE}/${table}`
  const res = await fetch(url, {
    headers: { 'x-api-key': FORGE_API_KEY },
  })
  if (!res.ok) throw new Error(`Forge error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function forgeGet<T>(table: string, id: string): Promise<ForgeSingleResponse<T>> {
  const res = await fetch(`${FORGE_BASE}/${table}/${id}`, {
    headers: { 'x-api-key': FORGE_API_KEY },
  })
  if (!res.ok) throw new Error(`Forge error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function forgeInsert<T>(table: string, data: unknown): Promise<ForgeSingleResponse<T>> {
  const res = await fetch(`${FORGE_BASE}/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': FORGE_API_KEY },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Forge error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function forgeUpdate<T>(table: string, id: string, data: Partial<T>): Promise<ForgeSingleResponse<T>> {
  const res = await fetch(`${FORGE_BASE}/${table}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': FORGE_API_KEY },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Forge error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function forgeDelete(table: string, id: string): Promise<void> {
  const res = await fetch(`${FORGE_BASE}/${table}/${id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': FORGE_API_KEY },
  })
  if (!res.ok) throw new Error(`Forge error: ${res.status} ${res.statusText}`)
}
