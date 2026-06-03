import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient, getImageUrl, asRecord, asRecords } from '@/lib/payload'
import { ArticleCard } from '@/components/ArticleCard'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'authors',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const author = res.docs[0] ? asRecord(res.docs[0]) : undefined
  if (!author) return { title: 'Олдсонгүй' }
  return {
    title: `${author.name as string} — Сүхбаатарын Өнгө`,
    description: author.bio as string | undefined,
  }
}

const PAGE_SIZE = 12

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1', 10)

  const payload = await getPayloadClient()

  const authorRes = await payload.find({
    collection: 'authors',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const author = authorRes.docs[0] ? asRecord(authorRes.docs[0]) : undefined
  if (!author) notFound()

  const articlesRes = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' },
      author: { equals: author.id as string },
    },
    sort: '-publishedAt',
    limit: PAGE_SIZE,
    page,
    depth: 2,
  })

  const articles = asRecords(articlesRes.docs)
  const totalPages = articlesRes.totalPages
  const photoUrl = getImageUrl(author.photo)

  return (
    <>
      <div className="page-hero">
        <div className="container" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {photoUrl && (
            <Image
              src={photoUrl}
              alt={author.name as string}
              width={90}
              height={90}
              style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid rgba(255,255,255,0.3)' }}
            />
          )}
          <div>
            <h1>{author.name as string}</h1>
            {!!author.role && <p>{author.role as string}</p>}
            {!!author.bio && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{author.bio as string}</p>}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="section-heading">{author.name as string}-ийн нийтлэлүүд</div>
        {articles.length === 0 ? (
          <div className="empty-state">
            <h2>Нийтлэл олдсонгүй</h2>
          </div>
        ) : (
          <>
            <div className="articles-grid">
              {articles.map((a) => (
                <ArticleCard key={a.id as string} article={a} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} basePath={`/author/${slug}`} />
            )}
          </>
        )}
      </div>
    </>
  )
}
