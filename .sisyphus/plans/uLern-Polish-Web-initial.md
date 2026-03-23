# uLern-Polish-Web Initial Work Plan

## Project Overview
uLern-Polish-Web is an immersive WebXR language learning application designed for mobile VR headsets (Google Cardboard style). It features a Polish-speaking avatar that users can interact with using gaze-based selection and speech recognition.

## Current State
- `index.html`: Basic A-Frame scene with a 2D overlay, sky, floor, and a placeholder avatar (box).
- `style.css`: Futuristic theme with Polish red accents, optimized for mobile VR.
- `app.js`: Referenced in HTML but missing.

## Missing Components
- Core application logic (`app.js`).
- Microphone access and permission handling.
- Speech-to-Text (STT) for Polish language.
- Text-to-Speech (TTS) for Polish language.
- Gaze-based interaction logic.
- Conversation state management.

## Prioritized Tasks

### Phase 1: Foundation & Interaction
- [x] Create `app.js` with basic scene initialization and overlay dismissal.
- [x] Implement gaze-based interaction with the avatar (triggering conversation).
- [x] Connect VR UI elements (status text, hint text) to application state.

### Phase 2: Audio & Speech Integration
- [x] Implement microphone permission request and access handling.
- [x] Integrate Web Speech API for Polish Speech-to-Text (STT).
- [x] Integrate Web Speech API for Polish Text-to-Speech (TTS).
- [x] Synchronize speech indicators (mic ring, "Mówię..." text) with audio state.

### Phase 3: Conversation Logic
- [x] Implement a basic conversation state machine (Greeting -> Question -> Response).
- [x] Create a set of simple Polish phrases for the avatar to use.
- [x] Handle user input and provide appropriate Polish responses.

### Phase 4: Refinement & UX
- [x] Add visual feedback for speech recognition (e.g., showing recognized text in VR).
- [x] Implement error handling for missing Web Speech API or microphone access.
- [x] Optimize performance for mobile VR devices.
- [x] Final verification of the end-to-end flow.

## Technical Considerations
- **Web Speech API**: Check for browser support (Chrome/Edge preferred).
- **A-Frame**: Use 1.5.0 features for XR compatibility.
- **Mobile VR**: Ensure the gaze cursor is intuitive and the UI is readable in VR.
- **Polish Language**: Ensure `lang="pl-PL"` is used for STT and TTS.
