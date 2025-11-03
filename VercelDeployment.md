# NutriGo — Vercel Deployment Guide (README2)

This document contains detailed, end-to-end instructions for deploying NutriGo on Vercel and the recommended production setup. It covers multiple options (frontend-only on Vercel + external backend, or frontend + backend on Vercel using serverless functions), environment variables, required services (Supabase, Gemini API), vercel.json rewrites, troubleshooting, and best practices.

---

## Summary / Recommendation

- Recommended: Deploy the Next.js frontend to Vercel and host the Express backend (the `backend/` folder) on a dedicated server or platform (Railway, Render, Fly, Heroku, DigitalOcean). The backend performs heavy tasks (OCR via Tesseract, calls to Gemini/LLM) which can hit Vercel serverless limits (time/memory). Host backend separately and set `BACKEND_URL` in Vercel env.

- Alternative (NOT recommended for heavy workloads): Convert your Express backend into Vercel Serverless Functions (API routes under `/api`) and deploy the entire monorepo to Vercel. This works for lightweight endpoints but may run into cold starts and execution limits for Tesseract/Gemini.

---

## What you need

1. Vercel account
2. GitHub repository (connected to Vercel for git-based deployments)
3. Supabase account and project (database and storage)
4. Google Cloud API key for Gemini (or equivalent AI provider)
5. Backend host (if deploying backend separately) — e.g., Render, Railway, Fly, or a VM

---

## Environment Variables (list exactly what to add in Vercel)

Add these environment variables to your Vercel Project (Project Settings → Environment Variables). Provide values for both "Preview" and "Production" where appropriate.

Frontend (Vercel project):
- NEXT_PUBLIC_SUPABASE_URL - e.g. `https://abcxyz.supabase.co`
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase anon/public key (safe to be public)
- BACKEND_URL - e.g. `https://api.your-backend.com` (if backend is hosted separately)
- NEXT_PUBLIC_VERCEL_ENV (optional) - Vercel sets `VERCEL_ENV` automatically

Backend (if you deploy backend separately to a host or as Vercel functions):
- PORT (if hosting on a VM)
- FRONTEND_URL (e.g. `https://your-frontend.vercel.app`)
- JWT_SECRET
- SUPABASE_URL
- SUPABASE_KEY (service_role key for server-side usage only)
- GEMINI_API_KEY (or your AI provider key)

Important security note:
- Never expose `SUPABASE_KEY` (service_role) in client-side code or `NEXT_PUBLIC_*`. Use only server-side.

---

## Option A — Recommended: Frontend on Vercel, Backend Hosted Elsewhere

Steps:
1. Deploy backend to your chosen provider (Railway/Render/Fly/etc.).
   - Ensure backend `.env` contains SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, PORT, etc.
   - Start backend and verify it responds: `curl http://<BACKEND_URL>/api/health`.
2. In the Vercel project for the frontend:
   - Set `BACKEND_URL` to point to your backend base URL.
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (these are used client-side).
3. Optional: Add rewrites in `vercel.json` so client-side requests under `/api/*` are proxied to your backend.

