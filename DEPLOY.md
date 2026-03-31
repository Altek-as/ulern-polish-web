# uLern-Polish — Deployment Guide

This guide covers deploying the two parts of uLern-Polish:
1. **Express Backend** → RunPod
2. **Next.js Frontend** → Vercel

---

## Prerequisites

- [RunPod](https://runpod.io) account
- [Vercel](https://vercel.com) account (free tier works)
- [Supabase](https://supabase.com) project created
- All API keys gathered (see `.env.example`)

---

## Part 1 — Deploy Express Backend to RunPod

### Step 1: Prepare the project for Docker

Make sure these files exist in your project root:
- `Dockerfile` (already provided)
- `server.js`
- `lib/` directory
- `package.json`

### Step 2: Push to GitHub (if not already)

```bash
cd uLern-Polish-Web
git init
git add .
git commit -m "Initial commit"
gh repo create ulern-polish-backend --public --push
```

Or add as a new remote if you already have a repo.

### Step 3: Deploy to RunPod

1. Log in to [RunPod](https://runpod.io) → **Deploy** → **New Endpoint**
2. **Cloud**: Choose preferred region
3. **Docker image**: Leave blank (we'll use a template)
4. **Choose template**: Select **Docker** → paste your GitHub repo URL or upload a Docker config
5. **Container size**: Small is fine for MVP
6. **GPU**: Not needed for Express — CPU-only

#### Alternative: Deploy via GitHub Container Registry

Build and push the Docker image yourself:

```bash
# Build image
docker build -t ulern-polish-backend:latest .

# Push to GHCR or Docker Hub
docker tag ulern-polish-backend:latest ghcr.io/YOUR_USERNAME/ulern-polish-backend:latest
docker push ghcr.io/YOUR_USERNAME/ulern-polish-backend:latest
```

Then in RunPod: **Deploy** → **New Endpoint** → **Community Templates** or enter your image URI directly.

### Step 4: Configure Environment Variables in RunPod

In RunPod → your endpoint → **Environment Variables**, add:

```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://YOUR_APP_NAME.vercel.app

# OpenRouter (AI chat)
OPENROUTER_API_KEY=sk-or-v1-...

# ElevenLabs (TTS)
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Supabase Auth
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# RunPod Whisper STT (if already deployed)
RUNPOD_WHISPER_API_URL=https://YOUR_WHISPER_ENDPOINT.runpod.io/v1/transcribe
RUNPOD_WHISPER_API_KEY=...
```

### Step 5: Get your RunPod endpoint URL

Once deployed, RunPod will give you a URL like:
```
https://YOUR_ENDPOINT_ID-5000.proxy.runpod.net
```

This is your **production API base URL**. Update `vercel.json` and Vercel env vars with this.

---

## Part 2 — Deploy Next.js Frontend to Vercel

### Step 1: Update `vercel.json`

Edit `vercel.json` and replace `YOUR_RUNPOD_ENDPOINT` with your actual RunPod URL:

```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "https://YOUR_ENDPOINT_ID-5000.proxy.runpod.net/api/:path*"
  }
]
```

### Step 2: Push to GitHub (Next.js app)

If not already connected:
```bash
git init
git add .
git commit -m "Deploy to Vercel"
gh repo create ulern-polish-web --public --push
```

### Step 3: Deploy on Vercel

1. Log in to [Vercel](https://vercel.com)
2. **Add New Project** → import the `ulern-polish-web` repo
3. **Framework**: Next.js (auto-detected)
4. **Root Directory**: `.` (default)
5. **Build Command**: `npm run build`
6. **Environment Variables** — add:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_BASE_URL=https://YOUR_ENDPOINT_ID-5000.proxy.runpod.net
```

7. **Deploy**

### Step 4: Set CORS on RunPod

After Vercel deploys, add your Vercel domain to the Express backend `CORS_ORIGIN` env var on RunPod:
```
CORS_ORIGIN=https://ulern-polish-web.vercel.app
```

---

## Verifying the Deployment

1. **Backend health**: Visit `https://YOUR_RUNPOD_ENDPOINT/api/health`
   - Should return `{"status":"ok", ...}`
2. **Frontend**: Visit `https://YOUR_APP.vercel.app`
3. **API proxy**: Vercel rewrites `/api/*` → RunPod automatically

---

## Useful RunPod Commands (CLI)

```bash
# Install RunPod CLI
npm install -g runpod

# Check endpoint status
runpod endpoint list

# Logs
runpod logs YOUR_ENDPOINT_ID

# Redeploy
runpod endpoint restart YOUR_ENDPOINT_ID
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| CORS errors in browser console | Add Vercel origin to `CORS_ORIGIN` on RunPod |
| 503 on `/api/health` | Check env vars on RunPod are all set |
| Next.js build fails | Check `NEXT_PUBLIC_` vars are set in Vercel dashboard |
| Whisper STT not working | Set `RUNPOD_WHISPER_API_URL` and `_KEY` on RunPod |
| 404 on static assets | `vercel.json` rewrites may need path adjustment |
