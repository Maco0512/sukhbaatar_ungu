'use client'
import { useId } from 'react'

type KheeDividerProps = {
  variant?: 'full' | 'content'
  color?: string
  height?: number
}

// 100 tiles × 42 px = 4 200 px — the fluid SVG clips them at its viewport edge
const TILE_COUNT  = 100
const TILE_STRIDE = 42
const TOP_RAIL    = 3
const BOT_RAIL    = 64

export function KheeDivider({
  variant = 'content',
  color   = '#C0392B',
  height  = 100,
}: KheeDividerProps) {
  const uid     = useId().replace(/:/g, '')
  const groupId = `khee-g-${uid}`

  const svg = (
    <svg
      width="100%"
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      overflow="hidden"
      style={{ color, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <g id={groupId}>
          <path d="M3 0V30"   stroke="currentColor" strokeWidth="6" fill="none"/>
          <path d="M21 24V54" stroke="currentColor" strokeWidth="6" fill="none"/>
          <path d="M33 12V42" stroke="currentColor" strokeWidth="6" fill="none"/>
          <path d="M51 36V66" stroke="currentColor" strokeWidth="6" fill="none"/>
          <path d="M0 27H24"  stroke="currentColor" strokeWidth="6" fill="none"/>
          <path d="M18 51H42" stroke="currentColor" strokeWidth="6" fill="none"/>
          <path d="M12 15H36" stroke="currentColor" strokeWidth="6" fill="none"/>
          <path d="M30 39H54" stroke="currentColor" strokeWidth="6" fill="none"/>
        </g>
      </defs>

      {Array.from({ length: TILE_COUNT }, (_, i) => (
        <use key={i} href={`#${groupId}`} x={i * TILE_STRIDE} />
      ))}

      {/* Horizontal rails */}
      <line x1="0"    y1={TOP_RAIL} x2="100%" y2={TOP_RAIL} stroke="currentColor" strokeWidth="6"/>
      <line x1="0"    y1={BOT_RAIL} x2="100%" y2={BOT_RAIL} stroke="currentColor" strokeWidth="6"/>

      {/* Left cap — center at x=3, so the 6 px stroke fills x=0..6 */}
      <line x1="3"    y1={TOP_RAIL} x2="3"    y2={BOT_RAIL} stroke="currentColor" strokeWidth="6"/>

      {/* Right cap — x1="100%" puts the center at the viewport edge; translate(-3,0)
          pulls it 3 px inward so the full 6 px stroke is visible before the clip */}
      <line
        x1="100%" y1={TOP_RAIL}
        x2="100%" y2={BOT_RAIL}
        stroke="currentColor" strokeWidth="6"
        transform="translate(-3, 0)"
      />
    </svg>
  )

  if (variant === 'full') {
    return (
      <div style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        {svg}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 'var(--max-w)', width: '100%', margin: '0 auto' }}>
      {svg}
    </div>
  )
}
