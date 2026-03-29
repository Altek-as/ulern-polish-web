/**
 * uLern-Polish - Express Backend Server
 * Serves static WebXR frontend and handles AI API calls (OpenRouter + ElevenLabs)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting: 50 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later.' }
});

// --- Helper: Call OpenRouter GPT-4o-mini ---
async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  // Inject system prompt if not present
  const hasSystem = messages.some(m => m.role === 'system');
  const fullMessages = hasSystem ? messages : [
    {
      role: 'system',
      content: `Jesteś przyjaznym polskim nauczycielem języka. Pomagasz użytkownikom ćwiczyć rozmowną polszczyznę.
Utrzymuj odpowiedzi KRÓTKIE (1-3 zdania maksymalnie) i po polsku.
Używaj prostego słownictwa odpowiedniego dla początkujących.
Bądź zachęcający i cierpliwy.
Jeśli użytkownik popełnia błędy gramatyczne, delikatnie je koryguj w wspierający sposób.
Zawsze odpowiadaj tylko po polsku.`
    },
    ...messages
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5000',
      'X-Title': 'uLern-Polish'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: fullMessages,
      max_tokens: 150,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// --- Helper: Call ElevenLabs TTS ---
async function callElevenLabs(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs error ${response.status}: ${error}`);
  }

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

// --- API Routes (MUST be before static middleware) ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    openrouter: !!process.env.OPENROUTER_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY
  });
});

// Chat endpoint — OpenRouter GPT-4o-mini
app.post('/api/chat', limiter, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const reply = await callOpenRouter(messages);
    res.json({ reply });
  } catch (error) {
    console.error('[uLern] /api/chat error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// TTS endpoint — ElevenLabs
app.post('/api/tts', limiter, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text required' });
    }

    const audioBuffer = await callElevenLabs(text);
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error('[uLern] /api/tts error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- Serve static files from public/ ---
app.use(express.static(path.join(process.cwd(), 'public')));

// --- Serve frontend for all other routes (SPA fallback) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`[uLern] Server running on http://localhost:${PORT}`);
  console.log(`[uLern] OpenRouter: ${process.env.OPENROUTER_API_KEY ? 'configured' : 'MISSING'}`);
  console.log(`[uLern] ElevenLabs: ${process.env.ELEVENLABS_API_KEY ? 'configured' : 'MISSING'}`);
});
