import { useState } from 'react'
import { useWeddingContext } from '../../contexts/WeddingContext'
import type { Guest } from '../../types/wedding'

interface Props { onNext: () => void; onBack: () => void }

export default function WizardGuests({ onNext, onBack }: Props) {
  const { currentEvent, addGuest, deleteGuest } = useWeddingContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [invitedPlusOne, setInvitedPlusOne] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    const guest: Guest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      invitedPlusOne,
      status: 'pending',
    }
    await addGuest(guest)
    setName('')
    setEmail('')
    setInvitedPlusOne(false)
  }

  const guests = currentEvent.guests

  return (
    <div className="rounded-xl border bg-white p-8">
      <h2 className="font-[Playfair_Display,serif] text-2xl font-light text-[#1a3c34]">Ajouter des invités</h2>
      <p className="mt-2 text-sm text-[#8a9a8c]">Les invités pour cet événement.</p>

      <form onSubmit={handleAdd} className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-[#5c6b5e]">Nom complet *</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37]"
            placeholder="Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5c6b5e]">Email *</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#d4af37]"
            placeholder="jean@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="plus-one"
            className="h-4 w-4"
            checked={invitedPlusOne}
            onChange={(e) => setInvitedPlusOne(e.target.checked)}
          />
          <label htmlFor="plus-one" className="text-sm text-[#5c6b5e]">Autoriser un accompagnateur</label>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-lg bg-[#1a3c34] px-6 py-3 text-sm font-medium text-white hover:bg-[#2a4c44] disabled:opacity-40"
            disabled={!name.trim() || !email.trim()}
          >
            Ajouter
          </button>
        </div>
      </form>

      {guests.length > 0 && (
        <div className="mt-8">
          <div className="hidden sm:block overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#5c6b5e]">Nom</th>
                  <th className="px-4 py-3 font-medium text-[#5c6b5e]">Email</th>
                  <th className="px-4 py-3 font-medium text-[#5c6b5e]">Accompagnateur</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {guests.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">{g.name}</td>
                    <td className="px-4 py-3 text-gray-500">{g.email}</td>
                    <td className="px-4 py-3">{g.invitedPlusOne ? <span className="text-green-600">Oui</span> : <span className="text-gray-400">Non</span>}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteGuest(g.id)} className="text-xs text-red-500 underline hover:text-red-700">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 sm:hidden">
            {guests.map((g) => (
              <div key={g.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{g.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{g.email}</p>
                    <p className="mt-1 text-xs">{g.invitedPlusOne ? <span className="text-green-600">+1 autorisé</span> : <span className="text-gray-400">Sans accompagnateur</span>}</p>
                  </div>
                  <button onClick={() => deleteGuest(g.id)} className="shrink-0 text-xs text-red-500 underline hover:text-red-700">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
          Retour
        </button>
        <button onClick={onNext} className="rounded-lg bg-[#1a3c34] px-8 py-3 text-sm font-medium text-white hover:bg-[#2a4c44]">
          Aperçu
        </button>
      </div>
    </div>
  )
}
