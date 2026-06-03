import React from 'react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Бидний тухай — Сүхбаатарын Өнгө',
  description: 'Сүхбаатарын Өнгө сонины тухай мэдээлэл. Ерөнхий редактор Д.Улаанхүүхэн.',
}

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Бидний тухай</h1>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 780 }}>
        <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 4, padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Сүхбаатарын Өнгө сонин
          </h2>
          <p style={{ lineHeight: 1.8, marginBottom: '1rem', color: 'var(--text-muted)' }}>
            "Сүхбаатарын Өнгө" нь Сүхбаатар аймгийн Дариганга нутгийн орон нутгийн сонин бөгөөд таван жилийн өмнө үүсгэн байгуулагдсан. Манай сонин орон нутгийн иргэдэд аймгийн мэдээ мэдээлэл, нийгмийн амьдрал, соёл, уламжлалын талаарх контентийг хүргэж ирсэн.
          </p>
          <p style={{ lineHeight: 1.8, marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Одоогоор Facebook хуудсаараа дамжуулан олон нийтэд хүрч байсан бөгөөд энэхүү вэбсайтаараа дамжуулан илүү өргөн хүрээний уншигчдад хүрэхийг зорьж байна.
          </p>
          <p style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
            Манай редакцийн баг нь орон нутгийн мэдээг шуурхай, үнэн зөвөөр хүргэхийг эрхэмлэдэг.
          </p>
        </div>

        <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 4, padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Ерөнхий редактор
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 80, height: 80, background: 'var(--accent)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0,
            }}>
              Д
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Д.Улаанхүүхэн
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Ерөнхий редактор, Үүсгэн байгуулагч
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Сүхбаатар аймгийн Дариганга сумын уугуул. "Сүхбаатарын Өнгө" сонинг үүсгэн байгуулж, редакцийн ажлыг удирдан явуулж байна.
              </p>
            </div>
          </div>
        </div>

        <div id="contact" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 4, padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            Холбоо барих
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ width: 24, color: 'var(--accent)', fontWeight: 700 }}>📍</span>
              <span style={{ color: 'var(--text-muted)' }}>Сүхбаатар аймаг, Дариганга сум, Монгол Улс</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ width: 24, color: 'var(--accent)', fontWeight: 700 }}>📘</span>
              <a
                href="https://facebook.com/sukhbaatar.ungu"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1877f2', fontWeight: 600 }}
              >
                facebook.com/sukhbaatar.ungu
              </a>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            Манай Facebook хуудсанд дагаж, орон нутгийн сонин мэдээнүүдийг тогтмол хүлээн авна уу.
          </p>
          <a
            href="https://facebook.com/sukhbaatar.ungu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '1rem', background: '#fff', color: 'var(--accent)', padding: '0.5rem 1.5rem', borderRadius: 4, fontWeight: 700, fontSize: '0.9rem' }}
          >
            Facebook дагах
          </a>
        </div>
      </div>
    </>
  )
}
