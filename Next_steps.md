# uLern-Polish — Deep Analysis & Next Steps

## Project Status
**Two apps now unified — Next.js frontend connects to Express backend; Supabase auth ready (awaiting project setup).**

---

## 1. Architecture Overview

```
uLern-Polish-Web/
├── server.js              # Express backend (port 5000) — AI pipeline + Supabase auth
│   ├── /api/chat          → OpenRouter GPT-4o-mini (supports lessonContext)
│   ├── /api/tts           → ElevenLabs TTS
│   ├── /api/auth/login    → Supabase Auth
│   ├── /api/auth/register → Supabase Auth
│   └── serves public/     → WebXR VR experience
│
├── public/
│   ├── index.html         # VR entry point (A-Frame WebXR)
│   ├── app.js             # VR app logic (reads sessionStorage for lessonContext)
│   └── style.css
│
└── app/                   # Next.js web app (port 3000)
    ├── /lessons           # Lesson browser + AI status badge
    ├── /lessons/[id]      # Individual lesson page
    ├── /exercises         # Quiz exercises
    ├── /login, /register  # Auth pages (connected to Express API)
    ├── /progress          # Progress tracking
    ├── /level-test        # Placement test
    └── /profile           # User profile
```

**Both apps are now connected via API proxy rewrites in Next.js config + direct calls from VR frontend.**

---

## 2. Path Discrepancy Analysis

### Problem: `__dirname` is absolute, drive-specific

`server.js` uses:
```js
path.join(__dirname, 'public')      // → E:\AI projects\Projects_AI\uLern-Polish-Web\public
path.join(__dirname, 'public', 'index.html')
```

`__dirname` resolves to the **absolute path of the server.js file's directory**. If the shared path resolves to a different drive letter on PC2 (e.g., `D:\...` vs `E:\...`), the server breaks silently — assets won't load, API routes may 404.

### Fix
Use `process.cwd()` instead of `__dirname`, or use **relative paths only**:
```js
// ❌ Bad — breaks when path changes
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Good — works from any location
app.use(express.static(path.join(process.cwd(), 'public')));
```

### Problem: Asset paths in `public/app.js`

`updateAvatarTexture()` references image files that don't exist in `public/assets/`:
```js
const textureByState = {
    idle: 'assets/avatar-idle.png',        // missing
    listening: 'assets/avatar-listening.png', // missing
    processing: 'assets/avatar-thinking.png', // missing
    speaking: 'assets/avatar-talking.gif'     // missing
};
```
The `public/` folder only has `avatar-idle.svg` — no PNGs or GIFs. The texture fallback silently fails, avatar never changes appearance.

### Fix
Either create the missing assets, or remove the texture swapper and keep the geometric A-Frame avatar from `index.html`.

---

## 3. Issues Found

### Critical
| # | Issue | Location |
|---|-------|----------|
| 1 | `__dirname` used instead of `process.cwd()` — breaks cross-PC | `server.js` |
| 2 | No missing avatar image files — texture swap silently fails | `public/app.js` |
| 3 | Next.js app has **zero connection** to the AI backend — two separate apps pretending to be one | whole repo |
| 4 | ~~Auth is entirely mock (localStorage only)~~ → **Supabase Auth migration complete** — code done, needs real Supabase credentials | `lib/store/auth.ts`, `server.js` |
| 5 | API keys + Discord webhook **in plaintext `.env`** committed to git (`.env.example` exists but `.env` is not fully gitignored) | `.env` |

### Moderate
| # | Issue | Location |
|---|-------|----------|
| 6 | Two entry points: `npm run dev:frontend` (Next.js) + `npm start` (Express) — confusing dev UX | `package.json` |
| 7 | VR lesson content is **hardcoded prompts** — no structured lesson progression in the AI tutor | `public/app.js` |
| 8 | `app/page.tsx` links to `/lessons`, `/exercises`, etc. which are **empty page shells** — no real content | `app/lessons/page.tsx` etc. |
| 9 | No user progress persistence beyond localStorage | `lib/store/progress.ts` |
| 10 | No STTS (Speech-to-Text) API — relies entirely on browser Web Speech API which is Chrome-only and inconsistent on mobile | `public/app.js` |

### Minor
| # | Issue | Location |
|---|-------|----------|
| 11 | `Decysions.md` is in root but gitignored — decisions not versioned | `Decysions.md` |
| 12 | Backup folder `ulern-polish-web-backup/` is 43MB of dead weight in the repo | `ulern-polish-web-backup/` |
| 13 | `public/app.js` has both `speechIndicator` and `micIndicator` referencing same DOM element IDs — potential conflict with A-Frame | `public/index.html`, `public/app.js` |
| 14 | `app/layout.tsx` has two `lang="en"` — should be `lang="pl"` | `app/layout.tsx` |

---

## 4. What Needs to Be Built

### Phase 1: Fix Path & Dev Experience
- [x] Replace `__dirname` → `process.cwd()` in `server.js`
- [x] Fix `.gitignore` to definitively exclude `.env` (currently `.env*` pattern may be overridden by later rules)
- [x] Add `start:dev` script that runs both Next.js + Express concurrently
- [x] Create avatar asset images OR remove `updateAvatarTexture()` dead code (Option B: geometric A-Frame avatar confirmed as official)

### Phase 2: Unite the Two Apps
- [x] Next.js app should **call the Express backend** (`http://localhost:5000/api/chat`) for AI features
- [x] Add API proxy in Next.js config so `/api/chat` → Express (avoids CORS in production)
- [x] Wire up login/register to Supabase Auth on Express backend
- [x] Connect lesson selection → triggers that lesson's topic in the VR conversation engine

### Phase 3: Real Lesson Content
- [ ] Replace hardcoded `callChatAPI('Zadaj pytanie...')` prompts with structured lesson context
- [x] Each lesson should inject a lesson-specific system prompt into the conversation history
- [ ] Add lesson completion tracking (mark lesson done after N successful exchanges)

### Phase 4: Polish & Polish (language)
- [x] ~~Add user accounts + DB (Supabase)~~ — **Done** (code ready, awaiting Supabase project setup)
- [ ] Replace browser Web Speech API with a real STT API (e.g., RunPod Whisper, Speechmatics, or Deepgram)
- [ ] Progress sync across devices (Supabase Postgres)
- [ ] ComfyUI integration for generating lesson visuals (already deployed on RunPod)

---

## 5. Cross-PC Dev Setup

Since the project path is shared (OneDrive/SharePoint?), the safest approach:

1. **Never hardcode absolute paths** — already partially addressed but needs `process.cwd()` fix
2. **Use environment variables for shared config** — Discord webhook, RunPod endpoint already noted
3. **`.env.local`** for PC-specific overrides (port numbers, local API keys)
4. **Relative paths only** for any file system operations

---

## 6. Quick Wins

1. ~~Delete `ulern-polish-web-backup/` folder~~ — DONE (already deleted before this session)
2. ~~Remove dead `updateAvatarTexture()` code from `app.js`~~ — DONE (replaced with no-op `updateAvatarState()`)
3. ~~Fix `lang="pl"` in `app/layout.tsx`~~ — DONE (was already fixed before this session)
4. ~~Add `apiProxy` to `next.config.ts`~~ — DONE (already present before this session)
5. ~~Add a "Launch VR Experience" button in Next.js app~~ — DONE (added in hero section + AI status badge in header)

---

_Analysis by Rook — 2026-03-29_
