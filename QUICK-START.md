# Quick Start Guide - SEO Tools Platform

## ✅ Tamamlanan Kurulum

Projeniz başarıyla kuruldu ve çalışıyor!

## 🎉 Admin Hesabı

Admin hesabınız oluşturuldu:

- **Email:** admin@seotools.com
- **Şifre:** admin123456
- **Rol:** ADMIN
- **Plan:** ENTERPRISE

⚠️ **Önemli:** İlk girişten sonra şifrenizi mutlaka değiştirin!

## 🚀 Kullanım

### Local Development

```bash
# Development server başlat
npm run dev
```

Tarayıcıda aç: http://localhost:3000

### Giriş Yapma

1. http://localhost:3000/sign-in adresine git
2. Email: `admin@seotools.com`
3. Şifre: `admin123456`
4. "Giriş Yap" butonuna tıkla

### Yeni Kullanıcı Kaydetme

1. http://localhost:3000/sign-up adresine git
2. Email, şifre ve isim bilgilerini gir
3. "Kayıt Ol" butonuna tıkla

## 📊 Özellikler

### SEO Araçları (10 Adet)
- ✅ Meta Tag Analyzer
- ✅ Keyword Density Checker
- ✅ Sitemap Generator
- ✅ Backlink Analyzer
- ✅ Image Optimizer
- ✅ Page Speed Analyzer
- ✅ Robots.txt Validator
- ✅ Schema Markup Generator
- ✅ Heading Structure Analyzer
- ✅ Internal Link Analyzer

### Authentication
- ✅ Email/Password ile kayıt ve giriş
- ✅ JWT token tabanlı session
- ✅ Role-based access (USER, ADMIN)
- ✅ Güvenli şifre hashleme

### Çoklu Dil Desteği
- 🇬🇧 English
- 🇹🇷 Türkçe
- 🇩🇪 Deutsch
- 🇪🇸 Español
- 🇫🇷 Français

## 🗄️ Database

### Mevcut Kurulum
- **Provider:** Neon PostgreSQL
- **Status:** ✅ Bağlı ve çalışıyor
- **Tables:** User, Session, ToolUsage, SavedAnalysis, ApiKey

### Database Komutları

```bash
# Prisma Client generate et
npm run db:generate

# Schema'yı database'e push et
npm run db:push

# Prisma Studio'yu aç (database GUI)
npm run db:studio

# Yeni admin kullanıcısı oluştur
npm run db:create-admin
```

## 🌐 Deployment

### Vercel (Otomatik)

Kod GitHub'a push edildiğinde otomatik deploy oluyor:
- **URL:** https://seo-platform-eight.vercel.app
- **Status:** ✅ Çalışıyor

### Environment Variables (Vercel'de Ekle)

```env
DATABASE_URL=postgresql://neondb_owner:npg_HvZ3obafS1Gl@ep-floral-moon-a4bu9nes-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
NEXT_PUBLIC_APP_URL=https://seo-platform-eight.vercel.app
```

## 📁 Proje Yapısı

```
seo-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   └── tools/        # SEO tool endpoints
│   │   └── [locale]/         # Localized pages
│   ├── components/            # React components
│   │   ├── auth/             # Auth forms
│   │   ├── layout/           # Layout components
│   │   ├── tools/            # SEO tool components
│   │   └── ui/               # UI components
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # Auth functions
│   │   ├── db.ts             # Prisma client
│   │   └── utils.ts          # Helper functions
│   └── messages/              # i18n translations
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── create-admin.ts        # Admin creation script
└── public/                    # Static files
```

## 🛠️ Geliştirme Komutları

```bash
# Development
npm run dev              # Dev server başlat
npm run build           # Production build
npm run start           # Production server başlat

# Database
npm run db:generate     # Prisma client generate
npm run db:push         # Schema'yı push et
npm run db:studio       # Database GUI aç
npm run db:create-admin # Admin oluştur

# Code Quality
npm run lint            # ESLint çalıştır
npm run type-check      # TypeScript kontrol
npm run format          # Prettier ile formatla
```

## 🔧 Yapılandırma

### .env.local Dosyası

```env
# Database
DATABASE_URL=postgresql://...

# JWT Secret
JWT_SECRET=your-secret-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Redis (Rate limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Optional: AI (Meta generator)
ANTHROPIC_API_KEY=sk-ant-...
```

## 📚 Dokümantasyon

- **AUTH-SETUP.md** - Authentication sistemi detayları
- **DEPLOYMENT.md** - Deployment rehberi
- **SETUP-GUIDE.md** - Kurulum rehberi
- **CONTRIBUTING.md** - Katkıda bulunma rehberi

## 🐛 Sorun Giderme

### Database bağlantı hatası
```bash
# Prisma client'ı yeniden generate et
npm run db:generate
npm run db:push
```

### Build hatası
```bash
# Dependencies'i yeniden yükle
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Session hatası
- Tarayıcı cookie'lerini temizle
- Tekrar giriş yap

## 📞 Destek

Sorun yaşarsanız:
1. GitHub Issues: https://github.com/acmeguvenlik/seo-platform/issues
2. Dokümantasyonu kontrol edin
3. Build logs'u inceleyin

## 🎯 Sıradaki Adımlar

1. ✅ Admin şifresini değiştir
2. ✅ SEO araçlarını test et
3. ⏳ Redis ekle (rate limiting için)
4. ⏳ Anthropic API ekle (AI önerileri için)
5. ⏳ Custom domain ekle
6. ⏳ Analytics ekle

## 🚀 Production Checklist

- [ ] Admin şifresini değiştir
- [ ] Güçlü JWT_SECRET oluştur
- [ ] Environment variables'ı Vercel'e ekle
- [ ] Database backup ayarla
- [ ] SSL sertifikası kontrol et
- [ ] Rate limiting aktif et
- [ ] Error tracking ekle (Sentry)
- [ ] Analytics ekle (Google Analytics)
- [ ] SEO optimizasyonu yap
- [ ] Performance test et

---

**Tebrikler! 🎉** SEO Tools Platform başarıyla kuruldu ve çalışıyor!
