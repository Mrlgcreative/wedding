import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useWedding } from '../../hooks/useWedding'

function GuestQRCard({ guest }: { guest: { id: string; name: string } }) {
  const { wedding } = useWedding()
  const svgRef = useRef<SVGSVGElement>(null)
  const p = wedding.dressCode.palette

  const base = wedding.website || window.location.origin
  const url = base + '?wedding=' + wedding.id + '&guest=' + guest.id

  const download = () => {
    const svg = svgRef.current
    if (!svg) return
    const clone = svg.cloneNode(true) as SVGSVGElement
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', '200')
    rect.setAttribute('height', '200')
    rect.setAttribute('fill', '#ffffff')
    rect.setAttribute('rx', '12')
    clone.insertBefore(rect, clone.firstChild)

    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(clone)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `e-wedding-${guest.name.replace(/\s+/g, '-').toLowerCase()}.svg`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const copyLink = () => navigator.clipboard.writeText(url)

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border bg-white p-4 shadow-sm">
      <QRCodeSVG ref={svgRef} value={url} size={120} level="M" fgColor={p.primary} />
      <p className="text-sm font-medium">{guest.name}</p>
      <div className="flex gap-3">
        <button onClick={download} className="text-xs underline opacity-60 hover:opacity-100">
          Télécharger
        </button>
        <button onClick={copyLink} className="text-xs underline opacity-60 hover:opacity-100">
          Copier le lien
        </button>
      </div>
    </div>
  )
}

export default function QRCodeSection() {
  const { wedding, guests } = useWedding()

  const base = wedding.website || window.location.origin
  const globalUrl = base + '?wedding=' + wedding.id
  const copyGlobalLink = () => navigator.clipboard.writeText(globalUrl)

  return (
    <section>
      <h2 className="font-serif text-xl font-light">QR Codes invités</h2>
      <p className="mt-1 text-xs opacity-60">
        Chaque QR code ouvre la page d'aperçu avec l'identité de l'invité pré-remplie.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={copyGlobalLink}
          className="rounded-lg border px-5 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
        >
          Copier le lien principal
        </button>
        <span className="max-w-[400px] truncate text-xs opacity-50">{globalUrl}</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {guests.map((guest) => (
          <GuestQRCard key={guest.id} guest={guest} />
        ))}
      </div>
    </section>
  )
}
