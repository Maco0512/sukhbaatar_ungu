# syntax=docker/dockerfile:1
# Multi-stage build for Payload CMS 3 + Next.js (standalone output).
# Package manager: npm (package-lock.json is the only lockfile in this repo).

FROM node:22-alpine AS base
# libc6-compat is needed by some native deps (sharp) on Alpine.
RUN apk add --no-cache libc6-compat

# ---------- deps ----------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ---------- builder ----------
FROM base AS builder
WORKDIR /app

# NEXT_PUBLIC_* values are inlined into the bundle at build time, so the public
# server URL must be known here, not just at runtime.
ARG PAYLOAD_SECRET
ARG DATABASE_URL
ARG NEXT_PUBLIC_SERVER_URL

ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Every Payload-querying route is `force-dynamic`, so no database connection is
# needed during the build.
RUN npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public

# Standalone server + static assets.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Writable dirs: .next for the prerender cache, media for uploads
# (matches Media.staticDir = path.resolve(process.cwd(), 'media') => /app/media).
RUN mkdir -p .next/cache media \
  && chown -R nextjs:nodejs .next media

USER nextjs

EXPOSE 3000

# Migrations run on boot via `prodMigrations` in payload.config.ts, because the
# standalone image has no Payload CLI.
CMD ["node", "server.js"]
