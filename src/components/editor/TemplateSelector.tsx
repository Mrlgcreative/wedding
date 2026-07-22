import { useState } from 'react'
import type { WeddingData, FontPairId } from '../../types/wedding'
import { fontPairs } from '../../types/wedding'
import { useWedding } from '../../hooks/useWedding'
import { templateStyles, type TemplateStyle } from '../../types/templates'

function TemplatePreview({ style }: { style: TemplateStyle }) {
  const p = { primary: '#1a3c34', secondary: '#d4af37', accent: '#e8d5c4', background: '#faf6f1', text: '#2d2d2d' }

  const Decor = () => {
    switch (style.decoration) {
      case 'arch':
        return <div className="h-3 w-12 rounded-t-full border-b-0" style={{ border: `2px solid ${p.secondary}40`, borderBottom: 'none' }} />
      case 'floral':
        return <span className="text-xs" style={{ color: p.secondary }}>✿ ✦ ✿</span>
      case 'geometric':
        return <div className="flex gap-0.5"><div className="h-1.5 w-1.5 rotate-45 border" style={{ borderColor: p.secondary }} /><div className="h-1.5 w-1.5 rotate-45 border opacity-60" style={{ borderColor: p.secondary }} /><div className="h-1.5 w-1.5 rotate-45 border opacity-30" style={{ borderColor: p.secondary }} /></div>
      case 'double-line':
        return <div className="flex flex-col items-center gap-0.5"><div className="h-px w-10" style={{ backgroundColor: p.secondary }} /><div className="h-px w-6 opacity-50" style={{ backgroundColor: p.secondary }} /></div>
      case 'hearts':
        return <span className="text-xs" style={{ color: p.secondary }}>♡ ❤ ♡</span>
      case 'stars':
        return <span className="text-xs" style={{ color: p.secondary }}>✦ ★ ✦</span>
      case 'waves':
        return <div className="flex gap-px items-end" style={{ color: p.secondary }}>{[1,2,3,4,3,2,1].map((h,i) => <div key={i} className="w-0.5 rounded-full" style={{ height: `${h*2}px`, backgroundColor: p.secondary, opacity: 0.3+h*0.05 }} />)}</div>
      case 'dots':
        return <div className="flex gap-1"><div className="h-1 w-1 rounded-full opacity-50" style={{ backgroundColor: p.secondary }} /><div className="h-1 w-1 rounded-full opacity-35" style={{ backgroundColor: p.secondary }} /><div className="h-1 w-1 rounded-full opacity-20" style={{ backgroundColor: p.secondary }} /></div>
      default:
        return null
    }
  }

  const isCentered = style.layout === 'centered' || style.layout === 'elegant'

  return (
    <div className="flex flex-col items-center gap-1.5 py-4 px-2">
      {style.showArch && <div className="h-2 w-10 rounded-t-full" style={{ border: `1px solid ${p.secondary}40`, borderBottom: 'none' }} />}
      <Decor />
      <div className={`flex flex-col ${isCentered ? 'items-center' : 'items-start'} gap-0.5`}>
        <div className="h-2 w-16 rounded" style={{ backgroundColor: p.primary, opacity: 0.8 }} />
        <span className="text-xs opacity-40" style={{ color: p.secondary }}>{style.coupleSeparator}</span>
        <div className="h-2 w-12 rounded" style={{ backgroundColor: p.primary, opacity: 0.8 }} />
      </div>
      {style.photo === 'top-banner' && <div className="h-6 w-full rounded" style={{ backgroundColor: p.accent }} />}
      {style.photo === 'rounded' && <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: p.accent }} />}
      {style.photo === 'circle' && <div className="h-7 w-7 rounded-full" style={{ backgroundColor: p.accent }} />}
      {!isCentered && <div className="h-px w-full opacity-30" style={{ backgroundColor: p.text }} />}
      <div className={`flex ${isCentered ? 'flex-col items-center' : 'flex-col items-start'} gap-0.5 w-full`}>
        <div className="h-1 w-10 rounded opacity-40" style={{ backgroundColor: p.text }} />
        <div className="h-1 w-8 rounded opacity-30" style={{ backgroundColor: p.text }} />
      </div>
      {style.eventCard === 'filled' && <div className="h-3 w-full rounded" style={{ backgroundColor: `${p.accent}` }} />}
      {style.eventCard === 'bordered' && <div className="h-3 w-full rounded border" style={{ borderColor: p.accent }} />}
      {style.eventCard === 'accent-left' && <div className="flex gap-1 w-full"><div className="h-3 w-0.5 rounded-full" style={{ backgroundColor: p.secondary }} /><div className="flex-1 h-3 rounded" style={{ backgroundColor: `${p.accent}60` }} /></div>}
      {style.eventCard === 'minimal' && <><div className="h-px w-full opacity-20" style={{ backgroundColor: p.text }} /><div className="h-2 w-full rounded" style={{ backgroundColor: `${p.accent}40` }} /></>}
    </div>
  )
}

export default function TemplateSelector() {
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
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {templateStyles.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => set({ template: t.id })}
              className={`rounded-xl border-2 p-2 text-left transition-all ${
                wedding.template === t.id
                  ? 'border-gray-900 bg-gray-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
              }`}
            >
              <div className="overflow-hidden rounded-lg bg-gray-50">
                <TemplatePreview style={t} />
              </div>
              <div className="p-3">
                <span className="block font-serif text-sm leading-tight">{t.name}</span>
                <span className="mt-1 block text-[10px] leading-tight opacity-60">{t.description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Police d'écriture</h2>
        <div className="mt-4">
          <select
            value={wedding.fontPair}
            onChange={(e) => set({ fontPair: e.target.value as FontPairId })}
            className="w-full rounded-lg border p-3 text-base"
          >
            {fontPairs.map((fp) => (
              <option key={fp.id} value={fp.id} style={{ fontFamily: fp.headingStack }}>
                {fp.label} — {fp.heading} + {fp.body}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">Taille des noms</h2>
        <div className="mt-4 flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="6"
            step="0.25"
            value={wedding.coupleFontSize}
            onChange={(e) => set({ coupleFontSize: parseFloat(e.target.value) })}
            className="flex-1 accent-gray-900"
          />
          <span className="w-12 text-right text-sm tabular-nums">{wedding.coupleFontSize}rem</span>
        </div>
      </section>

      <div className="flex items-center justify-between border-t pt-6">
        <div className="text-sm">
          {saveMsg === 'saved' && <span className="text-green-600">✓ Enregistré</span>}
          {saveMsg === 'error' && <span className="text-red-600">Erreur lors de la sauvegarte</span>}
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
    </div>
  )
}
