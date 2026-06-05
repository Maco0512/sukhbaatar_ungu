import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getImageUrl } from '@/lib/payload'

interface ArticleCardProps {
  article: Record<string, unknown>
  size?: 'sm' | 'md' | 'lg'
  horizontal?: boolean
}

export function ArticleCard({ article, size = 'md', horizontal = false }: ArticleCardProps) {
  const slug = typeof article.slug === 'string' ? article.slug : ''
  const title = typeof article.title === 'string' ? article.title : ''
  const excerpt = typeof article.excerpt === 'string' ? article.excerpt : ''
  const publishedAt = article.publishedAt as string | undefined
  const category = article.category as Record<string, unknown> | null | undefined
  const author = article.author as Record<string, unknown> | null | undefined
  const imgUrl = getImageUrl(article.coverImage)

  const catName = category?.name as string | undefined
  const catSlug = category?.slug as string | undefined
  const authorName = author?.name as string | undefined
  const authorSlug = author?.slug as string | undefined

  const titleClass =
    size === 'lg' ? 'article-title-lg' : size === 'sm' ? 'article-title-sm' : 'article-title-md'

  if (horizontal) {
    return (
      <div className="article-list-item">
        {imgUrl && (
          <Link href={`/news/${slug}`} style={{ flexShrink: 0 }}>
            <Image
              src={imgUrl}
              alt={title}
              width={76}
              height={54}
              className="article-list-image"
            />
          </Link>
        )}
        <div>
          {catName && catSlug && (
            <Link href={`/category/${catSlug}`} className="cat-badge" style={{ marginBottom: '0.25rem', display: 'inline-block' }}>
              {catName}
            </Link>
          )}
          <Link href={`/news/${slug}`}>
            <div className={titleClass}>{title}</div>
          </Link>
          <div className="meta-line" style={{ marginTop: '0.3rem' }}>
            {publishedAt && <span>{formatDate(publishedAt)}</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="article-card">
      {imgUrl && (
        <Link href={`/news/${slug}`} className="article-card-image">
          <Image src={imgUrl} alt={title} width={768} height={432} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
        <div className="meta-line">
          {publishedAt && <span>{formatDate(publishedAt)}</span>}
          {catName && catSlug && (
            <>
              <span className="meta-sep">|</span>
              <Link href={`/category/${catSlug}`}>{catName}</Link>
            </>
          )}
          {authorName && authorSlug && size === 'lg' && (
            <>
              <span className="meta-sep">·</span>
              <Link href={`/author/${authorSlug}`}>{authorName}</Link>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
