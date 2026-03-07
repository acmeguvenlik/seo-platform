# Contributing to SEO Tools Platform

SEO Tools Platform'a katkıda bulunmak istediğiniz için teşekkürler! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## Geliştirme Ortamı Kurulumu

### 1. Repository'yi Fork Edin

```bash
# Repository'yi fork edin (GitHub'da)
# Sonra local'e clone edin
git clone https://github.com/YOUR_USERNAME/seo-platform.git
cd seo-platform
```

### 2. Dependencies'i Yükleyin

```bash
npm install
```

### 3. Environment Variables

`.env.local` dosyası oluşturun:

```bash
cp .env.local.example .env.local
```

Gerekli API anahtarlarını ekleyin (development için test keys kullanabilirsiniz).

### 4. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 5. Development Server

```bash
npm run dev
```

## Kod Standartları

### TypeScript

- Strict mode kullanın
- `any` type'dan kaçının
- Interface'leri export edin
- Type safety'yi koruyun

### React/Next.js

- Functional components kullanın
- Server Components'i tercih edin (gerekmedikçe)
- "use client" directive'ini sadece gerektiğinde kullanın
- Custom hooks için `use` prefix'i kullanın

### Styling

- Tailwind CSS kullanın
- Custom CSS'den kaçının
- Design system'e uygun renkler kullanın
- Responsive tasarım yapın

### Naming Conventions

- Components: PascalCase (`MetaAnalyzer.tsx`)
- Files: kebab-case (`meta-analyzer.tsx`)
- Functions: camelCase (`handleAnalyze`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)

## Commit Messages

Conventional Commits formatını kullanın:

```
feat: add keyword density checker
fix: resolve meta analyzer bug
docs: update README
style: format code
refactor: improve performance
test: add unit tests
chore: update dependencies
```

## Pull Request Süreci

### 1. Branch Oluşturun

```bash
git checkout -b feature/your-feature-name
# veya
git checkout -b fix/bug-description
```

### 2. Değişiklikleri Yapın

- Küçük, odaklanmış değişiklikler yapın
- Her commit'te çalışan kod bırakın
- Test ekleyin (varsa)

### 3. Test Edin

```bash
# Build test
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### 4. Commit ve Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

### 5. Pull Request Açın

- Açıklayıcı bir başlık yazın
- Değişiklikleri detaylı açıklayın
- Screenshots ekleyin (UI değişiklikleri için)
- Related issues'ı link edin

## Yeni Araç Ekleme

Yeni bir SEO aracı eklemek için:

### 1. Tool Component

```typescript
// src/components/tools/your-tool.tsx
"use client";

export function YourTool() {
  // Implementation
}
```

### 2. Tool Page

```typescript
// src/app/[locale]/tools/your-tool/page.tsx
import { YourTool } from "@/components/tools/your-tool";

export default function YourToolPage() {
  return <YourTool />;
}
```

### 3. API Route

```typescript
// src/app/api/tools/your-tool/route.ts
export async function POST(request: NextRequest) {
  // Implementation
}
```

### 4. Tools Grid'e Ekleyin

```typescript
// src/components/tools/tools-grid.tsx
{
  name: "Your Tool",
  description: "Tool description",
  icon: YourIcon,
  href: "/tools/your-tool",
  available: true,
}
```

## Testing

### Manual Testing

- Tüm form'ları test edin
- Error handling'i kontrol edin
- Loading states'i test edin
- Responsive tasarımı kontrol edin
- Farklı dillerde test edin

### Browser Testing

- Chrome
- Firefox
- Safari
- Edge

### Device Testing

- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## Code Review

Pull request'iniz review edilirken:

- Feedback'lere açık olun
- Değişiklikleri hızlıca yapın
- Sorular sorun
- Tartışmalara katılın

## İletişim

- GitHub Issues: Bugs ve feature requests için
- GitHub Discussions: Genel sorular için
- Email: dev@seotools.com

## License

Katkılarınız projenin lisansı altında yayınlanacaktır.

## Teşekkürler!

Katkılarınız için teşekkür ederiz! 🎉
