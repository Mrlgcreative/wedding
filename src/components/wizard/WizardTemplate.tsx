import { useWeddingContext } from '../../contexts/WeddingContext'
import { templateStyles } from '../../types/templates'
import { fontPairs } from '../../types/wedding'

interface Props { onNext: () => void; onBack: () => void }

export default function WizardTemplate({ onNext, onBack }: Props) {
  const { currentEvent, setCurrentEvent } = useWeddingContext()

  return (
    <div className="space-y-10">
      <div className="rounded-xl border bg-white p-8">
        <h2 className="font-[Playfair_Display,serif] text-2xl font-light text-[#1a3c34]">Choisir un modèle</h2>
        <p className="mt-2 text-sm text-[#8a9a8c]">Sélectionnez le style de votre invitation.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {templateStyles.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setCurrentEvent({ ...currentEvent, template: t.id })}
              className={`rounded-xl border-2 p-2 text-left transition-all ${
                currentEvent.template === t.id
                  ? 'border-[#d4af37] bg-[#faf6f1] shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <div className="overflow-hidden rounded-lg bg-gray-50">
                <div className="flex flex-col items-center gap-1.5 py-4 px-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="h-2 w-14 rounded bg-gray-800 opacity-60" />
                    <div className="h-2 w-10 rounded bg-gray-800 opacity-60" />
                  </div>
                  <div className="h-px w-12 bg-gray-300" />
                  <div className="h-1 w-10 rounded bg-gray-400" />
                </div>
              </div>
              <div className="p-2">
                <span className="block font-serif text-xs leading-tight">{t.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-8">
        <h2 className="font-[Playfair_Display,serif] text-xl font-light text-[#1a3c34]">Police d'écriture</h2>
        <div className="mt-4">
          <select
            value={currentEvent.fontPair}
            onChange={(e) => setCurrentEvent({ ...currentEvent, fontPair: e.target.value as typeof currentEvent.fontPair })}
            className="w-full rounded-lg border border-gray-200 p-3 text-base outline-none focus:border-[#d4af37]"
          >
            {fontPairs.map((fp) => (
              <option key={fp.id} value={fp.id} style={{ fontFamily: fp.headingStack }}>
                {fp.label} — {fp.heading} + {fp.body}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
          Retour
        </button>
        <button onClick={onNext} className="rounded-lg bg-[#1a3c34] px-8 py-3 text-sm font-medium text-white hover:bg-[#2a4c44]">
          Continuer
        </button>
      </div>
    </div>
  )
}
