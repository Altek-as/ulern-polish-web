# Learnings - uLern-Polish Frontend MVP

## 2026-03-23 Started Plan Execution
- Plan validated by Momus: OKAY
- All referenced files exist and sections are present
- Note: QA grep checks may flag existing CDN URLs in index.html (expected)
- Note: Running on localhost:3000 defaults to Next.js app route; testers should use /index.html- Task 2: Updated <a-sky> to use 360 background image (assets/bg-store.jpg) with radius 100. HTML syntax validated successfully.
- Replaced 3D avatar entity with 2D image plane (<a-plane>) in public/index.html, preserving id, class, and position.
- Task 4: Added floating subtitle UI entity (`id="subtitlePanel"`) with two `<a-text>` elements for STT and LLM text. Positioned at `0 1 -2.5` with rotation `-15 0 0` for readability. Existing UI panel was kept intact.
## CSS Styling for A-Frame Elements
- A-Frame entities can be targeted with standard CSS selectors (IDs and classes) in `style.css` for DOM-level styling (e.g., hover effects, text shadows).
- Mobile VR responsiveness is maintained using media queries (`@media (max-width: 768px)`) to adjust padding, font sizes, and backgrounds for UI elements.
- The Polish red theme (#FF0033) and dark background (#0a0a1a) were preserved while adding new styles for the subtitle panel and avatar.
## Task 5 Visual Verification
- Verified that the page loads without JavaScript errors (only expected 404s for missing images `bg-store.jpg` and `avatar-idle.png`).
- Verified presence of `#avatar` and `#subtitlePanel` elements.
- Verified `#sttText` and `#llmText` exist and have correct colors (`#FF9900` and `#00FF99` respectively).
- Captured screenshot of the loaded page to `.sisyphus/evidence/task-5-visual-verification.png`.

## 2026-03-24 Task 7 - Avatar Texture State Manager
- Added `updateAvatarTexture(state)` in `public/app.js` with explicit mapping for `idle`, `listening`, `processing`, and `speaking` textures.
- Conversation states `greeting`, `question`, and `responding` are normalized to `speaking` so visual behavior matches voice output phases.
- Texture updates are pre-validated with `new Image()` and `onerror` fallback to idle texture to avoid runtime breaks when placeholder assets are missing.
- Integrated texture switching at the beginning of `transitionToState(newState)` to keep avatar visuals synchronized with state machine transitions.

## 2026-03-24 Task 9 - STT Text Update
- Added DOM references for `sttText` and `llmText` in `public/app.js`.
- Updated speech recognition `onresult` handler to display user transcript in `sttText` element using `setAttribute('value', 'User: ' + transcript)`.
- Verified syntax with `node -c public/app.js`.
- Updated transitionToState in public/app.js to handle clearing and setting of sttText and llmText during conversation state changes.

## Task 10: Gaze Interaction Verification
- Verified `class="clickable"` attribute is present on the `#avatar` element in `public/index.html`.
- Verified cursor fuse configuration is set to `fuse="true"` and `fuse-timeout="2000"` in `public/index.html`.
- Verified `setupGazeListeners()` in `public/app.js` correctly sets up `mouseenter` and `mouseleave` events.
- Tested gaze interaction using Playwright:
  - When the camera looks at the avatar for 2 seconds, the conversation starts.
  - When the camera looks away before the 2-second timer finishes, the gaze timer is cancelled and the conversation does not start.
- Captured evidence screenshots: `.sisyphus/evidence/task-10-gaze-test.png` and `.sisyphus/evidence/task-10-gaze-cancel.png`.
