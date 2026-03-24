# Frontend MVP for uLern-Polish WebXR (2.5D VTuber Architecture)

## TL;DR

> **Quick Summary**: Transform existing A-Frame WebXR application from 3D box avatar to 2.5D VTuber style with state-based avatar textures, 360 grocery store background, and enhanced UI for Polish language learning.
> 
> **Deliverables**: 
> - Updated `public/index.html` with 360 background, 2D avatar plane, floating subtitle UI
> - Enhanced `public/app.js` with avatar texture state manager
> - Updated `public/style.css` for new visual elements
> - `public/assets/` directory with placeholder image references
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves (Foundation → Core Logic → Integration)
> **Critical Path**: Setup assets → Update HTML → State manager → Integration tests

---

## Context

### Original Request
Build/update frontend MVP in public/ directory using "2.5D VTuber / Visual Novel" A-Frame architecture with 360 background, 2D avatar, gaze-triggered speech recognition, and backend API integration.

### Interview Summary
**Key Discussions**:
- Visual architecture: 360 equirectangular background (grocery store), flat avatar with transparency, floating subtitle UI
- State management: Avatar textures change based on conversation state (idle, listening, processing, speaking)
- Integration: Preserve existing speech recognition, backend API calls, audio playback logic
- Implementation: Vanilla JavaScript + A-Frame only, no React/Next.js

**Research Findings**:
- Existing `public/` files already have 80% functionality: speech recognition, backend integration, audio playback, gaze interaction
- Current implementation uses 3D box geometry avatar, needs conversion to 2D image plane
- Current UI has combined status text, needs separation into STT transcript and LLM response
- "Rozpocznij" overlay already implemented for autoplay bypass

### Metis Review
**Identified Gaps** (addressed):
1. **Asset directory structure**: Create `public/assets/` for images, ensure proper references
2. **Texture loading errors**: Add fallback textures or error handling for missing images
3. **State synchronization**: Ensure texture changes align with existing conversation state machine
4. **UI positioning**: Verify coordinates don't cause visual clipping or discomfort
5. **Mobile VR optimization**: Test on mobile devices for performance

---

## Work Objectives

### Core Objective
Transform the existing A-Frame WebXR application from 3D box avatar to 2.5D VTuber architecture while preserving all speech recognition, backend integration, and audio playback functionality.

### Concrete Deliverables
- `public/index.html`: Updated with 360 background (`assets/bg-store.jpg`), 2D avatar plane, floating subtitle UI
- `public/app.js`: Enhanced with avatar texture state manager and separate STT/LLM text display
- `public/style.css`: Updated for new visual elements
- Image reference structure in `public/assets/` directory

### Definition of Done
- [ ] All three files updated and tested locally
- [ ] Avatar displays correct texture for each conversation state
- [ ] STT transcript and LLM response appear in separate text elements
- [ ] 360 background loads without CORS errors
- [ ] Existing functionality preserved (speech recognition, backend calls, audio playback)

### Must Have
- 360 equirectangular background using local asset reference
- 2D avatar plane with transparent material (PNG/GIF support)
- Separate text elements for STT transcript (user) and LLM response (Polish)
- Avatar texture switching: idle, listening, processing, speaking states
- Preservation of all existing functionality

### Must NOT Have (Guardrails)
- No external image URLs (CORS avoidance)
- No breaking changes to existing speech recognition or backend integration
- No additional JavaScript frameworks (React/Next.js)
- No complex 3D models or animations beyond specified
- No removal of existing "Rozpocznij" overlay functionality

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: YES (A-Frame, browser APIs)
- **Automated tests**: None (browser testing requires agent-executed QA scenarios)
- **Framework**: Vanilla JavaScript + A-Frame 1.5.0
- **If TDD**: N/A - No unit test infrastructure

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **A-Frame VR**: Use Playwright — Load page, check A-Frame scene, verify entities
- **JavaScript Logic**: Use Bash (node -c) — Syntax check, basic validation

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.
> Target: 5-8 tasks per wave.

```
Wave 1 (Foundation — assets + HTML structure):
├── Task 1: Create assets directory structure [quick]
├── Task 2: Update index.html with 360 background [quick]
├── Task 3: Replace 3D avatar with 2D image plane [quick]
├── Task 4: Add floating subtitle UI entity [quick]
├── Task 5: Update CSS for new visual elements [quick]
└── Task 6: Verify no syntax errors [quick]

Wave 2 (Core Logic — state management + integration):
├── Task 7: Implement avatar texture state manager [deep]
├── Task 8: Integrate state manager with existing conversation states [deep]
├── Task 9: Add separate STT/LLM text display logic [unspecified-high]
├── Task 10: Ensure gaze interaction preserved [quick]
└── Task 11: Test backend integration preserved [unspecified-high]

Wave 3 (Integration — comprehensive verification):
├── Task 12: Full integration test - load page [unspecified-high]
├── Task 13: Visual verification - avatar states [visual-engineering]
├── Task 14: Functional verification - speech recognition [unspecified-high]
├── Task 15: Functional verification - backend calls [unspecified-high]
└── Task 16: Performance check - mobile VR [quick]

Critical Path: Task 1 → Task 3 → Task 7 → Task 8 → Task 12 → Task 13
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 6 (Wave 1)
```

### Dependency Matrix

- **1**: — — 2-6, 1
- **2**: 1 — 3-6, 1
- **3**: 1 — 4-6, 7-8, 1
- **4**: 1 — 5-6, 9, 1
- **5**: 1 — 6, 12, 1
- **6**: 1-5 — 7-16, 1
- **7**: 3, 6 — 8, 11, 13, 2
- **8**: 7, 6 — 9-11, 13-14, 2
- **9**: 4, 6, 8 — 10-11, 14, 2
- **10**: 6, 9 — 14, 2
- **11**: 6-9 — 14-15, 2
- **12**: 5-6 — 13-16, 3
- **13**: 7-8, 12 — 14-16, 3
- **14**: 8-11, 13 — 15-16, 3
- **15**: 11, 14 — 16, 3
- **16**: 12-15 — FINAL, 3

### Agent Dispatch Summary

