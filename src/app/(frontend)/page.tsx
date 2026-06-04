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
      limit: 20,
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

  const articles = asRecords(articlesRes.docs)
  const categories = asRecords(categoriesRes.docs)
  const ads = adsRes.docs

  const featured = articles.filter((a) => a.featured).slice(0, 4)
  const mainFeatured = featured[0] ?? articles[0]
  const sideFeatured = featured.slice(1, 4)
  const latest = articles.slice(0, 10)

  const articlesByCategory = categories.map((cat) => ({
    cat,
    articles: articles
      .filter((a) => {
        const c = a.category as Record<string, unknown> | null
        return c && c.id === cat.id
      })
      .slice(0, 4),
  })).filter((g) => g.articles.length > 0)

  const headerAds = getActiveAds(ads as unknown[], 'header')
  const sidebarAds = getActiveAds(ads as unknown[], 'sidebar')

  return (
    <>
      {headerAds.length > 0 && (
        <div className="header-ad">
          <div className="container">
            <AdSlot ads={ads as unknown[]} placement="header" />
          </div>
        </div>
      )}

      <div className="content-grid">
        <div>
          {mainFeatured && <FeaturedHero article={mainFeatured} sidePieces={sideFeatured} />}

          <hr className="divider" />

          <div className="section-heading">Сүүлийн мэдээ</div>
          <div className="articles-grid">
            {latest.slice(0, 6).map((article) => (
              <ArticleCard key={article.id as string} article={article} />
            ))}
          </div>

          {articlesByCategory.map(({ cat, articles: catArticles }) => (
            <div key={cat.id as string} style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="section-heading" style={{ margin: 0 }}>{cat.name as string}</div>
                <Link href={`/category/${cat.slug as string}`} className="btn-primary">
                  Бүгд харах
                </Link>
              </div>
              <div className="articles-grid-2">
                {catArticles.map((article) => (
                  <ArticleCard key={article.id as string} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="sidebar">
          {sidebarAds.length > 0 && <AdSlot ads={ads as unknown[]} placement="sidebar" className="sidebar-widget" />}

          <div className="sidebar-widget">
            <div className="sidebar-widget-title">Булангууд</div>
            <div className="sidebar-widget-body">
              {categories.map((cat) => (
                <div key={cat.id as string} style={{ marginBottom: '0.5rem' }}>
                  <Link href={`/category/${cat.slug as string}`} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    → {cat.name as string}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-widget">
            <div className="sidebar-widget-title">Сүүлийн мэдээ</div>
            <div className="sidebar-widget-body">
              {latest.slice(0, 5).map((article) => (
                <ArticleCard key={article.id as string} article={article} horizontal size="sm" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

function FeaturedHero({
  article,
  sidePieces,
}: {
  article: Record<string, unknown>
  sidePieces: Record<string, unknown>[]
}) {
  const slug = article.slug as string
  const title = article.title as string
  const excerpt = article.excerpt as string | undefined
  const publishedAt = article.publishedAt as string | undefined
  const author = article.author as Record<string, unknown> | null | undefined
  const category = article.category as Record<string, unknown> | null | undefined
  const imgUrl = getImageUrl(article.coverImage)

  const heroClass = imgUrl ? 'featured-hero' : 'featured-hero featured-hero--no-image'

  return (
    <section className="featured-section">
      <div className="section-heading">Онцлох мэдээ</div>

      {/* Main featured article */}
      <article className={heroClass}>
        {imgUrl && (
          <Link href={`/news/${slug}`} className="featured-hero-image">
            <Image
              src={imgUrl}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 55vw"
              priority
            />
          </Link>
        )}
        <div className="featured-hero-content">
          {category && (
            <Link href={`/category/${category.slug as string}`} className="cat-badge">
              {category.name as string}
            </Link>
          )}
          <Link href={`/news/${slug}`}>
            <h2 className="article-title-lg">{title}</h2>
          </Link>
          {excerpt && <p className="article-excerpt">{excerpt}</p>}
          <div className="article-meta">
            {author && (
              <Link href={`/author/${(author.slug as string)}`} style={{ fontWeight: 600 }}>
                {author.name as string}
              </Link>
            )}
            {publishedAt && <span>{formatDate(publishedAt)}</span>}
          </div>
          <Link href={`/news/${slug}`} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
            Дэлгэрэнгүй үзэх →
          </Link>
        </div>
      </article>

      {/* Side pieces — smaller cards in a horizontal row */}
      {sidePieces.length > 0 && (
        <div className="featured-side-grid">
          {sidePieces.map((a) => (
            <ArticleCard key={a.id as string} article={a} size="sm" />
          ))}
        </div>
      )}
    </section>
  )
}
