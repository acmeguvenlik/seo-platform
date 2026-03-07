# SEO Tools Platform

<div align="center">

![SEO Tools Platform](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

**A premium SaaS platform for SEO tools, webmaster tools, and AI-powered content optimization**

[Demo](https://seotools.com) · [Documentation](https://seotools.com/docs) · [Report Bug](https://github.com/username/seo-platform/issues)

</div>

---

## 🚀 Features

### ✅ Completed Features

#### Core Infrastructure
- Next.js 14 with App Router and TypeScript
- Tailwind CSS v4 with custom dark theme
- 5-language support (en, tr, de, es, fr) with next-intl
- Clerk authentication with custom pages
- Prisma ORM with PostgreSQL schema
- Upstash Redis for caching and rate limiting
- Anthropic Claude AI integration ready

#### Pages & Routes
- **Landing Page** - Hero, tools showcase, features, CTA sections
- **Tools Page** - Grid view of all SEO tools with categories
- **Meta Tag Analyzer** - Full working tool with real-time analysis
- **Keyword Density Checker** - Analyze keyword frequency and density
- **Dashboard** - User stats, recent analyses, quick access with sidebar
- **Saved Analyses** - List view with search, filter, and export
- **Settings** - Profile, notifications, security, billing tabs
- **Analytics** - Coming soon placeholder with feature preview
- **Billing** - Coming soon placeholder with plan management
- **Pricing** - 3 plans with detailed comparison table
- **About** - Mission, values, statistics, technology stack
- **Contact** - Form with validation and contact information
- **Documentation** - Guides, tutorials, API docs structure
- **Privacy Policy** - KVKK/GDPR compliant
- **Terms of Service** - Usage terms and conditions
- **Sign In/Sign Up** - Clerk authentication pages
- **404 Page** - Custom not found page
- **Error Boundaries** - Global and route-specific error handling
- **Loading States** - Skeleton screens and spinners

#### UI Components
- Button (5 variants, loading state)
- Card (default + interactive)
- Badge (7 variants)
- Input (URL variant with icon)
- Textarea (with character count)
- Select (custom styled dropdown)
- Tabs (horizontal navigation)
- Dialog (modal with overlay)
- Alert (4 variants with icons)
- Progress Bar (4 variants)
- Spinner (3 sizes)
- Skeleton (loading placeholder)

#### Layout Components
- Header (sticky, auth-aware, language switcher, mobile menu)
- Footer (4-column links grid)
- Dashboard Sidebar (navigation with active states)
- Mobile Menu (responsive hamburger menu)

#### Layout Components
- Header (sticky, auth-aware, language switcher)
- Footer (4-column links, responsive)
- Language Switcher (5 languages with flags)

#### SEO Tools
- **Meta Tag Analyzer** ✅
  - Title tag analysis (length, optimization)
  - Meta description analysis
  - Open Graph tags check
  - Twitter Card tags check
  - SEO score calculation (0-100)
  - Detailed suggestions
  - Real-time web scraping with Cheerio

#### Coming Soon Tools
- Keyword Research
- Sitemap Generator
- Backlink Analyzer
- Image Optimizer
- Page Speed Analyzer
- Competitor Analysis
- Domain Authority Checker

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Internationalization**: next-intl (en, tr, de, es, fr)
- **Authentication**: Clerk
- **Database**: Prisma + PostgreSQL (Neon)
- **Cache/Rate Limiting**: Upstash Redis
- **AI**: Anthropic SDK (Claude Sonnet 4)
- **Deployment**: Vercel

## Design Identity

"Dark Precision Instrument" - A professional-grade tool for SEO specialists. Think Linear meets Bloomberg Terminal.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- `ANTHROPIC_API_KEY` - Anthropic API key
- `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:3000 for dev)

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── (marketing)/    # Public pages
│   │   ├── (dashboard)/    # Protected dashboard
│   │   └── tools/          # SEO tools
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn + custom primitives
│   ├── layout/             # Header, Sidebar, Footer
│   ├── tools/              # Tool-specific components
│   └── dashboard/          # Dashboard widgets
├── lib/                    # Utilities and configs
├── messages/               # i18n translations
└── middleware.ts           # Auth + i18n middleware
```

## Phase 1 Status

✅ Project initialization
✅ All dependencies installed
✅ Tailwind CSS configured with custom design system
✅ Prisma schema created
✅ Core utilities (db, redis, rate-limiter, anthropic)
✅ i18n setup (5 languages)
✅ UI components (Button, Card, Badge, Input)
✅ Layout components (Header, Footer, Language Switcher)
✅ Landing page hero section

## Next Steps

Refer to PROMPT 2 or PROMPT 9B in the main guide for Phase 2 implementation.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema to database

## Project Status

### Phase 1 ✅ Complete
- Project setup and configuration
- Design system implementation
- Core utilities and libraries
- i18n setup

### Phase 2 ✅ Complete
- Meta Tag Analyzer tool (fully functional)
- Dashboard page with stats
- Pricing page with comparison
- Tools listing page
- Authentication pages
- Error handling and loading states
- Additional UI components

### Phase 3 🚧 In Progress
- Additional SEO tools
- User data persistence
- API rate limiting
- Analytics integration
- Email notifications

## Routes

### Public Routes
- `/` - Landing page
- `/tools` - All tools listing
- `/tools/meta-analyzer` - Meta tag analyzer
- `/pricing` - Pricing plans
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### Protected Routes (Requires Auth)
- `/dashboard` - User dashboard

### API Routes
- `/api/tools/meta-analyzer` - Meta analysis endpoint

## Environment Variables

See `.env.example` for required environment variables:
- Clerk (authentication)
- Neon PostgreSQL (database)
- Upstash Redis (cache/rate limiting)
- Anthropic AI (content generation)

## Design System

### Colors
- Background: `#080C0F` (base), `#0D1117` (elevated)
- Accent: `#00D4B4` (teal), `#F59E0B` (amber)
- Text: `#F0F4F8` (primary), `#8B98A8` (secondary)

### Typography
- Display: DM Serif Display
- UI: Geist
- Code: Geist Mono

### Animations
- Fast: 120ms
- Default: 200ms
- Slow: 400ms

## Contributing

This is a proprietary project. For questions or issues, please contact the development team.

## License

Proprietary

---

<div align="center">

**[Website](https://seotools.com)** · **[Documentation](https://seotools.com/docs)** · **[Support](https://seotools.com/contact)**

Made with ❤️ by SEO Tools Team

</div>