- **1**: **6** — T1-T6 → `quick`
- **2**: **5** — T7 → `deep`, T8 → `deep`, T9 → `unspecified-high`, T10 → `quick`, T11 → `unspecified-high`
- **3**: **5** — T12 → `unspecified-high`, T13 → `visual-engineering`, T14 → `unspecified-high`, T15 → `unspecified-high`, T16 → `quick`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [x] 1. Create assets directory structure

  **What to do**:
  - Create `public/assets/` directory if it doesn't exist
  - Create placeholder image references in code (files will be added later by user):
    - `assets/avatar-idle.png`
    - `assets/avatar-listening.png` 
    - `assets/avatar-thinking.png`
    - `assets/avatar-talking.gif`
    - `assets/bg-store.jpg`
  - Update any configuration or documentation to reference these paths

  **Must NOT do**:
  - Download actual image files (user will provide them)
  - Use external URLs
  - Modify existing image references in other parts of codebase

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple directory creation and path updates
  - **Skills**: `[]`
    - No specialized skills needed for file system operations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-6)
  - **Blocks**: Tasks 2-6 (all depend on asset paths being defined)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/index.html:44` - Existing `<a-sky>` element reference
  - `public/app.js:49-110` - Backend API call pattern

  **Why Each Reference Matters**:
  - `public/index.html:44`: Shows current A-Frame asset reference pattern
  - `public/app.js:49-110`: Demonstrates error handling pattern for missing resources

  **Acceptance Criteria**:
  - [ ] Directory `public/assets/` exists
  - [ ] No syntax errors in any modified files

  **QA Scenarios**:

  ```
  Scenario: Verify assets directory created
    Tool: Bash
    Preconditions: None
    Steps:
      1. Check if directory exists: ls -la public/assets/
    Expected Result: Directory exists (or is created)
    Failure Indicators: Permission errors, path doesn't exist after task
    Evidence: .sisyphus/evidence/task-1-directory-created.txt

  Scenario: Verify no broken references
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Search for external URLs in public/ files: grep -r "http.*://" public/ --include="*.html" --include="*.js" --include="*.css"
      2. Check for hardcoded localhost:5000: grep -r "localhost:5000" public/
    Expected Result: No external URLs or hardcoded localhost found
    Failure Indicators: External URLs present, CORS risks
    Evidence: .sisyphus/evidence/task-1-no-external-urls.txt
  ```

  **Evidence to Capture**:
  - [ ] Directory listing: task-1-directory-created.txt
  - [ ] URL check results: task-1-no-external-urls.txt

  **Commit**: NO (group with Task 6)

- [x] 2. Update index.html with 360 background

  **What to do**:
  - Locate `<a-sky>` element in `public/index.html` (currently line 45 with `color="#0a0a1a"`)
  - Replace `color` attribute with `src="assets/bg-store.jpg"`
  - Ensure element has appropriate attributes: `radius="100"` for proper 360 display
  - Keep any existing attributes like `id` if present

  **Must NOT do**:
  - Remove existing scene structure
  - Break existing event listeners or component bindings
  - Change camera or lighting setup

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple HTML attribute modification
  - **Skills**: `[]`
    - Basic file editing skills sufficient

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-6)
  - **Blocks**: Task 12 (integration test)
  - **Blocked By**: Task 1 (asset paths)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/index.html:44-46` - Current `<a-sky>` implementation
  - `public/index.html:51-61` - Avatar entity structure for attribute patterns

  **API/Type References** (contracts to implement against):
  - A-Frame docs: `<a-sky>` supports `src` attribute for 360 images

  **Why Each Reference Matters**:
  - `public/index.html:44-46`: Current implementation to modify
  - `public/index.html:51-61`: Example of A-Frame entity with multiple attributes
  - A-Frame docs: Confirm correct attribute syntax

  **Acceptance Criteria**:
  - [ ] `<a-sky>` has `src="assets/bg-store.jpg"` attribute
  - [ ] `<a-sky>` has `radius="100"` attribute
  - [ ] No `color` attribute on `<a-sky>`
  - [ ] HTML validates without syntax errors

  **QA Scenarios**:

  ```
  Scenario: Verify background updated
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Check index.html for sky element: grep -n "a-sky" public/index.html
      2. Verify src attribute: grep -A1 -B1 "a-sky" public/index.html | grep "src="
      3. Verify no color attribute: grep -A1 -B1 "a-sky" public/index.html | grep "color="
    Expected Result: src="assets/bg-store.jpg" present, no color attribute
    Failure Indicators: Missing src, color attribute still present
    Evidence: .sisyphus/evidence/task-2-sky-updated.txt

  Scenario: Check HTML syntax
    Tool: Bash
    Preconditions: Task complete
    Steps:
      1. Quick syntax check: grep -q "<a-sky.*src=" public/index.html && echo "OK" || echo "FAIL"
    Expected Result: "OK" output
    Failure Indicators: "FAIL" output or syntax error
    Evidence: .sisyphus/evidence/task-2-html-syntax.txt
  ```

  **Evidence to Capture**:
  - [ ] Sky element check: task-2-sky-updated.txt
  - [ ] Syntax check: task-2-html-syntax.txt

  **Commit**: NO (group with Task 6)

