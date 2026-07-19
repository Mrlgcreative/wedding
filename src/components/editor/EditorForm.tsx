import { useState } from 'react'
import type { WeddingData, TemplateType } from '../../types/wedding'
import { useWedding } from '../../hooks/useWedding'
import QRCodeSection from './QRCodeSection'

const templates: { id: TemplateType; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic Chic', desc: 'Élégance intemporelle, tons sobres et typographie serif' },
  { id: 'boho', label: 'Champêtre / Boho', desc: 'Ambiance nature, tons terreux et détails floraux' },
  { id: 'minimalist', label: 'Minimaliste Moderne', desc: 'Design épuré, monochrome, ligne claire' },
]

export default function EditorForm() {
  const { wedding, setLocalWedding, saveWedding, persisted } = useWedding()
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<'saved' | 'error' | null>(null)

  const set = (partial: Partial<WeddingData>) => {
    setLocalWedding({ ...wedding, ...partial })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      await saveWedding()
      setSaveMsg('saved')
    } catch {
      setSaveMsg('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-xl font-light">Modèle d'invitation</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => set({ template: t.id })}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                wedding.template === t.id
                  ? 'border-gray-900 bg-gray-50 shadow-sm'
                  : 'border-transparent bg-gray-50 hover:border-gray-300'
              }`}
            >
              <span className="block font-serif text-base">{t.label}</span>
              <span className="mt-1 block text-xs opacity-60">{t.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Les mariés</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Premier associé</label>
            <input
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              value={wedding.couple.partner1}
              onChange={(e) =>
                set({ couple: { ...wedding.couple, partner1: e.target.value } })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Deuxième associé</label>
            <input
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              value={wedding.couple.partner2}
              onChange={(e) =>
                set({ couple: { ...wedding.couple, partner2: e.target.value } })
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Adresse du mariage</h2>
        <div className="mt-4">
          <input
            className="mt-1 w-full rounded-lg border p-2 text-sm"
            placeholder="123 Rue de la Paix, 75000 Paris"
            value={wedding.address ?? ''}
            onChange={(e) => set({ address: e.target.value })}
          />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Photo des mariés</h2>
        <p className="mt-1 text-xs opacity-60">URL ou import d'une photo de couple (héros de l'invitation).</p>
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border p-2 text-sm"
              placeholder="https://images.unsplash.com/photo-...?w=800"
              value={wedding.photos?.hero ?? ''}
              onChange={(e) =>
                set({ photos: { ...wedding.photos, hero: e.target.value, gallery: wedding.photos?.gallery } })
              }
            />
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string
                      set({ photos: { ...wedding.photos, hero: dataUrl, gallery: wedding.photos?.gallery } })
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
              Importer
            </label>
          </div>
          {wedding.photos?.hero && (
            <img
              src={wedding.photos.hero}
              alt="Prévisualisation"
              className="h-40 w-full rounded-lg object-cover"
            />
          )}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Date & Compte à rebours</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Date du mariage</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              value={wedding.date.slice(0, 16)}
              onChange={(e) => set({ date: e.target.value })}
            />
          </div>
          <div className="flex items-end gap-2">
            <input
              type="checkbox"
              id="countdown-enabled"
              className="mb-2 h-4 w-4"
              checked={wedding.countdown.enabled}
              onChange={(e) =>
                set({ countdown: { ...wedding.countdown, enabled: e.target.checked } })
              }
            />
            <label htmlFor="countdown-enabled" className="text-sm">
              Afficher le compte à rebours
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Dress Code</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Thème</label>
            <input
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              value={wedding.dressCode.theme}
              onChange={(e) =>
                set({ dressCode: { ...wedding.dressCode, theme: e.target.value } })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Instructions</label>
            <textarea
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              rows={3}
              value={wedding.dressCode.instructions}
              onChange={(e) =>
                set({ dressCode: { ...wedding.dressCode, instructions: e.target.value } })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Palette de couleurs</label>
            <div className="mt-2 grid grid-cols-5 gap-3">
              {(Object.keys(wedding.dressCode.palette) as (keyof typeof wedding.dressCode.palette)[]).map(
                (key) => (
                  <div key={key}>
                    <label className="block text-center text-xs capitalize">{key}</label>
                    <input
                      type="color"
                      className="mt-1 h-10 w-full cursor-pointer rounded border"
                      value={wedding.dressCode.palette[key]}
                      onChange={(e) =>
                        set({
                          dressCode: {
                            ...wedding.dressCode,
                            palette: { ...wedding.dressCode.palette, [key]: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Événements</h2>
        <div className="mt-4 space-y-6">
          {wedding.events.map((event, i) => (
            <div key={event.type} className="rounded-lg border p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-60">
                {event.type}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-lg border p-2 text-sm"
                  value={event.name}
                  onChange={(e) => {
                    const events = [...wedding.events]
                    events[i] = { ...events[i], name: e.target.value }
                    set({ events })
                  }}
                />
                <input
                  className="rounded-lg border p-2 text-sm"
                  value={event.address}
                  onChange={(e) => {
                    const events = [...wedding.events]
                    events[i] = { ...events[i], address: e.target.value }
                    set({ events })
                  }}
                />
                <input
                  type="date"
                  className="rounded-lg border p-2 text-sm"
                  value={event.date}
                  onChange={(e) => {
                    const events = [...wedding.events]
                    events[i] = { ...events[i], date: e.target.value }
                    set({ events })
                  }}
                />
                <input
                  type="time"
                  className="rounded-lg border p-2 text-sm"
                  value={event.time}
                  onChange={(e) => {
                    const events = [...wedding.events]
                    events[i] = { ...events[i], time: e.target.value }
                    set({ events })
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between border-t pt-6">
        <div className="text-sm">
          {saveMsg === 'saved' && <span className="text-green-600">✓ Enregistré</span>}
          {saveMsg === 'error' && <span className="text-red-600">Erreur lors de la sauvegarde</span>}
          {!persisted && !saveMsg && <span className="text-amber-600">Modifications non sauvegardées</span>}
          {persisted && !saveMsg && <span className="text-gray-400">Enregistré sur le serveur</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <QRCodeSection />
    </div>
  )
}
