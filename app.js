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
     * Transition conversation state and trigger appropriate actions
     */
    function transitionToState(newState) {
        console.log('[uLern] State transition:', conversationState, '->', newState);
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
                    statusText.setAttribute('value', 'Przetwarzam odpowiedź...');
                }
                break;
                
            case 'responding':
                // Response text should be passed via pendingResponse variable
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
                break;
        }
    }
    
    /**
     * Process user input transcript and determine appropriate response
     */
    function processUserInput(transcript) {
        console.log('[uLern] Processing transcript:', transcript);
        transitionToState('processing');
        
        // Simple keyword matching for Polish phrases
        const lowerTranscript = transcript.toLowerCase();
        let response = '';
        
        if (lowerTranscript.includes('nazywam się') || lowerTranscript.includes('jestem')) {
            response = polishPhrases.responseThanks + ' Miło cię poznać!';
        } else if (lowerTranscript.includes('lat') && (lowerTranscript.includes('mam') || lowerTranscript.includes('jestem'))) {
            response = polishPhrases.positiveResponse + ' Dziękuję za informację!';
        } else if (lowerTranscript.includes('czuję się') || lowerTranscript.includes('czuje sie')) {
            if (lowerTranscript.includes('dobrze') || lowerTranscript.includes('świetnie')) {
                response = polishPhrases.positiveResponse + ' To wspaniale!';
            } else if (lowerTranscript.includes('źle') || lowerTranscript.includes('słabo')) {
                response = 'Przykro mi to słyszeć. Mam nadzieję, że będzie lepiej!';
            } else {
                response = polishPhrases.neutralResponse;
            }
        } else if (lowerTranscript.includes('hobby') || lowerTranscript.includes('lubię') || lowerTranscript.includes('lubie')) {
            response = polishPhrases.encouragement + ' To ciekawe hobby!';
        } else if (lowerTranscript.includes('do widzenia') || lowerTranscript.includes('pa') || lowerTranscript.includes('cześć')) {
            response = polishPhrases.goodbye;
            // End conversation after goodbye
            setTimeout(() => {
                isConversationActive = false;
                transitionToState('idle');
            }, 3000);
        } else {
            response = polishPhrases.notUnderstood;
        }
        
        // Store response and transition to responding state
        pendingResponse = response;
        transitionToState('responding');
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
                conversationState = 'idle';
                pendingResponse = null;
                
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