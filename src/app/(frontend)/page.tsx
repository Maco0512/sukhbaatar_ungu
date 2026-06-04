import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPayloadClient, formatDate, getImageUrl, getActiveAds, asRecords } from '@/lib/payload'
import { ArticleCard } from '@/components/ArticleCard'
import { AdSlot } from '@/components/AdSlot'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Сүхбаатарын Өнгө — Нүүр хуудас',
  description: 'Сүхбаатар аймгийн орон нутгийн сонин. Дариганга болон аймгийн мэдээ, нийгэм, соёл.',
  openGraph: {
    title: 'Сүхбаатарын Өнгө',
    description: 'Сүхбаатар аймгийн орон нутгийн сонин',
    type: 'website',
  },
}

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [articlesRes, categoriesRes, adsRes] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 40,
      depth: 2,
    }),
    payload.find({
      collection: 'categories',
      sort: 'order',
      limit: 10,
    }),
    payload.find({
      collection: 'ads',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 20,
    }),
  ])

  const articles  = asRecords(articlesRes.docs)
  const categories = asRecords(categoriesRes.docs)
  const ads = adsRes.docs

  // Lead: first featured article, fallback to latest
  const featured = articles.filter((a) => a.featured)
  const lead = featured[0] ?? articles[0]
  const leadId = lead?.id

  // Top stories: next 4 articles after the lead
  const topStories = articles.filter((a) => a.id !== leadId).slice(0, 4)

  // Per-category sections: max 3 articles each, lead excluded to avoid duplication
  const categoryGroups = categories
    .map((cat) => ({
      cat,
      articles: articles
        .filter((a) => {
          const c = a.category as Record<string, unknown> | null
          return c && c.id === cat.id && a.id !== leadId
        })
        .slice(0, 3),
    }))
    .filter((g) => g.articles.length > 0)

  const headerAds = getActiveAds(ads as unknown[], 'header')
  const sidebarAds = getActiveAds(ads as unknown[], 'sidebar')

  return (
    <>
      {/* Header Ad */}
      {headerAds.length > 0 && (
        <div className="header-ad">
          <div className="container">
            <AdSlot ads={ads as unknown[]} placement="header" />
          </div>
        </div>
      )}

      <div className="content-grid">
        {/* ── Main column ── */}
        <div>
          {/* 1. Lead story + Top stories */}
          {lead && (
            <div className="home-lead-row">
              <LeadStory article={lead} />
              <TopStoriesPanel articles={topStories} />
            </div>
          )}

          {/* 2. Category section blocks */}
          {categoryGroups.map(({ cat, articles: catArticles }) => (
            <div key={cat.id as string} className="cat-block">
              <div className="cat-block-header">
                <span className="cat-block-title">{cat.name as string}</span>
                <Link href={`/category/${cat.slug as string}`} className="cat-block-see-all">
                  Бүгдийг үзэх →
                </Link>
              </div>
              <div className="cat-block-grid">
                {catArticles.map((article) => (
                  <ArticleCard key={article.id as string} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          {sidebarAds.length > 0 && (
            <AdSlot ads={ads as unknown[]} placement="sidebar" className="sidebar-widget" />
          )}

          <div className="sidebar-widget">
            <div className="sidebar-widget-title">Булангууд</div>
            <div className="sidebar-widget-body">
              {categories.map((cat) => (
                <div key={cat.id as string} style={{ marginBottom: '0.5rem' }}>
                  <Link
                    href={`/category/${cat.slug as string}`}
                    style={{ fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    → {cat.name as string}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-widget">
            <div className="sidebar-widget-title">Сүүлийн мэдээ</div>
            <div className="sidebar-widget-body">
              {articles.slice(0, 6).map((article) => (
                <ArticleCard
                  key={article.id as string}
                  article={article}
                  horizontal
                  size="sm"
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

/* ─── Lead story component ─────────────────────────────────────────────────── */
function LeadStory({ article }: { article: Record<string, unknown> }) {
  const slug = article.slug as string
  const title = article.title as string
  const excerpt = article.excerpt as string | undefined
  const publishedAt = article.publishedAt as string | undefined
  const category = article.category as Record<string, unknown> | null | undefined
  const author = article.author as Record<string, unknown> | null | undefined
  const imgUrl = getImageUrl(article.coverImage)

  return (
    <article className="lead-story">
      {imgUrl && (
        <Link href={`/news/${slug}`} className="lead-story-image">
          <Image
            src={imgUrl}
            alt={title}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Link>
      )}
      <div className="lead-story-body">
        {category && (
          <Link href={`/category/${category.slug as string}`} className="cat-badge">
            {category.name as string}
          </Link>
        )}
        <Link href={`/news/${slug}`}>
          <h2 className="lead-story-title">{title}</h2>
        </Link>
        {excerpt && <p className="lead-story-excerpt">{excerpt}</p>}
        <div className="article-meta">
          {author && (
            <Link href={`/author/${author.slug as string}`} style={{ fontWeight: 600 }}>
              {author.name as string}
            </Link>
          )}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
        <Link href={`/news/${slug}`} className="lead-story-readmore">
          Дэлгэрэнгүй →
        </Link>
      </div>
    </article>
  )
}

/* ─── Top stories panel ────────────────────────────────────────────────────── */
function TopStoriesPanel({ articles }: { articles: Record<string, unknown>[] }) {
  if (!articles.length) return null

  return (
    <div className="top-stories-panel">
      <div className="top-stories-panel-title">Топ мэдээ</div>
      {articles.map((article) => {
        const slug = article.slug as string
        const title = article.title as string
        const publishedAt = article.publishedAt as string | undefined
        const category = article.category as Record<string, unknown> | null | undefined
        const catName = category?.name as string | undefined
        const catSlug = category?.slug as string | undefined

        return (
          <div key={article.id as string} className="top-story-item">
            {catName && catSlug && (
              <Link
                href={`/category/${catSlug}`}
                className="cat-badge"
                style={{ fontSize: '0.62rem', marginBottom: '0.1rem', display: 'inline-block' }}
              >
                {catName}
              </Link>
            )}
            <Link href={`/news/${slug}`} className="top-story-headline">
              {title}
            </Link>
            {publishedAt && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                {formatDate(publishedAt)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
