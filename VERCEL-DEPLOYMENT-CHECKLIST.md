# Vercel Deployment Checklist

## ✅ Tamamlanan Adımlar
- [x] GitHub repository oluşturuldu
- [x] Kod GitHub'a push edildi
- [x] Vercel'e deploy edildi
- [x] `vercel.json` dosyası düzeltildi (secret referansları kaldırıldı)

## 🔄 Şimdi Yapılması Gerekenler

### 1. Güncellenmiş vercel.json'ı GitHub'a Push Et

```bash
cd seo-platform
git add vercel.json
git commit -m "fix: Remove secret references from vercel.json"
git push
```

### 2. Vercel Dashboard'da Environment Variables Ekle

Vercel Dashboard'a git: https://vercel.com/dashboard

**Settings → Environment Variables** bölümünden şu değişkenleri ekle:

#### Minimum Gerekli (Test için):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmxleGlibGUtcG9ycG9pc2UtNDYuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_jwhrAhr3tT9LGQp3ZzUMlsQpLXgF4hhLCRJQbiv3r2
NEXT_PUBLIC_APP_URL=https://[proje-adi].vercel.app
```

**ÖNEMLİ:** `NEXT_PUBLIC_APP_URL` değerini Vercel'in size verdiği URL ile değiştir!

#### Opsiyonel (Tam Fonksiyonellik için):
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Vercel'de Redeploy Et

Environment variables ekledikten sonra:
1. Vercel Dashboard'da "Deployments" sekmesine git
2. En son deployment'ın yanındaki "..." menüsüne tıkla
3. "Redeploy" seç
4. "Redeploy" butonuna tıkla

### 4. Test Et

Deploy tamamlandıktan sonra:
```
https://[proje-adi].vercel.app
```

Şu sayfaları test et:
- ✅ Ana sayfa yükleniyor mu?
- ✅ Sign In/Sign Up çalışıyor mu?
- ✅ Tools sayfası açılıyor mu?

## 📝 Notlar

### Clerk Keys Hakkında
- Şu an **test keys** kullanıyorsun (`pk_test_...` ve `sk_test_...`)
- Production'a geçerken Clerk Dashboard'dan **production keys** alman gerekecek
- Test keys ile 10,000 MAU limiti var

### Database & Redis
- Şu an bu servisler olmadan da site çalışır
- Ancak şu özellikler çalışmaz:
  - Kullanıcı verileri kaydetme
  - Rate limiting
  - Saved analyses
  - Usage tracking

### AI Features
- `ANTHROPIC_API_KEY` olmadan AI önerileri çalışmaz
- Meta tag analyzer'da AI suggestions görünmez
- Diğer tüm analiz özellikleri normal çalışır

## 🚀 Sonraki Adımlar (Opsiyonel)

### 1. Production Clerk Keys
1. Clerk Dashboard → API Keys
2. "Production" sekmesine geç
3. Keys'i kopyala ve Vercel'e ekle

### 2. Database Kurulumu (Neon)
1. https://neon.tech adresine git
2. Yeni proje oluştur
3. Connection string'i kopyala
4. Vercel'e `DATABASE_URL` olarak ekle
5. Prisma migration çalıştır:
```bash
npx prisma generate
npx prisma db push
```

### 3. Redis Kurulumu (Upstash)
1. https://upstash.com adresine git
2. Yeni Redis database oluştur
3. REST API credentials'ı kopyala
4. Vercel'e ekle

### 4. AI Kurulumu (Anthropic)
1. https://console.anthropic.com adresine git
2. API key oluştur
3. Billing bilgilerini ekle
4. Vercel'e ekle

## ❓ Sorun Giderme

### "Publishable key not valid" Hatası
- Clerk keys'in doğru kopyalandığından emin ol
- Boşluk veya satır sonu karakteri olmamalı
- Test keys ile production keys'i karıştırma

### Build Hatası
- GitHub'daki kodun en güncel olduğundan emin ol
- Vercel'de "Redeploy" yap
- Build logs'u kontrol et

### 404 Hatası
- Vercel'in build'i tamamladığından emin ol
- Domain'in doğru olduğunu kontrol et
- Cache'i temizle (Ctrl+Shift+R)

## 📞 Yardım

Sorun yaşarsan:
1. Vercel build logs'unu kontrol et
2. Browser console'u kontrol et (F12)
3. Environment variables'ın doğru olduğunu kontrol et
