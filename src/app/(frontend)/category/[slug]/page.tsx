import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient, asRecord, asRecords } from '@/lib/payload'
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
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const cat = res.docs[0] ? asRecord(res.docs[0]) : undefined
  if (!cat) return { title: 'Олдсонгүй' }
  return {
    title: `${cat.name as string} — Сүхбаатарын Өнгө`,
    description: cat.description as string | undefined,
  }
}

const PAGE_SIZE = 12

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1', 10)

  const payload = await getPayloadClient()

  const catRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const cat = catRes.docs[0] ? asRecord(catRes.docs[0]) : undefined
  if (!cat) notFound()

  const articlesRes = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' },
      category: { equals: cat.id as string },
    },
    sort: '-publishedAt',
    limit: PAGE_SIZE,
    page,
    depth: 2,
  })

  const articles = asRecords(articlesRes.docs)
  const totalPages = articlesRes.totalPages

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{cat.name as string}</h1>
          {!!cat.description && <p>{cat.description as string}</p>}
        </div>
      </div>
      <div className="container">
        {articles.length === 0 ? (
          <div className="empty-state">
            <h2>Нийтлэл олдсонгүй</h2>
            <p>Энэ булангийн нийтлэл байхгүй байна.</p>
          </div>
        ) : (
          <>
            <div className="articles-grid" style={{ marginBottom: '2rem' }}>
              {articles.map((a) => (
                <ArticleCard key={a.id as string} article={a} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/category/${slug}`}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
