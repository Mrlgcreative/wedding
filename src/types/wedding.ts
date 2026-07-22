export type TemplateType = 'classic' | 'boho' | 'minimalist' | 'elegant' | 'romantic' | 'modern' | 'rustic' | 'luxury' | 'vintage' | 'tropical' | 'geometric' | 'playful' | 'classic-modern' | 'soft' | 'bold'

export type FontPairId = 'classic' | 'elegant' | 'romantic' | 'modern' | 'chic' | 'bergstena' | 'daisy' | 'meaculpa' | 'staylove' | 'remington'

export interface FontPair {
  id: FontPairId
  label: string
  heading: string
  body: string
  headingStack: string
  bodyStack: string
}

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

export interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  invitedPlusOne: boolean
  status: GuestStatus
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

export interface EventInvitation {
  id: string
  name: string
  type: string
  address: string
  date: string
  time: string
  notes?: string
  template: TemplateType
  fontPair: FontPairId
  coupleFontSize: number
  couple: Couple
  story?: string
  photos?: WeddingPhotos
  dressCode: DressCode
  countdown: CountdownConfig
  guests: Guest[]
}

export interface WeddingData {
  id: string
  website?: string
  events: EventInvitation[]
}

export const fontPairs: FontPair[] = [
  {
    id: 'classic',
    label: 'Classique',
    heading: 'Playfair Display',
    body: 'Inter',
    headingStack: '"Playfair Display", Georgia, serif',
    bodyStack: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'elegant',
    label: 'Élégant',
    heading: 'Cormorant Garamond',
    body: 'Lato',
    headingStack: '"Cormorant Garamond", Georgia, serif',
    bodyStack: '"Lato", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'romantic',
    label: 'Romantique',
    heading: 'Great Vibes',
    body: 'Open Sans',
    headingStack: '"Great Vibes", cursive',
    bodyStack: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'modern',
    label: 'Moderne',
    heading: 'Cinzel',
    body: 'Raleway',
    headingStack: '"Cinzel", Georgia, serif',
    bodyStack: '"Raleway", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'chic',
    label: 'Chic',
    heading: 'Libre Baskerville',
    body: 'Work Sans',
    headingStack: '"Libre Baskerville", Georgia, serif',
    bodyStack: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'bergstena',
    label: 'Bergstena',
    heading: 'Bergstena Script',
    body: 'Remington',
    headingStack: '"Bergstena Script", cursive',
    bodyStack: '"Remington", Georgia, serif',
  },
  {
    id: 'daisy',
    label: 'Daisy',
    heading: 'Daisy Display',
    body: 'Daisy Regular',
    headingStack: '"Daisy Display", cursive',
    bodyStack: '"Daisy Regular", cursive',
  },
  {
    id: 'meaculpa',
    label: 'Mea Culpa',
    heading: 'Mea Culpa',
    body: 'Lato',
    headingStack: '"Mea Culpa", cursive',
    bodyStack: '"Lato", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'staylove',
    label: 'Stay Love',
    heading: 'Stay Love',
    body: 'Open Sans',
    headingStack: '"Stay Love", cursive',
    bodyStack: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'remington',
    label: 'Remington',
    heading: 'Remington',
    body: 'Remington',
    headingStack: '"Remington", Georgia, serif',
    bodyStack: '"Remington", Georgia, serif',
  },
]

export interface TemplateProps {
  data: EventInvitation
  palette: ColorPalette
}

export type WizardStep = 'event' | 'template' | 'customize' | 'guests' | 'preview'
