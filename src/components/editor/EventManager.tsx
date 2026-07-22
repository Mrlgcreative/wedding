import { useState } from 'react'
import { useWedding } from '../../hooks/useWedding'
import type { EventDetails } from '../../types/wedding'

export default function EventManager() {
  const { wedding, setLocalWedding, saveWedding, persisted } = useWedding()
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<'saved' | 'error' | null>(null)

  const updateEvent = (id: string, partial: Partial<EventDetails>) => {
    const events = wedding.events.map((e) => (e.id === id ? { ...e, ...partial } : e))
    setLocalWedding({ ...wedding, events })
  }

  const addEvent = () => {
    const events = [
      ...wedding.events,
      {
        id: crypto.randomUUID(),
        type: '',
        name: '',
        address: '',
        date: '',
        time: '',
        notes: '',
      },
    ]
    setLocalWedding({ ...wedding, events })
  }

  const deleteEvent = (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    const events = wedding.events.filter((e) => e.id !== id)
    setLocalWedding({ ...wedding, events })
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
    <div className="space-y-8">
      {!persisted && (
        <div className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Enregistrez d'abord l'invitation dans l'onglet "Éditeur" pour rendre les événements persistants.
        </div>
      )}
      {wedding.events.length === 0 && (
        <p className="text-sm text-gray-400 italic">Aucun événement. Ajoutez-en un ci-dessous.</p>
      )}
      {wedding.events.map((event, i) => (
        <div key={event.id} className="rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">{i + 1}</span>
              <input
                type="text"
                className="font-serif text-base font-medium outline-none border-none bg-transparent p-0"
                placeholder="Type d'événement (ex: Mairie)"
                value={event.type}
                onChange={(e) => updateEvent(event.id, { type: e.target.value })}
              />
            </div>
            <button
              onClick={() => deleteEvent(event.id)}
              className="text-xs text-red-500 underline hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium opacity-60">Nom / Lieu</label>
              <input
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="Ex: Salle des fêtes de la Mairie"
                value={event.name}
                onChange={(e) => updateEvent(event.id, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium opacity-60">Adresse</label>
              <input
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="123 Rue de la Paix, 75000 Paris"
                value={event.address}
                onChange={(e) => updateEvent(event.id, { address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium opacity-60">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                value={event.date}
                onChange={(e) => updateEvent(event.id, { date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium opacity-60">Heure</label>
              <input
                type="time"
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                value={event.time}
                onChange={(e) => updateEvent(event.id, { time: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium opacity-60">Notes</label>
              <textarea
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                rows={2}
                placeholder="Informations complémentaires..."
                value={event.notes ?? ''}
                onChange={(e) => updateEvent(event.id, { notes: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addEvent}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600"
      >
        + Ajouter un événement
      </button>

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
    </div>
  )
}
