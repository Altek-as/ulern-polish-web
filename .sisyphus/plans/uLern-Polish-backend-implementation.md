# uLern-Polish Secure Backend Implementation

## TL;DR

> **Quick Summary**: Transform current vanilla HTML/JS/A-Frame frontend into a secure Node.js/Express backend with API proxying for OpenAI LLM and ElevenLabs TTS. Hide API keys server-side, add rate limiting and strict CORS, maintain MVP velocity with manual QA.
> 
> **Deliverables**: 
> - Complete backend with `/api/chat` endpoint proxying LLM→TTS sequentially
> - Static file serving of frontend from `public/` directory
> - Security: CORS (env var), rate limiting (50 req/15min per IP)
> - Updated frontend `app.js` making relative API calls to backend
> - Stripe Checkout placeholder endpoint
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Project setup → Backend core → API proxying → Frontend updates → Manual QA

---

## Context

### Original Request
Implement a secure backend for the uLern-Polish WebXR project to handle API proxying and Stripe monetization.

### Interview Summary
**Key Discussions**:
- Architecture: Separate Express server (port 5000), NOT using Next.js
- Frontend: Vanilla HTML/JS/A-Frame served from `public/` directory
- Testing: NO automated tests - manual QA for conversational loop (MVP velocity)
- Priority: Implement BOTH OpenAI LLM and ElevenLabs TTS simultaneously (sequential in `/api/chat`)
- Stripe: Checkout integration remains placeholder for now

**User Decisions**:
1. **CORS Strategy**: Environment variable `CORS_ORIGIN` (default: `http://localhost:5000`)
2. **Config Handling**: No `config.js` exposure - all API keys in backend `.env`
3. **Assets**: Only `index.html`, `app.js`, `style.css` moved to `public/`
4. **Directory**: Transform current `uLern-Polish-Web` folder into root Node.js project

**Research Findings**:
- Frontend `app.js` has `callLLMAPI()` (lines 48-165) and `callExternalTTS()` (lines 500-599)
- Uses `window.uLernConfig` from `config.js` with API key placeholders
- OpenAI format: POST to `/chat/completions` with `Authorization: Bearer {key}`
- ElevenLabs format: POST to `/text-to-speech/{voiceId}` with `xi-api-key` header
- Sequential flow: user input → LLM → Polish text → TTS → audio

### Metis Review
*Metis consultation timed out - proceeding with self-review*

---

## Work Objectives

### Core Objective
Create a secure backend that proxies LLM and TTS API calls to hide API keys from the frontend, while serving the existing WebXR frontend statically.

### Concrete Deliverables
1. `package.json` with dependencies: express, cors, dotenv, express-rate-limit
2. `server.js` with:
   - Static file serving from `public/` directory
   - `/api/chat` endpoint handling sequential LLM→TTS proxying
   - `/create-checkout-session` placeholder endpoint
   - Health check endpoint
   - Strict CORS (from `CORS_ORIGIN` env var)
   - Rate limiting (50 requests/15 minutes per IP)
3. `.env` and `.env.example` files for configuration
4. Updated frontend `app.js` making relative API calls (`fetch('/api/chat')`)
5. `public/` directory with `index.html`, `app.js`, `style.css`

### Definition of Done
- [ ] Backend serves frontend at `http://localhost:5000`
- [ ] `POST /api/chat` accepts user input, proxies to OpenAI, then ElevenLabs, returns audio URL/stream
- [ ] Frontend successfully completes conversational loop (input → LLM → TTS → audio playback)
- [ ] API keys never exposed to browser
- [ ] Rate limiting and CORS security active

### Must Have
- Hide OpenAI and ElevenLabs API keys server-side
- Strict CORS configuration (no wildcards)
- Rate limiting protection
- Sequential LLM→TTS flow in single endpoint
- Frontend modifications to use backend API
- Manual QA of conversational loop

### Must NOT Have (Guardrails)
- No automated tests (MVP velocity)
- No Next.js integration (vanilla Express)
- No Stripe implementation beyond placeholder
- No exposure of `config.js` to frontend
- No wildcard CORS (`*`)
- No missing error handling for API failures

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: NO (no automated tests per user request)
- **Automated tests**: NO (manual QA only for MVP velocity)
- **Framework**: None
- **Agent-Executed QA Scenarios**: REQUIRED for every task (frontend/API testing via Playwright/tmux/curl)

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **TUI/CLI**: Use interactive_bash (tmux) — Run command, send keystrokes, validate output
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Library/Module**: Use Bash (bun/node REPL) — Import, call functions, compare output

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.
> Target: 5-8 tasks per wave. Fewer than 3 per wave (except final) = under-splitting.

```
Wave 1 (Start Immediately — project setup + file structure):
├── Task 1: Create project structure and move frontend files to public/ [quick]
├── Task 2: Generate package.json with dependencies [quick]
├── Task 3: Create server.js skeleton with security middleware [quick]
├── Task 4: Create .env and .env.example configuration files [quick]
└── Task 5: Test basic server startup and static file serving [quick]

Wave 2 (After Wave 1 — backend core implementation):
├── Task 6: Implement /api/chat endpoint placeholder with logging [quick]
├── Task 7: Implement /create-checkout-session placeholder endpoint [quick]
├── Task 8: Add health check endpoint and error handling [quick]
├── Task 9: Configure CORS from environment variable [quick]
└── Task 10: Configure rate limiting middleware [quick]

Wave 3 (After Wave 2 — API proxying implementation):
├── Task 11: Implement OpenAI LLM proxying in /api/chat [deep]
├── Task 12: Implement ElevenLabs TTS proxying (sequential after LLM) [deep]
├── Task 13: Handle API error cases and fallbacks [unspecified-high]
└── Task 14: Test /api/chat endpoint with curl [quick]

Wave 4 (After Wave 3 — frontend integration):
├── Task 15: Update app.js to remove config.js dependency [quick]
├── Task 16: Modify app.js to call backend /api/chat endpoint [quick]
├── Task 17: Test frontend-backend integration [unspecified-high]
└── Task 18: Test complete conversational loop manually [visual-engineering]

Wave 5 (After ALL tasks — verification):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA - complete conversational loop (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 3 → Task 11 → Task 12 → Task 16 → Task 18 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Wave 1)
```

### Dependency Matrix (abbreviated — show ALL tasks in your generated plan)

