import { useState } from 'react'
import type { AppTab } from './types/wedding'
import EditorForm from './components/editor/EditorForm'
import EventManager from './components/editor/EventManager'
import GuestManager from './components/editor/GuestManager'
import GuestInvitation from './components/guest/GuestInvitation'
import { WeddingProvider, useWeddingContext } from './contexts/WeddingContext'

const tabs: { id: AppTab; label: string }[] = [
  { id: 'editor', label: 'Éditeur' },
  { id: 'events', label: 'Événements' },
  { id: 'guests', label: 'Invités' },
  { id: 'guest', label: 'Aperçu' },
]

function AppContent() {
  const [activeTab, setActiveTab] = useState<AppTab>('editor')
  const [menuOpen, setMenuOpen] = useState(false)
  const { loading, error } = useWeddingContext()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-serif text-lg opacity-50">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {error && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-700">
          {error} — Vous pouvez tout de même utiliser l'éditeur ci-dessous, les données seront sauvegardées plus tard.
        </div>
      )}

      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <h1 className="font-serif text-lg tracking-wide">E-Wedding</h1>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md sm:hidden"
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav className="hidden gap-1 rounded-lg bg-gray-100 p-1 sm:flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {menuOpen && (
          <div className="border-t px-4 py-3 sm:hidden">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMenuOpen(false) }}
                  className={`rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {activeTab === 'editor' && (
            <div className="rounded-xl border p-6 sm:p-10">
              <h2 className="mb-8 font-serif text-2xl font-light">Personnaliser l'invitation</h2>
              <EditorForm />
            </div>
          )}
          {activeTab === 'events' && (
            <div className="rounded-xl border p-6 sm:p-10">
              <h2 className="mb-8 font-serif text-2xl font-light">Événements</h2>
              <EventManager />
            </div>
          )}
          {activeTab === 'guests' && (
            <div className="rounded-xl border p-6 sm:p-10">
              <h2 className="mb-8 font-serif text-2xl font-light">Gestion des invités</h2>
              <GuestManager />
            </div>
          )}
          {activeTab === 'guest' && <GuestInvitation />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <WeddingProvider>
      <AppContent />
    </WeddingProvider>
  )
}