- [x] 3. Replace 3D avatar with 2D image plane

  **What to do**:
  - Locate avatar entity in `public/index.html` (currently lines 51-61, `<a-entity id="avatar">`)
  - Replace entire `<a-entity>` with `<a-plane>` element:
    - `id="avatar"`
    - `class="clickable"`
    - `position="0 1.6 -3"`
    - `width="1" height="2"`
    - `src="assets/avatar-idle.png"`
    - `transparent="true"` (for PNG/GIF transparency)
    - `side="double"` (visible from both sides)
  - Remove geometry, material, animation, and face-drawing child elements
  - Ensure `clickable` class preserved for gaze interaction

  **Must NOT do**:
  - Break event listeners (`mouseenter`, `mouseleave`, `click`)
  - Remove `id="avatar"` or `class="clickable"`
  - Change position from `"0 1.6 -3"`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI/visual element creation and positioning
  - **Skills**: `[]`
    - A-Frame knowledge helpful but not required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-2, 4-6)
  - **Blocks**: Tasks 7-8, 13 (state manager, visual verification)
  - **Blocked By**: Task 1 (asset paths)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/index.html:51-61` - Current avatar structure to replace
  - `public/index.html:65-78` - UI panel example using `<a-plane>`

  **API/Type References** (contracts to implement against):
  - A-Frame docs: `<a-plane>` supports `src`, `transparent`, `side` attributes

  **External References** (libraries and frameworks):
  - A-Frame documentation: Plane primitive with textures

  **Why Each Reference Matters**:
  - `public/index.html:51-61`: Exact element to replace
  - `public/index.html:65-78`: Example of correct `<a-plane>` usage in same file
  - A-Frame docs: Confirm attribute names and values

  **Acceptance Criteria**:
  - [ ] Avatar is `<a-plane>` not `<a-entity>`
  - [ ] Has `src="assets/avatar-idle.png"` attribute
  - [ ] Has `transparent="true"` and `side="double"` attributes
  - [ ] Position remains `"0 1.6 -3"`
  - [ ] `id="avatar"` and `class="clickable"` preserved
  - [ ] No geometry/material/animation attributes

  **QA Scenarios**:

  ```
  Scenario: Verify avatar is a-plane element
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Check for a-plane with id avatar: grep -n 'id="avatar"' public/index.html
      2. Verify element type: grep -B2 -A2 'id="avatar"' public/index.html | grep "a-plane"
      3. Check attributes: grep -A5 'id="avatar"' public/index.html | grep -E "src=|transparent=|side="
    Expected Result: a-plane element with correct attributes
    Failure Indicators: Wrong element type, missing attributes
    Evidence: .sisyphus/evidence/task-3-avatar-plane.txt

  Scenario: Verify no 3D geometry remains
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Check for removed attributes: grep -n "geometry=" public/index.html | grep -i avatar
      2. Check for material attribute: grep -n "material=" public/index.html | grep -i avatar
      3. Check for animation attribute: grep -n "animation=" public/index.html | grep -i avatar
    Expected Result: No geometry/material/animation on avatar
    Failure Indicators: 3D attributes still present
    Evidence: .sisyphus/evidence/task-3-no-3d-attributes.txt
  ```

  **Evidence to Capture**:
  - [ ] Avatar element check: task-3-avatar-plane.txt
  - [ ] 3D attribute check: task-3-no-3d-attributes.txt

  **Commit**: NO (group with Task 6)

- [x] 4. Add floating subtitle UI entity

  **What to do**:
  - Locate UI panel in `public/index.html` (currently lines 64-78, `id="uiPanel"`)
  - Create new `<a-entity>` for subtitles:
    - `id="subtitlePanel"`
    - `position="0 1 -2.5"`
    - `rotation="-15 0 0"` (tilted up for readability)
    - `visible="true"`
  - Add two `<a-text>` child elements:
    - STT transcript: `id="sttText"`, `value="User: "`, `color="#FF9900"`, `width="2"`
    - LLM response: `id="llmText"`, `value="Assistant: "`, `color="#00FF99"`, `width="2"`
  - Position texts vertically: STT at `position="0 0.2 0.01"`, LLM at `position="0 -0.2 0.01"`
  - Keep existing UI panel intact (for status/hints)

  **Must NOT do**:
  - Remove or modify existing UI panel
  - Change existing text element IDs
  - Overlap with avatar or existing UI

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI layout and positioning in 3D space
  - **Skills**: `[]`
    - A-Frame UI design experience helpful

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-3, 5-6)
  - **Blocks**: Task 9 (text display logic)
  - **Blocked By**: None (independent)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/index.html:64-78` - Existing UI panel structure
  - `public/index.html:66-69` - `<a-text>` element examples

  **API/Type References** (contracts to implement against):
  - A-Frame docs: `<a-text>` attributes and positioning

  **Why Each Reference Matters**:
  - `public/index.html:64-78`: Template for creating floating UI entities
  - `public/index.html:66-69`: Correct `<a-text>` syntax with positioning
  - A-Frame docs: Text width, color, alignment options

  **Acceptance Criteria**:
  - [ ] Subtitle entity with `id="subtitlePanel"` exists
  - [ ] Correct position and rotation attributes
  - [ ] Two `<a-text>` elements with IDs `sttText` and `llmText`
  - [ ] Text colors distinct (orange for user, green for assistant)
  - [ ] Existing UI panel unchanged

  **QA Scenarios**:

  ```
  Scenario: Verify subtitle panel created
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Check for subtitlePanel: grep -n 'id="subtitlePanel"' public/index.html
      2. Verify position and rotation: grep -A3 'id="subtitlePanel"' public/index.html | grep -E "position=|rotation="
      3. Check for text elements: grep -A10 'id="subtitlePanel"' public/index.html | grep -c "a-text"
    Expected Result: Entity with correct position/rotation, 2 text elements
    Failure Indicators: Missing entity, wrong position, missing text elements
    Evidence: .sisyphus/evidence/task-4-subtitle-panel.txt

  Scenario: Verify text elements have correct IDs
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Check for sttText: grep -n 'id="sttText"' public/index.html
      2. Check for llmText: grep -n 'id="llmText"' public/index.html
      3. Verify colors: grep -B1 -A1 'id="sttText"' public/index.html | grep "color"
      4. Verify colors: grep -B1 -A1 'id="llmText"' public/index.html | grep "color"
    Expected Result: Both IDs present with distinct colors
    Failure Indicators: Missing IDs, same colors
    Evidence: .sisyphus/evidence/task-4-text-ids.txt
  ```

  **Evidence to Capture**:
  - [ ] Subtitle panel check: task-4-subtitle-panel.txt
  - [ ] Text ID check: task-4-text-ids.txt

  **Commit**: NO (group with Task 6)

