# The Lotus Foundation — Website

Marketing site for The Lotus Foundation (Home, About, Services, Contact),
built with Next.js (App Router) + Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

See [DEPLOY.md](./DEPLOY.md) for step-by-step instructions on getting this
live on lotusfoundation.info via Vercel.

## Structure

- `app/page.tsx` — Home
- `app/about/page.tsx` — About (mission, vision, Lotus Model values)
- `app/services/page.tsx` — Services (current programs, who we serve, future expansion)
- `app/contact/page.tsx` — Contact (form + info)
- `app/components/` — Header, Footer, ContactForm
- `public/lotus-logo.png` — logo asset
- Brand colors and fonts are defined in `app/globals.css`
