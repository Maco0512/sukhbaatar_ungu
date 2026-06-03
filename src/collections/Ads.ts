import type { CollectionConfig } from 'payload'

export const Ads: CollectionConfig = {
  slug: 'ads',
  labels: {
    singular: 'Сурталчилгаа',
    plural: 'Сурталчилгаанууд',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'placement', 'active', 'startDate', 'endDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Нэр',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Зураг',
    },
    {
      name: 'linkUrl',
      type: 'text',
      label: 'Холбоос',
    },
    {
      name: 'placement',
      type: 'select',
      required: true,
      label: 'Байршил',
      options: [
        { label: 'Дээд хэсэг', value: 'header' },
        { label: 'Хажуу самбар', value: 'sidebar' },
        { label: 'Нийтлэл дотор', value: 'in_article' },
        { label: 'Доод хэсэг', value: 'footer' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Идэвхтэй',
      defaultValue: true,
    },
    {
      name: 'order',
      type: 'number',
      label: 'Дараалал',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Эхлэх огноо',
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Дуусах огноо',
    },
  ],
}