- [x] 5. Update CSS for new visual elements

  **What to do**:
  - Update `public/style.css` to ensure new elements display correctly:
    - Add styles for subtitle panel if needed
    - Ensure text colors are visible against background
    - Check mobile VR responsiveness for new elements
  - No major CSS overhaul needed - only adjustments for new elements

  **Must NOT do**:
  - Rewrite entire CSS file
  - Remove existing Polish red theme
  - Break existing overlay or UI panel styles

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS styling and visual design
  - **Skills**: `[]`
    - CSS knowledge required

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4, 6)
  - **Blocks**: Task 12-13 (integration, visual verification)
  - **Blocked By**: Tasks 2-4 (elements must exist to style)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/style.css:1-212` - Existing styling patterns
  - `public/style.css:176-178` - A-Frame text styling example

  **Why Each Reference Matters**:
  - `public/style.css:1-212`: Maintain consistent styling approach
  - `public/style.css:176-178`: Example of A-Frame specific styling

  **Acceptance Criteria**:
  - [ ] CSS file loads without errors
  - [ ] New elements are visible and legible
  - [ ] Mobile responsiveness maintained

  **QA Scenarios**:

  ```
  Scenario: Verify CSS syntax
    Tool: Bash
    Preconditions: Task complete
    Steps:
      1. Quick CSS validation: csslint --format=text public/style.css 2>&1 | head -20
    Expected Result: No critical syntax errors
    Failure Indicators: CSS syntax errors
    Evidence: .sisyphus/evidence/task-5-css-syntax.txt

  Scenario: Check new element references in CSS
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Look for subtitle panel styles: grep -i "subtitle" public/style.css
      2. Check text color definitions: grep -i "#FF9900\|#00FF99" public/style.css
    Expected Result: Styles for new elements present
    Failure Indicators: No styles for new elements
    Evidence: .sisyphus/evidence/task-5-css-styles.txt
  ```

  **Evidence to Capture**:
  - [ ] CSS syntax check: task-5-css-syntax.txt
  - [ ] Style check: task-5-css-styles.txt

  **Commit**: NO (group with Task 6)

- [x] 6. Verify no syntax errors

  **What to do**:
  - Run syntax checks on all modified files:
    - `node -c public/app.js` (JavaScript syntax)
    - `html5validator --root public/ --index index.html` or equivalent check
    - Check for broken references in HTML/CSS
  - Fix any syntax errors found

  **Must NOT do**:
  - Modify functionality beyond fixing syntax
  - Change business logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple validation checks
  - **Skills**: `[]`
    - Basic syntax checking skills

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-5)
  - **Blocks**: All Wave 2 tasks (7-11)
  - **Blocked By**: Tasks 1-5 (need files to check)

  **References**:

  **Pattern References** (existing code to follow):
  - Existing app.js already has valid syntax
  - Existing index.html already valid

  **Why Each Reference Matters**:
  - Baseline for expected syntax quality

  **Acceptance Criteria**:
  - [ ] JavaScript syntax passes `node -c`
  - [ ] HTML has no obvious syntax errors
  - [ ] All asset references valid (no 404s in console)

  **QA Scenarios**:

  ```
  Scenario: Verify JavaScript syntax
    Tool: Bash
    Preconditions: Tasks 1-5 complete
    Steps:
      1. Check app.js syntax: node -c public/app.js
    Expected Result: No syntax errors
    Failure Indicators: Syntax error output
    Evidence: .sisyphus/evidence/task-6-js-syntax.txt

  Scenario: Check asset references
    Tool: Bash (grep)
    Preconditions: Tasks 1-5 complete
    Steps:
      1. Find all asset references: grep -r "assets/" public/ --include="*.html" --include="*.js" --include="*.css"
      2. Check paths exist: while read -r line; do echo "$line"; done < <(grep -r "assets/" public/ --include="*.html" --include="*.js" --include="*.css" | grep -o "assets/[^\"]*" | sort -u)
    Expected Result: Asset paths follow consistent pattern
    Failure Indicators: Broken or malformed paths
    Evidence: .sisyphus/evidence/task-6-asset-refs.txt
  ```

  **Evidence to Capture**:
  - [ ] JS syntax check: task-6-js-syntax.txt
  - [ ] Asset reference check: task-6-asset-refs.txt

  **Commit**: YES (first commit point)
  - Message: `feat(frontend): 2.5D VTuber visual foundation`
  - Files: `public/index.html, public/style.css, public/assets/`
  - Pre-commit: `node -c public/app.js`

- [x] 7. Implement avatar texture state manager

  **What to do**:
  - In `public/app.js`, create function `updateAvatarTexture(state)` that:
    - Maps states to image paths:
      - `'idle'` → `'assets/avatar-idle.png'`
      - `'listening'` → `'assets/avatar-listening.png'`
      - `'processing'` → `'assets/avatar-thinking.png'`
      - `'speaking'` → `'assets/avatar-talking.gif'`
    - Gets avatar element: `document.querySelector('#avatar')` or `document.getElementById('avatar')`
    - Updates `src` attribute: `avatar.setAttribute('src', imagePath)`
    - Adds error handling: if image fails to load, fall back to idle texture and log error
  - Integrate with existing `transitionToState()` function:
    - Call `updateAvatarTexture(newState)` at beginning of `transitionToState()`
    - Ensure texture updates align with conversation states (idle, greeting, question, listening, processing, responding)
  - Handle GIF animation: `avatar-talking.gif` should animate when speaking state active

  **Must NOT do**:
  - Break existing conversation state machine logic
  - Remove or modify existing state transitions
  - Add complex animation systems beyond texture switching

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Requires understanding of existing state machine and careful integration
  - **Skills**: `[]`
    - JavaScript state management experience needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 3 for avatar element, Task 6 for syntax check)
  - **Parallel Group**: Wave 2 (sequential after Wave 1)
  - **Blocks**: Tasks 8, 11, 13
  - **Blocked By**: Tasks 3, 6

  **References**:

  **Pattern References** (existing code to follow):
  - `public/app.js:115-187` - Existing `transitionToState()` function
  - `public/app.js:49-110` - Backend API call pattern for error handling
  - `public/app.js:250-267` - UI update pattern using `setAttribute()`

  **API/Type References** (contracts to implement against):
  - A-Frame Entity `setAttribute()` method for updating `src`
  - HTML `Image` object for preloading/error handling

  **Why Each Reference Matters**:
  - `public/app.js:115-187`: Integration point for texture updates
  - `public/app.js:49-110`: Error handling pattern to follow
  - `public/app.js:250-267`: Example of updating A-Frame entity attributes

  **Acceptance Criteria**:
  - [ ] `updateAvatarTexture(state)` function exists and works for all four states
  - [ ] Texture changes triggered from `transitionToState()`
  - [ ] Error handling for missing images (fallback to idle)
  - [ ] No console errors when switching textures

  **QA Scenarios**:

  ```
  Scenario: Verify texture switching function
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Check for updateAvatarTexture function: grep -n "updateAvatarTexture" public/app.js
      2. Verify state mapping: grep -A10 "updateAvatarTexture" public/app.js | grep -E "idle|listening|processing|speaking"
      3. Check integration with transitionToState: grep -B2 -A2 "updateAvatarTexture" public/app.js | grep "transitionToState"
    Expected Result: Function exists, maps states, called from transitionToState
    Failure Indicators: Missing function, incorrect mapping, no integration
    Evidence: .sisyphus/evidence/task-7-texture-function.txt

  Scenario: Test error handling
    Tool: Playwright
    Preconditions: Task complete, missing test image
    Steps:
      1. Temporarily rename assets/avatar-listening.png to test fallback
      2. Load page, trigger listening state
      3. Check console for errors
      4. Restore image name
    Expected Result: No crashes, fallback to idle texture
    Failure Indicators: JavaScript error, page crash
    Evidence: .sisyphus/evidence/task-7-error-handling.png
  ```

  **Evidence to Capture**:
  - [ ] Function verification: task-7-texture-function.txt
  - [ ] Error handling test: task-7-error-handling.png

  **Commit**: NO (group with Task 8)

- [x] 8. Integrate state manager with existing conversation states

  **What to do**:
  - Map conversation states to avatar texture states:
    - `'idle'` conversation state → `'idle'` texture
    - `'greeting'`, `'question'`, `'responding'` → `'speaking'` texture (when TTS active)
    - `'listening'` → `'listening'` texture
    - `'processing'` → `'thinking'` texture
  - Modify `transitionToState()` to call `updateAvatarTexture()` with appropriate texture state
  - Handle TTS timing: Set to `'speaking'` when audio starts, revert to `'listening'` or `'idle'` when audio ends
  - Ensure texture changes don't interfere with existing gaze interaction or microphone states

  **Must NOT do**:
  - Change conversation state logic or flow
  - Modify speech recognition or TTS timing
  - Add new conversation states

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Deep integration with existing state machine
  - **Skills**: `[]`
    - JavaScript state machine expertise

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 7)
  - **Parallel Group**: Wave 2 (sequential after Task 7)
  - **Blocks**: Tasks 9, 11, 13-14
  - **Blocked By**: Task 7

  **References**:

  **Pattern References** (existing code to follow):
  - `public/app.js:119-187` - `transitionToState()` switch statement
  - `public/app.js:344-504` - `speakPolish()` function for TTS timing
  - `public/app.js:192-246` - `processUserInput()` for processing state timing

  **Why Each Reference Matters**:
  - `public/app.js:119-187`: Exact state transitions to hook into
  - `public/app.js:344-504`: TTS start/end events for speaking texture
  - `public/app.js:192-246`: LLM processing timing for thinking texture

  **Acceptance Criteria**:
  - [ ] Avatar shows listening texture during speech recognition
  - [ ] Avatar shows thinking texture during backend API call
  - [ ] Avatar shows talking texture during TTS playback
  - [ ] Avatar returns to idle when conversation ends
  - [ ] No visual glitches or delays in texture switching

  **QA Scenarios**:

  ```
  Scenario: Verify state mapping
    Tool: Bash (grep)
    Preconditions: Task complete
    Steps:
      1. Check transitionToState modifications: grep -n "updateAvatarTexture" public/app.js | grep -B5 -A5 "transitionToState"
      2. Verify all states covered: grep -B10 -A10 "updateAvatarTexture" public/app.js | grep -E "idle|listening|processing|speaking"
    Expected Result: All conversation states trigger texture updates
    Failure Indicators: Missing states, incorrect mappings
    Evidence: .sisyphus/evidence/task-8-state-mapping.txt

  Scenario: Test visual state flow
    Tool: Playwright
    Preconditions: Task complete, page loaded
    Steps:
      1. Start conversation (gaze on avatar)
      2. Observe avatar texture changes
      3. Speak phrase to trigger backend call
      4. Observe thinking texture during API call
      5. Observe talking texture during TTS response
    Expected Result: Smooth texture transitions matching conversation flow
    Failure Indicators: Wrong textures, timing issues, missing transitions
    Evidence: .sisyphus/evidence/task-8-visual-flow.mp4
  ```

  **Evidence to Capture**:
  - [ ] State mapping check: task-8-state-mapping.txt
  - [ ] Visual flow recording: task-8-visual-flow.mp4

  **Commit**: YES (second commit point)
  - Message: `feat(frontend): Avatar state-based textures integrated`
  - Files: `public/app.js`
  - Pre-commit: `node -c public/app.js`

- [x] 9. Add separate STT/LLM text display logic

  **What to do**:
  - Modify `public/app.js` to update separate text elements (not combined status):
    - STT transcript: Update `sttText` element with user speech
    - LLM response: Update `llmText` element with Polish response
  - Update speech recognition handler (`onresult`) to set `sttText` value
  - Update backend response handler to set `llmText` value
  - Clear `sttText` after processing, keep `llmText` until next response
  - Ensure text doesn't overflow UI bounds (use `width="2"` attribute)

  **Must NOT do**:
  - Remove existing status/hint text functionality
  - Break existing UI panel updates
  - Change text element IDs defined in Task 4

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: UI logic integration requiring attention to detail
  - **Skills**: `[]`
    - JavaScript DOM manipulation experience

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 10-11, depends on Task 4)
  - **Parallel Group**: Wave 2 (parallel with Tasks 10-11)
  - **Blocks**: Task 14 (functional verification)
  - **Blocked By**: Task 4 (text elements), Task 8 (state integration)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/app.js:294-309` - Speech recognition `onresult` handler
  - `public/app.js:216-219` - Backend response handling
  - `public/app.js:250-267` - UI update pattern with `setAttribute()`

  **Why Each Reference Matters**:
  - `public/app.js:294-309`: Where to add STT text updates
  - `public/app.js:216-219`: Where to add LLM text updates
  - `public/app.js:250-267`: Correct pattern for updating A-Frame text

  **Acceptance Criteria**:
  - [ ] User speech appears in `sttText` element (orange)
  - [ ] LLM response appears in `llmText` element (green)
  - [ ] Text clears/resets appropriately
  - [ ] No interference with existing status text

  **QA Scenarios**:

  ```
  Scenario: Verify STT text updates
    Tool: Playwright
    Preconditions: Task complete, microphone access granted
    Steps:
      1. Start conversation
      2. Speak test phrase "cześć"
      3. Check sttText element value
    Expected Result: "cześć" appears in orange text element
    Failure Indicators: Text not appearing, wrong element, wrong color
    Evidence: .sisyphus/evidence/task-9-stt-text.png

  Scenario: Verify LLM text updates
    Tool: Playwright + Bash
    Preconditions: Task complete, backend responding
    Steps:
      1. Trigger backend call (speak phrase)
      2. Check llmText element value after response
      3. Verify text is green
    Expected Result: Polish response appears in green text element
    Failure Indicators: No text, wrong element, wrong color
    Evidence: .sisyphus/evidence/task-9-llm-text.png
  ```

  **Evidence to Capture**:
  - [ ] STT text screenshot: task-9-stt-text.png
  - [ ] LLM text screenshot: task-9-llm-text.png

  **Commit**: NO (group with Task 11)

