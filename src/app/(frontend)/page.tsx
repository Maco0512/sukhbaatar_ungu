import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPayloadClient, formatDate, getImageUrl, getActiveAds, asRecords } from '@/lib/payload'
import { ArticleCard } from '@/components/ArticleCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Сүхбаатарын Өнгө',
  description: 'Сүхбаатар аймгийн орон нутгийн сонин. Дариганга болон аймгийн мэдээ, нийгэм, соёл.',
  openGraph: {
    title: 'Сүхбаатарын Өнгө',
    description: 'Сүхбаатар аймгийн орон нутгийн сонин',
    type: 'website',
  },
}

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [allRes, multimediaRes, categoriesRes, adsRes] = await Promise.all([
    // All recent published articles — used for lead, top stories, and category sections
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 60,
      depth: 2,
    }),
    // Multimedia — articles that have a video embed
    payload.find({
      collection: 'articles',
      where: {
        and: [
          { status: { equals: 'published' } },
          { videoEmbedUrl: { exists: true } },
        ],
      },
      sort: '-publishedAt',
      limit: 4,
      depth: 2,
    }),
    payload.find({ collection: 'categories', sort: 'order', limit: 10 }),
    payload.find({
      collection: 'ads',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 20,
    }),
  ])

  const articles  = asRecords(allRes.docs)
  const categories = asRecords(categoriesRes.docs)
  const multimedia = asRecords(multimediaRes.docs)
  const ads = adsRes.docs

  // Lead: most recent featured article, fallback to latest
  const featured = articles.filter((a) => a.featured)
  const lead = featured[0] ?? articles[0]

  // Top stories: next 4 articles excluding the lead
  const topStories = articles.filter((a) => a.id !== lead?.id).slice(0, 4)

  // Per-category sections (up to 3 articles each; exclude the lead article)
  const sectionData = categories
    .map((cat) => ({
      cat,
      articles: articles
        .filter((a) => {
          const c = a.category as Record<string, unknown> | null
          return c && c.id === cat.id && a.id !== lead?.id
        })
        .slice(0, 3),
    }))
    .filter((s) => s.articles.length > 0)

  const headerAds = getActiveAds(ads as unknown[], 'header')
  const sidebarAds = getActiveAds(ads as unknown[], 'sidebar')
  const firstSidebarAd = sidebarAds[0] as Record<string, unknown> | undefined

  return (
    <div className="home-wrapper">

      {/* 1 ─── Top banner ad */}
      {headerAds.length > 0 && (
        <div className="home-header-ad">
          {headerAds.map((ad, i) => {
            const a = ad as Record<string, unknown>
            const imgUrl = getImageUrl(a.image)
            if (!imgUrl) return null
            const content = (
              <Image key={i} src={imgUrl} alt={(a.name as string) || 'Сурталчилгаа'} width={970} height={90} style={{ maxWidth: '100%', height: 'auto' }} />
            )
            return typeof a.linkUrl === 'string'
              ? <a key={i} href={a.linkUrl} target="_blank" rel="noopener noreferrer sponsored">{content}</a>
              : content
          })}
        </div>
      )}

      {/* 2 ─── Lead story + Top stories strip */}
      {lead && (
        <div className="home-lead-row">
          <ArticleCard article={lead} variant="lead" priority />
          <div className="top-stories-col">
            <span className="top-stories-label">Топ мэдээ</span>
            {topStories.map((a) => (
              <ArticleCard key={a.id as string} article={a} variant="top" />
            ))}
          </div>
        </div>
      )}

      {/* 3 ─── Section blocks */}
      <div className="home-sections">
        {sectionData.map((section, idx) => {
          const catName = section.cat.name as string
          const catSlug = section.cat.slug as string

          const block = (
            <div className="section-block-bbc">
              <div className="section-header-bar">
                <h2>{catName}</h2>
                <Link href={`/category/${catSlug}`} className="section-see-all">
                  Бүгдийг үзэх →
                </Link>
              </div>
              <div className="section-cards-grid">
                {section.articles.map((a) => (
                  <ArticleCard key={a.id as string} article={a} variant="section" />
                ))}
              </div>
            </div>
          )

          // Place sidebar ad beside the first section that has articles
          if (idx === 0 && firstSidebarAd) {
            const adImgUrl = getImageUrl(firstSidebarAd.image)
            return (
              <div key={catSlug} className="section-with-sidebar">
                {block}
                <aside className="sidebar-ad-widget">
                  <p className="sidebar-ad-widget-label">Сурталчилгаа</p>
                  {adImgUrl && (
                    typeof firstSidebarAd.linkUrl === 'string' ? (
                      <a href={firstSidebarAd.linkUrl as string} target="_blank" rel="noopener noreferrer sponsored">
                        <Image src={adImgUrl} alt={(firstSidebarAd.name as string) || ''} width={240} height={320} style={{ width: '100%', height: 'auto', borderRadius: 2 }} />
                      </a>
                    ) : (
                      <Image src={adImgUrl} alt={(firstSidebarAd.name as string) || ''} width={240} height={320} style={{ width: '100%', height: 'auto', borderRadius: 2 }} />
                    )
                  )}
                </aside>
              </div>
            )
          }

          return <div key={catSlug}>{block}</div>
        })}
      </div>

      {/* 4 ─── Multimedia strip */}
      {multimedia.length > 0 && (
        <section className="multimedia-strip">
          <div className="multimedia-strip-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="multimedia-strip-title">Мультимедиа</span>
            <Link href="/multimedia" className="section-see-all" style={{ marginLeft: 'auto' }}>
              Бүгдийг үзэх →
            </Link>
          </div>
          <div className="multimedia-grid">
            {multimedia.map((a) => (
              <ArticleCard key={a.id as string} article={a} variant="multimedia" />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