- **1-5**: — — 6-10, 1
- **6-10**: 1-5 — 11-14, 2
- **11-14**: 6-10 — 15-18, 3
- **15-18**: 11-14 — F1-F4, 4

> This is abbreviated for reference. YOUR generated plan must include the FULL matrix for ALL tasks.

### Agent Dispatch Summary

- **1**: **5** — T1-T5 → `quick`
- **2**: **5** — T6-T10 → `quick`
- **3**: **4** — T11 → `deep`, T12 → `deep`, T13 → `unspecified-high`, T14 → `quick`
- **4**: **4** — T15 → `quick`, T16 → `quick`, T17 → `unspecified-high`, T18 → `visual-engineering`
- **5**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

---

- [x] 1. Create project structure and move frontend files to public/

  **What to do**:
  - Create `public/` directory if it doesn't exist
  - Move existing frontend files to `public/` directory:
    - `index.html` → `public/index.html`
    - `app.js` → `public/app.js` 
    - `style.css` → `public/style.css`
  - Keep original files as backup (copy, don't delete)
  - Ensure `public/` directory structure is correct

  **Must NOT do**:
  - Delete original files (keep backups)
  - Modify file contents during move
  - Move unrelated files (node_modules, .git, etc.)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file operations, no complex logic
  - **Skills**: None needed for basic file operations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-5)
  - **Blocks**: Tasks 3, 5 (need public/ directory for static serving)
  - **Blocked By**: None (can start immediately)

  **References**:
  - **File References**: Current directory files (`index.html`, `app.js`, `style.css`)
  - **Pattern References**: Standard Express static file serving pattern

  **Acceptance Criteria**:
  - [ ] `public/` directory exists
  - [ ] `public/index.html`, `public/app.js`, `public/style.css` exist
  - [ ] Original files still exist as backup
  - [ ] No other files moved to `public/`

  **QA Scenarios**:

  ```
  Scenario: Verify directory structure created
    Tool: Bash (ls)
    Preconditions: In project root directory
    Steps:
      1. Run: ls -la public/
      2. Verify output shows directory exists
      3. Run: ls -la public/*.html public/*.js public/*.css
    Expected Result: Files index.html, app.js, style.css listed
    Evidence: .sisyphus/evidence/task-1-directory-structure.txt

  Scenario: Verify files moved correctly
    Tool: Bash (diff)
    Preconditions: public/ directory created
    Steps:
      1. Run: diff -q index.html public/index.html
      2. Run: diff -q app.js public/app.js
      3. Run: diff -q style.css public/style.css
    Expected Result: No differences reported (identical files)
    Evidence: .sisyphus/evidence/task-1-file-diff.txt
  ```

  **Evidence to Capture**:
  - [ ] Directory listing before/after
  - [ ] File comparison results

  **Commit**: YES (groups with Task 2-4)
  - Message: `feat(backend): initial project structure`
  - Files: `public/`
  - Pre-commit: None

- [ ] 2. Generate package.json with dependencies

  **What to do**:
  - Create `package.json` in root directory
  - Include: name, version, description, main (server.js)
  - Add scripts: `start`, `dev` (with nodemon if installed)
  - Add dependencies: `express`, `cors`, `dotenv`, `express-rate-limit`
  - Use exact versions or caret ranges (e.g., `^4.18.2`)

  **Must NOT do**:
  - Add unnecessary dependencies (no stripe yet)
  - Use wildcard versions (`*`)
  - Include private API keys

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple JSON file creation
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1,3-5)
  - **Blocks**: Task 3 (server.js needs dependencies)
  - **Blocked By**: None

  **References**:
  - **External References**: npm docs for package.json format
  - **Version References**: Check current npm registry for latest stable versions

  **Acceptance Criteria**:
  - [ ] `package.json` exists in root
  - [ ] Contains all required dependencies
  - [ ] Scripts `start` and `dev` defined
  - [ ] Main entry point set to `server.js`

  **QA Scenarios**:

  ```
  Scenario: Verify package.json created
    Tool: Bash (cat + jq)
    Preconditions: In project root directory
    Steps:
      1. Run: cat package.json
      2. Verify JSON is valid: jq . package.json > /dev/null
      3. Check dependencies: jq '.dependencies' package.json
    Expected Result: JSON valid, dependencies include express, cors, dotenv, express-rate-limit
    Evidence: .sisyphus/evidence/task-2-package-json.txt

  Scenario: Verify npm install works
    Tool: Bash (npm)
    Preconditions: package.json exists
    Steps:
      1. Run: npm install --dry-run
      2. Check exit code is 0
    Expected Result: npm dry-run succeeds (no errors)
    Evidence: .sisyphus/evidence/task-2-npm-dry-run.txt
  ```

  **Evidence to Capture**:
  - [ ] package.json content
  - [ ] npm dry-run output

  **Commit**: YES (groups with Task 1,3,4)
  - Message: `feat(backend): initial project structure`
  - Files: `package.json`
  - Pre-commit: None

- [ ] 3. Create server.js skeleton with security middleware

  **What to do**:
  - Create `server.js` with Express app
  - Import required modules: express, cors, dotenv, express-rate-limit
  - Configure CORS from environment variable `CORS_ORIGIN` (default: `http://localhost:5000`)
  - Configure rate limiting: 50 requests per 15 minutes per IP
  - Add `express.json()` middleware
  - Serve static files from `public/` directory
  - Add placeholder endpoints: `/api/chat`, `/create-checkout-session`
  - Add health check endpoint `/health`
  - Add error handling middleware

  **Must NOT do**:
  - Implement actual API proxying yet (keep placeholders)
  - Use wildcard CORS (`*`)
  - Hardcode API keys

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Template implementation from existing draft
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1,2,4,5)
  - **Blocks**: Tasks 5,11,12 (need server skeleton first)
  - **Blocked By**: Tasks 1,2 (need public/ and dependencies)

  **References**:
  - **Pattern References**: `.sisyphus/drafts/uLern-Polish-secure-backend.md:62-194` - Complete server.js code
  - **API References**: Express.js documentation for middleware setup
  - **Security References**: express-rate-limit documentation for configuration

  **Acceptance Criteria**:
  - [ ] `server.js` exists
  - [ ] Server starts without errors
  - [ ] Static files served from `public/`
  - [ ] Health endpoint returns `{status: "OK"}`
  - [ ] Placeholder endpoints return success messages

  **QA Scenarios**:

  ```
  Scenario: Verify server.js syntax
    Tool: Bash (node)
    Preconditions: package.json dependencies installed
    Steps:
      1. Run: node -c server.js
      2. Check exit code is 0
    Expected Result: Syntax check passes
    Evidence: .sisyphus/evidence/task-3-syntax-check.txt

  Scenario: Test server startup
    Tool: interactive_bash (tmux)
    Preconditions: server.js exists, dependencies installed
    Steps:
      1. Start server in background: node server.js &
      2. Wait 2 seconds
      3. Check process is running: ps aux | grep "node server.js"
      4. Kill process: pkill -f "node server.js"
    Expected Result: Server starts, process found, clean kill
    Evidence: .sisyphus/evidence/task-3-server-start.txt
  ```

  **Evidence to Capture**:
  - [ ] Syntax check output
  - [ ] Server startup logs

  **Commit**: YES (groups with Task 1,2,4)
  - Message: `feat(backend): initial express server setup`
  - Files: `server.js`
  - Pre-commit: None

