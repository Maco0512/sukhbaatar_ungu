import React from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Бидний тухай — Сүхбаатарын Өнгө',
  description: 'Сүхбаатарын Өнгө сонины тухай мэдээлэл. Ерөнхий редактор Д.Улаанхүүхэн.',
}

const stats = [
  { num: '2017', label: 'оноос хойш тогтмол' },
  { num: '13', label: 'сум хамардаг' },
  { num: '67', label: 'багт хүрдэг' },
  { num: '14', label: 'хоног тутам хэвлэгддэг' },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="page-hero">
        <div className="container">
          <h1>Бидний тухай</h1>
          <p>Сүхбаатар аймгийн орон нутгийн чөлөөт сонин</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 820 }}>
        {/* Stats band */}
        <div className="about-stats">
          {stats.map((s) => (
            <div key={s.num} className="about-stat">
              <div className="about-stat-num">{s.num}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Intro + editor */}
        <div className="about-card">
          <h2 className="about-h2">Сүхбаатарын Өнгө сонин</h2>
          <p style={{ lineHeight: 1.8, marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Сүхбаатарын Өнгө сонин нь 2017 оноос эхлэн тогтмол гарч байна. Аймгийнхаа
            13 сум, 67 багт хүрч, 14 хоног тутамд уншигчдадаа орон нутгийн мэдээллийг
            хүргэдэг.
          </p>

          <div className="about-award">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="8" r="6" />
              <path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.11" />
            </svg>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)' }}>
              2024 оны МСНЭ-ийн “Ган үзэг” наадмын <strong>“Шилдэг сонин”</strong>-оор шалгарсан.
            </p>
          </div>

          <div className="about-editor">
            <Image
              src="/profile.jpg"
              alt="Д.Улаанхүүхэн"
              width={200}
              height={300}
              style={{
                width: 84, height: 112, borderRadius: 10,
                objectFit: 'cover', objectPosition: 'center top', flexShrink: 0,
                boxShadow: '0 2px 12px rgba(0,0,0,0.14)',
              }}
            />
            <div>
              <div className="about-eyebrow">Эрхлэгч</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.2 }}>Д.Улаанхүүхэн</div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div id="contact" className="about-card">
          <h2 className="about-h2">Холбоо барих</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="about-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+97690099027" style={{ color: 'var(--text)', fontWeight: 500 }}>9009-9027</a>
            </div>
            <div className="about-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ color: 'var(--text)' }}>Монгол улс, Сүхбаатар аймаг, Баруун-Урт сум</span>
            </div>
            <div className="about-contact-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)" style={{ flexShrink: 0 }}>
                <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.48 0-1.94.92-1.94 1.87v2.24h3.3l-.53 3.49h-2.77V24C19.61 23.1 24 18.1 24 12.07z" />
              </svg>
              <a href="https://facebook.com/sukhbaatar.ungu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', fontWeight: 500 }}>
                facebook.com/sukhbaatar.ungu
              </a>
            </div>
          </div>
        </div>

        {/* Facebook CTA */}
        <div className="about-cta">
          <p style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
            Манай Facebook хуудсанд дагаж, орон нутгийн шинэ мэдээг хамгийн түрүүнд аваарай.
          </p>
          <a href="https://facebook.com/sukhbaatar.ungu" target="_blank" rel="noopener noreferrer" className="about-cta-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.48 0-1.94.92-1.94 1.87v2.24h3.3l-.53 3.49h-2.77V24C19.61 23.1 24 18.1 24 12.07z" />
            </svg>
            Facebook дагах
          </a>
        </div>
      </div>
    </div>
  )
}
