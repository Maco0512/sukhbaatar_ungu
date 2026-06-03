import type { MetadataRoute } from 'next'
import { getPayloadClient, asRecords } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://localhost:3000'
  const payload = await getPayloadClient()

  const [articlesRes, categoriesRes, authorsRes] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1000,
    }),
    payload.find({ collection: 'categories', limit: 100 }),
    payload.find({ collection: 'authors', limit: 100 }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.5 },
    { url: `${siteUrl}/multimedia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const articles = asRecords(articlesRes.docs).map((a) => ({
    url: `${siteUrl}/news/${a.slug as string}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt as string) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const categories = asRecords(categoriesRes.docs).map((c) => ({
    url: `${siteUrl}/category/${c.slug as string}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  const authors = asRecords(authorsRes.docs).map((a) => ({
    url: `${siteUrl}/author/${a.slug as string}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...articles, ...categories, ...authors]
}