- [x] 10. Ensure gaze interaction preserved

  **What to do**:
  - Verify existing gaze interaction still works with new 2D avatar:
    - 2-second gaze timer still triggers conversation start
    - Mouse enter/leave events still fire
    - Click fallback still works
  - Test with new `<a-plane>` avatar (should work same as `<a-entity>`)
  - Ensure `class="clickable"` attribute preserved on avatar element
  - Verify cursor fuse still works (2-second timeout in `index.html:82`)

  **Must NOT do**:
  - Modify gaze interaction logic unless broken
  - Change fuse timeout or event handlers
  - Break existing conversation start/stop flow

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple verification task
  - **Skills**: `[]`
    - Basic testing skills

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 11)
  - **Parallel Group**: Wave 2 (parallel with Tasks 9, 11)
  - **Blocks**: Task 14 (functional verification)
  - **Blocked By**: Task 3 (avatar element), Task 6 (syntax check)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/index.html:82` - Cursor fuse configuration
  - `public/app.js:702-796` - `setupGazeListeners()` function
  - `public/app.js:666-697` - `startConversation()` function

  **Why Each Reference Matters**:
  - `public/index.html:82`: Fuse timeout setting
  - `public/app.js:702-796`: Gaze listener implementation to verify
  - `public/app.js:666-697`: Conversation start function that should still be called

  **Acceptance Criteria**:
  - [ ] Gaze on avatar for 2 seconds starts conversation
  - [ ] Mouse leave cancels gaze timer
  - [ ] Click on avatar toggles conversation
  - [ ] All existing gaze behavior preserved

  **QA Scenarios**:

  ```
  Scenario: Test gaze interaction
    Tool: Playwright
    Preconditions: Task complete, page loaded
    Steps:
      1. Hover mouse over avatar
      2. Wait 2 seconds
      3. Verify conversation starts (status text changes, microphone active)
    Expected Result: Conversation starts after 2-second gaze
    Failure Indicators: No response, wrong timing, errors
    Evidence: .sisyphus/evidence/task-10-gaze-test.png

  Scenario: Test gaze cancellation
    Tool: Playwright
    Preconditions: Task complete, page loaded
    Steps:
      1. Hover mouse over avatar
      2. Wait 1 second
      3. Move mouse off avatar
      4. Verify conversation doesn't start
    Expected Result: Gaze timer cancels, no conversation start
    Failure Indicators: Conversation starts anyway
    Evidence: .sisyphus/evidence/task-10-gaze-cancel.png
  ```

  **Evidence to Capture**:
  - [ ] Gaze test: task-10-gaze-test.png
  - [ ] Gaze cancel test: task-10-gaze-cancel.png

  **Commit**: NO (group with Task 11)

- [ ] 11. Test backend integration preserved

  **What to do**:
  - Verify existing backend API calls still work with new UI:
    - `callBackendAPI()` function (lines 49-110) unchanged
    - POST to `/api/chat` endpoint with correct headers/body
    - Audio playback from base64 response still works
    - Error handling for failed API calls intact
  - Test with mock responses to ensure no regressions
  - Check that new text display doesn't break response parsing

  **Must NOT do**:
  - Modify backend API integration logic
  - Change request/response format
  - Break fallback phrase system

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires testing backend integration without breaking it
  - **Skills**: `[]`
    - API testing experience

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9-10)
  - **Parallel Group**: Wave 2 (parallel with Tasks 9-10)
  - **Blocks**: Task 15 (backend calls verification)
  - **Blocked By**: Tasks 7-8 (state integration), Task 9 (text display)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/app.js:49-110` - `callBackendAPI()` function
  - `public/app.js:65-71` - Fetch request configuration
  - `public/app.js:83-101` - Response parsing logic

  **Why Each Reference Matters**:
  - `public/app.js:49-110`: Core backend integration to preserve
  - `public/app.js:65-71`: Exact fetch configuration to verify unchanged
  - `public/app.js:83-101`: Response parsing to ensure still works

  **Acceptance Criteria**:
  - [ ] Backend API calls succeed with same request format
  - [ ] Audio playback from base64 response works
  - [ ] Error handling for failed calls still functional
  - [ ] Fallback phrases work when API fails

  **QA Scenarios**:

  ```
  Scenario: Test backend API call
    Tool: Bash (curl) + Playwright
    Preconditions: Task complete, backend running on localhost:5000
    Steps:
      1. Mock backend response if needed
      2. Trigger conversation that calls backend
      3. Check network request in browser devtools
      4. Verify response processed correctly
    Expected Result: API call succeeds, response handled
    Failure Indicators: Request failure, parsing error, audio playback failure
    Evidence: .sisyphus/evidence/task-11-backend-call.png

  Scenario: Test error handling
    Tool: Playwright
    Preconditions: Task complete
    Steps:
      1. Temporarily break backend (stop server or wrong endpoint)
      2. Trigger conversation
      3. Verify fallback phrases used
      4. Check console for appropriate error messages
    Expected Result: Graceful fallback, no crashes
    Failure Indicators: Crash, no fallback, missing error handling
    Evidence: .sisyphus/evidence/task-11-error-handling.png
  ```

  **Evidence to Capture**:
  - [ ] Backend call test: task-11-backend-call.png
  - [ ] Error handling test: task-11-error-handling.png

  **Commit**: YES (third commit point)
  - Message: `test(frontend): Backend integration verified`
  - Files: `public/app.js` (if any fixes needed)
  - Pre-commit: `node -c public/app.js`