- [ ] 4. Create .env and .env.example configuration files

  **What to do**:
  - Create `.env.example` with template:
    - `PORT=5000`
    - `CORS_ORIGIN=http://localhost:5000`
    - `OPENAI_API_KEY=your_openai_api_key_here`
    - `ELEVENLABS_API_KEY=your_elevenlabs_api_key_here`
    - `NODE_ENV=development`
  - Create `.env` by copying `.env.example`
  - Update `.env` with actual values for local development:
    - `PORT=5000`
    - `CORS_ORIGIN=http://localhost:5000`
    - API keys remain placeholder (will be added later)
  - Add `.env` to `.gitignore`

  **Must NOT do**:
  - Commit real API keys to git
  - Expose `.env` file in repository
  - Use production keys in development

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file creation and copying
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-3,5)
  - **Blocks**: Task 3 (server needs .env for config)
  - **Blocked By**: None

  **References**:
  - **Pattern References**: `.sisyphus/drafts/uLern-Polish-secure-backend.md:196-210` - .env.example template
  - **Security References**: Best practices for environment variables

  **Acceptance Criteria**:
  - [ ] `.env.example` exists with all required variables
  - [ ] `.env` exists (copied from .env.example)
  - [ ] `.env` in `.gitignore`
  - [ ] No real API keys committed

  **QA Scenarios**:

  ```
  Scenario: Verify environment files created
    Tool: Bash (ls + cat)
    Preconditions: In project root directory
    Steps:
      1. Run: ls -la .env .env.example
      2. Verify both files exist
      3. Check .env.example has template values: cat .env.example
      4. Check .env is not empty: cat .env
    Expected Result: Both files exist, .env.example has placeholders
    Evidence: .sisyphus/evidence/task-4-env-files.txt

  Scenario: Verify .env in .gitignore
    Tool: Bash (grep)
    Preconditions: .gitignore exists or will be created
    Steps:
      1. Run: grep -q "^\\.env$" .gitignore || echo ".env" >> .gitignore
      2. Verify: grep "^\\.env$" .gitignore
    Expected Result: .env listed in .gitignore
    Evidence: .sisyphus/evidence/task-4-gitignore.txt
  ```

  **Evidence to Capture**:
  - [ ] File listings
  - [ ] .env.example content
  - [ ] .gitignore verification

  **Commit**: YES (groups with Task 1,2,3)
  - Message: `feat(backend): initial project structure`
  - Files: `.env.example`, `.gitignore`
  - Pre-commit: None

- [ ] 5. Test basic server startup and static file serving

  **What to do**:
  - Install dependencies: `npm install`
  - Start server: `node server.js`
  - Test endpoints:
    - `GET /` - should serve index.html
    - `GET /health` - should return health status
    - `POST /api/chat` - placeholder should return success
    - `POST /create-checkout-session` - placeholder should return success
  - Verify static files are served correctly
  - Verify CORS headers present
  - Verify rate limiting headers present

  **Must NOT do**:
  - Test actual API proxying (still placeholders)
  - Modify server.js beyond bug fixes
  - Skip any security verification

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Basic server testing with curl/Playwright
  - **Skills**: `playwright` for frontend loading test

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4)
  - **Blocks**: Tasks 11,12,14 (need working server first)
  - **Blocked By**: Tasks 1-4 (need complete setup)

  **References**:
  - **API References**: Express static serving documentation
  - **Testing References**: curl command examples for API testing

  **Acceptance Criteria**:
  - [ ] Server starts on port 5000
  - [ ] Frontend loads at http://localhost:5000/
  - [ ] Health endpoint returns 200 OK
  - [ ] API placeholder endpoints return success
  - [ ] CORS headers present for configured origin
  - [ ] Rate limit headers present

  **QA Scenarios**:

  ```
  Scenario: Test server startup and basic endpoints
    Tool: Bash (curl)
    Preconditions: Server running on port 5000
    Steps:
      1. Start server: node server.js &
      2. Wait 2 seconds
      3. Test health: curl -s http://localhost:5000/health | grep -q "OK"
      4. Test static serving: curl -s http://localhost:5000/ | grep -q "<title>"
      5. Test API placeholder: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{}' | grep -q "success"
      6. Kill server: pkill -f "node server.js"
    Expected Result: All curls succeed (exit code 0)
    Evidence: .sisyphus/evidence/task-5-curl-tests.txt

  Scenario: Test frontend loads without errors
    Tool: Playwright (playwright skill)
    Preconditions: Server running on port 5000
    Steps:
      1. Navigate to http://localhost:5000/
      2. Wait for page load
      3. Check for JavaScript errors in console
      4. Take screenshot of loaded page
      5. Verify page title or heading contains expected text
    Expected Result: Page loads without errors, screenshot captured
    Evidence: .sisyphus/evidence/task-5-frontend-load.png
  ```

  **Evidence to Capture**:
  - [ ] curl test outputs
  - [ ] Playwright screenshot
  - [ ] Console error log (if any)

  **Commit**: NO (verification only)
  - Message: N/A
  - Files: None
  - Pre-commit: None

---

