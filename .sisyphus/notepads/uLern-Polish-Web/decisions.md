# Decisions - uLern Polish Web Project

## [TIMESTAMP] Initialization
- Using Sisyphus orchestration system
- Created notepad structure for knowledge retention## 2026-03-22: Initial Work Plan Created

- Created initial work plan for uLern-Polish-Web project in `.sisyphus/plans/uLern-Polish-Web-initial.md`.
- Identified missing `app.js` as the primary task for the next phase.
- Prioritized gaze-based interaction and speech integration (STT/TTS) for Polish language.
- Decided to use Web Speech API for both STT and TTS to keep the project lightweight and browser-native.
- Focused on mobile VR (Google Cardboard style) as the target platform.

## [2026-03-22] app.js modular voice pipeline
- Added a modular architecture with separate controllers for UI state, Web Audio playback, SpeechRecognition STT, and external API integration.
- Bound startup to the `Rozpocznij` button so AudioContext initialization and `getUserMedia` permission flow both run within a user gesture (mobile autoplay policy safe).
- Implemented gaze flow with A-Frame cursor events: `fusing` for pre-record hints and `click` (plus `fused` fallback) to trigger recording after fuse timeout on `#avatar`.
- Centralized placeholders (OpenAI + ElevenLabs endpoints/keys) in a frozen config object to make future credential swapping low-risk.

## [2026-03-22] app.js full replacement after regression
- Replaced the incomplete 94-line scaffold with a complete modular implementation containing `UIController`, `AudioController`, `SpeechToTextController`, `ConversationalApiClient`, and `PolishVrConversationApp`.
- Standardized gaze-to-recording flow on A-Frame avatar events (`fusing`, `fused`, and fuse-driven `click` fallback) to align with `fuse-timeout="2000"` behavior.
- Kept strict placeholder-based API configuration for OpenAI Chat Completions and ElevenLabs TTS to allow easy key/endpoint swapping without refactoring runtime logic.

## [2026-03-22] app.js full modular rewrite (>500 lines)
- Rebuilt `app.js` from scratch as a full modular runtime (UI, audio, STT, gaze activation, conversational API, orchestration) instead of patching the old scaffold.
- Kept speech language hardcoded to `pl-PL`, with startup gated by `Rozpocznij` to satisfy autoplay and microphone permission constraints on mobile VR browsers.
- Added resilient network parsing and graceful fallback behavior for placeholder LLM/TTS endpoints while preserving required async `fetch()` integrations.

## [2026-03-22] Web Application Tech Stack (RESTART)
- **Framework:** Next.js (React) - Chosen for its robust ecosystem, SSR/SSG capabilities, and excellent developer experience.
- **UI Library:** shadcn/ui - Selected for high customizability, accessibility (Radix UI), and modern look without dependency bloat.
- **Styling:** Tailwind CSS - Utility-first approach for rapid UI development and consistent design.
- **State Management:** Zustand - Lightweight and performant alternative to Redux/Context for managing lesson progress and user state.
- **Validation:** Zod + React Hook Form - Industry standard for type-safe forms and data validation.
- **Testing:** Vitest + React Testing Library - Modern, fast testing suite for React components.
- **Icons:** Lucide React - Clean and consistent icon set.