- [ ] 12. Full integration test - load page

  **What to do**:
  - Comprehensive test of entire application from page load to conversation:
    - Load `index.html` in browser
    - Verify "Rozpocznij" overlay appears
    - Click button, grant microphone permission
    - Overlay disappears, A-Frame scene visible
    - 360 background loads (may show placeholder if image missing)
    - Avatar appears with idle texture
    - UI panel and subtitle panel visible
    - No JavaScript errors in console
  - Document any issues found

  **Must NOT do**:
  - Skip any steps in the user journey
  - Ignore console errors or warnings

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: End-to-end testing requiring attention to detail
  - **Skills**: `['playwright']`
    - Browser automation needed for comprehensive testing

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on all Wave 1 and Wave 2 tasks)
  - **Parallel Group**: Wave 3 (first task, sequential start)
  - **Blocks**: Tasks 13-16
  - **Blocked By**: Tasks 1-11 (all foundation and core logic)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/index.html:13-40` - Overlay structure
  - `public/app.js:618-661` - `handleStart()` function for permission flow
  - `public/index.html:43-84` - A-Frame scene structure

  **Why Each Reference Matters**:
  - `public/index.html:13-40`: Overlay to test
  - `public/app.js:618-661`: Permission flow to verify
  - `public/index.html:43-84`: Scene elements to check

  **Acceptance Criteria**:
  - [ ] Page loads without errors
  - [ ] Overlay appears and functions
  - [ ] Microphone permission requested
  - [ ] A-Frame scene loads with all elements
  - [ ] No broken image references in console

  **QA Scenarios**:

  ```
  Scenario: Full page load test
    Tool: Playwright
    Preconditions: All previous tasks complete
    Steps:
      1. Navigate to http://localhost:3000 (or file:// path)
      2. Wait for page load
      3. Check for JavaScript errors in console
      4. Verify overlay visible with "Rozpocznij" button
      5. Click button, grant microphone permission
      6. Verify overlay disappears, scene visible
      7. Check for broken image icons in scene
    Expected Result: Clean load, functional overlay, working scene
    Failure Indicators: JavaScript errors, missing elements, broken images
    Evidence: .sisyphus/evidence/task-12-page-load.mp4

  Scenario: Console error check
    Tool: Playwright
    Preconditions: All previous tasks complete
    Steps:
      1. Load page with devtools open
      2. Record all console messages (errors, warnings)
      3. Click through permission flow
      4. Gaze at avatar to start conversation
      5. Check for new errors
    Expected Result: No critical errors, only expected warnings
    Failure Indicators: Unhandled exceptions, 404s for assets
    Evidence: .sisyphus/evidence/task-12-console-log.txt
  ```

  **Evidence to Capture**:
  - [ ] Page load recording: task-12-page-load.mp4
  - [ ] Console log: task-12-console-log.txt

  **Commit**: NO (verification task only)

- [ ] 13. Visual verification - avatar states

  **What to do**:
  - Verify avatar texture changes visually match conversation states:
    - Idle state shows `avatar-idle.png`
    - Listening state shows `avatar-listening.png` (when microphone active)
    - Processing state shows `avatar-thinking.png` (during backend API call)
    - Speaking state shows `avatar-talking.gif` (during TTS playback)
  - Test each state transition:
    - Gaze → listening texture
    - Speak → thinking texture (API call)
    - Response → talking texture (TTS)
    - Audio end → listening or idle texture
  - Capture screenshots/video evidence of each state

  **Must NOT do**:
  - Modify avatar textures or state logic
  - Skip any state transitions

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual verification requiring design/UI expertise
  - **Skills**: `['playwright']`
    - Screenshot capture needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 14-16, after Task 12)
  - **Parallel Group**: Wave 3 (parallel with Tasks 14-16)
  - **Blocks**: Final verification
  - **Blocked By**: Task 12 (page loads), Tasks 7-8 (state manager)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/app.js:115-187` - `transitionToState()` for state transitions
  - Task 7 implementation - `updateAvatarTexture()` function

  **Why Each Reference Matters**:
  - `public/app.js:115-187`: State transition timing to verify
  - Task 7 implementation: Texture switching logic to test

  **Acceptance Criteria**:
  - [ ] All four avatar textures display correctly
  - [ ] Texture changes match conversation timing
  - [ ] No delays or glitches in texture switching
  - [ ] GIF animation works during speaking state

  **QA Scenarios**:

  ```
  Scenario: Verify all avatar states
    Tool: Playwright
    Preconditions: Task 12 complete, conversation functional
    Steps:
      1. Start in idle state - capture screenshot
      2. Gaze at avatar to trigger listening - capture screenshot
      3. Speak phrase to trigger processing - capture screenshot
      4. Wait for response to trigger speaking - capture screenshot
      5. Wait for audio end to return to listening - capture screenshot
    Expected Result: Correct texture for each state, smooth transitions
    Failure Indicators: Wrong texture, missing texture, delayed transitions
    Evidence: .sisyphus/evidence/task-13-avatar-states.mp4

  Scenario: Test GIF animation
    Tool: Playwright
    Preconditions: Task 12 complete
    Steps:
      1. Trigger speaking state (TTS playback)
      2. Record video of avatar for 3 seconds
      3. Verify GIF is animating (frame changes)
    Expected Result: Animated talking GIF during speaking state
    Failure Indicators: Static image, no animation
    Evidence: .sisyphus/evidence/task-13-gif-animation.mp4
  ```

  **Evidence to Capture**:
  - [ ] Avatar states video: task-13-avatar-states.mp4
  - [ ] GIF animation video: task-13-gif-animation.mp4

  **Commit**: NO (verification task only)

