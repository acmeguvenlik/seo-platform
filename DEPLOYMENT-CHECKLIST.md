# Deployment Checklist

Bu dosya, SEO Tools Platform'u production ortamına deploy etmeden önce kontrol edilmesi gereken tüm adımları içerir.

## 🔧 Ön Hazırlık

### 1. Environment Variables

Tüm gerekli environment variable'ları `.env.example` dosyasından kopyalayın ve değerlerini doldurun:

```bash
cp .env.example .env.local
```

**Kritik değişkenler:**
- ✅ `DATABASE_URL` - Neon PostgreSQL connection string
- ✅ `JWT_SECRET` - En az 32 karakter, güvenli random string
- ✅ `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- ✅ `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- ✅ `ANTHROPIC_API_KEY` - Claude AI API key
- ✅ `NEXT_PUBLIC_APP_URL` - Production domain (https://yourdomain.com)

**Opsiyonel ama önerilen:**
- `GOOGLE_PAGESPEED_API_KEY` - Page Speed tool için
- `RESEND_API_KEY` - Email gönderimi için
- `STRIPE_SECRET_KEY` - Ödeme sistemi için

### 2. Database Setup

```bash
# Prisma client oluştur
npm run db:generate

# Database'i push et (ilk deployment)
npm run db:push

# Admin kullanıcısı oluştur
npm run db:create-admin
```

Admin credentials:
- Email: `admin@seotools.com`
- Password: `admin123456`

**ÖNEMLİ:** Production'da admin şifresini değiştirin!

### 3. Build Test

Local'de production build'i test edin:

```bash
npm run build
npm start
```

Hata yoksa devam edin.

---

## 🚀 Vercel Deployment

### 1. Vercel Project Oluştur

```bash
# Vercel CLI yükle (yoksa)
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 2. Environment Variables Ekle

Vercel Dashboard → Settings → Environment Variables

Tüm `.env.local` değişkenlerini ekleyin. **Production**, **Preview**, ve **Development** için ayrı ayrı ayarlayın.

### 3. Domain Bağla

Vercel Dashboard → Settings → Domains

Custom domain ekleyin ve DNS ayarlarını yapın.

### 4. Build Settings

Vercel otomatik algılar ama kontrol edin:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 20.x

### 5. Function Configuration

`vercel.json` oluşturun (opsiyonel):

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 🔍 SEO Checklist

### 1. Google Search Console

- [ ] Domain verify et
- [ ] Sitemap submit et: `https://yourdomain.com/sitemap.xml`
- [ ] robots.txt kontrol et: `https://yourdomain.com/robots.txt`

### 2. Meta Tags Kontrolü

Her sayfada olmalı:
- [ ] Title tag (30-60 karakter)
- [ ] Meta description (120-160 karakter)
- [ ] Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter Card tags
- [ ] Canonical URL

### 3. Structured Data

- [ ] Homepage: WebApplication schema
- [ ] Tool pages: SoftwareApplication schema
- [ ] Blog posts: Article schema

Google Rich Results Test ile kontrol edin: https://search.google.com/test/rich-results

### 4. Performance

PageSpeed Insights ile test edin: https://pagespeed.web.dev/

Hedef:
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Mobile score > 90
- [ ] Desktop score > 95

---

## 🔒 Security Checklist

### 1. Environment Variables

- [ ] JWT_SECRET production'da değiştirildi
- [ ] API keys güvenli
- [ ] Database credentials güvenli
- [ ] `.env.local` gitignore'da

### 2. Rate Limiting

- [ ] Redis rate limiter çalışıyor
- [ ] Plan-based limits aktif
- [ ] API routes korumalı

### 3. Authentication

- [ ] JWT token expiry ayarlandı
- [ ] Session management çalışıyor
- [ ] Password hashing (bcrypt) aktif
- [ ] Admin şifresi değiştirildi

### 4. CORS & Headers

- [ ] Security headers ayarlandı
- [ ] CORS policy doğru
- [ ] CSP (Content Security Policy) ayarlandı

---

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

Otomatik aktif olur. Dashboard'dan kontrol edin.

### 2. Error Tracking (Opsiyonel)

Sentry entegrasyonu:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 3. Uptime Monitoring

Önerilen servisler:
- BetterUptime (https://betteruptime.com)
- UptimeRobot (https://uptimerobot.com)

---

## 🧪 Post-Deployment Tests

### 1. Functional Tests

- [ ] Homepage yükleniyor
- [ ] Kayıt/giriş çalışıyor
- [ ] Tool'lar çalışıyor (her birini test et)
- [ ] AI tools çalışıyor
- [ ] Rate limiting çalışıyor
- [ ] Dashboard açılıyor

### 2. API Tests

```bash
# Health check
curl https://yourdomain.com/api/health

# Meta analyzer (auth gerektirmez)
curl -X POST https://yourdomain.com/api/tools/meta-analyzer \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### 3. Performance Tests

- [ ] Lighthouse audit
- [ ] WebPageTest (https://webpagetest.org)
- [ ] GTmetrix (https://gtmetrix.com)

---

## 🐛 Troubleshooting

### Build Hatası

```bash
# Cache temizle
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Connection Hatası

- Neon dashboard'dan connection string'i kontrol et
- SSL mode eklenmiş mi? `?sslmode=require`
- IP whitelist var mı? (Neon'da genelde yok)

### Redis Connection Hatası

- Upstash dashboard'dan URL ve token'ı kontrol et
- REST API kullanıldığından emin ol (TCP değil)

### AI Tools Çalışmıyor

- `ANTHROPIC_API_KEY` doğru mu?
- API quota doldu mu?
- Model adı doğru mu? (`claude-sonnet-4-20250514`)

---

## 📈 Post-Launch

### 1. Marketing

- [ ] Product Hunt lansmanı
- [ ] Social media duyurusu
- [ ] SEO blog yazıları
- [ ] Backlink stratejisi

### 2. Monitoring

İlk hafta günlük kontrol:
- Error rate
- Response times
- User registrations
- Tool usage stats
- API costs (Anthropic)

### 3. Optimization

- Slow query'leri optimize et
- Cache hit rate'i artır
- Bundle size'ı küçült
- Image optimization

---

## 📞 Support

Sorun yaşarsanız:

1. Vercel logs: `vercel logs`
2. Database logs: Neon dashboard
3. Redis logs: Upstash dashboard
4. Application logs: Console errors

---

**Son güncelleme:** Mart 2026
