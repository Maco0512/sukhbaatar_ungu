# Deploying to a fresh Ubuntu 24.04 VPS

Stack: Postgres 16 + the Next.js/Payload app + Caddy, all via Docker Compose.
Run everything below as a sudo-capable user on the server.

## 1. Server setup

```bash
# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 4GB swap — the Next.js build is memory-hungry (NODE_OPTIONS sets a 8GB heap
# cap), and small VPS plans will OOM-kill the build without it.
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Docker Engine + Compose plugin (official repo)
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Use docker without sudo (log out and back in afterwards)
sudo usermod -aG docker $USER
```

## 2. Clone with a GitHub deploy key

```bash
ssh-keygen -t ed25519 -C "vps-sukhbaatarungu" -f ~/.ssh/id_deploy -N ""
cat ~/.ssh/id_deploy.pub
```

Add that public key in GitHub under **repo → Settings → Deploy keys → Add deploy
key** (read-only is enough). Then:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/id_deploy
  IdentitiesOnly yes
EOF

git clone git@github.com:<owner>/sukhbaatar_ungu.git
cd sukhbaatar_ungu
```

## 3. Create .env

`.env` is gitignored and must never be committed.

```bash
cp .env.example .env

# Generate real secrets
echo "POSTGRES_PASSWORD=$(openssl rand -hex 32)" >  .env
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)"    >> .env
echo "SERVER_URL=http://<your-server-ip>"        >> .env
```

Leave `BLOB_READ_WRITE_TOKEN` unset — with no token, Payload stores uploads on
the local `media` volume instead of Vercel Blob.

## 4. Start

```bash
docker compose up -d --build
```

The first build takes several minutes. On boot the app runs the migrations in
`src/migrations/` automatically (`prodMigrations` in `payload.config.ts`), since
the standalone image ships no Payload CLI.

Then open `http://<your-server-ip>/admin` and create the first admin user.

## 5. Logs and status

```bash
docker compose ps
docker compose logs -f app      # look for "Running migrations" on first boot
docker compose logs -f caddy
docker compose exec db psql -U payload -d payload -c '\dt'
```

## 6. Updating

```bash
cd ~/sukhbaatar_ungu
git pull && docker compose up -d --build
```

New migrations committed to `src/migrations/` apply themselves on the restart.

## 7. Switching to the domain

Point an `A` record for `sukhbaatarungu.com` (and `www`) at the server IP first,
then:

1. In `Caddyfile`, replace `:80 {` with `sukhbaatarungu.com, www.sukhbaatarungu.com {`
   — Caddy will get a Let's Encrypt certificate on its own.
2. In `.env`, set `SERVER_URL=https://sukhbaatarungu.com`.
3. **Rebuild, don't just restart:**

   ```bash
   docker compose up -d --build
   ```

   `NEXT_PUBLIC_SERVER_URL` is inlined into the JavaScript bundle at build time,
   so `sitemap.xml`, `robots.txt`, `feed.xml` and the article OpenGraph tags keep
   emitting the old URL until the image is rebuilt.

## Backups

```bash
# Database
docker compose exec -T db pg_dump -U payload payload | gzip > backup-$(date +%F).sql.gz

# Uploaded media
docker run --rm -v sukhbaatar_ungu_media:/media -v "$PWD":/backup alpine \
  tar czf /backup/media-$(date +%F).tar.gz -C /media .
```

Restore the database with `gunzip -c backup.sql.gz | docker compose exec -T db psql -U payload -d payload`.

## Notes

- `docker compose down -v` **deletes the pgdata and media volumes.** Use plain
  `docker compose down` to stop without data loss.
- The build runs with no database reachable; that works because every
  Payload-querying route is marked `export const dynamic = 'force-dynamic'`.
  Don't add `generateStaticParams` to those routes without revisiting this.
