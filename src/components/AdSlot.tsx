import React from 'react'
import Image from 'next/image'
import { getActiveAds, getImageUrl } from '@/lib/payload'

interface AdSlotProps {
  ads: unknown[]
  placement: 'header' | 'sidebar' | 'in_article' | 'footer'
  className?: string
}

export function AdSlot({ ads, placement, className = '' }: AdSlotProps) {
  const active = getActiveAds(ads, placement)
  if (!active.length) return null

  return (
    <div className={`ad-slot ${className}`}>
      {active.map((ad, i) => {
        const a = ad as Record<string, unknown>
        const imgUrl = getImageUrl(a.image)
        if (!imgUrl) return null
        const content = (
          <div key={i} style={{ width: '100%' }}>
            <Image
              src={imgUrl}
              alt={typeof a.name === 'string' ? a.name : 'Сурталчилгаа'}
              width={728}
              height={90}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )
        if (typeof a.linkUrl === 'string' && a.linkUrl) {
          return (
            <a key={i} href={a.linkUrl} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block', width: '100%' }}>
              <Image
                src={imgUrl}
                alt={typeof a.name === 'string' ? a.name : 'Сурталчилгаа'}
                width={728}
                height={90}
                style={{ width: '100%', height: 'auto' }}
              />
            </a>
          )
        }
        return content
      })}
    </div>
  )
}
