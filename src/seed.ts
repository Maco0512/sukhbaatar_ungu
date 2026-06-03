import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Author } from './payload-types'

async function seed() {
  const payload = await getPayload({ config })
  console.log('🌱 Seeding database...')

  // Categories
  const categorySlugs = [
    { name: 'Мэдээ', slug: 'medee', description: 'Орон нутгийн мэдээ', order: 1 },
    { name: 'Нийгэм', slug: 'niigem', description: 'Нийгмийн амьдрал', order: 2 },
    { name: 'Үйл явдал', slug: 'ued', description: 'Тулгамдсан асуудал, үйл явдал', order: 3 },
    { name: 'Соёл', slug: 'soiol', description: 'Соёл, урлаг, уламжлал', order: 4 },
    { name: 'Эдийн засаг', slug: 'ediizasag', description: 'Эдийн засгийн мэдээ', order: 5 },
  ]

  const categories: Category[] = []
  for (const cat of categorySlugs) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      categories.push(existing.docs[0])
      console.log(`  ✓ Category "${cat.name}" already exists`)
      continue
    }
    const created = await payload.create({ collection: 'categories', data: cat })
    categories.push(created)
    console.log(`  ✓ Created category "${cat.name}"`)
  }

  // Authors
  const authorData = [
    { name: 'Д.Улаанхүүхэн', slug: 'ulaanhuukhen', role: 'Ерөнхий редактор', bio: 'Сүхбаатарын Өнгө сонины үүсгэн байгуулагч, ерөнхий редактор.', order: 1 },
    { name: 'Б.Нарантуяа', slug: 'narantuya', role: 'Сурвалжлагч', bio: 'Орон нутгийн мэдээ, нийгмийн чиглэлээр ажилладаг сурвалжлагч.', order: 2 },
  ]

  const authors: Author[] = []
  for (const a of authorData) {
    const existing = await payload.find({ collection: 'authors', where: { slug: { equals: a.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      authors.push(existing.docs[0])
      console.log(`  ✓ Author "${a.name}" already exists`)
      continue
    }
    const created = await payload.create({ collection: 'authors', data: a })
    authors.push(created)
    console.log(`  ✓ Created author "${a.name}"`)
  }

  // Sample articles
  type ArticleStatus = 'draft' | 'published'

  const articleData: Array<{
    title: string
    slug: string
    excerpt: string
    category?: number
    author?: number
    featured: boolean
    status: ArticleStatus
    publishedAt: string
    tags: Array<{ tag: string }>
    videoEmbedUrl?: string
  }> = [
    {
      title: 'Сүхбаатар аймгийн Дариганга сумын хөгжлийн чиг хандлага',
      slug: 'dariganga-khogjoliyn-chig-handlag',
      excerpt: 'Дариганга сум нь малын аж ахуй, байгалийн үзэсгэлэнт газраараа алдартай. Сумын хөгжлийн талаар ярилцлага хийлээ.',
      category: categories[0]?.id,
      author: authors[0]?.id,
      featured: true,
      status: 'published',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'Дариганга' }, { tag: 'Хөгжил' }],
    },
    {
      title: 'Аймгийн 2024 оны ойн арга хэмжээний тайлан',
      slug: 'aimgiin-2024-oi',
      excerpt: 'Аймгийн төвд болсон ойн тэмдэглэлийн арга хэмжээнд олон зуун иргэн оролцов.',
      category: categories[1]?.id,
      author: authors[1]?.id,
      featured: false,
      status: 'published',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'Ой тэмдэглэл' }],
    },
    {
      title: 'Дариганга нутгийн уламжлалт нааданчдын уулзалт',
      slug: 'dariganga-naadanchdiin-uulzalt',
      excerpt: 'Жил бүр уламжлал болсон нааданчдын уулзалт энэ жил ч амжилттай боллоо.',
      category: categories[3]?.id,
      author: authors[0]?.id,
      featured: true,
      status: 'published',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'Соёл' }, { tag: 'Уламжлал' }],
    },
    {
      title: 'Мал аж ахуйн зуны бэлтгэл ажил эхэллээ',
      slug: 'mal-aj-ahuin-zuny-beltgel',
      excerpt: 'Дариганга сумын малчид зуны бэлчээрт нүүж, малынхаа эрүүл мэндийг хамгаалах ажилд оржээ.',
      category: categories[4]?.id,
      author: authors[1]?.id,
      featured: false,
      status: 'published',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [{ tag: 'Мал аж ахуй' }],
    },
    {
      title: 'Видео: Дариганга нутгийн байгаль орчны тойм',
      slug: 'dariganga-baigal-orchny-toim-video',
      excerpt: 'Дариганга нутгийн байгаль орчны гайхалтай видео тоймыг үзнэ үү.',
      category: categories[0]?.id,
      author: authors[0]?.id,
      featured: false,
      status: 'published',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      videoEmbedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tags: [{ tag: 'Видео' }, { tag: 'Байгаль' }],
    },
  ]

  for (const article of articleData) {
    const existing = await payload.find({ collection: 'articles', where: { slug: { equals: article.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      console.log(`  ✓ Article "${article.title}" already exists`)
      continue
    }
    await payload.create({ collection: 'articles', data: article })
    console.log(`  ✓ Created article "${article.title}"`)
  }

  // Sample ad
  const existingAd = await payload.find({ collection: 'ads', where: { name: { equals: 'Жишээ сурталчилгаа' } }, limit: 1 })
  if (existingAd.docs.length === 0) {
    await payload.create({
      collection: 'ads',
      data: {
        name: 'Жишээ сурталчилгаа',
        placement: 'sidebar',
        active: true,
        order: 1,
        linkUrl: 'https://facebook.com/sukhbaatar.ungu',
      },
    })
    console.log('  ✓ Created sample ad')
  } else {
    console.log('  ✓ Sample ad already exists')
  }

  console.log('\n✅ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
