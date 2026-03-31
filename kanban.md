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

## ⚠️ Blocker

**Supabase credentials needed** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` must be added to `.env` before auth works.

---

_Last updated: 2026-03-31_
