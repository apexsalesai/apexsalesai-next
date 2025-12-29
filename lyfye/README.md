# Lyfye Website

Premium, production-ready website for Lyfye - the parent R&D AI technology company.

**No VC. No ads. Just product.**

## Overview

This is a JSON-driven Next.js website built to Apple/Tesla quality standards. Every page, section, and feature is configurable through JSON files with full TypeScript validation via Zod schemas.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Validation**: Zod
- **Email**: Nodemailer (Microsoft 365 SMTP)
- **OG Images**: @vercel/og
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js ≥ 18.17.0
- npm ≥ 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
lyfye/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles + theme
│   ├── error.tsx            # Error boundary
│   ├── not-found.tsx        # 404 page
│   └── api/                 # API routes
│       ├── subscribe/       # Newsletter subscription
│       ├── contact/         # Contact form
│       └── og/              # OG image generation
├── components/              # React components
│   ├── ui/                  # Design system components
│   ├── sections/            # Page section components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── lib/                     # Utilities
│   ├── schemas/             # Zod validation schemas
│   ├── loaders/             # Content loaders
│   └── utils/               # Helper functions
├── content/                 # JSON content (EDIT HERE!)
│   ├── site.json           # Global site config
│   ├── nav.json            # Navigation
│   ├── social.json         # Social sharing
│   ├── pages/              # Page content
│   │   └── home.json
│   └── blog/               # Blog posts
├── public/                  # Static assets
└── vercel.json             # Deployment config

## Editing Content

**All content is managed through JSON files in `/content/`**

### Global Site Configuration (`content/site.json`)

Edit site name, tagline, SEO defaults, social links, contact emails.

```json
{
  "name": "Lyfye",
  "tagline": "No VC. No ads. Just product.",
  "url": "https://lyfye.com",
  ...
}
```

### Navigation (`content/nav.json`)

Configure header and footer navigation.

```json
{
  "header": {
    "nav": [...],
    "cta": {...}
  },
  "footer": {
    "sections": [...],
    "legal": [...]
  }
}
```

### Pages (`content/pages/*.json`)

Each page is a JSON file defining sections:

```json
{
  "slug": "home",
  "metadata": {
    "title": "...",
    "description": "..."
  },
  "sections": [
    {
      "type": "hero",
      "title": "...",
      "description": "...",
      ...
    }
  ]
}
```

**Available Section Types:**
- `hero` - Hero banner with title, subtitle, buttons
- `features` - Feature grid/list
- `cta` - Call-to-action section
- `grid` - Product/content grid
- `stats` - Metrics display
- `testimonials` - Customer quotes
- `faq` - Frequently asked questions
- `timeline` - Changelog/roadmap
- `content` - Rich text content
- `logoCloud` - Logo showcase

### Blog Posts (`content/blog/*.json`)

```json
{
  "slug": "post-slug",
  "title": "...",
  "description": "...",
  "content": "Full markdown or text...",
  "author": {...},
  "publishedAt": "2024-01-15",
  "category": "AI",
  "tags": ["..."]
}
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://lyfye.com
NEXT_PUBLIC_SITE_NAME=Lyfye

# Newsletter (choose one provider)
NEWSLETTER_PROVIDER=mailchimp
MAILCHIMP_API_KEY=your_key
MAILCHIMP_AUDIENCE_ID=your_id

# Contact Form (Microsoft 365 SMTP)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your_app_password
CONTACT_EMAIL_TO=contact@lyfye.com

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Newsletter Providers

**Mailchimp:**
- Get API key from Mailchimp account settings
- Find Audience ID in Audience > Settings > Audience name and defaults

**ConvertKit:**
- Get API key from ConvertKit account settings
- Find Form ID from the form URL

**HubSpot:**
- Get API key from HubSpot settings
- Portal ID from account settings

### Microsoft 365 SMTP Setup

1. Go to Microsoft 365 Admin Center
2. Create an app password for SMTP
3. Use `smtp.office365.com` with port `587`
4. Set SMTP_USER to your email and SMTP_PASSWORD to app password

## Development

```bash
# Start dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format

# Run all checks
npm run validate
```

## Building

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

## Deployment to Vercel

### Via GitHub

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel

Add all variables from `.env.local` in:
**Project Settings > Environment Variables**

## Adding New Pages

1. Create JSON file in `content/pages/your-page.json`
2. Define sections using available section types
3. Create route in `app/your-page/page.tsx`:

```tsx
import { loadPage } from '@/lib/loaders';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export default async function YourPage() {
  const pageData = await loadPage('your-page');
  return (
    <>
      {pageData.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </>
  );
}
```

## Testing

```bash
# Unit tests (JSON schema validation)
npm run test

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

## Security

- CSP headers configured in `vercel.json`
- HSTS enabled
- Rate limiting on API routes (implement as needed)
- Environment variables never exposed to client
- Schema validation on all inputs

## Performance

Target Lighthouse scores:
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95

Optimizations:
- Image optimization via Next.js Image
- Font optimization
- Route-based code splitting
- Static generation where possible

## License

UNLICENSED - Proprietary software for Lyfye Technologies

## Support

- Technical issues: [GitHub Issues](https://github.com/lyfye/lyfye/issues)
- General questions: hello@lyfye.com
- Press inquiries: press@lyfye.com
