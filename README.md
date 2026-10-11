# Snip — Free URL Shortener (Sprint 1 MVP)

Paste a long URL, get a short readable link like:
`yoursite.vercel.app/spotify/my-summer-playlist`

## Stack
- Frontend: plain HTML/CSS/JS (`public/index.html`)
- Backend: Vercel Serverless Functions (`api/`)
- Database: Supabase (Postgres)

## 1. Set up Supabase
1. Go to https://supabase.com → create a free account → create a new project.
2. Once created, go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → this is your `SUPABASE_URL`
   - `anon public` key → this is your `SUPABASE_ANON_KEY`

## 2. Set up the project locally
```bash
npm install
```

Create a `.env` file locally for testing (not committed to git):
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Deploy to Vercel
1. Push this project to a GitHub repo.
2. Go to https://vercel.com → New Project → import your repo.
3. In the Vercel project settings → **Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy. Every future `git push` auto-redeploys (unlimited on free tier).

## How it works
- `public/index.html` — the form where users paste a URL and optionally pick an alias
- `api/shorten.js` — creates a new short link (auto-detects platform from the URL's domain)
- `api/check-alias.js` — live-checks if `platform/alias` is already taken
- `api/redirect.js` — looks up `platform/alias` and 302-redirects to the original URL
- `vercel.json` — rewrites `/platform/alias` requests to the redirect function

## Project structure
```
url-shortener/
├── api/
│   ├── shorten.js        (POST: create short link)
│   ├── check-alias.js    (GET: check alias availability)
│   └── redirect.js       (GET: handles the actual redirect)
├── lib/
│   ├── supabase.js       (Supabase client setup)
│   └── utils.js          (platform extraction, validation helpers)
├── public/
│   └── index.html        (frontend page)
├── package.json
├── vercel.json
└── supabase-schema.sql
```

## Out of scope for this sprint (planned for later)
- Click tracking / analytics
- User accounts / login
- Link expiration
- QR code generation
