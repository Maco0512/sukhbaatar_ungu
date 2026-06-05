import React from 'react'
import Link from 'next/link'
import { Noto_Serif, Inter } from 'next/font/google'
import { getPayloadClient } from '@/lib/payload'
import './styles.css'

const serif = Noto_Serif({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = Inter({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  variable: '--font-sans',
  display: 'swap',
})

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
      <div className="topbar">
        <div className="topbar-inner">
          <span>Сүхбаатар аймаг</span>
          <span>
            <a href="https://facebook.com/sukhbaatar.ungu" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Facebook
            </a>
          </span>
        </div>
      </div>
      <div className="header-inner">
        <Link href="/" className="site-logo">
          <span className="site-logo-mn">Сүхбаатарын Өнгө</span>
          <span className="site-logo-sub">Сүхбаатар аймгийн сонин</span>
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
          <div className="footer-brand-name">Сүхбаатарын Өнгө</div>
          <p className="footer-brand-desc">
            Сүхбаатар аймгийн Дариганга сумд тулгуурласан орон нутгийн сонин.
            Ерөнхий редактор: Д.Улаанхүүхэн.
          </p>
          <br/>
          <a
            href="https://facebook.com/sukhbaatar.ungu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4267B2', background: '#fff', padding: '0.3rem 0.8rem', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600 }}
          >
            Facebook хуудас
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
            <li>
              <a href="/feed.xml" target="_blank">RSS тэжээл</a>
            </li>
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
    <html lang="mn" className={`${serif.variable} ${sans.variable}`}>
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
