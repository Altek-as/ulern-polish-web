# uLern-Polish — Kanban Board

## 🪄 MVP (Shipped)
- [x] Express backend with OpenRouter + ElevenLabs pipeline
- [x] WebXR A-Frame VR experience with geometric avatar
- [x] Speech recognition (browser Web Speech API)
- [x] Cross-PC path fix (`process.cwd()`)
- [x] Next.js ↔ Express API proxy wired
- [x] Next.js frontend with lesson browser + exercises
- [x] Auth endpoints (Supabase Auth)
- [x] Lesson → VR context injection
- [x] AI status badge in header
- [x] `npm run dev` starts both servers

---

## 🚧 In Progress

- [x] Supabase Auth migration — **code complete, awaiting Supabase project credentials in `.env`**
- [x] Turbopack panic (`nul` reserved Windows filename) — **fixed** (file deleted, `.next` cache cleared)

---

## 📋 Next Up

### Phase 3 — STT & Polish Voice
- [ ] Replace browser Web Speech API with a real STT API
  - Option A: RunPod Whisper (use the `rpa_GRYA5VWDN1CCAVGT4FPR539NT9GTDPD7X4L4O0IC1urw46` endpoint already deployed)
  - Option B: Speechmatics or Deepgram
  - Priority: HIGH — browser SR is Chrome-only, unreliable on mobile
- [ ] Avatar voice sync: ElevenLabs `eleven_multilingual_v2` confirmed working

### Phase 4 — Polish & Polish
- [ ] Replace `users.json` with Supabase auth + Postgres
  - Real user accounts, email verification
  - Cross-device progress sync
  - OAuth (Google, Apple)
- [ ] Progress tracking DB (lesson completion, vocab mastery, quiz scores)
- [ ] Deploy Express backend to RunPod (production)
- [ ] Deploy Next.js to Vercel (production)

### Phase 5 — Content & Visuals
- [ ] Structured lesson content (15–20 lessons, not just 6)
- [ ] ComfyUI integration (RunPod endpoint) for generating lesson visuals
  - Lesson-specific avatar backgrounds
  - Scene illustrations
- [ ] Avatar artwork upgrade (from geometric → illustrated 2D, via ComfyUI or Fiverr artist)
- [ ] Pronunciation scoring (compare user STT → correct pronunciation)

---

## 💤 Backlog

- [ ] Mobile app wrapper (Capacitor/Tauri — turn WebXR into an APK)
- [ ] Offline mode (cache lessons + TTS audio)
- [ ] Gamification: streaks, XP, leaderboards
- [ ] B2B pitch deck for language schools (uLern as a white-label tool)
- [ ] Stripe integration for subscriptions / one-time purchases
- [ ] Multi-language UI (switch UI to English/Polish)

---

## 🗑️ Done / Won't Do

- [~~] ComfyUI from scratch on RunPod — **Done** (already running)
- [~~] Missing avatar PNG/GIF textures — **Won't fix** (geometric avatar is official)
- [~~] `ulern-polish-web-backup/` 43MB folder — **Deleted**
- [~~] `__dirname` hardcoded paths — **Fixed**

---

_Last updated: 2026-03-30_

---

## Changelog — 2026-03-30

### Fixed
- **`nul` Windows reserved filename in project root** — caused Turbopack panic (OS error 1: "Incorrect function") on every Next.js route. File deleted via `\\?\` namespace prefix; `.next` cache cleared.
- Supabase credentials remain placeholder — **still needs real values from Supabase dashboard** before auth will function.

### Added
- **Lessons 7–12** — Days & Time, Family, Colours & Adjectives, Shopping & Clothing, Travel & Transport, Weather & Seasons (content + vocab + exercises)
- **Interactive exercise UX** — lesson detail page exercises now require user to select/answer before revealing correct answer; multiple choice shows per-option correct/incorrect feedback
- **`AIStatusBadge` component** — created missing component imported in `app/layout.tsx`

### Known Issues (pre-existing)
- `lib/store/auth.ts` — null-safety issues on Supabase auth responses — **Fixed** (added null guards on `data.user` in login and register; TS now clean)
- `app/layout.tsx` — duplicate `lang="en"` (was noted, not yet fixed)
