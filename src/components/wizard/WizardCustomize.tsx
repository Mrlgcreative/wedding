import { useState } from 'react'
import { useWeddingContext } from '../../contexts/WeddingContext'
import type { EventInvitation } from '../../types/wedding'

interface Props { onNext: () => void; onBack: () => void }

export default function WizardCustomize({ onNext, onBack }: Props) {
  const { currentEvent, setCurrentEvent, saveWedding } = useWeddingContext()
  const [saving, setSaving] = useState(false)

  const ev = currentEvent

  const setNested = <K extends keyof EventInvitation>(key: K, value: EventInvitation[K]) => {
    setCurrentEvent({ ...ev, [key]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try { await saveWedding() } catch {}
    setSaving(false)
    onNext()
  }

  return (
    <div className="space-y-10">
      <div className="rounded-xl border bg-white p-8">
        <h2 className="font-[Playfair_Display,serif] text-2xl font-light text-[#1a3c34]">Personnaliser l'invitation</h2>
        <p className="mt-2 text-sm text-[#8a9a8c]">Ajoutez les informations du couple et les détails de l'invitation.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#5c6b5e]">Premier associé</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
              value={ev.couple.partner1}
              onChange={(e) => setNested('couple', { ...ev.couple, partner1: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5c6b5e]">Deuxième associé</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
              value={ev.couple.partner2}
              onChange={(e) => setNested('couple', { ...ev.couple, partner2: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#5c6b5e]">Notre histoire</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
              placeholder="Racontez votre histoire..."
              value={ev.story ?? ''}
              onChange={(e) => setNested('story', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#5c6b5e]">Photo des mariés</label>
            <div className="mt-1 flex gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37]"
                placeholder="URL de la photo"
                value={ev.photos?.hero ?? ''}
                onChange={(e) => setNested('photos', { ...ev.photos, hero: e.target.value, gallery: ev.photos?.gallery ?? [] } as typeof ev.photos)}
              />
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev2) => {
                      const dataUrl = ev2.target?.result as string
                      setNested('photos', { ...ev.photos, hero: dataUrl, gallery: ev.photos?.gallery ?? [] } as typeof ev.photos)
                    }
                    reader.readAsDataURL(file)
                  }
                }} />
                Importer
              </label>
            </div>
            {ev.photos?.hero && (
              <img src={ev.photos.hero} alt="" className="mt-3 h-32 w-full rounded-lg object-cover" />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-8">
        <h2 className="font-[Playfair_Display,serif] text-xl font-light text-[#1a3c34]">Dress Code</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#5c6b5e]">Thème</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37]"
              value={ev.dressCode.theme}
              onChange={(e) => setNested('dressCode', { ...ev.dressCode, theme: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5c6b5e]">Instructions</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37]"
              value={ev.dressCode.instructions}
              onChange={(e) => setNested('dressCode', { ...ev.dressCode, instructions: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#5c6b5e]">Palette de couleurs</label>
            <div className="mt-2 flex gap-4">
              {(Object.keys(ev.dressCode.palette) as (keyof typeof ev.dressCode.palette)[]).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs capitalize text-[#8a9a8c]">{key}</span>
                  <input
                    type="color"
                    className="h-8 w-8 cursor-pointer rounded border"
                    value={ev.dressCode.palette[key]}
                    onChange={(e) =>
                      setNested('dressCode', { ...ev.dressCode, palette: { ...ev.dressCode.palette, [key]: e.target.value } })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="countdown-enabled"
              className="h-4 w-4"
              checked={ev.countdown.enabled}
              onChange={(e) => setNested('countdown', { ...ev.countdown, enabled: e.target.checked })}
            />
            <label htmlFor="countdown-enabled" className="text-sm text-[#5c6b5e]">Afficher le compte à rebours</label>
          </div>
          {ev.countdown.enabled && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#5c6b5e]">Texte du compte à rebours</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37]"
                value={ev.countdown.label}
                onChange={(e) => setNested('countdown', { ...ev.countdown, label: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
          Retour
        </button>
        <button onClick={handleSave} disabled={saving} className="rounded-lg bg-[#1a3c34] px-8 py-3 text-sm font-medium text-white hover:bg-[#2a4c44] disabled:opacity-40">
          {saving ? 'Enregistrement...' : 'Enregistrer et continuer'}
        </button>
      </div>
    </div>
  )
}
