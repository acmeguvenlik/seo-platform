# Authentication System Setup

SEO Tools Platform artık custom authentication sistemi kullanıyor.

## Özellikler

- ✅ Email/Password authentication
- ✅ JWT token based sessions
- ✅ Secure password hashing (bcrypt)
- ✅ Role-based access control (USER, ADMIN)
- ✅ Session management
- ✅ Protected routes

## Kurulum

### 1. Database Setup

Önce Prisma schema'yı database'e push edin:

```bash
npm run db:generate
npm run db:push
```

### 2. Admin Kullanıcısı Oluşturma

Admin kullanıcısı oluşturmak için:

```bash
npm run db:create-admin
```

Varsayılan admin bilgileri:
- Email: `admin@seotools.com`
- Password: `admin123456`
- Role: `ADMIN`
- Plan: `ENTERPRISE`

Özel admin bilgileri ile oluşturmak için:

```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword ADMIN_NAME="Your Name" npm run db:create-admin
```

⚠️ **Önemli:** İlk girişten sonra şifreyi mutlaka değiştirin!

### 3. Environment Variables

`.env.local` dosyasında şu değişkenlerin olduğundan emin olun:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# JWT Secret (production'da güçlü bir key kullanın)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Kullanım

### Kayıt Olma

1. `/sign-up` sayfasına gidin
2. Email, şifre ve isim bilgilerini girin
3. "Kayıt Ol" butonuna tıklayın
4. Otomatik olarak giriş yapılır ve dashboard'a yönlendirilirsiniz

### Giriş Yapma

1. `/sign-in` sayfasına gidin
2. Email ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın
4. Dashboard'a yönlendirilirsiniz

### Çıkış Yapma

Header'daki kullanıcı menüsünden "Çıkış Yap" seçeneğine tıklayın.

## API Endpoints

### POST /api/auth/register
Yeni kullanıcı kaydı

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### POST /api/auth/login
Kullanıcı girişi

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/logout
Oturumu sonlandır

### GET /api/auth/me
Mevcut kullanıcı bilgilerini getir

## Middleware

Middleware artık sadece i18n (çoklu dil) için kullanılıyor. Authentication kontrolü her route'ta ayrı ayrı yapılıyor.

## Protected Routes

Dashboard ve admin sayfaları için authentication kontrolü:

```typescript
import { requireAuth, requireAdmin } from "@/lib/auth";

// User authentication gerekli
export async function GET() {
  const user = await requireAuth();
  // ...
}

// Admin authentication gerekli
export async function POST() {
  const admin = await requireAdmin();
  // ...
}
```

## Roller

- **USER**: Normal kullanıcı (varsayılan)
- **ADMIN**: Yönetici (tüm özelliklere erişim)

## Planlar

- **FREE**: Ücretsiz plan (varsayılan)
- **PRO**: Pro plan
- **ENTERPRISE**: Enterprise plan

## Güvenlik

- Şifreler bcrypt ile hash'leniyor (12 rounds)
- JWT token'lar 7 gün geçerli
- Session'lar database'de saklanıyor
- HTTP-only cookies kullanılıyor
- HTTPS zorunlu (production)

## Troubleshooting

### "Unauthorized" hatası
- Session süresi dolmuş olabilir, tekrar giriş yapın
- Cookie'ler engellenmiş olabilir, tarayıcı ayarlarını kontrol edin

### "Email already registered" hatası
- Bu email ile zaten bir hesap var
- Giriş yapmayı deneyin veya farklı bir email kullanın

### Database connection hatası
- DATABASE_URL'in doğru olduğundan emin olun
- Database'in çalıştığını kontrol edin
- `npm run db:push` komutunu çalıştırın

## Production Deployment

Production'a deploy ederken:

1. Güçlü bir JWT_SECRET oluşturun (en az 32 karakter)
2. DATABASE_URL'i production database'e ayarlayın
3. NEXT_PUBLIC_APP_URL'i production domain'e ayarlayın
4. Admin şifresini değiştirin
5. HTTPS kullanın

```bash
# Güçlü JWT secret oluşturma
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