- [ ] 6. Implement /api/chat endpoint placeholder with logging

  **What to do**:
  - Update the `/api/chat` placeholder endpoint in `server.js`
  - Add request validation: check for `message` field in request body
  - Add detailed logging: timestamp, request body, headers, IP address
  - Return structured response with:
    - `success: true`
    - `message`: "API proxy endpoint ready for LLM/TTS integration"
    - `timestamp`: current ISO timestamp
    - `input`: echoed user message (sanitized)
  - Maintain compatibility with frontend expectations

  **Must NOT do**:
  - Implement actual API proxying to OpenAI/ElevenLabs yet
  - Expose any API keys
  - Change response structure dramatically from placeholder

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple endpoint enhancement
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-10)
  - **Blocks**: Tasks 11,12 (need endpoint structure first)
  - **Blocked By**: Tasks 3,5 (need server skeleton and testing)

  **References**:
  - **Pattern References**: Existing placeholder in `server.js` (from Task 3)
  - **Validation References**: Express request validation patterns
  - **Logging References**: Best practices for API request logging

  **Acceptance Criteria**:
  - [ ] `/api/chat` endpoint validates request body has `message` field
  - [ ] Returns 400 error if `message` missing
  - [ ] Logs requests with timestamp and IP
  - [ ] Returns structured success response

  **QA Scenarios**:

  ```
  Scenario: Test /api/chat validation
    Tool: Bash (curl)
    Preconditions: Server running
    Steps:
      1. Send request without message: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{}'
      2. Verify response status is 400
      3. Send request with message: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Cześć"}'
      4. Verify response status is 200 and contains "success": true
    Expected Result: First fails with 400, second succeeds with 200
    Evidence: .sisyphus/evidence/task-6-api-validation.txt
  ```

  **Evidence to Capture**:
  - [ ] curl command outputs
  - [ ] Server logs showing request details

  **Commit**: YES (groups with Task 7,8,9,10)
  - Message: `feat(api): enhance placeholder endpoints with validation`
  - Files: `server.js`
  - Pre-commit: None

- [ ] 7. Implement /create-checkout-session placeholder endpoint

  **What to do**:
  - Update the `/create-checkout-session` placeholder endpoint
  - Add request validation: check for required Stripe fields (email, success/cancel URLs)
  - Add logging for payment initiation attempts
  - Return structured response:
    - `success: true`
    - `message`: "Stripe checkout endpoint ready for integration"
    - `timestamp`: current ISO timestamp
    - `note`: "Will create $5.00 Language Token package checkout session"
  - Maintain placeholder status (no actual Stripe integration)

  **Must NOT do**:
  - Integrate actual Stripe SDK
  - Process real payments
  - Expose Stripe secret keys

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple endpoint enhancement
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6,8-10)
  - **Blocks**: None (independent placeholder)
  - **Blocked By**: Task 3 (need endpoint existence)

  **References**:
  - **Pattern References**: Existing placeholder in `server.js`
  - **Stripe References**: Stripe Checkout session creation API format (for future)

  **Acceptance Criteria**:
  - [ ] `/create-checkout-session` endpoint validates required fields
  - [ ] Returns 400 error if validation fails
  - [ ] Logs payment initiation attempts
  - [ ] Returns structured success response

  **QA Scenarios**:

  ```
  Scenario: Test /create-checkout-session validation
    Tool: Bash (curl)
    Preconditions: Server running
    Steps:
      1. Send invalid request: curl -X POST http://localhost:5000/create-checkout-session -H "Content-Type: application/json" -d '{}'
      2. Verify response status is 400
      3. Send valid request: curl -X POST http://localhost:5000/create-checkout-session -H "Content-Type: application/json" -d '{"email": "test@example.com", "successUrl": "http://localhost:5000/success", "cancelUrl": "http://localhost:5000/cancel"}'
      4. Verify response status is 200 and contains "success": true
    Expected Result: First fails with 400, second succeeds with 200
    Evidence: .sisyphus/evidence/task-7-checkout-validation.txt
  ```

  **Evidence to Capture**:
  - [ ] curl command outputs
  - [ ] Server logs

  **Commit**: YES (groups with Task 6,8,9,10)
  - Message: `feat(api): enhance placeholder endpoints with validation`
  - Files: `server.js`
  - Pre-commit: None

- [ ] 8. Add health check endpoint and error handling

  **What to do**:
  - Enhance `/health` endpoint to include:
    - Server uptime
    - Memory usage
    - API status (LLM/TTS connectivity placeholder)
    - Timestamp
  - Add global error handling middleware:
    - Catch unhandled errors
    - Return standardized error response
    - Log errors with stack trace (development only)
  - Add 404 handler for undefined routes
  - Ensure all errors return consistent JSON format

  **Must NOT do**:
  - Expose sensitive error details in production
  - Remove existing error handling
  - Over-engineer health checks

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Express middleware patterns
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6,7,9,10)
  - **Blocks**: Task 5 (health check already tested)
  - **Blocked By**: Task 3 (need server skeleton)

  **References**:
  - **Pattern References**: Express error handling documentation
  - **Health Check References**: Common health check patterns for microservices

  **Acceptance Criteria**:
  - [ ] `/health` returns detailed status information
  - [ ] Unhandled errors caught and return JSON error response
  - [ ] 404 routes return consistent JSON error
  - [ ] Error logging includes stack trace in development

  **QA Scenarios**:

  ```
  Scenario: Test enhanced health endpoint
    Tool: Bash (curl)
    Preconditions: Server running
    Steps:
      1. Call health endpoint: curl -s http://localhost:5000/health
      2. Verify response includes: status, uptime, timestamp
      3. Check JSON is valid
    Expected Result: Health endpoint returns 200 with detailed JSON
    Evidence: .sisyphus/evidence/task-8-health-check.txt

  Scenario: Test error handling
    Tool: Bash (curl)
    Preconditions: Server running
    Steps:
      1. Access undefined route: curl -s http://localhost:5000/nonexistent
      2. Verify response status is 404 and JSON error format
      3. Verify error message included
    Expected Result: 404 returns JSON error with "error" field
    Evidence: .sisyphus/evidence/task-8-error-handling.txt
  ```

  **Evidence to Capture**:
  - [ ] Health endpoint response
  - [ ] 404 error response

  **Commit**: YES (groups with Task 6,7,9,10)
  - Message: `feat(api): enhance placeholder endpoints with validation`
  - Files: `server.js`
  - Pre-commit: None

