# Vercel Environment Variables Setup

## 🚨 Önemli: Environment Variables Eksik!

Vercel'de login çalışması için environment variables eklemeniz gerekiyor.

## 📝 Gerekli Environment Variables

### 1. Vercel Dashboard'a Git
https://vercel.com/dashboard

### 2. Projenizi Seç
`seo-platform` projesine tıkla

### 3. Settings → Environment Variables
Sol menüden "Settings" → "Environment Variables" sekmesine git

### 4. Şu Değişkenleri Ekle

#### DATABASE_URL (Zorunlu)
```
DATABASE_URL=postgresql://neondb_owner:npg_HvZ3obafS1Gl@ep-floral-moon-a4bu9nes-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Not:** Bu sizin Neon database connection string'iniz. Eğer farklı bir database kullanıyorsanız, kendi connection string'inizi kullanın.

#### JWT_SECRET (Zorunlu)
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

**Önemli:** Production için güçlü bir secret key oluşturun:
```bash
# PowerShell'de:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# veya Node.js ile:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### NEXT_PUBLIC_APP_URL (Zorunlu)
```
NEXT_PUBLIC_APP_URL=https://seo-platform-eight.vercel.app
```

**Not:** Kendi Vercel URL'inizi kullanın. Vercel Dashboard'da "Domains" sekmesinde bulabilirsiniz.

### 5. Environment Seçimi

Her değişken için şu environment'ları seç:
- ✅ Production
- ✅ Preview
- ✅ Development

### 6. Redeploy

Environment variables ekledikten sonra:
1. "Deployments" sekmesine git
2. En son deployment'ın yanındaki "..." menüsüne tıkla
3. "Redeploy" seç
4. "Redeploy" butonuna tıkla

## 🔍 Hata Kontrolü

### Login 500 Hatası
- DATABASE_URL doğru mu kontrol et
- Database'e bağlanabiliyor mu test et
- Prisma client generate edildi mi kontrol et

### Login 401 Hatası
- Kullanıcı database'de var mı kontrol et
- Admin kullanıcısı oluşturuldu mu kontrol et

### /api/auth/me 401 Hatası
- Normal bir durum, kullanıcı giriş yapmamış demek
- Login yaptıktan sonra düzelecek

## 🗄️ Database Kurulumu

Eğer henüz database'iniz yoksa:

### Neon PostgreSQL (Ücretsiz)

1. https://neon.tech adresine git
2. "Sign Up" ile hesap oluştur
3. "Create Project" ile yeni proje oluştur
4. Connection string'i kopyala
5. Vercel'e DATABASE_URL olarak ekle

### Prisma Migration

Database oluşturduktan sonra:

```bash
# Local'de:
npm run db:generate
npm run db:push
npm run db:create-admin
```

Bu komutlar:
- Prisma client'ı generate eder
- Database schema'yı oluşturur
- Admin kullanıcısı oluşturur

## 🎯 Test

Environment variables ekledikten ve redeploy ettikten sonra:

1. https://seo-platform-eight.vercel.app/sign-in adresine git
2. Admin bilgileriyle giriş yap:
   - Email: `admin@seotools.com`
   - Şifre: `admin123456`

## 📞 Sorun Giderme

### "Internal server error" alıyorum
- Vercel Function Logs'u kontrol et (Deployments → ... → View Function Logs)
- DATABASE_URL'in doğru olduğundan emin ol
- Database'in erişilebilir olduğunu kontrol et

### "Invalid credentials" alıyorum
- Admin kullanıcısı oluşturuldu mu kontrol et
- Email ve şifrenin doğru olduğundan emin ol
- Database'de user tablosunu kontrol et

### Environment variables görmüyorum
- Settings → Environment Variables sekmesinde olduğundan emin ol
- Doğru projeyi seçtiğinden emin ol
- Sayfayı yenile (F5)

## 🔐 Güvenlik

Production'da:
- ✅ Güçlü JWT_SECRET kullan (32+ karakter)
- ✅ Admin şifresini değiştir
- ✅ HTTPS kullan (Vercel otomatik sağlar)
- ✅ Environment variables'ı kimseyle paylaşma

## 📚 Daha Fazla Bilgi

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Neon PostgreSQL Docs](https://neon.tech/docs/introduction)
- [Prisma Docs](https://www.prisma.io/docs)

---

**Yardıma mı ihtiyacınız var?**
- GitHub Issues: https://github.com/acmeguvenlik/seo-platform/issues
- Vercel Support: https://vercel.com/support
