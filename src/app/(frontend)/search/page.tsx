import React from 'react'
import type { Metadata } from 'next'
import { getPayloadClient, asRecords } from '@/lib/payload'
import { ArticleCard } from '@/components/ArticleCard'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Хайлт — Сүхбаатарын Өнгө',
  description: 'Нийтлэл хайх',
}

interface Props {
  searchParams: Promise<{ q?: string; category?: string; from?: string; to?: string; page?: string }>
}

const PAGE_SIZE = 12

export default async function SearchPage({ searchParams }: Props) {
  const { q, category, from, to, page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1', 10)

  const payload = await getPayloadClient()

  const [categoriesRes, articlesRes] = await Promise.all([
    payload.find({ collection: 'categories', sort: 'order', limit: 20 }),
    q || category || from || to
      ? payload.find({
          collection: 'articles',
          where: {
            and: [
              { status: { equals: 'published' } },
              ...(q ? [{ or: [
                { title: { like: q } },
                { excerpt: { like: q } },
              ]}] : []),
              ...(category ? [{ category: { equals: category } }] : []),
              ...(from ? [{ publishedAt: { greater_than_equal: from } }] : []),
              ...(to ? [{ publishedAt: { less_than_equal: to } }] : []),
            ],
          },
          sort: '-publishedAt',
          limit: PAGE_SIZE,
          page,
          depth: 2,
        })
      : Promise.resolve({ docs: [], totalPages: 0, totalDocs: 0 }),
  ])

  const categories = asRecords(categoriesRes.docs)
  const articles = asRecords(articlesRes.docs)
  const totalPages = (articlesRes as { totalPages: number }).totalPages
  const totalDocs = (articlesRes as { totalDocs: number }).totalDocs
  const hasSearch = !!(q || category || from || to)

  const currentSearchParams = Object.fromEntries(
    Object.entries({ q, category, from, to }).filter(([, v]) => !!v) as [string, string][]
  )

  return (
    <div className="container">
      <div className="section-heading" style={{ marginTop: '0.5rem' }}>Хайлт / Архив</div>

      <form method="GET" action="/search">
        <div className="search-form">
          <input
            type="text"
            name="q"
            placeholder="Гарчиг эсвэл агуулгаар хайх..."
            defaultValue={q}
            className="search-input"
          />
          <button type="submit" className="search-btn">Хайх</button>
        </div>
        <div className="search-filters">
          <select name="category" className="filter-select" defaultValue={category || ''}>
            <option value="">Бүх булан</option>
            {categories.map((cat) => (
              <option key={cat.id as string} value={cat.id as string}>
                {cat.name as string}
              </option>
            ))}
          </select>
          <input type="date" name="from" className="filter-select" defaultValue={from} title="Эхлэх огноо" />
          <input type="date" name="to" className="filter-select" defaultValue={to} title="Дуусах огноо" />
        </div>
      </form>

      {hasSearch && (
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {totalDocs} нийтлэл олдлоо{q ? ` "${q}"` : ''}
        </p>
      )}

      {hasSearch && articles.length === 0 && (
        <div className="empty-state">
          <h2>Нийтлэл олдсонгүй</h2>
          <p>Хайлтын нөхцөлөө өөрчилж дахин оролдоно уу.</p>
        </div>
      )}

      {articles.length > 0 && (
        <>
          <div className="articles-grid">
            {articles.map((a) => (
              <ArticleCard key={a.id as string} article={a} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/search"
              searchParams={currentSearchParams}
            />
          )}
        </>
      )}

      {!hasSearch && (
        <div className="empty-state" style={{ paddingTop: '1rem' }}>
          <p>Хайх үгээ дээд талын хайлтын хайрцагт оруулна уу.</p>
        </div>
      )}
    </div>
  )
}
