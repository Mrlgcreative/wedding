import { useState, useEffect } from 'react'

const words = ['15 modèles', 'Personnalisable', 'Partageable']

function AnimatedWords() {
  const [i, setI] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setI((prev) => (prev + 1) % words.length)
        setFade(true)
      }, 400)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <span
      className="transition-opacity duration-400"
      style={{ opacity: fade ? 1 : 0 }}
    >
      {words[i]}
    </span>
  )
}

interface HomepageProps {
  onStart: () => void
}

export default function Homepage({ onStart }: HomepageProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#faf6f1]">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#1a3c34" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#d4af37]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#d4af37]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-[#d4af37]/10" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#1a3c34]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-3 text-[#d4af37]">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-[Cormorant_Garamond,serif] text-xs tracking-[0.35em] uppercase">E-Wedding</span>
        </div>

        <div className="mt-16 h-px w-12 bg-[#d4af37]/40" />

        <h1 className="mt-12 font-[Playfair_Display,serif] text-6xl font-light leading-[1.1] tracking-wide text-[#1a3c34] sm:text-8xl">
          L'art de
          <br />
          <span className="italic font-normal">dire oui</span>
        </h1>

        <p className="mt-8 max-w-lg font-[Cormorant_Garamond,serif] text-lg leading-relaxed text-[#5c6b5e]">
          Créez une invitation de mariage d'exception. Choisissez parmi 15 modèles, personnalisez chaque détail et partagez avec vos proches.
        </p>

        <button
          onClick={onStart}
          className="group relative mt-12 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1a3c34] px-10 py-4 font-[Cormorant_Garamond,serif] text-lg text-white transition-all hover:bg-[#2a4c44] active:scale-[0.97]"
        >
          <span className="relative z-10">Créer mon invitation</span>
          <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        <div className="mt-20 h-px w-24 bg-[#d4af37]/20" />

        <p className="mt-8 font-[Cormorant_Garamond,serif] text-base italic text-[#8a9a8c]">
          <AnimatedWords />
        </p>

        <div className="mt-20 grid w-full max-w-2xl grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Événement', desc: 'Définissez la date, le lieu et les horaires de votre célébration' },
            { step: '02', title: 'Modèle', desc: 'Sélectionnez parmi 15 styles d\'invitation raffinés' },
            { step: '03', title: 'Personnalisez', desc: 'Ajoutez vos photos, votre histoire et le dress code' },
          ].map((item) => (
            <div key={item.step} className="space-y-3 text-center">
              <span className="font-[Cormorant_Garamond,serif] text-2xl font-light text-[#d4af37]/50">{item.step}</span>
              <h3 className="font-[Playfair_Display,serif] text-sm font-medium text-[#1a3c34]">{item.title}</h3>
              <p className="text-xs leading-relaxed text-[#8a9a8c]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
