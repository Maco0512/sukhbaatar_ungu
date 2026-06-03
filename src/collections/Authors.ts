import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: {
    singular: 'Сэтгүүлч',
    plural: 'Сэтгүүлчид',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
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
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Зураг',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Албан тушаал',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Намтар',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Дараалал',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