- [ ] 9. Configure CORS from environment variable

  **What to do**:
  - Modify CORS configuration in `server.js` to:
    - Read `CORS_ORIGIN` from environment variable
    - Default to `http://localhost:5000` if not set
    - Support comma-separated origins (e.g., "http://localhost:5000,https://production.com")
    - Parse into array for CORS middleware
    - Maintain strict origin validation (no wildcards)
  - Update `.env.example` with documentation
  - Test with different origin values

  **Must NOT do**:
  - Allow wildcard (`*`) origin
  - Break existing CORS functionality
  - Hardcode origins in code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Environment variable configuration
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6-8,10)
  - **Blocks**: Task 5 (CORS testing)
  - **Blocked By**: Task 4 (need .env file)

  **References**:
  - **Pattern References**: CORS middleware configuration documentation
  - **Environment References**: dotenv usage patterns

  **Acceptance Criteria**:
  - [ ] CORS origin configurable via `CORS_ORIGIN` env var
  - [ ] Defaults to `http://localhost:5000`
  - [ ] Supports comma-separated multiple origins
  - [ ] Returns appropriate CORS headers for configured origins

  **QA Scenarios**:

  ```
  Scenario: Test CORS configuration
    Tool: Bash (curl)
    Preconditions: Server running with CORS_ORIGIN=http://localhost:5000
    Steps:
      1. Make request with Origin header: curl -H "Origin: http://localhost:5000" -I http://localhost:5000/health
      2. Verify response includes: Access-Control-Allow-Origin: http://localhost:5000
      3. Test with disallowed origin: curl -H "Origin: http://evil.com" -I http://localhost:5000/health
      4. Verify Access-Control-Allow-Origin NOT set to evil.com
    Expected Result: CORS headers only for allowed origin
    Evidence: .sisyphus/evidence/task-9-cors-test.txt
  ```

  **Evidence to Capture**:
  - [ ] curl output with CORS headers
  - [ ] Environment variable configuration

  **Commit**: YES (groups with Task 6,7,8,10)
  - Message: `feat(security): configurable CORS from environment variable`
  - Files: `server.js`, `.env.example`
  - Pre-commit: None

- [ ] 10. Configure rate limiting middleware

  **What to do**:
  - Review and optimize rate limiting configuration in `server.js`:
    - Ensure rate limit applies globally
    - Configure custom response message
    - Set appropriate headers (`RateLimit-*`)
    - Consider excluding health endpoint from rate limiting (optional)
    - Test rate limiting behavior
  - Update documentation in code comments

  **Must NOT do**:
  - Disable rate limiting
  - Set overly restrictive limits (keep 50/15min)
  - Break existing functionality

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Middleware configuration tuning
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6-9)
  - **Blocks**: Task 5 (rate limiting testing)
  - **Blocked By**: Task 3 (need rate limiting middleware)

  **References**:
  - **Pattern References**: express-rate-limit documentation
  - **Security References**: Rate limiting best practices for APIs

  **Acceptance Criteria**:
  - [ ] Rate limiting active on all routes (except possibly health)
  - [ ] Custom response message returned when limit exceeded
  - [ ] Rate limit headers present in responses
  - [ ] Limit set to 50 requests per 15 minutes per IP

  **QA Scenarios**:

  ```
  Scenario: Test rate limiting
    Tool: Bash (curl + sleep)
    Preconditions: Server running
    Steps:
      1. Make 60 rapid requests to health endpoint: for i in {1..60}; do curl -s http://localhost:5000/health > /dev/null; done
      2. Check last response for rate limit message or 429 status
      3. Verify RateLimit headers present in normal responses
    Expected Result: After 50 requests, rate limiting triggers (may be 429 or custom message)
    Evidence: .sisyphus/evidence/task-10-rate-limit-test.txt
  ```

  **Evidence to Capture**:
  - [ ] Rate limit test output
  - [ ] Response headers showing rate limits

  **Commit**: YES (groups with Task 6,7,8,9)
  - Message: `feat(security): configure rate limiting middleware`
  - Files: `server.js`
  - Pre-commit: None

---

- [ ] 11. Implement OpenAI LLM proxying in /api/chat

  **What to do**:
  - Modify `/api/chat` endpoint in `server.js` to proxy requests to OpenAI API
  - Read `OPENAI_API_KEY` from environment variables (`.env`)
  - Construct OpenAI API request based on frontend `app.js` pattern:
    - Endpoint: `https://api.openai.com/v1/chat/completions`
    - Headers: `Authorization: Bearer ${OPENAI_API_KEY}`, `Content-Type: application/json`
    - Body: `{model: "gpt-4o-mini", messages: [{role: "system", content: systemPrompt}, {role: "user", content: userInput}], max_tokens: 150, temperature: 0.7}`
  - Use system prompt: `"Jesteś pomocnym asystentem języka polskiego. Odpowiadaj wyłącznie po polsku, używając prostego języka odpowiedniego dla początkujących. Utrzymuj odpowiedzi krótkie i zachęcające."`
  - Forward user input from request body (`req.body.message`)
  - Handle OpenAI response, extract Polish text from `choices[0].message.content`
  - Return structured response with LLM result for TTS processing

  **Must NOT do**:
  - Expose OpenAI API key in responses or logs
  - Hardcode API key in source code
  - Skip error handling for API failures
  - Change the system prompt (must match frontend expectations)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex API integration with error handling and security
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 6,10)
  - **Parallel Group**: Wave 3 (sequential with Task 12)
  - **Blocks**: Task 12 (TTS needs LLM result)
  - **Blocked By**: Tasks 6,10 (need endpoint structure and rate limiting)

  **References**:
  - **API References**: OpenAI Chat Completions API documentation
  - **Pattern References**: `app.js:48-165` - `callLLMAPI()` function for request format
  - **Security References**: Environment variable best practices for API keys

  **Acceptance Criteria**:
  - [ ] `/api/chat` forwards requests to OpenAI API
  - [ ] OpenAI API key read from `OPENAI_API_KEY` environment variable
  - [ ] System prompt matches frontend expectations (Polish language assistant)
  - [ ] Polish text extracted from OpenAI response
  - [ ] Response includes LLM result for TTS processing

  **QA Scenarios**:

  ```
  Scenario: Test OpenAI proxying (with mock/placeholder)
    Tool: Bash (curl)
    Preconditions: Server running, OPENAI_API_KEY set (can be placeholder)
    Steps:
      1. Send request to /api/chat: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Cześć, jak się masz?"}'
      2. Verify response includes LLM result field
      3. Check server logs show OpenAI API call attempt
    Expected Result: Request succeeds, response includes LLM processing indication
    Evidence: .sisyphus/evidence/task-11-openai-proxy.txt
  ```

  **Evidence to Capture**:
  - [ ] curl request/response
  - [ ] Server logs showing API call attempt

  **Commit**: YES (groups with Task 12,13)
  - Message: `feat(api): implement OpenAI LLM proxying in /api/chat`
  - Files: `server.js`
  - Pre-commit: None

