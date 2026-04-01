# uLern-Polish — Kanban Board

## 🪄 MVP (Shipped)
- [x] Express backend with OpenRouter + ElevenLabs pipeline
- [x] WebXR A-Frame VR experience
- [x] Geometric avatar with animations
- [x] RunPod Whisper STT (MediaRecorder → base64 → Whisper → text)
- [x] Cross-PC path fix (`process.cwd()`)
- [x] Next.js ↔ Express API proxy wired
- [x] Next.js frontend with lesson browser + exercises
- [x] Auth — Supabase Auth (code complete, awaiting credentials)
- [x] Lesson → VR context injection
- [x] AI status badge in header (OpenRouter + ElevenLabs + Whisper)
- [x] `npm run dev` starts both servers
- [x] Lesson content — **20 lessons** with vocab, exercises, visual themes
- [x] Full Polish UI translation
- [x] Spaced repetition + vocabulary practice
- [x] Stripe subscription integration (code + webhooks)

---

## 🚧 In Progress

*(nothing actively being worked — awaiting Supabase credentials)*

---

## 📋 Next Up

### Deployment
- [ ] Deploy Express → RunPod (production)
- [ ] Deploy Next.js → Vercel (production)
- [ ] Add real Supabase credentials to `.env` (only blocker remaining for auth)

### Polish & Polish
- [ ] Supabase — real user accounts, email verification
- [ ] Cross-device progress sync (Supabase Postgres)
- [ ] OAuth (Google, Apple)

### Content & Visuals
- [ ] ComfyUI → lesson scene generation (backgrounds, scene illustrations)
- [ ] Avatar artwork upgrade (geometric → illustrated 2D)
- [ ] Pronunciation scoring (compare STT → correct pronunciation)

---

## 💤 Backlog

- [ ] More lesson content (20 → 30 lessons)
- [ ] Mobile APK wrapper (Capacitor/Tauri)
- [ ] Offline mode (cache lessons + TTS audio)
- [ ] Gamification: streaks, XP, leaderboards
- [ ] B2B pitch deck for language schools
- [ ] Multi-language UI toggle (PL/EN)

---

## 🗑️ Done / Won't Do

- [~~] ComfyUI from scratch on RunPod — **Done** (running)
- [~~] Missing avatar PNG/GIF textures — **Won't fix** (animated geometric avatar is official)
- [~~] `ulern-polish-web-backup/` 43MB folder — **Deleted**
- [~~] `__dirname` hardcoded paths — **Fixed**
- [~~] Browser Web Speech API — **Replaced** with RunPod Whisper STT
- [~~] bcrypt + users.json auth — **Replaced** with Supabase Auth
- [~~] `nul` Windows reserved filename crash — **Fixed**

---

## ⚠️ Blockers — What Andrzej Needs to Do

| # | Credential | Status | Action Required |
|---|-----------|--------|----------------|
| 1 | Supabase | ⚠️ URL set, anon key is a **placeholder** | Replace `sb_publishable_...` with real JWT anon key from Supabase dashboard. Create `profiles` table. |
| 2 | RunPod Whisper | ❌ All missing | Deploy Whisper on RunPod, fill API key + endpoint URL |
| 3 | ComfyUI API key | ⚠️ URL set, key missing | Add `RUNPOD_COMFY_API_KEY` to `.env` |
| 4 | Stripe Price IDs | ❌ Placeholders | Create products in Stripe dashboard, add Price IDs |
| 5 | Discord bot token | 🚨 Rotate if ever real | Check if real token was in `.env`, rotate at discord.com/developers |

See `CREDENTIALS_SETUP.md` for step-by-step instructions.

---

_Last updated: 2026-04-01_