- [ ] 14. Functional verification - speech recognition

  **What to do**:
  - Test speech recognition functionality preserved:
    - `webkitSpeechRecognition` with `pl-PL` locale
    - 2-second gaze trigger still works
    - Transcription appears in STT text element (orange)
    - Transcription sent to backend API
    - Error handling for recognition failures
    - Microphone indicator shows during listening
  - Test edge cases:
    - No speech detected
    - Recognition errors
    - Network failures during recognition

  **Must NOT do**:
  - Modify speech recognition configuration
  - Change Polish language setting

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Functional testing of complex browser API
  - **Skills**: `['playwright']`
    - Browser automation for microphone simulation

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13, 15-16, after Task 12)
  - **Parallel Group**: Wave 3 (parallel with Tasks 13, 15-16)
  - **Blocks**: Final verification
  - **Blocked By**: Task 12 (page loads), Tasks 9-10 (text display, gaze)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/app.js:282-338` - `initializeSpeechRecognition()` function
  - `public/app.js:294-309` - `onresult` handler for transcripts
  - `public/app.js:702-796` - `setupGazeListeners()` for gaze trigger

  **Why Each Reference Matters**:
  - `public/app.js:282-338`: Speech recognition setup to verify
  - `public/app.js:294-309`: Transcript handling to test
  - `public/app.js:702-796`: Gaze trigger mechanism

  **Acceptance Criteria**:
  - [ ] Speech recognition activates on gaze
  - [ ] Polish transcription works (or simulates)
  - [ ] Transcript appears in STT text element
  - [ ] Backend receives transcribed text
  - [ ] Error handling for recognition failures

  **QA Scenarios**:

  ```
  Scenario: Test speech recognition flow
    Tool: Playwright
    Preconditions: Task 12 complete, microphone access
    Steps:
      1. Gaze at avatar to start listening
      2. Speak test phrase "dzień dobry"
      3. Verify STT text shows "dzień dobry" (or simulated)
      4. Verify backend API called with transcript
      5. Verify response received
    Expected Result: Full speech-to-response pipeline works
    Failure Indicators: No recognition, missing text, API not called
    Evidence: .sisyphus/evidence/task-14-speech-flow.mp4

  Scenario: Test recognition error handling
    Tool: Playwright
    Preconditions: Task 12 complete
    Steps:
      1. Simulate recognition error (if possible)
      2. Or test with no speech input for timeout
      3. Verify error handling works (UI shows appropriate message)
      4. Verify system doesn't crash
    Expected Result: Graceful error handling, no crashes
    Failure Indicators: Crash, unhandled exception
    Evidence: .sisyphus/evidence/task-14-error-handling.png
  ```

  **Evidence to Capture**:
  - [ ] Speech flow video: task-14-speech-flow.mp4
  - [ ] Error handling screenshot: task-14-error-handling.png

  **Commit**: NO (verification task only)

- [ ] 15. Functional verification - backend calls

  **What to do**:
  - Test backend API integration:
    - POST to `/api/chat` with correct JSON body
    - Response parsing for Polish text and audio base64
    - Audio playback via Web Audio API
    - Fallback to Web Speech API if audio fails
    - Error handling for failed API calls
    - LLM text appears in green text element
  - Test with simulated responses to verify all paths

  **Must NOT do**:
  - Modify backend integration code
  - Break existing error handling

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: API integration testing
  - **Skills**: `['playwright']`
    - Network interception for testing

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13-14, 16, after Task 12)
  - **Parallel Group**: Wave 3 (parallel with Tasks 13-14, 16)
  - **Blocks**: Final verification
  - **Blocked By**: Task 12 (page loads), Task 11 (backend integration)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/app.js:49-110` - `callBackendAPI()` function
  - `public/app.js:344-504` - `speakPolish()` function for audio playback
  - `public/app.js:216-219` - Response handling for LLM text

  **Why Each Reference Matters**:
  - `public/app.js:49-110`: Backend call logic to test
  - `public/app.js:344-504`: Audio playback to verify
  - `public/app.js:216-219`: LLM text update to check

  **Acceptance Criteria**:
  - [ ] Backend API called with correct request format
  - [ ] Polish text extracted from response
  - [ ] Audio base64 decoded and played (or fallback)
  - [ ] LLM text appears in green text element
  - [ ] Error handling works for failed calls

  **QA Scenarios**:

  ```
  Scenario: Test backend call and response
    Tool: Playwright + Network interception
    Preconditions: Task 12 complete
    Steps:
      1. Intercept /api/chat call
      2. Provide mock response with Polish text and audio base64
      3. Trigger conversation that calls backend
      4. Verify Polish text appears in llmText element
      5. Verify audio playback attempted
    Expected Result: Response processed, text displayed, audio played
    Failure Indicators: No text, no audio, parsing errors
    Evidence: .sisyphus/evidence/task-15-backend-response.png

  Scenario: Test fallback when audio fails
    Tool: Playwright
    Preconditions: Task 12 complete
    Steps:
      1. Simulate audio playback failure
      2. Trigger backend response without audio base64
      3. Verify Web Speech API fallback used
      4. Verify conversation continues
    Expected Result: Graceful fallback, conversation continues
    Failure Indicators: Crash, stuck state, no fallback
    Evidence: .sisyphus/evidence/task-15-audio-fallback.png
  ```

  **Evidence to Capture**:
  - [ ] Backend response test: task-15-backend-response.png
  - [ ] Audio fallback test: task-15-audio-fallback.png

  **Commit**: NO (verification task only)

