import { getPayloadClient, asRecords } from '@/lib/payload'

export const dynamic = 'force-dynamic'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://localhost:3000'
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 30,
    depth: 2,
  })

  const articles = asRecords(res.docs)

  const items = articles.map((a) => {
    const title = escapeXml((a.title as string) || '')
    const slug = a.slug as string
    const excerpt = escapeXml((a.excerpt as string) || '')
    const date = a.publishedAt ? new Date(a.publishedAt as string).toUTCString() : ''
    const author = a.author as Record<string, unknown> | null
    const authorName = author ? escapeXml((author.name as string) || '') : ''
    const url = `${siteUrl}/news/${slug}`

    return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${excerpt}</description>
      <pubDate>${date}</pubDate>
      ${authorName ? `<author>${authorName}</author>` : ''}
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Сүхбаатарын Өнгө</title>
    <link>${siteUrl}</link>
    <description>Сүхбаатар аймгийн орон нутгийн сонин</description>
    <language>mn</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
