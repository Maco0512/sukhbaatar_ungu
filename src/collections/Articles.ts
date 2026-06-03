import type { CollectionConfig } from 'payload'

const cyrToLat: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ө: 'o', ү: 'u',
}

function toUrlSlug(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => cyrToLat[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Нийтлэл',
    plural: 'Нийтлэлүүд',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.title) {
          data.slug = toUrlSlug(data.title as string)
        } else if (data?.slug) {
          data.slug = toUrlSlug(data.slug as string)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Гарчиг',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: {
        position: 'sidebar',
        description: 'Гарчгаас автоматаар үүснэ. Зөвхөн a-z, 0-9, дефис.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Товч/Удиртгал',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Агуулга',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Нүүр зураг',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Булан',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Сэтгүүлч',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Шошго',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Шошго',
        },
      ],
    },
    {
      name: 'videoEmbedUrl',
      type: 'text',
      label: 'Видео/Подкаст холбоос',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Онцлох',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Нийтэлсэн огноо',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Төлөв',
      defaultValue: 'draft',
      options: [
        { label: 'Ноорог', value: 'draft' },
        { label: 'Нийтэлсэн', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
