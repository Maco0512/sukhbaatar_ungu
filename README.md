# Сүхбаатарын Өнгө — News Website

Public news website + CMS for **"Сүхбаатарын Өнгө"**, the local newspaper of
Sükhbaatar aimag (Dariganga region), Mongolia.

**Stack:** Next.js 16 (App Router) · Payload CMS 3 · PostgreSQL (Neon) · Vercel Blob · Lexical rich text

---

## Local Development

### Prerequisites

- Node.js ≥ 20
- A PostgreSQL database (Neon free tier works)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env
# Edit .env — see "Environment Variables" below

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the front end and
[http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

On first load, Payload will prompt you to create the first admin user.

### Seed sample data

After creating your admin user:

```bash
npm run seed
```

This creates 5 categories, 2 authors, 5 sample articles, and 1 ad.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled, with `?sslmode=require`) |
| `PAYLOAD_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_SERVER_URL` | Full public URL **with `https://`**, no trailing slash (e.g. `https://yoursite.vercel.app`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read-write token (see Blob setup below) |

`.env.example`:
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
PAYLOAD_SECRET=your-secret-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=
```

---

## NPM Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed sample categories, authors, articles |
| `npm run generate:types` | Regenerate Payload TypeScript types after schema changes |
| `npm run generate:importmap` | Regenerate admin importmap after adding plugins |

---

## CMS Collections

| Collection | Slug | Purpose |
|---|---|---|
| Users | `users` | Admin access |
| Media | `media` | Images with thumbnail/card/hero sizes |
| Categories | `categories` | Section/bulан (e.g. Мэдээ, Нийгэм) |
| Authors | `authors` | Journalist profiles |
| Articles | `articles` | News articles with rich text, video embed |
| Ads | `ads` | Banner ads with placement/date control |

---

## Public Routes

| Route | Page |
|---|---|
| `/` | Home — featured + latest by category |
| `/news/[slug]` | Article detail with JSON-LD, share buttons |
| `/category/[slug]` | Category listing, paginated |
| `/author/[slug]` | Author bio + articles |
| `/search` | Full-text search with category/date filters |
| `/multimedia` | Articles with video/podcast embeds |
| `/about` | About the paper and contact |
| `/feed.xml` | RSS feed |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots |

---

## Vercel Deployment Checklist

### 1. Database — Neon PostgreSQL

- Create a project on [neon.tech](https://neon.tech)
- Use the **pooled** connection string (ending in `-pooler.neon.tech`)
- Append `?sslmode=require` to the connection string
- Set as `DATABASE_URL` in Vercel production env vars

### 2. Media Storage — Vercel Blob

> **Critical:** Several traps to avoid.

1. In your Vercel project → **Storage** → Create a **Blob** store
2. **Choose PUBLIC** — private blobs are not browser-accessible; images won't load on a public site
3. Vercel sets `BLOB_STORE_ID`, `VERCEL_OIDC_TOKEN`, `BLOB_WEBHOOK_PUBLIC_KEY` automatically but does **NOT** auto-create `BLOB_READ_WRITE_TOKEN`
4. Go to the Blob store settings → copy the **read-write token**
5. Add it manually as `BLOB_READ_WRITE_TOKEN` in Vercel's production environment variables
6. The Payload plugin is `enabled: true` unconditionally — do not gate it on the token

Without this, uploads fail with `ENOENT: mkdir 'media'` because Vercel's filesystem is read-only.

### 3. Environment Variables in Vercel

Set these in **Project → Settings → Environment Variables → Production**:

| Variable | Value |
|---|---|
| `PAYLOAD_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URL` | Neon pooled connection string with `?sslmode=require` |
| `NEXT_PUBLIC_SERVER_URL` | `https://yourproject.vercel.app` — **must include `https://`**, no trailing slash. A bare hostname causes "Invalid URL" build crash. |
| `BLOB_READ_WRITE_TOKEN` | From Blob store settings (manually added) |

### 4. importMap — must be committed

After any plugin change, regenerate and commit:

```bash
npm run generate:importmap
git add src/app/\(payload\)/admin/importMap.js
git commit -m "regenerate importmap"
```

If you skip this, the admin renders a blank page with "PayloadComponent not found in importMap".

### 5. `force-dynamic` on all frontend pages

All pages under `src/app/(frontend)/` that read Payload data export:

```ts
export const dynamic = 'force-dynamic'
```

This prevents Next.js from trying to prerender them at build time (which would fail — no DB during build).

Do **not** add this to `app/(payload)/...` routes.

### 6. Vercel plan

Vercel Hobby is non-commercial. A newspaper is commercial content → use **Vercel Pro**.

For heavier traffic or to avoid serverless cold-start delays on the admin panel, a VPS (cloud.mn or similar) with Payload running as a Node server is a better long-term target. Keep media on Vercel Blob or S3 either way.

---

## After Deployment

1. Open `https://yoursite.vercel.app/admin` and create the first admin user
2. Create categories (Булан) — set slugs like `medee`, `niigem`, `ued`
3. Create author profiles (Сэтгүүлч)
4. Publish articles (Нийтлэл) — set Status = Нийтэлсэн and tick Онцлох for featured ones
5. Add ads (Сурталчилгаа) with placement = sidebar/header

---

## Schema Changes Workflow

After editing a collection in `src/collections/`:

```bash
npm run generate:types     # update TypeScript types
npm run generate:importmap # update admin importmap (if plugins changed)
git add -A && git commit -m "update schema"
```

Payload auto-migrates the database on server start (dev) or you can run `npm run payload migrate` manually.
