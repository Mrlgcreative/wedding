export type TemplateType = 'classic' | 'boho' | 'minimalist'

export type EventType = 'mairie' | 'ceremonie' | 'reception'

export type GuestStatus = 'pending' | 'confirmed' | 'declined'

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface DressCode {
  theme: string
  instructions: string
  palette: ColorPalette
}

export interface EventDetails {
  type: EventType
  name: string
  address: string
  date: string
  time: string
  notes?: string
}

export interface Couple {
  partner1: string
  partner2: string
}

export interface CountdownConfig {
  enabled: boolean
  label: string
}

export interface WeddingPhotos {
  hero: string
  gallery?: string[]
}

export interface WeddingData {
  id: string
  template: TemplateType
  couple: Couple
  date: string
  address?: string
  countdown: CountdownConfig
  events: EventDetails[]
  dressCode: DressCode
  photos?: WeddingPhotos
  story?: string
  website?: string
}

export interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  invitedPlusOne: boolean
  status: GuestStatus
  weddingId: string
}

export interface RSVP {
  guestId: string
  confirmed: boolean
  plusOne: boolean
  plusOneName?: string
  dietaryRestrictions?: string
  allergies?: string
  message?: string
  submittedAt: string
}

export interface TemplateProps {
  data: WeddingData
}

export type AppTab = 'editor' | 'guest'
