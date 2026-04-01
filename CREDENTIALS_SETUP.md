# uLern-Polish — Credential Setup Guide

_Last updated: 2026-04-01_

This file tracks every external credential the app needs, what it's for, and the current status.

---

## 🚨 URGENT — Rotate Discord Bot Token

**If you ever had a real Discord bot token in `.env`, it may be exposed via OneDrive/SharePoint sync.**

1. Go to https://discord.com/developers/applications
2. Select your application → Bot → Reset Token
3. **Never put the new token in `.env`** — use environment variables on your hosting provider instead
4. Delete any copies of `.env` from cloud sync folders

---

## ✅ Already Working

| Service | Status | Notes |
|---------|--------|-------|
| OpenRouter | ✅ Configured | `sk-or-v1-...` — GPT-4o-mini works |
| ElevenLabs | ✅ Configured | Multilingual v2 voice (Rachel) |
| ComfyUI RunPod | ⚠️ URL set, key missing | Need `RUNPOD_COMFY_API_KEY` |

---

## 📋 Still Needed

### 1. Supabase (Auth + Database)

**What it does:** User accounts, email login, progress sync, subscription management.

**How to get credentials:**
1. Go to https://supabase.com → your project → Settings → API
2. Copy:
   - `Project URL` → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

**⚠️ The current anon key in `.env` (`sb_publishable_-CWCOvv...`) is a placeholder — it's NOT a real JWT token. Real Supabase keys start with `eyJ`.**

**After adding credentials, you also need to create the `profiles` table:**
```sql
-- Run this in Supabase SQL Editor
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text,
  subscription_tier text default 'free',
  subscription_status text default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Allow users to read their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Allow service role to update any profile (for Stripe webhooks)
create policy "Service role can update profiles" on profiles
  for update using (true);
```

---

### 2. RunPod Whisper (Speech-to-Text)

**What it does:** Converts spoken Polish into text for pronunciation practice.

**How to deploy:**
1. Go to https://runpod.io → Templates → Search "Whisper"
2. Deploy the "Whisper (OpenAI)" template
3. Note the endpoint URL (looks like `https://your-id-xxxx-gtw.gateway.runpod.xyz`)
4. Generate an API key in RunPod settings

**Fill in `.env`:**
```
RUNPOD_WHISPER_API_URL=https://your-endpoint-xxxx-gtw.gateway.runpod.xyz
RUNPOD_WHISPER_API_KEY=your_api_key_here
RUNPOD_WHISPER_ENDPOINT_ID=your_endpoint_id_here
```

---

### 3. ComfyUI RunPod — API Key

**The endpoint URL is already set** in `.env`:
```
RUNPOD_COMFY_API_URL=https://api.runpod.io/v2/rpa_GRYA5VWDN1CCAVGT4FPR539NT9GTDPD7X4L4O0IC1urw46
```

**What's missing:** `RUNPOD_COMFY_API_KEY`

1. Log into RunPod → https://console.runpod.io
2. Go to API Keys → Create a new key
3. Copy it to `.env`:
   ```
   RUNPOD_COMFY_API_KEY=your_runpod_api_key
   ```

**Note:** Your ComfyUI deployment may use a different gateway URL format (e.g., `https://your-endpoint-xxxx-gtw.gateway.runpod.xyz`). If the current URL doesn't work after adding the key, check your deployment URL in RunPod → Deployments and update `RUNPOD_COMFY_API_URL` accordingly.

---

### 4. Stripe (Subscriptions)

**What it does:** Handles Pro subscription payments ($9/mo or $79/yr).

**How to get Price IDs:**
1. Go to https://dashboard.stripe.com/products
2. Create two products:
   - **Pro Monthly** ($9/month) → Copy Price ID (`price_xxx`)
   - **Pro Annual** ($79/year) → Copy Price ID
3. Or use Stripe CLI for test mode:
   ```bash
   stripe products create --name="Pro Monthly" --amount=900 --currency=usd --interval=month
   stripe products create --name="Pro Annual" --amount=7900 --currency=usd --interval=year
   ```

**Fill in `.env`:**
```
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL=price_xxxxxxxxxxxxxxxxxxxx
```

**Webhook setup (required for subscriptions to work):**
```bash
stripe listen --forward-to localhost:5000/api/webhook
```
Copy the webhook signing secret to:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
```

---

## 🧪 Verification Checklist

After filling in credentials, verify each service:

```bash
# Start the server
npm run dev:backend

# Test health endpoint — should show true for configured services
curl http://localhost:5000/api/health

# Expected output:
# {
#   "status": "ok",
#   "openrouter": true,
#   "elevenlabs": true,
#   "whisper": false,    # ← false until RunPod Whisper deployed
#   "comfyui": false,    # ← false until RUNPOD_COMFY_API_KEY added
#   "supabase": false    # ← false until real Supabase JWT key added
# }
```

---

## 📁 `.env` File Locations

- **Local dev:** `E:\AI projects\Projects_AI\uLern-Polish-Web\.env`
- **RunPod (Express):** Set in RunPod deployment environment variables
- **Vercel (Next.js):** Set in Vercel dashboard → Settings → Environment Variables

**⚠️ Never commit real API keys to git.** The `.gitignore` should exclude `.env`, but verify before pushing.
