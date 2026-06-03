import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient, formatDate, getImageUrl, getActiveAds, asRecord, asRecords } from '@/lib/payload'
import { ArticleCard } from '@/components/ArticleCard'
import { AdSlot } from '@/components/AdSlot'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  const raw = res.docs[0]
  if (!raw) return { title: 'Олдсонгүй' }
  const article = asRecord(raw)

  const title = article.title as string
  const excerpt = article.excerpt as string | undefined
  const imgUrl = getImageUrl(article.coverImage)
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  return {
    title: `${title} — Сүхбаатарын Өнгө`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      publishedTime: article.publishedAt as string,
      ...(imgUrl ? { images: [{ url: imgUrl, width: 1600, height: 900, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      ...(imgUrl ? { images: [imgUrl] } : {}),
    },
    alternates: {
      canonical: `${siteUrl}/news/${slug}`,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const [res, adsRes] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: { slug: { equals: slug }, status: { equals: 'published' } },
      limit: 1,
      depth: 2,
    }),
    payload.find({
      collection: 'ads',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 20,
    }),
  ])

  if (!res.docs[0]) notFound()
  const article = asRecord(res.docs[0])
  const ads = adsRes.docs

  const title = article.title as string
  const excerpt = article.excerpt as string | undefined
  const content = article.content
  const publishedAt = article.publishedAt as string | undefined
  const tags = article.tags as Array<{ tag: string }> | undefined
  const videoEmbedUrl = article.videoEmbedUrl as string | undefined
  const category = article.category as Record<string, unknown> | null | undefined
  const author = article.author as Record<string, unknown> | null | undefined
  const imgUrl = getImageUrl(article.coverImage)
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const pageUrl = `${siteUrl}/news/${slug}`

  const related = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' },
      slug: { not_equals: slug },
      ...(category ? { category: { equals: (category as Record<string, unknown>).id } } : {}),
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 2,
  })
  const relatedArticles = asRecords(related.docs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    author: author ? { '@type': 'Person', name: author.name } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Сүхбаатарын Өнгө',
      url: siteUrl,
    },
    image: imgUrl ? [imgUrl] : undefined,
    url: pageUrl,
  }

  const inArticleAds = getActiveAds(ads as unknown[], 'in_article')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="content-grid">
        <article className="article-detail">
          <div className="article-detail-header">
            {category && (
              <Link href={`/category/${category.slug as string}`} className="cat-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                {category.name as string}
              </Link>
            )}
            <h1>{title}</h1>
            {excerpt && <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0.75rem 0 1rem' }}>{excerpt}</p>}
            <div className="article-meta" style={{ marginBottom: '1rem' }}>
              {author && (
                <span>
                  <Link href={`/author/${author.slug as string}`} style={{ fontWeight: 600 }}>
                    {author.name as string}
                  </Link>
                </span>
              )}
              {publishedAt && <span>{formatDate(publishedAt)}</span>}
              {category && <span><Link href={`/category/${category.slug as string}`}>{category.name as string}</Link></span>}
            </div>

            <div className="share-bar">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Хуваалцах:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-btn-fb"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-btn-tw"
              >
                Twitter
              </a>
            </div>
          </div>

          {imgUrl && (
            <Image
              src={imgUrl}
              alt={title}
              width={1600}
              height={900}
              className="article-detail-cover"
              priority
              style={{ objectFit: 'cover' }}
            />
          )}

          {author && (
            <div className="author-box">
              {getImageUrl(author.photo) && (
                <Image
                  src={getImageUrl(author.photo)!}
                  alt={author.name as string}
                  width={60}
                  height={60}
                  className="author-photo"
                />
              )}
              <div>
                <Link href={`/author/${author.slug as string}`}>
                  <div className="author-name">{author.name as string}</div>
                </Link>
                {!!author.role && <div className="author-role">{author.role as string}</div>}
              </div>
            </div>
          )}

          {videoEmbedUrl && <VideoEmbed url={videoEmbedUrl} />}

          {inArticleAds.length > 0 && (
            <div style={{ margin: '1.5rem 0' }}>
              <AdSlot ads={ads as unknown[]} placement="in_article" />
            </div>
          )}

          {!!content && (
            <div className="article-content">
              <RichText data={content as Parameters<typeof RichText>[0]['data']} />
            </div>
          )}

          {tags && tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              {tags.map((t, i) => (
                <span key={i} className="tag-pill">{t.tag}</span>
              ))}
            </div>
          )}

          <div className="share-bar" style={{ marginTop: '2rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Хуваалцах:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn share-btn-fb"
            >
              Facebook
            </a>
          </div>

          {relatedArticles.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <div className="section-heading">Холбоотой мэдээ</div>
              <div className="articles-grid">
                {relatedArticles.map((a) => (
                  <ArticleCard key={a.id as string} article={a} />
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="sidebar">
          <AdSlot ads={ads as unknown[]} placement="sidebar" className="sidebar-widget" />
          <RecentSidebar />
        </aside>
      </div>
    </>
  )
}

function VideoEmbed({ url }: { url: string }) {
  let src = url
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) src = `https://www.youtube.com/embed/${ytMatch[1]}`

  const fbMatch = url.match(/facebook\.com\/.*\/videos\/(\d+)/)
  if (fbMatch) src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`

  return (
    <div className="video-embed-wrapper">
      <iframe
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Видео"
      />
    </div>
  )
}

async function RecentSidebar() {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 5,
    depth: 2,
  })
  const articles = asRecords(res.docs)

  return (
    <div className="sidebar-widget">
      <div className="sidebar-widget-title">Сүүлийн мэдээ</div>
      <div className="sidebar-widget-body">
        {articles.map((a) => (
          <ArticleCard key={a.id as string} article={a} horizontal size="sm" />
        ))}
      </div>
    </div>
  )
}