Example `vercel.json` (root of repo):
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "${BACKEND_URL}/api/:path*" }
  ]
}
```
Note: Vercel environment variables are not expanded in `vercel.json` at runtime when used in rewrites — instead use the actual production URL or configure rewrites via the Vercel dashboard. Another approach is to set `BACKEND_URL` and have the frontend call it directly (we use `/api/*` on the frontend only when we provide a Next.js API proxy route).

4. Connect your GitHub repo to Vercel and push a branch — Vercel will create a Preview deployment, and a Production deployment on `main` by default.

5. Validate:
   - Visit `https://your-vercel-project.vercel.app` and use the Scanner UI.
   - Confirm `/api/scan/image` requests succeed and your backend responds.

Pros:
- Heavy backend tasks run on a dedicated server without serverless timeouts.
- Easier to debug and scale the backend independently.

Cons:
- Two deployments to manage.

---

## Option B — Deploy Full App to Vercel (Serverless Functions)

If you still want to host backend on Vercel serverless functions, you must transform Express routes to Next.js API routes (or use a thin adapter). Steps:

1. Move backend handler code for each endpoint to `app/api/*` or `pages/api/*` (depending on framework) as Vercel Serverless Functions.
2. Replace any native filesystem dependencies (e.g., `tesseract.js` using worker threads or local binaries) with serverless-compatible approaches — this is often non-trivial.
3. Ensure third-party APIs (Supabase, Gemini) are set via environment variables in Vercel project settings.
4. Build and deploy. Watch logs in Vercel dashboard; serverless functions have time limits and memory limits.

Caveats:
- Tesseract and heavy image processing is generally not suitable for serverless functions due to CPU and execution time constraints.
- Gemini and network calls are fine, but total runtime may exceed limits.

---

## vercel.json examples & rewrites

If you want to add a `vercel.json` to the project root to configure rewrites or headers, here's a solid starting point:

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.your-backend.com/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

Replace `https://api.your-backend.com` with your real backend URL.

---

## Vercel Project Setup

1. Log in to Vercel and create a new project.
2. Import from GitHub and select the NutriGo repository.
3. Root Directory: the repository root (default for Next.js)
4. Framework Preset: Next.js (detected automatically)
5. Build & Output Settings (defaults are fine):
   - Build Command: `npm run build` or `next build`
   - Install Command: `npm install`
   - Output Directory: (leave empty for Next.js)
6. Environment Variables: add the vars listed earlier.

---

## Required Files / Changes

- `vercel.json` (optional but recommended for rewrites)
- Ensure your `package.json` scripts include:
  - "build": "next build"
  - "start": "next start"
  - "dev": "next dev"

- Keep `.env.example` and `backend/.env.example` updated.

---

## Storage & Uploads

- If your app uploads images to Supabase Storage, ensure you set correct CORS and Storage policies.
- If your backend writes to disk (`uploads/`), do NOT rely on ephemeral serverless file system. Use Supabase Storage, S3, or have your backend host persist files.

---

## Supabase configuration notes

- In Supabase, create the `scans` table with appropriate columns used by the backend. Make sure the anon key is used in the frontend only. Use the `service_role` key in the backend only (never exposed to the client).
- If you use Row Level Security, create the necessary policies.

---

## CI/CD & Branch Deploys

- Vercel automatically deploys Preview on each PR. Use environment variables for Preview branches (set in Vercel under "Preview Environment Variables").

---

## Monitoring, Logs & Troubleshooting

- Use Vercel's serverless function logs (in the dashboard) to inspect failing requests.
- Use your backend host's logs for heavy operations (OCR/Gemini) if you host backend externally.
- If you see `Unexpected token '<'` at the frontend, open DevTools → Network tab and inspect the failing API response — usually an HTML error page returned by the backend.

---

## Security & Best Practices

- Keep `SUPABASE_KEY` (service role) secret; set it only in backend env or Vercel server environment variables (not `NEXT_PUBLIC_`).
- Use HTTPS for `BACKEND_URL`.
- Limit file upload sizes and validate file types on both client and server.

---

## Sample Environment (recap)

Frontend (`Vercel`):
```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
BACKEND_URL=https://api.your-backend.com
```

Backend (`Render/Railway`/etc):
```
PORT=4000
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_KEY=<service-role-key>
GEMINI_API_KEY=<gemini_key>
FRONTEND_URL=https://your-vercel-app.vercel.app
JWT_SECRET=some-secret
```

---

## Frequently Asked: "Can I deploy backend as-is to Vercel?"

- Technically you can put Node/Express in serverless functions, or use a custom server, but Vercel does NOT support running a long-lived Express server in production the same way as a VM. You must adapt endpoints to be serverless or host the Express app elsewhere. Because the backend runs OCR and heavy processing, hosting it on a dedicated server (or container) is recommended.

---

## Quick Checklist before you click Deploy on Vercel

- [ ] Frontend builds locally with `npm run build`.
- [ ] Backend running on your chosen host and responding to health checks.
- [ ] Environment variables set in Vercel and backend host.
- [ ] `vercel.json` configured if you need rewrites or headers.
- [ ] Supabase tables exist and keys are correctly set.
- [ ] Upload/storage strategy verified (Supabase Storage or external S3).

---

## Support & Next Steps

If you want, I can:
- Add a `vercel.json` with an environment-specific rewrite strategy (needs final backend URL), or
- Add docs to convert a single minimal endpoint to a Vercel serverless function, or
- Create a small `deploy-backend-to-railway.md` guide with exact commands.

Tell me which option you want next and I’ll prepare it.
