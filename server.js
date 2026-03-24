// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cors = require('cors');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - strict origin
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5000';
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Rate limiting: 50 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());

// Fallback Polish phrases for LLM failures (from app.js)
const fallbackPolishPhrases = [
  'Cześć! Jak się masz?',
  'Powiedz mi, jak się nazywasz?',
  'Dziękuję za odpowiedź!',
  'Do widzenia! Miło było z tobą porozmawiać.',
  'Jak się dziś czujesz?',
  'To świetnie!',
  'Rozumiem.',
  'Świetnie ci idzie! Mów dalej.'
];

// Serve static files from public directory
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// LLM→TTS proxying endpoint with OpenAI integration
app.post('/api/chat', async (req, res) => {
  const timestamp = new Date().toISOString();
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] POST /api/chat from IP: ${clientIp}`);
  console.log('Request headers:', req.headers);
  
  // Validate request body
  if (!req.body.message) {
    console.log(`[${timestamp}] Validation failed: missing 'message' field`);
    return res.status(400).json({
      success: false,
      error: 'Missing required field: message',
      timestamp
    });
  }
  
  // Sanitize input (basic trim)
  const userMessage = String(req.body.message).trim().slice(0, 1000);
  
  console.log(`[${timestamp}] Valid request: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"`);
  
  try {
    // Get LLM configuration from environment (OpenRouter)
    const openaiApiKey = process.env.OPENROUTER_API_KEY;
    const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    
    let llmFallback = false;
    let polishText = '';
    let llmError = null;
    let tokensUsed = null;
    let openaiData = null;
    
    // System prompt (must match frontend expectations)
    const systemPrompt = 'Jesteś pomocnym asystentem języka polskiego. Odpowiadaj wyłącznie po polsku, używając prostego języka odpowiedniego dla początkujących. Utrzymuj odpowiedzi krótkie i zachęcające.';
    
    // Check if LLM API key is configured (OpenRouter)
    if (!openaiApiKey || openaiApiKey === 'your_openai_api_key_here') {
      console.log(`[${timestamp}] LLM API key not configured, using fallback phrase`);
      llmFallback = true;
      llmError = 'LLM API key not configured';
    } else {
      try {
        console.log(`[${timestamp}] Calling LLM API via OpenRouter with model: ${openaiModel}`);
        
        // Call LLM API via OpenRouter
        const llmResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
            // OpenRouter optional (but recommended) headers:
            "HTTP-Referer": "http://localhost:5000", // Your site URL
            "X-Title": "uLern-Polish", // Your app name
          },
          body: JSON.stringify({
            model: openaiModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        });
        
        if (!llmResponse.ok) {
          const errorText = await llmResponse.text();
          console.error(`[${timestamp}] LLM API error: ${llmResponse.status} - ${errorText}`);
          llmFallback = true;
          llmError = `LLM API request failed: ${llmResponse.status}`;
        } else {
          openaiData = await llmResponse.json();
          
          // Extract Polish text from response
          const extractedText = openaiData.choices?.[0]?.message?.content?.trim();
          
          if (!extractedText) {
            console.error(`[${timestamp}] LLM response missing text:`, openaiData);
            llmFallback = true;
            llmError = 'LLM response missing text';
          } else {
            polishText = extractedText;
            tokensUsed = openaiData.usage?.total_tokens;
            console.log(`[${timestamp}] LLM response received: "${polishText.substring(0, 50)}${polishText.length > 50 ? '...' : ''}"`);
          }
        }
      } catch (error) {
        console.error(`[${timestamp}] LLM API network error:`, error);
        llmFallback = true;
        llmError = `LLM API network error: ${error.message}`;
      }
    }
    
    // If LLM failed, use fallback phrase
    if (llmFallback || !polishText) {
      const randomIndex = Math.floor(Math.random() * fallbackPolishPhrases.length);
      polishText = fallbackPolishPhrases[randomIndex];
      console.log(`[${timestamp}] Using fallback Polish phrase: "${polishText}"`);
    }
    
    // ElevenLabs TTS API call
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const elevenLabsModelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
    const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
    
    let ttsResult = null;
    let ttsError = null;
    let audioBase64 = null;
    
    if (!elevenLabsApiKey || elevenLabsApiKey === 'your_elevenlabs_api_key_here') {
      console.log(`[${timestamp}] ElevenLabs API key not configured, TTS fallback required`);
      ttsError = 'ElevenLabs API key not configured';
    } else {
      try {
        console.log(`[${timestamp}] Calling ElevenLabs TTS API with model: ${elevenLabsModelId}, voice: ${elevenLabsVoiceId}`);
        
        const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsApiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text: polishText,
            model_id: elevenLabsModelId,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          }),
        });
        
        if (!elevenLabsResponse.ok) {
          const errorText = await elevenLabsResponse.text();
          console.error(`[${timestamp}] ElevenLabs API error: ${elevenLabsResponse.status} - ${errorText}`);
          ttsError = `ElevenLabs API request failed: ${elevenLabsResponse.status}`;
        } else {
          // Get audio buffer
          const audioBuffer = await elevenLabsResponse.arrayBuffer();
          // Convert to base64
          audioBase64 = Buffer.from(audioBuffer).toString('base64');
          
          console.log(`[${timestamp}] ElevenLabs TTS successful, audio size: ${audioBuffer.byteLength} bytes`);
          
          ttsResult = {
            success: true,
            audioFormat: 'audio/mpeg',
            audioSize: audioBuffer.byteLength,
            model: elevenLabsModelId,
            voiceId: elevenLabsVoiceId,
            audioBase64: audioBase64
          };
        }
      } catch (error) {
        console.error(`[${timestamp}] ElevenLabs TTS processing error:`, error);
        ttsError = `TTS processing error: ${error.message}`;
      }
    }
    
    // Construct final response
    const response = {
      success: true,
      message: llmFallback ? (ttsError ? 'LLM fallback used, TTS fallback required' : 'LLM fallback used, TTS processing complete') : (ttsError ? 'LLM processing complete, TTS fallback required' : 'LLM and TTS processing complete'),
      timestamp,
      input: userMessage,
      llmResult: {
        polishText: polishText,
        model: openaiModel,
        tokensUsed: tokensUsed,
        llmFallback: llmFallback,
        llmError: llmError,
      },
      ttsResult: ttsResult,
      ttsError: ttsError,
      note: (llmFallback ? 'LLM fallback used; ' : '') + (ttsError ? 'Frontend should use Web Speech API fallback' : 'Audio data included as base64')
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error(`[${timestamp}] Unexpected error:`, error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during LLM processing',
      timestamp,
      details: error.message
    });
  }
});

// Placeholder for Stripe Checkout endpoint with validation and logging
app.post('/create-checkout-session', (req, res) => {
  const timestamp = new Date().toISOString();
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] POST /create-checkout-session from IP: ${clientIp}`);
  console.log('Request body:', req.body);
  
  // Validate required Stripe fields (placeholder validation)
  const requiredFields = ['email', 'successUrl', 'cancelUrl'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log(`[${timestamp}] Validation failed: missing fields ${missingFields.join(', ')}`);
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
      timestamp
    });
  }
  
  console.log(`[${timestamp}] Valid payment initiation attempt for email: ${req.body.email}`);
  
  res.status(200).json({
    success: true,
    message: 'Stripe checkout endpoint ready for integration',
    timestamp,
    note: 'Will create $5.00 Language Token package checkout session',
    sessionId: 'placeholder_session_id_' + Date.now(),
    email: req.body.email,
    amount: 500, // cents
    currency: 'usd'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS origin: ${corsOrigin}`);
  console.log(`Static files served from: public/`);
});

module.exports = app;