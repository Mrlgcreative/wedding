import { useState } from 'react'
import type { RSVP } from '../../types/wedding'

interface RSVPFormProps {
  guestId: string
  onSubmit: (rsvp: RSVP) => void
}

export default function RSVPForm({ guestId, onSubmit }: RSVPFormProps) {
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [allergies, setAllergies] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (confirmed === null) return
    onSubmit({
      guestId,
      confirmed,
      plusOne,
      plusOneName: plusOne ? plusOneName : undefined,
      dietaryRestrictions: dietaryRestrictions || undefined,
      allergies: allergies || undefined,
      message: message || undefined,
      submittedAt: new Date().toISOString(),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <p className="font-serif text-lg text-green-800">
          Merci pour votre réponse !
        </p>
        <p className="mt-1 text-sm text-green-600">
          Nous sommes ravis de vous compter parmi nous
          {confirmed ? '' : ' et espérons vous voir prochainement'}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="font-serif text-lg">Réponse attendue</p>
      <div className="flex gap-4">
        {(['Oui, je viens !', 'Non, désolé(e)'] as const).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setConfirmed(label === 'Oui, je viens !')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              (confirmed === (label === 'Oui, je viens !'))
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {confirmed && (
        <>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={plusOne} onChange={(e) => setPlusOne(e.target.checked)} />
            Je viens accompagné(e)
          </label>

          {plusOne && (
            <div>
              <label className="block text-sm font-medium">Nom de l'accompagnant</label>
              <input
                className="mt-1 w-full rounded-lg border p-2 text-sm"
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Régime alimentaire</label>
            <input
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              placeholder="Végétarien, vegan, sans gluten…"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Allergies</label>
            <input
              className="mt-1 w-full rounded-lg border p-2 text-sm"
              placeholder="Arachides, lactose, etc."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium">Un mot pour les mariés</label>
        <textarea
          className="mt-1 w-full rounded-lg border p-2 text-sm"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={confirmed === null}
        className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Envoyer ma réponse
      </button>
    </form>
  )
}
