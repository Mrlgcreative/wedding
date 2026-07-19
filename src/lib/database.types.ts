export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      weddings: {
        Row: {
          id: string
          template: 'classic' | 'boho' | 'minimalist'
          partner1: string
          partner2: string
          date: string
          countdown_enabled: boolean
          story: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template?: 'classic' | 'boho' | 'minimalist'
          partner1: string
          partner2: string
          date: string
          countdown_enabled?: boolean
          story?: string | null
          website?: string | null
        }
        Update: {
          template?: 'classic' | 'boho' | 'minimalist'
          partner1?: string
          partner2?: string
          date?: string
          countdown_enabled?: boolean
          story?: string | null
          website?: string | null
        }
      }
      dress_codes: {
        Row: {
          id: string
          wedding_id: string
          theme: string
          instructions: string
          palette_primary: string
          palette_secondary: string
          palette_accent: string
          palette_background: string
          palette_text: string
        }
        Insert: {
          id?: string
          wedding_id: string
          theme: string
          instructions?: string
          palette_primary?: string
          palette_secondary?: string
          palette_accent?: string
          palette_background?: string
          palette_text?: string
        }
        Update: {
          theme?: string
          instructions?: string
          palette_primary?: string
          palette_secondary?: string
          palette_accent?: string
          palette_background?: string
          palette_text?: string
        }
      }
      events: {
        Row: {
          id: string
          wedding_id: string
          type: 'mairie' | 'ceremonie' | 'reception'
          name: string
          address: string
          date: string
          time: string
          notes: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          wedding_id: string
          type: 'mairie' | 'ceremonie' | 'reception'
          name: string
          address: string
          date: string
          time: string
          notes?: string | null
          sort_order?: number
        }
        Update: {
          type?: 'mairie' | 'ceremonie' | 'reception'
          name?: string
          address?: string
          date?: string
          time?: string
          notes?: string | null
          sort_order?: number
        }
      }
      photos: {
        Row: {
          id: string
          wedding_id: string
          url: string
          type: 'hero' | 'gallery'
          sort_order: number
        }
        Insert: {
          id?: string
          wedding_id: string
          url: string
          type?: 'hero' | 'gallery'
          sort_order?: number
        }
        Update: {
          url?: string
          type?: 'hero' | 'gallery'
          sort_order?: number
        }
      }
      guests: {
        Row: {
          id: string
          wedding_id: string
          name: string
          email: string
          phone: string | null
          invited_plus_one: boolean
          status: 'pending' | 'confirmed' | 'declined'
        }
        Insert: {
          id?: string
          wedding_id: string
          name: string
          email: string
          phone?: string | null
          invited_plus_one?: boolean
          status?: 'pending' | 'confirmed' | 'declined'
        }
        Update: {
          name?: string
          email?: string
          phone?: string | null
          invited_plus_one?: boolean
          status?: 'pending' | 'confirmed' | 'declined'
        }
      }
      rsvps: {
        Row: {
          id: string
          guest_id: string
          confirmed: boolean
          plus_one: boolean
          plus_one_name: string | null
          dietary_restrictions: string | null
          allergies: string | null
          message: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          confirmed: boolean
          plus_one?: boolean
          plus_one_name?: string | null
          dietary_restrictions?: string | null
          allergies?: string | null
          message?: string | null
        }
        Update: {
          confirmed?: boolean
          plus_one?: boolean
          plus_one_name?: string | null
          dietary_restrictions?: string | null
          allergies?: string | null
          message?: string | null
        }
      }
    }
    Enums: {
      template_type: 'classic' | 'boho' | 'minimalist'
      event_type: 'mairie' | 'ceremonie' | 'reception'
      guest_status: 'pending' | 'confirmed' | 'declined'
      photo_type: 'hero' | 'gallery'
    }
  }
}