- [ ] 16. Performance check - mobile VR

  **What to do**:
  - Test performance on mobile VR constraints:
    - Page load time on simulated mobile connection
    - Frame rate in A-Frame scene (should be >30fps)
    - Memory usage with texture switching
    - GIF animation performance impact
    - Responsive design working on mobile viewport
  - Use browser devtools for performance profiling
  - Check for any mobile-specific issues

  **Must NOT do**:
  - Optimize performance unless critical issues found
  - Change code for mobile unless broken

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Basic performance checking
  - **Skills**: `[]`
    - Basic performance assessment skills

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13-15, after Task 12)
  - **Parallel Group**: Wave 3 (parallel with Tasks 13-15)
  - **Blocks**: Final verification
  - **Blocked By**: Task 12 (page loads)

  **References**:

  **Pattern References** (existing code to follow):
  - `public/style.css:181-205` - Mobile media queries
  - `public/index.html:5` - Viewport meta tag

  **Why Each Reference Matters**:
  - `public/style.css:181-205`: Mobile responsiveness to test
  - `public/index.html:5`: Viewport setting for mobile

  **Acceptance Criteria**:
  - [ ] Page loads in under 5 seconds on 3G
  - [ ] A-Frame scene runs at >30fps
  - [ ] Texture switching doesn't cause frame drops
  - [ ] Mobile responsive design works
  - [ ] No memory leaks observed

  **QA Scenarios**:

  ```
  Scenario: Test mobile performance
    Tool: Playwright (mobile emulation)
    Preconditions: Task 12 complete
    Steps:
      1. Enable mobile emulation (iPhone 12)
      2. Load page with 3G throttling
      3. Measure load time
      4. Check frame rate in A-Frame scene
      5. Test conversation flow
    Expected Result: Acceptable performance on mobile
    Failure Indicators: Slow load, low fps, crashes
    Evidence: .sisyphus/evidence/task-16-mobile-performance.txt

  Scenario: Check responsive design
    Tool: Playwright
    Preconditions: Task 12 complete
    Steps:
      1. Test at mobile viewport (375x667)
      2. Test at tablet viewport (768x1024)
      3. Test at desktop viewport (1920x1080)
      4. Verify UI elements properly scaled
    Expected Result: Responsive design works at all sizes
    Failure Indicators: Broken layout, overlapping elements
    Evidence: .sisyphus/evidence/task-16-responsive-screenshots.png
  ```

  **Evidence to Capture**:
  - [ ] Mobile performance metrics: task-16-mobile-performance.txt
  - [ ] Responsive screenshots: task-16-responsive-screenshots.png

  **Commit**: NO (verification task only)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `node -c` on app.js, check HTML/CSS validity. Review all changed files for: syntax errors, broken references, console.log in prod, commented-out code. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Syntax [PASS/FAIL] | References [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: missing images, network errors, speech recognition failures. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1**: `feat(frontend): 2.5D VTuber architecture with state-based avatars` — public/*, npm test

---

## Success Criteria

### Verification Commands
```bash
# Load page and check for errors
curl -s http://localhost:3000 | grep -q "uLern Polish Web" && echo "HTML loaded" || echo "HTML missing"

# Check JavaScript syntax
node -c public/app.js && echo "JS syntax OK" || echo "JS syntax error"

# Verify asset references exist
ls public/assets/*.png public/assets/*.jpg public/assets/*.gif 2>/dev/null | wc -l | grep -q "[1-9]" && echo "Assets exist" || echo "Missing assets"
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent  
- [ ] All files load without errors
- [ ] Avatar textures change correctly per state
- [ ] STT and LLM text display separately
- [ ] Existing functionality preserved
