import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useWeddingContext } from '../../contexts/WeddingContext'
import { FlexibleTemplate } from '../templates'
import { fontPairs } from '../../types/wedding'
import { getCountdown } from '../../utils/helpers'

interface Props { onBack: () => void }

export default function WizardPreview({ onBack }: Props) {
  const { wedding, currentEvent, addEvent, saveWedding, persisted } = useWeddingContext()
  const font = fontPairs.find((f) => f.id === (currentEvent.fontPair ?? 'classic')) ?? fontPairs[0]
  const palette = currentEvent.dressCode.palette
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(getCountdown(currentEvent.date))
  useEffect(() => {
    if (!currentEvent.countdown.enabled) return
    const timer = setInterval(() => setCountdown(getCountdown(currentEvent.date)), 1000)
    return () => clearInterval(timer)
  }, [currentEvent.date, currentEvent.countdown.enabled])

  const shareUrl = `${window.location.origin}/guest.html?wedding=${wedding.id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleSave = async () => {
    setSaving(true)
    try { await saveWedding() } catch {}
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button onClick={onBack} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:px-4">
          Retour
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={async () => { await saveWedding(); addEvent() }}
            className="rounded-lg border border-[#d4af37] bg-white px-3 py-2 text-sm font-medium text-[#d4af37] hover:bg-[#faf6f1] sm:px-4"
          >
            <span className="hidden sm:inline">+ Ajouter un autre événement</span>
            <span className="sm:hidden">+ Ajouter</span>
          </button>
          <button
            onClick={async () => { await saveWedding(); setSaved(true) }}
            className="rounded-lg bg-[#1a3c34] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a4c44] disabled:opacity-40 sm:px-6"
            disabled={saved}
          >
            {saved ? '✓' : 'Terminer'}
          </button>
        </div>
      </div>

      <div
        className="min-h-screen w-full"
        style={{ '--font-couple': font.headingStack, '--font-couple-size': `${currentEvent.coupleFontSize}rem` } as React.CSSProperties}
      >
        <FlexibleTemplate data={currentEvent} palette={palette} />
      </div>

      {currentEvent.countdown.enabled && currentEvent.date && countdown.days > 0 && (
        <div className="mt-8 rounded-xl border bg-white p-6 sm:p-8">
          <h2 className="font-[Playfair_Display,serif] text-xl font-light text-[#1a3c34]">Compte à rebours</h2>
          <p className="mt-1 text-sm text-[#8a9a8c]">{currentEvent.countdown.label}</p>
          <div className="mt-6 grid grid-cols-4 gap-2 text-center sm:gap-4 max-w-md">
            {(['jours', 'heures', 'minutes', 'secondes'] as const).map((label, i) => {
              const value = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds][i]
              return (
                <div key={label} className="rounded-lg p-2 sm:p-4" style={{ backgroundColor: palette.accent }}>
                  <span className="block font-serif text-lg font-light sm:text-3xl" style={{ color: palette.primary }}>{value}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: palette.text }}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border bg-white p-6 sm:p-8">
        <h2 className="font-[Playfair_Display,serif] text-xl font-light text-[#1a3c34]">Partager l'invitation</h2>
        {!persisted ? (
          <div className="mt-4">
            <p className="text-sm text-[#8a9a8c]">Sauvegardez d'abord votre travail pour générer un lien partageable.</p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-3 rounded-lg bg-[#1a3c34] px-6 py-2 text-sm font-medium text-white hover:bg-[#2a4c44] disabled:opacity-40"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder & générer le lien'}
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="w-full flex-1">
              <p className="text-xs font-medium text-[#5c6b5e]">Lien partageable</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs text-gray-600 outline-none sm:text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:px-4"
                >
                  {copied ? 'Copié ✓' : 'Copier'}
                </button>
              </div>
              <p className="mt-3 text-xs text-[#8a9a8c]">
                Les invités verront l'invitation de &laquo;{currentEvent.name || "l'événement"}&raquo;.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <QRCodeSVG value={shareUrl} size={140} />
              <span className="text-[10px] text-[#8a9a8c]">Scannez pour accéder</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
