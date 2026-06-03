import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config })
}

// Cast Payload typed docs to a plain record for component props
export function asRecord<T>(val: T): Record<string, unknown> {
  return val as unknown as Record<string, unknown>
}

export function asRecords<T>(arr: T[]): Record<string, unknown>[] {
  return arr as unknown as Record<string, unknown>[]
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function getImageUrl(image: unknown): string | null {
  if (!image || typeof image !== 'object') return null
  const img = image as Record<string, unknown>
  if (typeof img.url === 'string') return img.url
  return null
}

export function getActiveAds(ads: unknown[], placement: string): unknown[] {
  const now = new Date()
  return ads.filter((ad: unknown) => {
    const a = ad as Record<string, unknown>
    if (!a.active) return false
    if (a.placement !== placement) return false
    if (a.startDate && new Date(a.startDate as string) > now) return false
    if (a.endDate && new Date(a.endDate as string) < now) return false
    return true
  })
}
