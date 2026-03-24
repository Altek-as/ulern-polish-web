/**
 * uLern-Polish VR - Main Application Logic
 * Phase 1: Basic Scene Initialization and Overlay Dismissal
 * Phase 2: Microphone Permission Handling
 */

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
    let conversationState = 'idle'; // 'idle', 'greeting', 'question', 'listening', 'processing', 'responding'
    let pendingResponse = null;
    
    // Polish phrases for conversation
    const polishPhrases = {
        greeting: "Cześć! Jak się masz?",
        question: "Powiedz mi, jak się nazywasz?",
        responseThanks: "Dziękuję za odpowiedź!",
        goodbye: "Do widzenia! Miło było z tobą porozmawiać.",
        // Additional phrases for conversation flow
        askFeeling: "Jak się dziś czujesz?",
        askAge: "Ile masz lat?",
        askHobby: "Co lubisz robić w wolnym czasie?",
        positiveResponse: "To świetnie!",
        neutralResponse: "Rozumiem.",
        encouragement: "Świetnie ci idzie! Mów dalej.",
        repeatRequest: "Możesz powtórzyć?",
        notUnderstood: "Przepraszam, nie zrozumiałem. Możesz powiedzieć to inaczej?"
    };
    
    /**
     * Call backend API to generate Polish response based on user input
     * @param {string} userInput - User's spoken text in Polish
     * @returns {Promise<string>} Promise resolving to Polish response text
     */
    async function callBackendAPI(userInput) {
        // Get configuration from global object or use defaults
        const config = window.uLernConfig || {
            llm: {
                provider: 'openai',
                apiKey: 'YOUR_OPENAI_API_KEY',
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-3.5-turbo',
                maxTokens: 150,
                temperature: 0.7,
                systemPrompt: 'Jesteś pomocnym asystentem języka polskiego. Odpowiadaj wyłącznie po polsku, używając prostego języka odpowiedniego dla początkujących. Utrzymuj odpowiedzi krótkie i zachęcające.',
                enableFallback: true
            },
            app: {
                language: 'pl-PL',
                debug: false
            }
        };
        
        // Fallback phrases if LLM fails
        const fallbackPhrases = [
            'Cześć! Jak się masz?',
            'Powiedz mi, jak się nazywasz?',
            'Dziękuję za odpowiedź!',
            'Do widzenia! Miło było z tobą porozmawiać.',
            'Jak się dziś czujesz?',
            'To świetnie!',
            'Rozumiem.',
            'Świetnie ci idzie! Mów dalej.'
        ];
        
        // If mock mode enabled, return mock response
        if (config.llm.mock === true) {
            console.log('[uLern] Using mock LLM response:', config.llm.mockResponse);
            return config.llm.mockResponse;
        }
        
        // If API key is placeholder, immediately fallback
        if (config.llm.apiKey.includes('YOUR_')) {
            console.warn('[uLern] LLM API key not configured, using fallback phrases');
            return fallbackPhrases[Math.floor(Math.random() * fallbackPhrases.length)];
        }
        
        try {
            // Construct request based on provider
            let requestBody;
            let endpoint;
            
            if (config.llm.provider === 'openai') {
                endpoint = `${config.llm.baseUrl}/chat/completions`;
                requestBody = {
                    model: config.llm.model,
                    messages: [
                        { role: 'system', content: config.llm.systemPrompt },
                        { role: 'user', content: userInput }
                    ],
                    max_tokens: config.llm.maxTokens,
                    temperature: config.llm.temperature
                };
            } else {
                // Default to OpenAI format for unknown providers
                endpoint = `${config.llm.baseUrl}/chat/completions`;
                requestBody = {
                    model: config.llm.model,
                    messages: [
                        { role: 'system', content: config.llm.systemPrompt },
                        { role: 'user', content: userInput }
                    ],
                    max_tokens: config.llm.maxTokens,
                    temperature: config.llm.temperature
                };
            }
            
            console.log('[uLern] Calling LLM API:', config.llm.provider, endpoint);
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.llm.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Extract Polish text from response based on provider format
            let polishResponse;
            if (config.llm.provider === 'openai') {
                polishResponse = data.choices?.[0]?.message?.content?.trim();
            } else {
                // Try to extract from common response formats
                polishResponse = data.choices?.[0]?.message?.content?.trim() ||
                                data.response?.trim() ||
                                data.text?.trim();
            }
            
            if (!polishResponse) {
                throw new Error('No Polish response text found in LLM API response');
            }
            
            console.log('[uLern] LLM response received:', polishResponse.substring(0, 100) + '...');
            return polishResponse;
            
        } catch (error) {
            console.error('[uLern] LLM API failed:', error.message);
            
            // Fallback to hardcoded phrases
            if (config.llm.enableFallback !== false) {
                const fallbackIndex = Math.floor(Math.random() * fallbackPhrases.length);
                return fallbackPhrases[fallbackIndex];
            }
            
            // If fallback disabled, re-throw the error
            throw error;
        }
    }

    /**
     * Update avatar texture based on conversation state.
     * Maps speaking-like states (greeting/question/responding) to speaking texture.
     * @param {string} state
     */
    function updateAvatarTexture(state) {
        const textureByState = {
            idle: 'assets/avatar-idle.png',
            listening: 'assets/avatar-listening.png',
            processing: 'assets/avatar-thinking.png',
            speaking: 'assets/avatar-talking.gif'
        };

        const avatarEl = document.querySelector('#avatar') || document.getElementById('avatar');
        if (!avatarEl) {
            console.warn('[uLern] Avatar element not found for texture update');
            return;
        }

        const normalizedState = ['greeting', 'question', 'responding'].includes(state)
            ? 'speaking'
            : state;

        const requestedPath = textureByState[normalizedState] || textureByState.idle;
        const idlePath = textureByState.idle;

        const previewImage = new Image();
        previewImage.onload = () => {
            avatarEl.setAttribute('src', requestedPath);
        };
        previewImage.onerror = () => {
            console.warn(`[uLern] Avatar texture failed to load for state "${state}": ${requestedPath}. Falling back to idle.`);

            if (requestedPath === idlePath) {
                return;
            }

            const idlePreview = new Image();
            idlePreview.onload = () => {
                avatarEl.setAttribute('src', idlePath);
            };
            idlePreview.onerror = () => {
                console.warn(`[uLern] Avatar idle texture is also missing: ${idlePath}`);
            };
            idlePreview.src = idlePath;
        };
        previewImage.src = requestedPath;
    }
    
    /**
     * Transition conversation state and trigger appropriate actions
     */
    function transitionToState(newState) {
        console.log('[uLern] State transition:', conversationState, '->', newState);
        updateAvatarTexture(newState);
        conversationState = newState;
        
        switch (newState) {
            case 'greeting':
                speakPolish(polishPhrases.greeting, () => {
                    transitionToState('question');
                });
                break;
                
            case 'question':
                speakPolish(polishPhrases.question, () => {
                    transitionToState('listening');
                });
                break;
                
            case 'listening':
                // Ensure speech recognition is active
                if (speechRecognition && isConversationActive) {
                    try {
                        speechRecognition.start();
                        console.log('[uLern] Speech recognition started for listening state');
                    } catch (error) {
                        console.error('[uLern] Failed to start speech recognition:', error);
                    }
                }
                // Show mic indicator
                if (micIndicator) {
                    micIndicator.setAttribute('visible', 'true');
                    micIndicator.setAttribute('opacity', '0.8');
                }
                if (statusText) {
                    statusText.setAttribute('value', 'Słucham... mów teraz!');
                }
                break;
                
            case 'processing':
                // Processing happens in processUserInput, just update UI
                if (statusText) {
                    statusText.setAttribute('value', 'Przetwarzanie LLM...');
                }
                if (sttText) sttText.setAttribute('value', '');
                break;
                
            case 'responding':
                // Response text should be passed via pendingResponse variable
                // Update UI to show TTS synthesis
                if (statusText) {
                    statusText.setAttribute('value', 'Synteza mowy...');
                }
                
                const responseText = pendingResponse || polishPhrases.responseThanks;
                if (llmText) llmText.setAttribute('value', 'Assistant: ' + responseText);
                
                if (pendingResponse) {
                    speakPolish(pendingResponse, () => {
                        // After speaking, go back to listening
                        transitionToState('listening');
                    });
                    pendingResponse = null;
                } else {
                    // Fallback response
                    speakPolish(polishPhrases.responseThanks, () => {
                        transitionToState('listening');
                    });
                }
                break;
                
            case 'idle':
                // Reset UI
                if (micIndicator) micIndicator.setAttribute('visible', 'false');
                if (speechIndicator) speechIndicator.setAttribute('visible', 'false');
                if (speechText) speechText.setAttribute('visible', 'false');
                if (statusText) statusText.setAttribute('value', 'Gotowy do rozmowy');
                if (llmText) llmText.setAttribute('value', '');
                if (sttText) sttText.setAttribute('value', '');
                break;
        }
    }
    
    /**
     * Process user input transcript and determine appropriate response
     */
    function processUserInput(transcript) {
        console.log('[uLern] Processing transcript:', transcript);
        transitionToState('processing');
        
        // Update UI to show LLM processing
        if (statusText) {
            statusText.setAttribute('value', 'Przetwarzanie LLM...');
        }
        
        // Check for goodbye to end conversation
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes('do widzenia') || lowerTranscript.includes('pa') || lowerTranscript.includes('cześć')) {
            // End conversation after goodbye response
            pendingResponse = polishPhrases.goodbye;
            transitionToState('responding');
            setTimeout(() => {
                isConversationActive = false;
                transitionToState('idle');
            }, 3000);
            return;
        }
        
        // Call backend API for intelligent response and audio
        callBackendAPI(transcript)
            .then(response => {
                pendingResponse = response;
                transitionToState('responding');
            })
            .catch(error => {
                console.error('[uLern] LLM failed, using fallback phrases:', error);
                // Fallback to keyword matching if LLM fails
                let fallbackResponse = '';
                
                if (lowerTranscript.includes('nazywam się') || lowerTranscript.includes('jestem')) {
                    fallbackResponse = polishPhrases.responseThanks + ' Miło cię poznać!';
                } else if (lowerTranscript.includes('lat') && (lowerTranscript.includes('mam') || lowerTranscript.includes('jestem'))) {
                    fallbackResponse = polishPhrases.positiveResponse + ' Dziękuję za informację!';
                } else if (lowerTranscript.includes('czuję się') || lowerTranscript.includes('czuje sie')) {
                    if (lowerTranscript.includes('dobrze') || lowerTranscript.includes('świetnie')) {
                        fallbackResponse = polishPhrases.positiveResponse + ' To wspaniale!';
                    } else if (lowerTranscript.includes('źle') || lowerTranscript.includes('słabo')) {
                        fallbackResponse = 'Przykro mi to słyszeć. Mam nadzieję, że będzie lepiej!';
                    } else {
                        fallbackResponse = polishPhrases.neutralResponse;
                    }
                } else if (lowerTranscript.includes('hobby') || lowerTranscript.includes('lubię') || lowerTranscript.includes('lubie')) {
                    fallbackResponse = polishPhrases.encouragement + ' To ciekawe hobby!';
                } else {
                    fallbackResponse = polishPhrases.notUnderstood;
                }
                
                pendingResponse = fallbackResponse;
                transitionToState('responding');
            });
    }
    
    // --- UI Helper Functions ---
    
    /**
     * Updates the start button to show loading state
     */
    function setButtonLoading(isLoading, text = '') {
        if (!startButton) return;
        
        if (isLoading) {
            const originalHTML = startButton.innerHTML;
            startButton.dataset.originalHTML = originalHTML;
            startButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
            startButton.disabled = true;
        } else {
            const originalHTML = startButton.dataset.originalHTML || '<i class="fas fa-play-circle"></i> Rozpocznij';
            startButton.innerHTML = originalHTML;
            startButton.disabled = false;
            delete startButton.dataset.originalHTML;
        }
    }
    
    /**
     * Shows error message in the overlay instruction text
     */
    function showErrorMessage(message) {
        const instructionEl = document.querySelector('.instruction');
        if (instructionEl) {
            instructionEl.innerHTML = `<span style="color: #ff4444; font-weight: bold;">${message}</span>`;
        }
    }

    /**
     * Initializes SpeechRecognition for Polish language
     */
    function initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('[uLern] SpeechRecognition not supported in this browser');
            return null;
        }
        
        const recognition = new SpeechRecognition();
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
            if (transcript) {
                console.log('[uLern] Recognized:', transcript);
                if (statusText) {
                    statusText.setAttribute('value', 'Rozpoznano: ' + transcript);
                }
                if (sttText) {
                    sttText.setAttribute('value', 'User: ' + transcript);
                }
                // Process user input and trigger conversation state machine
                processUserInput(transcript);
            }
        };
        
        recognition.onerror = (event) => {
            console.error('[uLern] Speech recognition error:', event.error);
            if (statusText) {
                statusText.setAttribute('value', 'Błąd rozpoznawania mowy: ' + event.error);
            }
            if (micIndicator) {
                micIndicator.setAttribute('visible', 'false');
            }
        };
        
        recognition.onend = () => {
            console.log('[uLern] Speech recognition ended');
            // Hide mic indicator if conversation inactive
            if (!isConversationActive && micIndicator) {
                micIndicator.setAttribute('visible', 'false');
            }
            // If conversation still active, restart recognition
            if (isConversationActive && speechRecognition) {
                try {
                    speechRecognition.start();
                } catch (e) {
                    console.error('[uLern] Failed to restart recognition:', e);
                }
            }
        };
        
        return recognition;
    }

    /**
     * Speaks Polish text using Text-to-Speech (TTS)
     * @param {string} text - Polish text to speak
     */
    function speakPolish(text, onEndCallback) {
        // Get configuration
        const config = window.uLernConfig || {
            app: {
                preferExternalTTS: true
            },
            tts: {
                apiKey: 'YOUR_ELEVENLABS_API_KEY',
                enableFallback: true
            }
        };
        
        // Try external TTS first if configured and preferred
        if (config.app.preferExternalTTS && !config.tts.apiKey.includes('YOUR_')) {
            console.log('[uLern] Attempting external TTS');
            callExternalTTS(text)
                .then(() => {
                    console.log('[uLern] External TTS completed');
                    if (onEndCallback && typeof onEndCallback === 'function') {
                        onEndCallback();
                    }
                })
                .catch(error => {
                    console.warn('[uLern] External TTS failed, falling back to Web Speech API:', error.message);
                    // Fallback to Web Speech API
                    fallbackToWebSpeech(text, onEndCallback);
                });
            return; // External TTS attempt started, return early
        }
        
        // Otherwise use Web Speech API directly
        fallbackToWebSpeech(text, onEndCallback);
        
        // Helper function for Web Speech API TTS
        function fallbackToWebSpeech(text, onEndCallback) {
            if (!window.speechSynthesis) {
                console.warn('[uLern] SpeechSynthesis not supported in this browser');
                if (statusText) {
                    statusText.setAttribute('value', 'Synteza mowy nieobsługiwana');
                }
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pl-PL';
            
            // Show speech indicator
            if (speechIndicator) {
                speechIndicator.setAttribute('visible', 'true');
                speechIndicator.setAttribute('opacity', '0.8');
            }
            if (speechText) {
                speechText.setAttribute('visible', 'true');
                speechText.setAttribute('value', 'Mówię: ' + text);
            }

            utterance.onstart = () => {
                console.log('[uLern] TTS started:', text);
            };

            utterance.onend = () => {
                console.log('[uLern] TTS ended');
                // Hide speech indicator
                if (speechIndicator) {
                    speechIndicator.setAttribute('visible', 'false');
                }
                if (speechText) {
                    speechText.setAttribute('visible', 'false');
                }
                // Call callback if provided
                if (onEndCallback && typeof onEndCallback === 'function') {
                    onEndCallback();
                }
            };

            utterance.onerror = (event) => {
                console.error('[uLern] TTS error:', event.error);
                if (statusText) {
                    statusText.setAttribute('value', 'Błąd syntezy mowy: ' + event.error);
                }
                // Hide speech indicator on error
                if (speechIndicator) {
                    speechIndicator.setAttribute('visible', 'false');
                }
                if (speechText) {
                    speechText.setAttribute('visible', 'false');
                }
            };

            window.speechSynthesis.speak(utterance);
        }
    }
    async function callExternalTTS(polishText) {
        // Get configuration from global object or use defaults
        const config = window.uLernConfig || {
            tts: {
                provider: 'elevenlabs',
                apiKey: 'YOUR_ELEVENLABS_API_KEY',
                baseUrl: 'https://api.elevenlabs.io/v1',
                voiceId: '21m00Tcm4TlvDq8ikWAM',
                modelId: 'eleven_monolingual_v1',
                stability: 0.5,
                similarityBoost: 0.75,
                enableFallback: true,
                fallbackProvider: 'webSpeech'
            },
            app: {
                debug: false
            }
        };
        
        // If API key is placeholder or mock mode, fallback immediately
        if (config.tts.apiKey.includes('YOUR_')) {
            console.warn('[uLern] TTS API key not configured, falling back to Web Speech API');
            return new Promise((resolve) => {
                speakPolish(polishText, resolve);
            });
        }
        
        // Show speech indicator (same as speakPolish)
        if (speechIndicator) {
            speechIndicator.setAttribute('visible', 'true');
            speechIndicator.setAttribute('opacity', '0.8');
        }
        if (speechText) {
            speechText.setAttribute('visible', 'true');
            speechText.setAttribute('value', 'Mówię: ' + polishText);
        }
        
        try {
            console.log('[uLern] Calling external TTS API:', config.tts.provider);
            
            // Construct ElevenLabs API request
            const endpoint = `${config.tts.baseUrl}/text-to-speech/${config.tts.voiceId}`;
            const requestBody = {
                text: polishText,
                model_id: config.tts.modelId,
                voice_settings: {
                    stability: config.tts.stability,
                    similarity_boost: config.tts.similarityBoost
                }
            };
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': config.tts.apiKey
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
            }
            
            // Get audio stream as blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // Play audio and wait for completion
            await new Promise((resolve, reject) => {
                audio.onended = () => {
                    console.log('[uLern] External TTS audio finished');
                    resolve();
                };
                audio.onerror = (error) => {
                    reject(new Error(`Audio playback error: ${error.message}`));
                };
                audio.play().catch(reject);
            });
            
            // Clean up
            URL.revokeObjectURL(audioUrl);
            
        } catch (error) {
            console.error('[uLern] External TTS failed:', error.message);
            throw error; // Let caller handle fallback
        } finally {
            // Hide speech indicator (if not already hidden by speakPolish)
            // speakPolish will handle its own indicators, so only hide if we didn't fallback
            if (config.tts.enableFallback === false || !config.tts.apiKey.includes('YOUR_')) {
                if (speechIndicator) {
                    speechIndicator.setAttribute('visible', 'false');
                }
                if (speechText) {
                    speechText.setAttribute('visible', 'false');
                }
            }
        }
    }

    // --- Core Functions ---
    
    /**
     * Handles the start button click event.
     * Requests microphone permission, then hides overlay and initializes scene.
     */
    async function handleStart() {
        if (!startButton || !startOverlay || !uiPanel) return;
        
        console.log('[uLern] Requesting microphone access...');
        
        // Show loading state
        setButtonLoading(true, 'Proszę o dostęp do mikrofonu...');
        
        try {
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: true 
            });
            
            console.log('[uLern] Microphone permission granted');
            
            // Success: Hide overlay and initialize scene
            startOverlay.classList.add('hidden');
            uiPanel.setAttribute('visible', 'true');
            
            // Update status text to show success
            if (statusText) {
                statusText.setAttribute('value', 'Dostęp do mikrofonu przyznany. Rozpoczynamy!');
            }
            
            // Initialize gaze listeners
            setupGazeListeners();
            
            // Store stream for future use (will be used in Phase 2)
            window.microphoneStream = stream;
            
            // Reset button after a moment
            setTimeout(() => {
                setButtonLoading(false);
            }, 1000);
            
        } catch (error) {
            console.error('[uLern] Microphone permission denied:', error);
            
            // Error: Show error message and reset button
            showErrorMessage('Brak dostępu do mikrofonu. Aplikacja wymaga mikrofonu do rozpoznawania mowy.');
            setButtonLoading(false);
        }
    }
    
    /**
     * Starts conversation with speech recognition
     */
    function startConversation() {
        if (isConversationActive) return;
        isConversationActive = true;
        
        if (statusText) {
            statusText.setAttribute('value', 'Rozmowa rozpoczęta - mów teraz!');
        }
        if (hintText) {
            hintText.setAttribute('value', 'Powiedz coś po polsku');
        }
        if (speechIndicator) {
            speechIndicator.setAttribute('visible', 'true');
            speechIndicator.setAttribute('opacity', '0.8');
        }
        if (micIndicator) {
            micIndicator.setAttribute('visible', 'true');
            micIndicator.setAttribute('opacity', '0.8');
        }
        if (avatar) {
            avatar.setAttribute('material', 'color', '#FF0033');
        }
        
        console.log('[uLern] Conversation started, initializing speech recognition...');
        
        // Initialize speech recognition if not already done
        if (!speechRecognition) {
            speechRecognition = initializeSpeechRecognition();
        }
        
        // Start conversation state machine
        transitionToState('greeting');
    }
    
    /**
     * Sets up gaze interaction listeners for the avatar
     */
    function setupGazeListeners() {
        if (!avatar) return;
        
        // Mouse enter (gaze start)
        avatar.addEventListener('mouseenter', () => {
            if (isConversationActive) return;
            
            if (statusText) {
                statusText.setAttribute('value', 'Skup wzrok na avatarze...');
            }
            if (hintText) {
                hintText.setAttribute('value', 'Po 2 sekundach uruchomi się nagrywanie.');
            }
            
            // Clear any existing timer
            if (gazeTimer) clearTimeout(gazeTimer);
            
            // Start 2-second gaze timer
            gazeTimer = setTimeout(() => {
                startConversation();
            }, 2000);
        });
        
        // Mouse leave (gaze end)
        avatar.addEventListener('mouseleave', () => {
            // Cancel gaze timer
            if (gazeTimer) {
                clearTimeout(gazeTimer);
                gazeTimer = null;
            }
            
            if (isConversationActive) return;
            
            // Reset UI to ready state
            if (statusText) {
                statusText.setAttribute('value', 'Gotowy do rozmowy');
            }
            if (hintText) {
                hintText.setAttribute('value', 'Spójrz na avatar przez 2 sekundy, aby zacząć mówić');
            }
        });
        
        // Click (fallback interaction)
        avatar.addEventListener('click', () => {
            // Cancel gaze timer if active
            if (gazeTimer) {
                clearTimeout(gazeTimer);
                gazeTimer = null;
            }
            
            if (!isConversationActive) {
                startConversation();
            } else {
                // End conversation and stop speech recognition
                isConversationActive = false;
                pendingResponse = null;
                transitionToState('idle');
                
                // Stop speech recognition if active
                if (speechRecognition) {
                    try {
                        speechRecognition.stop();
                        console.log('[uLern] Speech recognition stopped');
                    } catch (error) {
                        console.error('[uLern] Error stopping speech recognition:', error);
                    }
                }
                
                if (statusText) {
                    statusText.setAttribute('value', 'Gotowy do rozmowy');
                }
                if (hintText) {
                    hintText.setAttribute('value', 'Spójrz na avatar przez 2 sekundy, aby zacząć mówić');
                }
                if (speechIndicator) {
                    speechIndicator.setAttribute('visible', 'false');
                }
                if (micIndicator) {
                    micIndicator.setAttribute('visible', 'false');
                }
                if (speechText) {
                    speechText.setAttribute('visible', 'false');
                }
                if (avatar) {
                    avatar.setAttribute('material', 'color', '#4A90E2');
                }
                // Cancel any ongoing TTS
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
                
                console.log('[uLern] Conversation ended');
            }
        });
    }
    
    // --- Event Listeners ---
    
    if (startButton) {
        startButton.addEventListener('click', handleStart);
    } else {
        console.error('[uLern] Start button not found in the DOM.');
    }
});
