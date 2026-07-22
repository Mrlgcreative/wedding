import { useState } from 'react'
import type { WizardStep } from './types/wedding'
import Homepage from './components/Homepage'
import WizardEvent from './components/wizard/WizardEvent'
import WizardTemplate from './components/wizard/WizardTemplate'
import WizardCustomize from './components/wizard/WizardCustomize'
import WizardGuests from './components/wizard/WizardGuests'
import WizardPreview from './components/wizard/WizardPreview'
import { WeddingProvider, useWeddingContext } from './contexts/WeddingContext'

const steps: { id: WizardStep; label: string }[] = [
  { id: 'event', label: 'Événement' },
  { id: 'template', label: 'Modèle' },
  { id: 'customize', label: 'Personnalisation' },
  { id: 'guests', label: 'Invités' },
  { id: 'preview', label: 'Aperçu' },
]

function WizardContent() {
  const { loading, error, currentIndex, setCurrentIndex, addEvent, wedding } = useWeddingContext()
  const [step, setStep] = useState<WizardStep>('event')
  const stepIndex = steps.findIndex((s) => s.id === step)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf6f1]">
        <p className="font-serif text-lg opacity-50">Chargement...</p>
      </div>
    )
  }

  const goNext = () => {
    const i = stepIndex + 1
    if (i < steps.length) setStep(steps[i].id as WizardStep)
  }
  const goBack = () => {
    const i = stepIndex - 1
    if (i >= 0) setStep(steps[i].id as WizardStep)
  }

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {error && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-700">
          {error}
        </div>
      )}

      <div className="border-b bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
          <h1 className="shrink-0 font-[Playfair_Display,serif] text-sm tracking-wide text-[#1a3c34]">E-Wedding</h1>
          <div className="flex items-center gap-2 overflow-x-auto text-xs text-[#8a9a8c] scrollbar-none">
            {wedding.events.map((ev, i) => (
              <button
                key={ev.id}
                onClick={() => { setCurrentIndex(i); setStep('event') }}
                className={`shrink-0 rounded-full px-2 py-1 transition-colors sm:px-3 ${i === currentIndex ? 'bg-[#1a3c34] text-white' : 'hover:bg-gray-100'}`}
              >
                {ev.name || `Événement ${i + 1}`}
              </button>
            ))}
            <button onClick={addEvent} className="shrink-0 rounded-full px-2 py-1 hover:bg-gray-100 text-[#d4af37] sm:px-3">+</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-4">
        <div className="mb-8 flex items-center justify-center gap-1 sm:gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setStep(s.id as WizardStep)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i === stepIndex ? 'bg-[#1a3c34] text-white' : i < stepIndex ? 'bg-[#d4af37] text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1}
              </button>
              <span className={`hidden text-xs sm:inline ${i === stepIndex ? 'text-[#1a3c34] font-medium' : 'text-gray-400'}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="h-px w-4 bg-gray-200 sm:w-6" />}
            </div>
          ))}
        </div>

        {step === 'event' && <WizardEvent onNext={goNext} />}
        {step === 'template' && <WizardTemplate onNext={goNext} onBack={goBack} />}
        {step === 'customize' && <WizardCustomize onNext={goNext} onBack={goBack} />}
        {step === 'guests' && <WizardGuests onNext={goNext} onBack={goBack} />}
        {step === 'preview' && <WizardPreview onBack={goBack} />}
      </div>
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(() => localStorage.getItem('ew-started') === 'true')
  if (!started)
    return <Homepage onStart={() => { setStarted(true); localStorage.setItem('ew-started', 'true') }} />
  return (
    <WeddingProvider>
      <WizardContent />
    </WeddingProvider>
  )
}