- [ ] 12. Implement ElevenLabs TTS proxying (sequential after LLM)

  **What to do**:
  - Extend `/api/chat` endpoint to sequentially call ElevenLabs TTS API after LLM response
  - Read `ELEVENLABS_API_KEY` from environment variables (`.env`)
  - Construct ElevenLabs API request:
    - Endpoint: `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}`
    - Headers: `xi-api-key: ${ELEVENLABS_API_KEY}`, `Content-Type: application/json`
    - Body: `{text: polishText, model_id: "eleven_multilingual_v2", voice_settings: {stability: 0.5, similarity_boost: 0.75}}`
  - Use voice ID: `21m00Tcm4TlvDq8ikWAM` (default from frontend)
  - Pass Polish text from LLM response to TTS API
  - Handle audio response (MP3 stream or URL)
  - Return audio URL or base64-encoded audio data to frontend
  - Maintain sequential flow: user input → LLM → Polish text → TTS → audio

  **Must NOT do**:
  - Expose ElevenLabs API key
  - Call TTS before LLM completes
  - Change voice ID (must match frontend expectations)
  - Skip error handling for TTS failures

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex sequential API integration with audio handling
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 11)
  - **Parallel Group**: Wave 3 (sequential after Task 11)
  - **Blocks**: Tasks 14,16 (need complete API flow)
  - **Blocked By**: Task 11 (need LLM result)

  **References**:
  - **API References**: ElevenLabs Text-to-Speech API documentation
  - **Pattern References**: `app.js:500-599` - `callExternalTTS()` function for request format
  - **Audio References**: Handling audio streams in Express responses

  **Acceptance Criteria**:
  - [ ] `/api/chat` calls ElevenLabs API after OpenAI LLM
  - [ ] ElevenLabs API key read from `ELEVENLABS_API_KEY` environment variable
  - [ ] Correct voice ID and settings used
  - [ ] Audio response (URL or data) returned to frontend
  - [ ] Sequential flow maintained

  **QA Scenarios**:

  ```
  Scenario: Test TTS proxying (with mock/placeholder)
    Tool: Bash (curl)
    Preconditions: Server running, ELEVENLABS_API_KEY set (can be placeholder)
    Steps:
      1. Send request to /api/chat: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Dzień dobry"}'
      2. Verify response includes audio field (URL or data)
      3. Check server logs show ElevenLabs API call attempt
    Expected Result: Request succeeds, response includes audio processing indication
    Evidence: .sisyphus/evidence/task-12-tts-proxy.txt
  ```

  **Evidence to Capture**:
  - [ ] curl request/response
  - [ ] Server logs showing TTS API call attempt

  **Commit**: YES (groups with Task 11,13)
  - Message: `feat(api): implement ElevenLabs TTS proxying sequential after LLM`
  - Files: `server.js`
  - Pre-commit: None

- [ ] 13. Handle API error cases and fallbacks

  **What to do**:
  - Add comprehensive error handling to `/api/chat` endpoint:
    - OpenAI API failures (network errors, rate limits, invalid key)
    - ElevenLabs API failures
    - Malformed responses from external APIs
  - Implement fallback mechanisms:
    - LLM fallback: Return static Polish phrases if OpenAI fails (use fallback phrases from `app.js`)
    - TTS fallback: Indicate Web Speech API fallback if ElevenLabs fails
  - Log errors with appropriate severity
  - Return user-friendly error messages to frontend
  - Maintain graceful degradation (partial functionality)

  **Must NOT do**:
  - Crash server on API failures
  - Expose detailed error information to frontend in production
  - Skip fallback implementation

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex error handling and fallback logic
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 11,12)
  - **Parallel Group**: Wave 3 (after Tasks 11,12)
  - **Blocks**: Tasks 14,16 (need error handling for robust frontend)
  - **Blocked By**: Tasks 11,12 (need API integrations to handle errors)

  **References**:
  - **Pattern References**: `app.js:68-89` - Fallback phrases array
  - **Error Handling References**: Express error handling best practices
  - **Fallback References**: Graceful degradation patterns for dependent services

  **Acceptance Criteria**:
  - [ ] OpenAI failures trigger fallback Polish phrases
  - [ ] ElevenLabs failures trigger TTS fallback indication
  - [ ] Errors logged with appropriate severity
  - [ ] User-friendly error messages returned
  - [ ] Server remains stable during API failures

  **QA Scenarios**:

  ```
  Scenario: Test OpenAI failure fallback
    Tool: Bash (curl)
    Preconditions: Server running, OPENAI_API_KEY set to invalid value
    Steps:
      1. Send request to /api/chat: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Test"}'
      2. Verify response includes fallback Polish phrase
      3. Check server logs show OpenAI error and fallback triggered
    Expected Result: Request succeeds with fallback response (not crash)
    Evidence: .sisyphus/evidence/task-13-llm-fallback.txt

  Scenario: Test ElevenLabs failure fallback
    Tool: Bash (curl)
    Preconditions: Server running, ELEVENLABS_API_KEY set to invalid value
    Steps:
      1. Send request to /api/chat: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Test"}'
      2. Verify response indicates TTS fallback
      3. Check server logs show ElevenLabs error
    Expected Result: Request succeeds with TTS fallback indication
    Evidence: .sisyphus/evidence/task-13-tts-fallback.txt
  ```

  **Evidence to Capture**:
  - [ ] Error response outputs
  - [ ] Server logs showing fallback triggers

  **Commit**: YES (groups with Task 11,12)
  - Message: `feat(api): implement error handling and fallbacks for LLM/TTS`
  - Files: `server.js`
  - Pre-commit: None

