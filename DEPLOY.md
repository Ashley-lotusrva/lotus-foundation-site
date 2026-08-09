# Deploying The Lotus Foundation Website

This site is built with Next.js. It's ready to deploy — follow the steps below
to get it live on **Ashley's own Vercel account** at **lotusfoundation.info**.

## 1. Get the code into a GitHub repo

1. Create a free GitHub account if she doesn't have one: https://github.com/signup
2. Create a new repository (e.g. `lotus-foundation-site`), keep it **private**.
3. From this project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<her-username>/lotus-foundation-site.git
   git push -u origin main
   ```

## 2. Deploy on her Vercel account

1. Go to https://vercel.com/signup and sign up (easiest: "Continue with GitHub"
   using the same GitHub account from step 1).
2. Click **Add New… → Project**.
3. Import the `lotus-foundation-site` repo.
4. Framework preset auto-detects as **Next.js** — leave defaults as-is.
5. Click **Deploy**. In ~1 minute she'll get a live URL like
   `lotus-foundation-site.vercel.app`.

Because she's signing into Vercel herself and importing the repo into her own
account, she owns the project, billing, and future deploys — not you.

## 3. Point lotusfoundation.info at Vercel

The domain was purchased through Squarespace, but it doesn't need to be
hosted there. DNS (which server the domain points to) is separate from where
it was bought.

**In the Vercel project:**
1. Go to the project → **Settings → Domains**.
2. Add `lotusfoundation.info` and `www.lotusfoundation.info`.
3. Vercel will show the DNS records it needs (usually an `A` record for the
   root domain and a `CNAME` for `www`).

**In Squarespace Domains:**
1. Go to Squarespace → **Domains → lotusfoundation.info → DNS Settings**.
2. Add the records Vercel gave you (typically):
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`
   *(Vercel shows the exact current values on the Domains page — use those,
   they occasionally change.)*
3. Save. DNS changes can take anywhere from a few minutes to ~24 hours to
   fully propagate.

**Email stays untouched.** As long as email (ashley.thompson@lotusfoundation.info)
uses its own MX records — whether that's Squarespace Email, Google Workspace,
or something else — changing the A/CNAME records for the website does not
affect email delivery. Only touch the records Vercel asks for.

## 4. Future updates

Any time changes are needed, they can be made in this codebase and pushed to
GitHub (`git push`) — Vercel automatically redeploys on every push to `main`.

## Notes on the contact form

The Contact page form currently opens the visitor's email app with a
pre-filled message to ashley.thompson@lotusfoundation.info (no backend
required, works immediately). If a proper in-page submission (e.g. via
Formspree, Resend, or a database) is wanted later, that can be added without
changing anything else on the site.
