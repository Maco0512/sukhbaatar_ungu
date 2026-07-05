import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import './styles.css'

export const metadata = {
  title: 'Сүхбаатарын Өнгө',
  description: 'Сүхбаатар аймгийн орон нутгийн сонин',
}

async function SiteHeader() {
  // Fetch categories at render-time so the nav always matches the DB
  let categories: Array<{ name: string; slug: string }> = []
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'categories',
      sort: 'order',
      limit: 10,
    })
    categories = res.docs.map((c) => ({
      name: c.name as string,
      slug: c.slug as string,
    }))
  } catch {
    // DB unavailable during build — use empty list; static fallback below
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-logo">
          <Image
            src="/logo.jpg"
            alt="Сүхбаатарын Өнгө"
            width={96}
            height={96}
            quality={90}
            className="site-logo-img"
            priority
          />
          <span className="site-logo-text">
            <span className="site-logo-mn">
              <span style={{ color: '#e40a03' }}>Сүхбаатарын</span>{' '}
              <span style={{ color: '#1664de' }}>Өнгө</span>
            </span>
            <span className="site-logo-sub">Сүхбаатар аймгийн чөлөөт хэвлэл</span>
          </span>
        </Link>
        <nav className="site-nav" id="site-nav">
          <Link href="/">Нүүр</Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}
          <Link href="/multimedia">Мультимедиа</Link>
          <Link href="/search">Хайлт</Link>
          <Link href="/about">Бидний тухай</Link>
        </nav>
        <button className="nav-hamburger" aria-label="Цэс" id="nav-toggle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand-name">
            <span style={{ color: '#e40a03' }}>Сүхбаатарын</span>{' '}
            <span style={{ color: '#1664de' }}>Өнгө</span>
          </div>
          <p className="footer-brand-desc">Сүхбаатар аймгийн чөлөөт хэвлэл</p>
          <br/>
          <a
            href="https://facebook.com/sukhbaatar.ungu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4267B2', background: '#fff', padding: '0.3rem 0.8rem', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.48 0-1.94.92-1.94 1.87v2.24h3.3l-.53 3.49h-2.77V24C19.61 23.1 24 18.1 24 12.07z"/>
            </svg>
            <span>Facebook хуудас</span>
          </a>
        </div>
        <div>
          <div className="footer-heading">Төрөл</div>
          <ul className="footer-links">
            <li><Link href="/category/medee">Мэдээ</Link></li>
            <li><Link href="/category/niigem">Нийгэм</Link></li>
            <li><Link href="/category/ued">Үйл явдал</Link></li>
            <li><Link href="/category/soiol">Соёл</Link></li>
            <li><Link href="/multimedia">Мультимедиа</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-heading">Мэдээлэл</div>
          <ul className="footer-links">
            <li><Link href="/about">Бидний тухай</Link></li>
            <li><Link href="/about#contact">Холбоо барих</Link></li>
            <li><Link href="/search">Хайлт</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {year} Сүхбаатарын Өнгө. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <SiteHeader />
        <main className="page-main">{children}</main>
        <SiteFooter />
        {/* Mobile nav toggle */}
        <script dangerouslySetInnerHTML={{ __html: `
          var btn = document.getElementById('nav-toggle');
          var nav = document.getElementById('site-nav');
          if (btn && nav) btn.addEventListener('click', function() { nav.classList.toggle('open'); });
        `}} />
      </body>
    </html>
  )
}
