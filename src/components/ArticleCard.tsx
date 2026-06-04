import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getImageUrl } from '@/lib/payload'

export type ArticleVariant = 'lead' | 'top' | 'section' | 'multimedia' | 'horizontal'

interface ArticleCardProps {
  article: Record<string, unknown>
  /** lead = big hero; top = thumbnail strip; section = grid card; multimedia = play badge; horizontal = sidebar list */
  variant?: ArticleVariant
  /** Legacy size prop used by author/category/search pages */
  size?: 'sm' | 'md' | 'lg'
  /** Legacy horizontal prop used by sidebar list */
  horizontal?: boolean
  showExcerpt?: boolean
  priority?: boolean
}

function extractFields(article: Record<string, unknown>) {
  return {
    slug: (article.slug as string) || '',
    title: (article.title as string) || '',
    excerpt: (article.excerpt as string) || '',
    publishedAt: article.publishedAt as string | undefined,
    category: article.category as Record<string, unknown> | null | undefined,
    author: article.author as Record<string, unknown> | null | undefined,
  }
}

// ─── Lead card ────────────────────────────────────────────────────────────────
function LeadCard({
  article,
  priority,
}: {
  article: Record<string, unknown>
  priority?: boolean
}) {
  const { slug, title, excerpt, publishedAt, category, author } = extractFields(article)
  const imgUrl = getImageUrl(article.coverImage, 'hero')
  const catName = category?.name as string | undefined
  const catSlug = category?.slug as string | undefined
  const authorName = author?.name as string | undefined
  const authorSlug = author?.slug as string | undefined

  return (
    <article className="lead-card">
      <Link href={`/news/${slug}`} className="lead-card-image-wrap">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 800px"
            style={{ objectFit: 'cover' }}
            priority={priority}
          />
        ) : (
          <div className="lead-card-image-placeholder" />
        )}
      </Link>
      <div className="lead-card-body">
        {catName && catSlug && (
          <Link href={`/category/${catSlug}`} className="cat-badge">{catName}</Link>
        )}
        <Link href={`/news/${slug}`}>
          <h2 className="lead-card-headline">{title}</h2>
        </Link>
        {excerpt && (
          <p className="lead-card-excerpt">{excerpt}</p>
        )}
        <div className="article-meta" style={{ marginTop: '0.25rem' }}>
          {authorName && authorSlug && (
            <Link href={`/author/${authorSlug}`} style={{ fontWeight: 600 }}>{authorName}</Link>
          )}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
        <Link href={`/news/${slug}`} className="lead-card-readmore">
          Дэлгэрэнгүй үзэх →
        </Link>
      </div>
    </article>
  )
}

// ─── Top-story card (thumbnail + text, for the strip beside the lead) ─────────
function TopCard({ article }: { article: Record<string, unknown> }) {
  const { slug, title, publishedAt, category } = extractFields(article)
  const imgUrl = getImageUrl(article.coverImage, 'thumbnail')
  const catName = category?.name as string | undefined
  const catSlug = category?.slug as string | undefined

  return (
    <div className="top-card">
      <Link href={`/news/${slug}`} className="top-card-thumb-wrap">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={title}
            fill
            sizes="85px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="top-card-thumb-placeholder" />
        )}
      </Link>
      <div className="top-card-text">
        {catName && catSlug && (
          <Link href={`/category/${catSlug}`} className="cat-badge cat-badge--sm">{catName}</Link>
        )}
        <Link href={`/news/${slug}`} className="top-card-headline">{title}</Link>
        {publishedAt && <div className="article-meta" style={{ marginTop: '0.2rem' }}><span>{formatDate(publishedAt)}</span></div>}
      </div>
    </div>
  )
}

// ─── Section grid card ─────────────────────────────────────────────────────────
function SectionCard({
  article,
  showExcerpt,
}: {
  article: Record<string, unknown>
  showExcerpt?: boolean
}) {
  const { slug, title, excerpt, publishedAt, category } = extractFields(article)
  const imgUrl = getImageUrl(article.coverImage, 'card')
  const catName = category?.name as string | undefined
  const catSlug = category?.slug as string | undefined

  return (
    <article className="sec-card">
      <Link href={`/news/${slug}`} className="sec-card-image-wrap">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={title}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 280px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="sec-card-image-placeholder" />
        )}
      </Link>
      <div className="sec-card-body">
        {catName && catSlug && (
          <Link href={`/category/${catSlug}`} className="cat-badge cat-badge--sm">{catName}</Link>
        )}
        <Link href={`/news/${slug}`} className="sec-card-headline">{title}</Link>
        {showExcerpt && excerpt && (
          <p className="sec-card-excerpt">{excerpt}</p>
        )}
        {publishedAt && (
          <div className="article-meta" style={{ marginTop: '0.3rem' }}>
            <span>{formatDate(publishedAt)}</span>
          </div>
        )}
      </div>
    </article>
  )
}

