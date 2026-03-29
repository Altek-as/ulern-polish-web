/**
 * uLern-Polish VR - Main Application Logic
 * Phase 2: AI Pipeline (OpenRouter + ElevenLabs via backend)
 */

const API_BASE = window.location.origin; // Use same origin as the app

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const startOverlay = document.getElementById('startOverlay');
    const startButton = document.getElementById('startButton');
    const uiPanel = document.getElementById('uiPanel');
    const avatar = document.getElementById('avatar');
    const statusText = document.getElementById('statusText');
    const hintText = document.getElementById('hintText');
    const speechIndicator = document.getElementById('speechIndicator');
    const micIndicator = document.getElementById('micIndicator');
    const speechText = document.getElementById('speechText');
    const sttText = document.getElementById('sttText');
    const llmText = document.getElementById('llmText');
    
    // --- State ---
    let isConversationActive = false;
    let gazeTimer = null;
    let speechRecognition = null;
    let conversationState = 'idle';
    let pendingResponse = null;
    let audioElement = null;

    // --- Conversation History (for context) ---
    const conversationHistory = [];

    // System prompt for the AI tutor
    const SYSTEM_PROMPT = `Jesteś przyjaznym polskim nauczycielem języka. Pomagasz użytkownikom ćwiczyć rozmowną polszczyznę.
Utrzymuj odpowiedzi KRÓTKIE (1-3 zdania maksymalnie) i po polsku.
Używaj prostego słownictwa odpowiedniego dla początkujących.
Bądź zachęcający i cierpliwy.
Jeśli użytkownik popełnia błędy gramatyczne, delikatnie je koryguj w wspierający sposób.
Zawsze odpowiadaj tylko po polsku.`;

    // --- API Calls ---

    /**
     * Check if backend is healthy
     */
    async function checkBackendHealth() {
        try {
            const res = await fetch(`${API_BASE}/api/health`);
            const data = await res.json();
            console.log('[uLern] Backend health:', data);
            return data;
        } catch (e) {
            console.warn('[uLern] Backend unreachable:', e.message);
            return null;
        }
    }

    /**
     * Call /api/chat — sends conversation history, returns AI response
     * @param {string} userMessage - User's spoken text
     * @returns {Promise<string>} AI response in Polish
     */
    async function callChatAPI(userMessage) {
        conversationHistory.push({ role: 'user', content: userMessage });

        // Read lesson context from sessionStorage if set
        let lessonContext = null;
        try {
            const stored = sessionStorage.getItem('ulern_selected_lesson');
            if (stored) lessonContext = JSON.parse(stored);
        } catch (e) {}

        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory, lessonContext })
        });

        if (!response.ok) {
            throw new Error(`Chat API error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.reply;

        conversationHistory.push({ role: 'assistant', content: reply });
        return reply;
    }

    /**
     * Call /api/tts — sends Polish text, plays returned audio
     * @param {string} text - Polish text to speak
     * @returns {Promise<void>}
     */
    async function callTTSAPI(text) {
        // Stop any currently playing audio
        if (audioElement) {
            audioElement.pause();
            audioElement = null;
        }

        const response = await fetch(`${API_BASE}/api/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`TTS API error: ${response.status}`);
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        audioElement = new Audio(audioUrl);

        return new Promise((resolve, reject) => {
            audioElement.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            audioElement.onerror = (e) => {
                URL.revokeObjectURL(audioUrl);
                reject(new Error('Audio playback failed'));
            };
            audioElement.play().catch(reject);
        });
    }

    /**
     * Speak Polish text — tries ElevenLabs first, falls back to browser TTS
     */
    function speakPolish(text, onEndCallback) {
        // Show speech indicator
        if (speechIndicator) {
            speechIndicator.setAttribute('visible', 'true');
            speechIndicator.setAttribute('opacity', '0.8');
        }
        if (speechText) {
            speechText.setAttribute('visible', 'true');
            speechText.setAttribute('value', 'Mówię: ' + text);
        }

        // Try ElevenLabs via backend
        callTTSAPI(text)
            .then(() => {
                hideSpeechIndicator();
                if (onEndCallback) onEndCallback();
            })
            .catch(() => {
                console.warn('[uLern] TTS failed, falling back to browser TTS');
                fallbackToBrowserTTS(text, onEndCallback);
            });
    }

    function fallbackToBrowserTTS(text, onEndCallback) {
        if (!window.speechSynthesis) {
            console.warn('[uLern] Browser TTS not supported');
            hideSpeechIndicator();
            if (onEndCallback) onEndCallback();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.onend = () => {
            hideSpeechIndicator();
            if (onEndCallback) onEndCallback();
        };
        utterance.onerror = () => {
            hideSpeechIndicator();
            if (onEndCallback) onEndCallback();
        };

        window.speechSynthesis.speak(utterance);
    }

    function hideSpeechIndicator() {
        if (speechIndicator) {
            speechIndicator.setAttribute('visible', 'false');
        }
        if (speechText) {
            speechText.setAttribute('visible', 'false');
        }
    }

    // --- Avatar State ---
    // Avatar uses A-Frame geometric primitives (no texture files needed).
    // State transitions are handled visually via the state machine below.
    function updateAvatarState(state) {
        // Future: animate avatar based on state (e.g., eye color, mouth shape)
        // Currently a no-op — geometric avatar is self-sufficient
    }

    // --- State Machine ---
    function transitionToState(newState) {
        console.log('[uLern] State:', conversationState, '->', newState);
        updateAvatarState(newState);
        conversationState = newState;

        switch (newState) {
            case 'greeting':
                // Get AI greeting
                if (statusText) statusText.setAttribute('value', 'Generowanie powitania...');
                callChatAPI('Powiedz mi krótkie powitanie, jak polski nauczyciel. Tylko 1-2 zdania.')
                    .then(greeting => {
                        pendingResponse = greeting;
                        transitionToState('responding');
                    })
                    .catch(() => {
                        pendingResponse = 'Cześć! Witaj w nauce języka polskiego!';
                        transitionToState('responding');
                    });
                break;

            case 'question':
                if (statusText) statusText.setAttribute('value', 'Zadaję pytanie...');
                callChatAPI('Zadaj użytkownikowi proste pytanie po polsku, żeby rozpocząć rozmowę. Tylko 1 zdanie.')
                    .then(question => {
                        pendingResponse = question;
                        transitionToState('responding');
                    })
                    .catch(() => {
                        pendingResponse = 'O czym chciałbyś porozmawiać?';
                        transitionToState('responding');
                    });
                break;

            case 'listening':
                if (speechRecognition && isConversationActive) {
                    try { speechRecognition.start(); } catch (e) {}
                }
                if (micIndicator) {
                    micIndicator.setAttribute('visible', 'true');
                    micIndicator.setAttribute('opacity', '0.8');
                }
                if (statusText) statusText.setAttribute('value', 'Słucham... mów teraz!');
                break;

            case 'processing':
                if (statusText) statusText.setAttribute('value', 'Przetwarzanie...');
                if (sttText) sttText.setAttribute('value', '');
                break;

            case 'responding':
                if (statusText) statusText.setAttribute('value', 'Mówię...');
                if (llmText) llmText.setAttribute('value', 'Assistant: ' + (pendingResponse || ''));
                if (pendingResponse) {
                    const response = pendingResponse;
                    speakPolish(response, () => {
                        transitionToState('listening');
                    });
                    pendingResponse = null;
                }
                break;

            case 'idle':
                hideSpeechIndicator();
                if (micIndicator) micIndicator.setAttribute('visible', 'false');
                if (statusText) statusText.setAttribute('value', 'Gotowy do rozmowy');
                if (llmText) llmText.setAttribute('value', '');
                if (sttText) sttText.setAttribute('value', '');
                conversationHistory.length = 0; // Reset conversation context
                break;
        }
    }

    // --- Process User Input ---
    function processUserInput(transcript) {
        console.log('[uLern] Recognized:', transcript);
        if (sttText) sttText.setAttribute('value', 'User: ' + transcript);

        // Check for goodbye
        const lower = transcript.toLowerCase();
        if (lower.includes('do widzenia') || lower.includes('pa ') || lower.includes('cześć') || lower.includes('na razie')) {
            pendingResponse = 'Do widzenia! Miło było z tobą rozmawiać. Trzymaj się!';
            transitionToState('responding');
            setTimeout(() => {
                isConversationActive = false;
                transitionToState('idle');
            }, 4000);
            return;
        }

        transitionToState('processing');

        callChatAPI(transcript)
            .then(reply => {
                pendingResponse = reply;
                transitionToState('responding');
            })
            .catch(err => {
                console.error('[uLern] Chat API failed:', err);
                pendingResponse = 'Przepraszam, miałem problem. Możesz powtórzyć?';
                transitionToState('responding');
            });
    }

    // --- Speech Recognition ---
    function initializeSpeechRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return null;

        const recognition = new SR();
        recognition.lang = 'pl-PL';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                }
            }
            if (transcript) processUserInput(transcript);
        };

        recognition.onerror = (event) => {
            console.error('[uLern] SR error:', event.error);
            if (event.error === 'no-speech') return;
            if (micIndicator) micIndicator.setAttribute('visible', 'false');
        };

        recognition.onend = () => {
            if (isConversationActive && speechRecognition) {
                try { speechRecognition.start(); } catch (e) {}
            }
        };

        return recognition;
    }

    // --- UI Helpers ---
    function setButtonLoading(isLoading, text = '') {
        if (!startButton) return;
        if (isLoading) {
            startButton.dataset.originalHTML = startButton.innerHTML;
            startButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
            startButton.disabled = true;
        } else {
            startButton.innerHTML = startButton.dataset.originalHTML || '<i class="fas fa-play-circle"></i> Rozpocznij';
            startButton.disabled = false;
            delete startButton.dataset.originalHTML;
        }
    }

    function showErrorMessage(message) {
        const el = document.querySelector('.instruction');
        if (el) el.innerHTML = `<span style="color: #ff4444">${message}</span>`;
    }

    // --- Start Flow ---
    async function handleStart() {
        if (!startButton || !startOverlay || !uiPanel) return;

        setButtonLoading(true, 'Uruchamianie...');

        // Check backend health first
        const health = await checkBackendHealth();
        if (!health || !health.openrouter || !health.elevenlabs) {
            console.warn('[uLern] Backend not fully configured — using fallback mode');
        }

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            showErrorMessage('Brak dostępu do mikrofonu. Aplikacja wymaga mikrofonu.');
            setButtonLoading(false);
            return;
        }

        startOverlay.classList.add('hidden');
        uiPanel.setAttribute('visible', 'true');
        if (statusText) statusText.setAttribute('value', 'Gotowy! Spójrz na awatar.');

        setupGazeListeners();
        setButtonLoading(false);
    }

    function startConversation() {
        if (isConversationActive) return;
        isConversationActive = true;
        conversationHistory.length = 0; // Fresh conversation

        if (statusText) statusText.setAttribute('value', 'Rozmowa rozpoczęta!');
        if (hintText) hintText.setAttribute('value', 'Mów po polsku');

        if (!speechRecognition) speechRecognition = initializeSpeechRecognition();

        transitionToState('greeting');
    }

    function setupGazeListeners() {
        if (!avatar) return;

        avatar.addEventListener('mouseenter', () => {
            if (isConversationActive) return;
            if (statusText) statusText.setAttribute('value', 'Skup...');
            gazeTimer = setTimeout(startConversation, 2000);
        });

        avatar.addEventListener('mouseleave', () => {
            if (gazeTimer) { clearTimeout(gazeTimer); gazeTimer = null; }
            if (!isConversationActive && statusText) statusText.setAttribute('value', 'Gotowy do rozmowy');
        });

        avatar.addEventListener('click', () => {
            if (gazeTimer) { clearTimeout(gazeTimer); gazeTimer = null; }
            if (!isConversationActive) {
                startConversation();
            } else {
                // End conversation
                isConversationActive = false;
                pendingResponse = null;
                if (speechRecognition) { try { speechRecognition.stop(); } catch (e) {} }
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if (audioElement) { audioElement.pause(); audioElement = null; }
                transitionToState('idle');
            }
        });
    }

    // --- Init ---
    if (startButton) {
        startButton.addEventListener('click', handleStart);
    } else {
        console.error('[uLern] Start button not found');
    }
});
