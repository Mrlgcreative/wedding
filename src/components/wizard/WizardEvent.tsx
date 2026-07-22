import { useWeddingContext } from '../../contexts/WeddingContext'

interface Props { onNext: () => void }

export default function WizardEvent({ onNext }: Props) {
  const { currentEvent, setCurrentEvent } = useWeddingContext()
  const ev = currentEvent

  const set = (partial: Partial<typeof ev>) => setCurrentEvent({ ...ev, ...partial })

  return (
    <div className="rounded-xl border bg-white p-8">
      <h2 className="font-[Playfair_Display,serif] text-2xl font-light text-[#1a3c34]">Créer votre événement</h2>
      <p className="mt-2 text-sm text-[#8a9a8c]">Définissez les informations de votre événement.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#5c6b5e]">Nom de l'événement</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            placeholder="Ex: Cérémonie à l'église"
            value={ev.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5c6b5e]">Type</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            placeholder="Ex: Mairie, Église, Réception"
            value={ev.type}
            onChange={(e) => set({ type: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5c6b5e]">Adresse</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            placeholder="123 Rue de la Paix, 75000 Paris"
            value={ev.address}
            onChange={(e) => set({ address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5c6b5e]">Date</label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            value={ev.date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5c6b5e]">Heure</label>
          <input
            type="time"
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            value={ev.time}
            onChange={(e) => set({ time: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#5c6b5e]">Notes</label>
          <textarea
            rows={2}
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            placeholder="Informations complémentaires..."
            value={ev.notes ?? ''}
            onChange={(e) => set({ notes: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!ev.name.trim()}
          className="rounded-lg bg-[#1a3c34] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2a4c44] disabled:opacity-40"
        >
          Continuer
        </button>
      </div>
    </div>
  )
}
