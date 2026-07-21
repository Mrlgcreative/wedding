import { useWedding } from '../../hooks/useWedding'
import type { EventDetails } from '../../types/wedding'

const eventLabels: Record<string, string> = {
  mairie: 'Mairie',
  ceremonie: 'Cérémonie religieuse',
  reception: 'Vin d\'honneur / Réception',
}

export default function EventManager() {
  const { wedding, setLocalWedding, persisted } = useWedding()

  const updateEvent = (i: number, partial: Partial<EventDetails>) => {
    const events = wedding.events.map((e, idx) => (idx === i ? { ...e, ...partial } : e))
    setLocalWedding({ ...wedding, events })
  }

  return (
    <div className="space-y-8">
      {!persisted && (
        <div className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Enregistrez d'abord l'invitation dans l'onglet "Éditeur" pour rendre les événements persistants.
        </div>
      )}
      {wedding.events.map((event, i) => (
        <div key={event.type} className="rounded-xl border p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">{i + 1}</span>
            <h3 className="font-serif text-base font-medium">{eventLabels[event.type] || event.type}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium opacity-60">Nom / Lieu</label>
              <input
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="Ex: Salle des fêtes de la Mairie"
                value={event.name}
                onChange={(e) => updateEvent(i, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium opacity-60">Adresse</label>
              <input
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="123 Rue de la Paix, 75000 Paris"
                value={event.address}
                onChange={(e) => updateEvent(i, { address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium opacity-60">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                value={event.date}
                onChange={(e) => updateEvent(i, { date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium opacity-60">Heure</label>
              <input
                type="time"
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                value={event.time}
                onChange={(e) => updateEvent(i, { time: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium opacity-60">Notes</label>
              <textarea
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                rows={2}
                placeholder="Informations complémentaires..."
                value={event.notes ?? ''}
                onChange={(e) => updateEvent(i, { notes: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
