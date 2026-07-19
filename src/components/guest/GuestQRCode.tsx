import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useWedding } from '../../hooks/useWedding'

interface GuestQRCodeProps {
  guestId: string
  guestName: string
}

export default function GuestQRCode({ guestId, guestName }: GuestQRCodeProps) {
  const { wedding } = useWedding()
  const svgRef = useRef<SVGSVGElement>(null)
  const p = wedding.dressCode.palette

  const base = wedding.website || window.location.origin + '/invitation/' + wedding.id
  const url = base + '?guest=' + guestId

  const download = () => {
    const svg = svgRef.current
    if (!svg) return
    const clone = svg.cloneNode(true) as SVGSVGElement
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', '200')
    rect.setAttribute('height', '200')
    rect.setAttribute('fill', p.background)
    rect.setAttribute('rx', '12')
    clone.insertBefore(rect, clone.firstChild)

    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(clone)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `e-wedding-${guestName.replace(/\s+/g, '-').toLowerCase()}.svg`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-white p-6 shadow-sm" style={{ borderColor: p.accent }}>
      <p className="text-xs uppercase tracking-widest opacity-50">Votre invitation personnelle</p>
      <QRCodeSVG ref={svgRef} value={url} size={140} level="M" fgColor={p.primary} />
      <p className="text-sm font-medium">{guestName}</p>
      <button
        onClick={download}
        className="rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
        style={{ borderColor: p.accent }}
      >
        Télécharger mon QR code
      </button>
    </div>
  )
}
