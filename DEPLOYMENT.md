# Deployment Guide - SEO Tools Platform

Bu rehber, SEO Tools Platform'u production ortamına deploy etmek için gerekli adımları içerir.

## Ön Gereksinimler

### 1. Gerekli Servisler

Aşağıdaki servislere kayıt olun ve API anahtarlarını alın:

#### Clerk (Authentication)
- URL: https://clerk.com
- Ücretsiz plan: 10,000 MAU
- Gerekli: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

#### Neon (PostgreSQL Database)
- URL: https://neon.tech
- Ücretsiz plan: 0.5 GB storage
- Gerekli: `DATABASE_URL`

#### Upstash (Redis)
- URL: https://upstash.com
- Ücretsiz plan: 10,000 commands/day
- Gerekli: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

#### Anthropic (Claude AI)
- URL: https://console.anthropic.com
- Ücretli: Pay-as-you-go
- Gerekli: `ANTHROPIC_API_KEY`

### 2. Vercel Hesabı
- URL: https://vercel.com
- GitHub ile bağlantı kurun

## Deployment Adımları

### 1. Repository Hazırlığı

```bash
# Git repository oluşturun
git init
git add .
git commit -m "Initial commit"

# GitHub'a push edin
git remote add origin https://github.com/username/seo-platform.git
git branch -M main
git push -u origin main
```

### 2. Veritabanı Kurulumu

#### Neon PostgreSQL

1. Neon Console'da yeni bir proje oluşturun
2. Connection string'i kopyalayın
3. Prisma schema'yı push edin:

```bash
# .env.local dosyasına DATABASE_URL ekleyin
npx prisma generate
npx prisma db push
```

### 3. Clerk Kurulumu

1. Clerk Dashboard'da yeni bir application oluşturun
2. API keys'i kopyalayın
3. Clerk'te şu ayarları yapın:
   - Email/Password authentication'ı aktif edin
   - Social login'leri yapılandırın (opsiyonel)
   - Redirect URLs'leri ekleyin

### 4. Upstash Redis Kurulumu

1. Upstash Console'da yeni bir database oluşturun
2. REST API credentials'ı kopyalayın

### 5. Anthropic API Kurulumu

1. Anthropic Console'da API key oluşturun
2. Billing bilgilerini ekleyin
3. Rate limits'i kontrol edin

### 6. Vercel Deployment

#### Option 1: Vercel Dashboard

1. Vercel Dashboard'a gidin
2. "New Project" tıklayın
3. GitHub repository'nizi seçin
4. Environment variables'ı ekleyin:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

5. "Deploy" tıklayın

#### Option 2: Vercel CLI

```bash
# Vercel CLI'yi yükleyin
npm i -g vercel

# Login olun
vercel login

# Deploy edin
vercel

# Production'a deploy edin
vercel --prod
```

### 7. Domain Yapılandırması

1. Vercel Dashboard'da "Domains" sekmesine gidin
2. Custom domain ekleyin
3. DNS kayıtlarını yapılandırın:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com

### 8. Environment Variables Kontrolü

Vercel Dashboard'da tüm environment variables'ların doğru olduğundan emin olun:

```bash
# Local'de test edin
npm run build
npm run start

# Production URL'de test edin
curl https://yourdomain.com/api/health
```

## Post-Deployment

### 1. Monitoring

- Vercel Analytics'i aktif edin
- Error tracking için Sentry ekleyin (opsiyonel)
- Uptime monitoring için UptimeRobot kullanın (opsiyonel)

### 2. SEO Optimizasyonu

- Google Search Console'a site ekleyin
- Sitemap'i gönderin: `https://yourdomain.com/sitemap.xml`
- robots.txt'i kontrol edin

### 3. Performance

- Vercel Speed Insights'ı kontrol edin
- Lighthouse score'u test edin
- Core Web Vitals'ı optimize edin

### 4. Security

- SSL sertifikasının aktif olduğunu kontrol edin
- Security headers'ı test edin
- Rate limiting'in çalıştığını doğrulayın

## Troubleshooting

### Build Hatası

```bash
# Local'de build test edin
npm run build

# Type errors'ı kontrol edin
npm run type-check

# Dependencies'i güncelleyin
npm install
```

### Database Connection Hatası

- DATABASE_URL'in doğru olduğunu kontrol edin
- Neon'da IP whitelist'i kontrol edin
- SSL mode'un `require` olduğunu doğrulayın

### Clerk Authentication Hatası

- API keys'in doğru olduğunu kontrol edin
- Redirect URLs'lerin production domain'i içerdiğini doğrulayın
- Clerk Dashboard'da application settings'i kontrol edin

### Redis Connection Hatası

- Upstash credentials'ın doğru olduğunu kontrol edin
- Rate limit'e takılmadığınızı doğrulayın
- Upstash Dashboard'da connection logs'u kontrol edin

## Maintenance

### Database Migrations

```bash
# Schema değişikliklerini push edin
npx prisma db push

# Migration oluşturun (production için)
npx prisma migrate dev --name migration_name
npx prisma migrate deploy
```

### Dependency Updates

```bash
# Outdated packages'ı kontrol edin
npm outdated

# Güvenlik güncellemelerini yapın
npm audit fix

# Major updates için
npm update
```

### Backup

- Neon otomatik backup yapar (7 gün)
- Manual backup için Neon Dashboard'u kullanın
- Environment variables'ı güvenli bir yerde saklayın

## Support

Sorun yaşarsanız:
- GitHub Issues: https://github.com/username/seo-platform/issues
- Email: support@seotools.com
- Documentation: https://seotools.com/docs
