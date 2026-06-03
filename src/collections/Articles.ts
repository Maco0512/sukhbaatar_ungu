import type { CollectionConfig } from 'payload'

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
      label: 'Slug',
      admin: {
        position: 'sidebar',
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