// ─── Multimedia card (with play badge) ────────────────────────────────────────
function MultimediaCard({ article }: { article: Record<string, unknown> }) {
  const { slug, title, publishedAt, category } = extractFields(article)
  const imgUrl = getImageUrl(article.coverImage, 'card')
  const catName = category?.name as string | undefined
  const catSlug = category?.slug as string | undefined

  return (
    <article className="mm-card">
      <Link href={`/news/${slug}`} className="mm-card-image-wrap">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            style={{ objectFit: 'cover', opacity: 0.88 }}
          />
        ) : (
          <div className="mm-card-image-placeholder" />
        )}
        <div className="mm-play-badge" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </Link>
      <div className="mm-card-body">
        {catName && catSlug && (
          <Link href={`/category/${catSlug}`} className="cat-badge cat-badge--sm">{catName}</Link>
        )}
        <Link href={`/news/${slug}`} className="mm-card-headline">{title}</Link>
        {publishedAt && (
          <div className="article-meta" style={{ marginTop: '0.2rem' }}>
            <span>{formatDate(publishedAt)}</span>
          </div>
        )}
      </div>
    </article>
  )
}

// ─── Horizontal / sidebar list card ───────────────────────────────────────────
function HorizontalCard({
  article,
  size,
}: {
  article: Record<string, unknown>
  size?: 'sm' | 'md' | 'lg'
}) {
  const { slug, title, publishedAt, category } = extractFields(article)
  const imgUrl = getImageUrl(article.coverImage, 'thumbnail')
  const catName = category?.name as string | undefined
  const catSlug = category?.slug as string | undefined
  const titleClass =
    size === 'lg' ? 'article-title-lg' : size === 'sm' ? 'article-title-sm' : 'article-title-md'

  return (
    <div className="article-list-item">
      {imgUrl && (
        <Link href={`/news/${slug}`} style={{ flexShrink: 0 }}>
          <Image
            src={imgUrl}
            alt={title}
            width={90}
            height={65}
            className="article-list-image"
          />
        </Link>
      )}
      <div>
        {catName && catSlug && (
          <Link href={`/category/${catSlug}`} className="cat-badge" style={{ marginBottom: '0.3rem', display: 'inline-block' }}>
            {catName}
          </Link>
        )}
        <Link href={`/news/${slug}`}>
          <div className={titleClass}>{title}</div>
        </Link>
        {publishedAt && (
          <div className="article-meta" style={{ marginTop: '0.3rem' }}>
            <span>{formatDate(publishedAt)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Legacy grid card (used by category/author/search pages) ──────────────────
function LegacyCard({
  article,
  size,
}: {
  article: Record<string, unknown>
  size?: 'sm' | 'md' | 'lg'
}) {
  const { slug, title, excerpt, publishedAt, category, author } = extractFields(article)
  const imgUrl = getImageUrl(article.coverImage, 'card')
  const catName = category?.name as string | undefined
  const catSlug = category?.slug as string | undefined
  const authorName = author?.name as string | undefined
  const authorSlug = author?.slug as string | undefined
  const titleClass =
    size === 'lg' ? 'article-title-lg' : size === 'sm' ? 'article-title-sm' : 'article-title-md'

  return (
    <article className="article-card">
      {imgUrl && (
        <Link href={`/news/${slug}`} className="article-card-image">
          <Image
            src={imgUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 280px"
            style={{ objectFit: 'cover' }}
          />
        </Link>
      )}
      <div className="article-card-body">
        {catName && catSlug && (
          <Link href={`/category/${catSlug}`} className="cat-badge">{catName}</Link>
        )}
        <Link href={`/news/${slug}`}>
          <div className={titleClass}>{title}</div>
        </Link>
        {excerpt && size !== 'sm' && (
          <p className="article-excerpt">{excerpt.slice(0, 120)}{excerpt.length > 120 ? '…' : ''}</p>
        )}
        <div className="article-meta">
          {authorName && authorSlug && (
            <Link href={`/author/${authorSlug}`}>{authorName}</Link>
          )}
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
        </div>
      </div>
    </article>
  )
}

// ─── Public export ─────────────────────────────────────────────────────────────
export function ArticleCard({
  article,
  variant,
  size,
  horizontal,
  showExcerpt,
  priority,
}: ArticleCardProps) {
  if (horizontal || variant === 'horizontal') {
    return <HorizontalCard article={article} size={size} />
  }
  if (variant === 'lead') return <LeadCard article={article} priority={priority} />
  if (variant === 'top') return <TopCard article={article} />
  if (variant === 'section') return <SectionCard article={article} showExcerpt={showExcerpt} />
  if (variant === 'multimedia') return <MultimediaCard article={article} />
  // Legacy default
  return <LegacyCard article={article} size={size} />
}
