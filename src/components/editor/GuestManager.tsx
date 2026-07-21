import { useState } from 'react'
import { useWedding } from '../../hooks/useWedding'
import type { Guest, EventType } from '../../types/wedding'

export default function GuestManager() {
  const { wedding, guests, addGuest, deleteGuest, persisted } = useWedding()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [invitedPlusOne, setInvitedPlusOne] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([])
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createdEvents = wedding.events.filter((e) => e.name.trim())

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !persisted) return
    setAdding(true)
    setError(null)
    const guest: Guest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      invitedPlusOne,
      status: 'pending',
      weddingId: wedding.id,
      eventTypes: selectedEvents,
    }
    try {
      await addGuest(guest)
      setName('')
      setEmail('')
      setPhone('')
      setInvitedPlusOne(false)
      setSelectedEvents([])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l\'ajout')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet invité ?')) {
      await deleteGuest(id)
    }
  }

  if (!persisted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
        <p className="font-serif text-lg text-gray-400">
          Enregistrez d'abord l'invitation dans l'onglet "Éditeur"
        </p>
        <p className="mt-1 text-sm text-gray-300">
          Vous pourrez ajouter des invités une fois l'invitation créée.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-xl font-light">Ajouter un invité</h2>
        <form onSubmit={handleAdd} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Nom complet *</label>
              <input
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email *</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="jean@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Téléphone</label>
              <input
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Événements</label>
              {createdEvents.length === 0 ? (
                <p className="mt-1 text-xs text-amber-600">
                  Créez d'abord des événements dans l'onglet "Éditeur"
                </p>
              ) : (
                <div className="mt-1 flex flex-wrap gap-4">
                  {createdEvents.map((event) => (
                    <label key={event.type} className="flex items-center gap-1.5 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedEvents.includes(event.type)}
                        onChange={(e) =>
                          setSelectedEvents(
                            e.target.checked
                              ? [...selectedEvents, event.type]
                              : selectedEvents.filter((t) => t !== event.type)
                          )
                        }
                      />
                      {event.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input
                type="checkbox"
                id="invited-plus-one"
                className="mb-2 h-4 w-4"
                checked={invitedPlusOne}
                onChange={(e) => setInvitedPlusOne(e.target.checked)}
              />
              <label htmlFor="invited-plus-one" className="text-sm">
                Autoriser un accompagnateur
              </label>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={adding || !name.trim() || !email.trim()}
            className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {adding ? 'Ajout...' : 'Ajouter l\'invité'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-xl font-light">
          Invités ({guests.length})
        </h2>
        {guests.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">
            Aucun invité pour le moment. Ajoutez-en un ci-dessus.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Téléphone</th>
                  <th className="px-4 py-3 font-medium">Événements</th>
                  <th className="px-4 py-3 font-medium">Accompagnateur</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">{guest.name}</td>
                    <td className="px-4 py-3 text-gray-500">{guest.email}</td>
                    <td className="px-4 py-3 text-gray-500">{guest.phone || '—'}</td>
                    <td className="px-4 py-3">
                      {guest.eventTypes && guest.eventTypes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {guest.eventTypes.map((t) => {
                            const ev = wedding.events.find((e) => e.type === t)
                            return (
                              <span key={t} className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                {ev?.name || t}
                              </span>
                            )
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-400">Tous</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {guest.invitedPlusOne ? (
                        <span className="text-green-600">Oui</span>
                      ) : (
                        <span className="text-gray-400">Non</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={guest.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-xs text-red-500 underline hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {guests.length > 0 && (
        <section className="rounded-xl border bg-gray-50/50 p-6">
          <h2 className="font-serif text-xl font-light">Lien de partage</h2>
          <p className="mt-1 text-xs opacity-60">
            Partagez ce lien avec vos invités. Ils n'ont qu'à choisir leur nom dans la liste.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <input
              className="flex-1 rounded-lg border bg-white p-2 text-sm"
              readOnly
              value={`${wedding.website || window.location.origin}/guest.html?wedding=${wedding.id}`}
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${wedding.website || window.location.origin}/guest.html?wedding=${wedding.id}`
                )
              }
              className="rounded-lg border bg-white px-5 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              Copier
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: Guest['status'] }) {
  const styles: Record<Guest['status'], string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-green-50 text-green-700',
    declined: 'bg-red-50 text-red-700',
  }
  const labels: Record<Guest['status'], string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    declined: 'Décliné',
  }
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