- [ ] 14. Test /api/chat endpoint with curl

  **What to do**:
  - Perform comprehensive testing of the integrated `/api/chat` endpoint
  - Test scenarios:
    - Happy path: Valid input, both APIs working
    - LLM failure: OpenAI API fails, fallback triggered
    - TTS failure: ElevenLabs API fails, fallback triggered
    - Invalid input: Missing or malformed request body
    - Rate limiting: Verify rate limits apply to /api/chat
  - Use curl commands to simulate frontend requests
  - Verify response structure matches frontend expectations
  - Document test cases and results

  **Must NOT do**:
  - Skip any test scenario
  - Use real API keys if placeholders work for testing
  - Modify production code during testing

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: API testing with curl commands
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 11,12,13)
  - **Parallel Group**: Wave 3 (final task)
  - **Blocks**: Tasks 16,17 (need verified API endpoint)
  - **Blocked By**: Tasks 11,12,13 (need complete endpoint implementation)

  **References**:
  - **Testing References**: curl command options for API testing
  - **Validation References**: Expected response format from frontend `app.js`

  **Acceptance Criteria**:
  - [ ] All test scenarios pass
  - [ ] Response structure consistent across scenarios
  - [ ] Error cases handled gracefully
  - [ ] Rate limiting verified
  - [ ] Test documentation complete

  **QA Scenarios**:

  ```
  Scenario: Comprehensive /api/chat testing
    Tool: Bash (curl + jq)
    Preconditions: Server running with all API keys (can be placeholders)
    Steps:
      1. Test happy path: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Cześć"}' | jq .
      2. Test invalid input: curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{}' | jq .
      3. Test rate limiting: for i in {1..55}; do curl -s -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Test $i"}' > /dev/null; done; echo "Last response:"; curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message": "Final test"}' | jq '.'
    Expected Result: Happy path succeeds, invalid input returns 400, rate limiting triggers after 50 requests
    Evidence: .sisyphus/evidence/task-14-comprehensive-test.txt
  ```

  **Evidence to Capture**:
  - [ ] All curl command outputs
  - [ ] Rate limiting test results

  **Commit**: NO (testing only)
  - Message: N/A
  - Files: None
  - Pre-commit: None

---

- [ ] 15. Update app.js to remove config.js dependency

  **What to do**:
  - Modify `public/app.js` to remove dependency on `config.js`:
    - Remove any reference to `window.uLernConfig`
    - Remove `config.js` script tag from `index.html` (if present)
    - Hardcode necessary defaults directly in `app.js`:
      - System prompt for Polish language assistant
      - Voice ID for ElevenLabs (`21m00Tcm4TlvDq8ikWAM`)
      - Model IDs and settings (stability, similarity_boost)
    - Keep fallback phrases array (from original `app.js`)
    - Remove API key placeholders (keys now server-side)
  - Ensure frontend still functions without config.js
  - Update comments to reflect new architecture

  **Must NOT do**:
  - Leave any API key placeholders in frontend code
  - Break existing functionality
  - Remove fallback mechanisms

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Frontend code modification with straightforward changes
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 14)
  - **Parallel Group**: Wave 4 (with Tasks 16-18)
  - **Blocks**: Task 16 (need cleaned app.js before API integration)
  - **Blocked By**: Task 14 (need verified backend API)

  **References**:
  - **Pattern References**: Original `app.js` lines 48-165 (callLLMAPI) and 500-599 (callExternalTTS)
  - **Config References**: `config.js` file for default values to hardcode
  - **Architecture References**: Backend API response format from Tasks 11-13

  **Acceptance Criteria**:
  - [ ] `app.js` no longer references `window.uLernConfig`
  - [ ] Necessary defaults hardcoded (system prompt, voice ID, etc.)
  - [ ] Frontend loads without config.js errors
  - [ ] Fallback phrases array preserved

  **QA Scenarios**:

  ```
  Scenario: Verify app.js loads without config.js
    Tool: Playwright (playwright skill)
    Preconditions: Server running, index.html served
    Steps:
      1. Navigate to http://localhost:5000/
      2. Open browser console
      3. Check for errors related to config.js or uLernConfig
      4. Verify page loads successfully
    Expected Result: No config.js errors, page loads
    Evidence: .sisyphus/evidence/task-15-appjs-load.png
  ```

  **Evidence to Capture**:
  - [ ] Browser console screenshot (no errors)
  - [ ] Page load screenshot

  **Commit**: YES (groups with Task 16)
  - Message: `feat(frontend): remove config.js dependency, hardcode defaults`
  - Files: `public/app.js`, `public/index.html` (if script tag removed)
  - Pre-commit: None

- [ ] 16. Modify app.js to call backend /api/chat endpoint

  **What to do**:
  - Replace `callLLMAPI()` and `callExternalTTS()` functions in `public/app.js`:
    - Create new function `callBackendAPI(userInput)` that:
      - Sends POST request to `/api/chat` with `{message: userInput}`
      - Handles backend response containing LLM text and audio data/URL
      - Processes audio response for playback
    - Remove separate LLM and TTS API calls
    - Update UI integration to use the new unified backend call
    - Maintain error handling and fallbacks (now handled server-side)
    - Update progress indicators and user feedback
  - Ensure compatibility with backend response format (from Tasks 11-13)
  - Test that frontend can play audio from backend response

  **Must NOT do**:
  - Keep direct API calls to OpenAI/ElevenLabs
  - Expose API keys in frontend
  - Break audio playback functionality

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Frontend API integration with known backend contract
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 15)
  - **Parallel Group**: Wave 4 (with Tasks 15,17,18)
  - **Blocks**: Tasks 17,18 (need frontend-backend integration)
  - **Blocked By**: Task 15 (need cleaned app.js)

  **References**:
  - **API References**: Backend `/api/chat` endpoint response format (Tasks 11-13)
  - **Frontend References**: Original `app.js` for UI integration patterns
  - **Audio References**: Audio playback code in original `app.js`

  **Acceptance Criteria**:
  - [ ] `callLLMAPI()` and `callExternalTTS()` replaced with `callBackendAPI()`
  - [ ] Frontend sends requests to `/api/chat`
  - [ ] Audio playback works from backend response
  - [ ] Error handling maintained

  **QA Scenarios**:

  ```
  Scenario: Test frontend-backend API call
    Tool: Playwright (playwright skill)
    Preconditions: Server running, frontend loaded
    Steps:
      1. Navigate to http://localhost:5000/
      2. Enter test message in input field
      3. Click send/submit button
      4. Wait for response
      5. Verify backend API call made (check network tab)
      6. Verify UI shows processing indicators
    Expected Result: Frontend successfully calls backend API, shows response
    Evidence: .sisyphus/evidence/task-16-frontend-api-call.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of network request to /api/chat
  - [ ] Screenshot of UI with response

  **Commit**: YES (groups with Task 15)
  - Message: `feat(frontend): integrate with backend /api/chat endpoint`
  - Files: `public/app.js`
  - Pre-commit: None

- [ ] 17. Test frontend-backend integration

  **What to do**:
  - Perform comprehensive integration testing:
    - Frontend loads and renders correctly
    - User input captured and sent to backend
    - Backend processes request and returns response
    - Frontend receives response and updates UI
    - Audio playback initiated (if audio data provided)
    - Error scenarios handled gracefully
  - Test with various inputs:
    - Simple Polish greetings
    - Longer sentences
    - Edge cases (empty input, special characters)
  - Verify end-to-end flow works without external API keys (using placeholders/fallbacks)
  - Document integration test results

  **Must NOT do**:
  - Skip any integration scenario
  - Use real API keys if not necessary
  - Modify code during testing (only bug fixes)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: End-to-end integration testing requiring attention to detail
  - **Skills**: `playwright` for browser automation

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 16)
  - **Parallel Group**: Wave 4 (with Tasks 15,16,18)
  - **Blocks**: Task 18 (need verified integration before manual QA)
  - **Blocked By**: Task 16 (need frontend-backend integration)

  **References**:
  - **Testing References**: Playwright testing patterns for web applications
  - **Integration References**: End-to-end testing best practices

  **Acceptance Criteria**:
  - [ ] Frontend loads without errors
  - [ ] User input successfully sent to backend
  - [ ] Backend response received and processed
  - [ ] UI updates appropriately
  - [ ] Error scenarios handled
  - [ ] Integration test documentation complete

  **QA Scenarios**:

  ```
  Scenario: End-to-end integration test
    Tool: Playwright (playwright skill)
    Preconditions: Server running with backend API (can use placeholders)
    Steps:
      1. Navigate to http://localhost:5000/
      2. Wait for page load
      3. Enter "Dzień dobry" in input field
      4. Click send button
      5. Wait for response (5-10 seconds)
      6. Verify UI shows response (text or indication)
      7. Check console for errors
      8. Take screenshot of final state
    Expected Result: Frontend sends request, receives response, updates UI without errors
    Evidence: .sisyphus/evidence/task-17-integration-test.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots of each test scenario
  - [ ] Console error logs (if any)
  - [ ] Network request/response details

  **Commit**: NO (testing only)
  - Message: N/A
  - Files: None
  - Pre-commit: None

