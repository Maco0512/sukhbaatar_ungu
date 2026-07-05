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
  description: 'Сүхбаатар аймгийн орон нутгийн сонин. Дарьганга болон аймгийн мэдээ, нийгэм, соёл.',
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

  const articles   = asRecords(articlesRes.docs)
  const categories = asRecords(categoriesRes.docs)
  const ads        = adsRes.docs

  // Lead story
  const featured = articles.filter((a) => a.featured)
  const lead    = featured[0] ?? articles[0]
  const leadId  = lead?.id

  // Right column: most recent articles (excluding lead)
  const recentNews = articles.filter((a) => a.id !== leadId).slice(0, 6)

  // Category blocks below hero (lead excluded)
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

  return (
    <>
      {/* Full-width leaderboard ad */}
      {headerAds.length > 0 && (
        <div className="ad-leaderboard">
          <p className="ad-leaderboard-label">Сайт сурталчилгаа</p>
          <AdSlot ads={ads as unknown[]} placement="header" />
        </div>
      )}

      {/* Hero: wide lead story (left) + Сүүлийн мэдээ list (right) */}
      {lead && (
        <section className="home-hero-section">
          <div className="home-hero-inner">
            <LeadStory article={lead} />
            <RecentNewsPanel articles={recentNews} />
          </div>
        </section>
      )}

      {/* Category section blocks */}
      {categoryGroups.length > 0 && (
        <div className="home-body">
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
      )}
    </>
  )
}

/* ─── Lead story (left, wide) ──────────────────────────────────────────────── */
function LeadStory({ article }: { article: Record<string, unknown> }) {
  const slug       = article.slug as string
  const title      = article.title as string
  const excerpt    = article.excerpt as string | undefined
  const publishedAt = article.publishedAt as string | undefined
  const category   = article.category as Record<string, unknown> | null | undefined
  const author     = article.author as Record<string, unknown> | null | undefined
  const imgUrl     = getImageUrl(article.coverImage)

  return (
    <article className="lead-story">
      {imgUrl ? (
        <Link href={`/news/${slug}`} className="lead-story-image">
          <Image
            src={imgUrl}
            alt={title}
            fill
            sizes="(max-width: 900px) 100vw, 65vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Link>
      ) : (
        <div className="lead-story-image" />
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
        <div className="meta-line">
          {author && (
            <>
              <Link href={`/author/${author.slug as string}`} style={{ fontWeight: 600, color: 'var(--text)' }}>
                {author.name as string}
              </Link>
              <span className="meta-sep">·</span>
            </>
          )}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
          {category && (
            <>
              <span className="meta-sep">|</span>
              <Link href={`/category/${category.slug as string}`}>{category.name as string}</Link>
            </>
          )}
        </div>
        <Link href={`/news/${slug}`} className="lead-story-readmore">
          Дэлгэрэнгүй →
        </Link>
      </div>
    </article>
  )
}

/* ─── Сүүлийн мэдээ list (right column) ────────────────────────────────────── */
function RecentNewsPanel({ articles }: { articles: Record<string, unknown>[] }) {
  if (!articles.length) return null

  return (
    <nav className="recent-news-panel" aria-label="Сүүлийн мэдээ">
      <div className="recent-news-panel-title">Сүүлийн мэдээ</div>

      {articles.map((article) => {
        const slug       = article.slug as string
        const title      = article.title as string
        const excerpt    = article.excerpt as string | undefined
        const publishedAt = article.publishedAt as string | undefined
        const category   = article.category as Record<string, unknown> | null | undefined
        const catName    = category?.name as string | undefined
        const catSlug    = category?.slug as string | undefined
        const hasVideo   = !!(article.videoEmbedUrl)

        return (
          <div key={article.id as string} className="recent-news-item">
            {/* Headline */}
            <Link href={`/news/${slug}`} className="recent-news-headline">
              {hasVideo && <span className="video-icon">▶</span>}
              {title}
            </Link>

            {/* 1–2 line summary */}
            {excerpt && (
              <p className="recent-news-excerpt">{excerpt}</p>
            )}

            {/* date | category */}
            <div className="recent-news-meta">
              {publishedAt && <span>{formatDate(publishedAt)}</span>}
              {catName && catSlug && (
                <>
                  <span className="meta-sep">|</span>
                  <Link href={`/category/${catSlug}`}>{catName}</Link>
                </>
              )}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
