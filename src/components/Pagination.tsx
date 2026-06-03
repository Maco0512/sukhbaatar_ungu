import React from 'react'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  function buildUrl(page: number) {
    const params = new URLSearchParams({ ...searchParams, page: String(page) })
    return `${basePath}?${params.toString()}`
  }

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav className="pagination" aria-label="Хуудас хуваарилалт">
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)}>← Өмнөх</Link>
      )}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`}>…</span>
        ) : (
          <Link key={p} href={buildUrl(p)} className={p === currentPage ? 'active' : ''}>
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)}>Дараах →</Link>
      )}
    </nav>
  )
}