- [ ] 18. Test complete conversational loop manually

  **What to do**:
  - Perform manual QA of the complete conversational loop:
    - Open browser to `http://localhost:5000/`
    - Interact with the WebXR interface (if VR elements present)
    - Use text input or voice input (if implemented)
    - Send multiple messages in sequence
    - Verify LLM responses are in Polish
    - Verify TTS audio plays back
    - Test fallback scenarios (disable network, invalid API keys)
    - Document manual test results
  - Focus on user experience and flow completeness
  - Ensure the "conversational loop" works end-to-end

  **Must NOT do**:
  - Rely solely on automated tests
  - Skip VR/WebXR interaction testing (if applicable)
  - Ignore audio playback issues

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Manual QA requiring attention to user experience, audio, and visual feedback
  - **Skills**: `playwright` for browser interaction, potentially `dev-browser` for manual testing

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 17)
  - **Parallel Group**: Wave 4 (final task)
  - **Blocks**: F3 (Real Manual QA) - this is the implementation of manual QA
  - **Blocked By**: Task 17 (need verified integration)

  **References**:
  - **User Experience References**: Original uLern-Polish workflow from frontend
  - **Audio References**: Audio playback testing procedures
  - **VR References**: WebXR/A-Frame interaction patterns (if applicable)

  **Acceptance Criteria**:
  - [ ] Complete conversational loop works end-to-end
  - [ ] Audio plays back for TTS responses
  - [ ] Polish language maintained throughout
  - [ ] User experience is smooth and responsive
  - [ ] Manual test documentation complete

  **QA Scenarios**:

  ```
  Scenario: Manual conversational loop test
    Tool: Playwright (playwright skill) + manual observation
    Preconditions: Server running with full backend (API keys optional)
    Steps:
      1. Open browser to http://localhost:5000/
      2. Observe page loads correctly
      3. Enter "Cześć, jak się nazywasz?" (Hello, what's your name?)
      4. Wait for response (LLM processing + TTS)
      5. Listen for audio playback (or check audio element state)
      6. Verify response is in Polish
      7. Enter follow-up question: "Skąd pochodzisz?" (Where are you from?)
      8. Verify continued conversation works
      9. Document audio quality, timing, any issues
    Expected Result: Complete conversational loop works with audio playback
    Evidence: .sisyphus/evidence/task-18-manual-qa.txt (notes) + .png (screenshots)
  ```

  **Evidence to Capture**:
  - [ ] Screenshots of conversation flow
  - [ ] Notes on audio playback quality/timing
  - [ ] Documentation of any issues encountered

  **Commit**: NO (manual QA only)
  - Message: N/A
  - Files: None
  - Pre-commit: None

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `node server.js` to check server starts. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Server Start [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **1**: `feat(backend): initial express server setup` — server.js, package.json, .env.example
- **2**: `feat(api): implement LLM/TTS proxying in /api/chat` — server.js (LLM+TTS logic)
- **3**: `feat(frontend): update app.js to use backend API` — public/app.js
- **4**: `chore(verification): final QA and cleanup` — evidence files, README updates

---

## Success Criteria

### Verification Commands
```bash
# 1. Server starts and serves frontend
node server.js &
sleep 2
curl -s http://localhost:5000/ | grep -q "<title>" && echo "Frontend served ✓" || echo "FAIL"

# 2. /api/chat endpoint works
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Cześć"}' | grep -q "success" && echo "API endpoint works ✓" || echo "FAIL"

# 3. Health check works
curl -s http://localhost:5000/health | grep -q "OK" && echo "Health check works ✓" || echo "FAIL"

# 4. Rate limiting headers present
curl -I http://localhost:5000/health | grep -i "ratelimit" && echo "Rate limiting active ✓" || echo "FAIL"

# 5. Frontend loads without errors (Playwright)
# (Will be executed as QA scenario)
```

### Final Checklist
- [ ] Backend serves frontend at http://localhost:5000
- [ ] `/api/chat` proxies LLM → TTS sequentially
- [ ] Frontend successfully completes conversational loop
- [ ] API keys hidden in `.env` (not in frontend)
- [ ] CORS configured from environment variable
- [ ] Rate limiting active (50 req/15min per IP)
- [ ] No `config.js` exposed to frontend
- [ ] All QA scenarios executed with evidence saved