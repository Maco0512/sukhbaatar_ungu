import type { CollectionConfig } from 'payload'

// Transliteration map: Cyrillic → Latin (Mongolian common chars)
const cyrToLat: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', ö: 'o', ō: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ü: 'u', ū: 'u', ф: 'f', х: 'h',
  ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
  я: 'ya', ө: 'o', ү: 'u',
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

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Булан',
    plural: 'Булангууд',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.name) {
          data.slug = toUrlSlug(data.name as string)
        } else if (data?.slug) {
          // Sanitise whatever the editor typed
          data.slug = toUrlSlug(data.slug as string)
        }
        return data
      },
    ],
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
      label: 'Slug (URL)',
      admin: {
        position: 'sidebar',
        description: 'Автоматаар үүснэ. Зөвхөн a-z, 0-9, дефис зөвшөөрнө.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Тайлбар',
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
