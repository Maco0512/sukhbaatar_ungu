import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPayloadClient, formatDate, getImageUrl, asRecords } from '@/lib/payload'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Мультимедиа — Сүхбаатарын Өнгө',
  description: 'Видео болон подкаст агуулга',
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 12

export default async function MultimediaPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1', 10)

  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' },
      videoEmbedUrl: { exists: true },
    },
    sort: '-publishedAt',
    limit: PAGE_SIZE,
    page,
    depth: 2,
  })

  const articles = asRecords(res.docs)
  const totalPages = res.totalPages

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Мультимедиа</h1>
          <p>Видео болон подкаст агуулга</p>
        </div>
      </div>
      <div className="container">
        {articles.length === 0 ? (
          <div className="empty-state">
            <h2>Мультимедиа агуулга олдсонгүй</h2>
          </div>
        ) : (
          <>
            <div className="articles-grid">
              {articles.map((article) => (
                <MultimediaCard key={article.id as string} article={article} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} basePath="/multimedia" />
            )}
          </>
        )}
      </div>
    </>
  )
}

function MultimediaCard({ article }: { article: Record<string, unknown> }) {
  const slug = article.slug as string
  const title = article.title as string
  const excerpt = article.excerpt as string | undefined
  const publishedAt = article.publishedAt as string | undefined
  const imgUrl = getImageUrl(article.coverImage)
  const category = article.category as Record<string, unknown> | null | undefined

  return (
    <article className="article-card">
      <Link href={`/news/${slug}`} className="article-card-image" style={{ position: 'relative', display: 'block', aspectRatio: '3/2', overflow: 'hidden', background: '#222' }}>
        {imgUrl && (
          <Image src={imgUrl} alt={title} fill style={{ objectFit: 'cover' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{
            width: 48, height: 48, background: 'rgba(255,255,255,0.9)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </Link>
      <div className="article-card-body">
        {category && (
          <Link href={`/category/${category.slug as string}`} className="cat-badge">{category.name as string}</Link>
        )}
        <Link href={`/news/${slug}`}>
          <div className="article-title-md">{title}</div>
        </Link>
        {excerpt && <p className="article-excerpt">{excerpt.slice(0, 100)}…</p>}
        <div className="article-meta">
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
      </div>
    </article>
  )
}
