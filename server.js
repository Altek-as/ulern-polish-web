/**
 * uLern-Polish - Express Backend Server
 * Serves static WebXR frontend and handles AI API calls (OpenRouter + ElevenLabs)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

// Initialize Stripe (uses STRIPE_SECRET_KEY from .env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

// Supabase server-side client (uses service role key — never expose to client)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
const SYSTEM_PROMPT = `Jesteś przyjaznym polskim nauczycielem języka. Pomagasz użytkownikom ćwiczyć rozmowną polszczyznę.
Utrzymuj odpowiedzi KRÓTKIE (1-3 zdania maksymalnie) i po polsku.
Używaj prostego słownictwa odpowiedniego dla początkujących.
Bądź zachęcający i cierpliwy.
Jeśli użytkownik popełnia błędy gramatyczne, delikatnie je koryguj w wspierający sposób.
Zawsze odpowiadaj tylko po polsku.`;

async function callOpenRouter(messages, lessonContext) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  // Inject system prompt if not present
  const hasSystem = messages.some(m => m.role === 'system');
  let systemContent = SYSTEM_PROMPT;
  if (lessonContext && lessonContext.title) {
    const ctxParts = [`Lekcja: ${lessonContext.title}`];
    if (lessonContext.description) ctxParts.push(`Temat: ${lessonContext.description}`);
    if (lessonContext.difficulty) ctxParts.push(`Poziom: ${lessonContext.difficulty}`);
    systemContent = `${SYSTEM_PROMPT}\n\n[Kontekst — ${ctxParts.join(' | ')}]`;
  }
  const fullMessages = hasSystem ? messages : [
    { role: 'system', content: systemContent },
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
    elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    whisper: !!process.env.RUNPOD_WHISPER_API_URL,
    supabase: !!process.env.SUPABASE_URL
  });
});

// Chat endpoint — OpenRouter GPT-4o-mini
app.post('/api/chat', limiter, async (req, res) => {
  try {
    const { messages, lessonContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const reply = await callOpenRouter(messages, lessonContext);
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

// STT endpoint — RunPod Whisper
app.post('/api/stt', limiter, async (req, res) => {
  try {
    const { audioUrl } = req.body; // base64 encoded audio
    const apiKey = process.env.RUNPOD_WHISPER_API_KEY;
    const endpointUrl = process.env.RUNPOD_WHISPER_API_URL;

    if (!endpointUrl) {
      // TODO: Once RUNPOD_WHISPER_API_URL is configured, uncomment the line below
      // and remove this fallback response
      return res.status(503).json({ error: 'RUNPOD_WHISPER_API_URL not configured. Whisper STT deployment pending.' });
      // In production, remove the return above and use:
      // throw new Error('RUNPOD_WHISPER_API_URL not configured');
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'RUNPOD_WHISPER_API_KEY not configured. Whisper STT deployment pending.' });
    }

    // Call RunPod Whisper endpoint
    const response = await fetch(`${endpointUrl}/v1/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ audio: audioUrl })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Whisper error ${response.status}: ${err}`);
    }

    const data = await response.json();
    res.json({ text: data.text || '' });
  } catch (error) {
    console.error('[uLern] /api/stt error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register — Supabase Auth
app.post('/api/auth/register', limiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name }
    });

    if (error) throw error;

    res.json({
      success: true,
      user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata.name, createdAt: data.user.created_at }
    });
  } catch (error) {
    console.error('[uLern] /api/auth/register error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/generate-lesson-visual — ComfyUI RunPod lesson visuals
const { LESSON_THEMES } = require('./lib/lesson-themes.js');
const { submitComfyUIJob, pollComfyUIJob } = require('./lib/comfyui-client.js');

app.post('/api/generate-lesson-visual', limiter, async (req, res) => {
  try {
    const { lessonId, type } = req.body; // type: 'scene' | 'avatar' | 'both'
    if (!lessonId) return res.status(400).json({ error: 'lessonId required' });

    const validTypes = ['scene', 'avatar', 'both'];
    const visualType = validTypes.includes(type) ? type : 'both';

    const result = await generateLessonVisualCJS(Number(lessonId), visualType);
    res.json({ success: true, lessonId, ...result });
  } catch (error) {
    console.error('[uLern] /api/generate-lesson-visual error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/lesson-theme/:id — get theme metadata for a lesson
app.get('/api/lesson-theme/:id', (req, res) => {
  const theme = LESSON_THEMES[Number(req.params.id)];
  if (!theme) return res.status(404).json({ error: 'Lesson theme not found' });
  res.json({ lessonId: Number(req.params.id), ...theme });
});

// CJS wrapper — calls the ESM comfyui-client via dynamic import
async function generateLessonVisualCJS(lessonId, type) {
  const { generateLessonVisual } = await import('./lib/comfyui-client.js');
  return generateLessonVisual(lessonId, type);
}

// POST /api/auth/login — Supabase Auth
app.post('/api/auth/login', limiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Missing email or password' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    res.json({
      success: true,
      user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata.name, createdAt: data.user.created_at }
    });
  } catch (error) {
    console.error('[uLern] /api/auth/login error:', error.message);
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// --- Stripe Webhook (MUST be before express.json() — needs raw body) ---
// POST /api/webhook — Stripe webhook handler
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // No secret configured — parse the body directly (dev only)
      event = JSON.parse(req.body);
      console.warn('[Stripe] Webhook secret not set — skipping signature verification (dev mode only)');
    }
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('[Stripe] Checkout completed:', session.id);
      // TODO: Grant premium access to user (update Supabase / user record)
      // const customerId = session.customer;
      // const userId = session.metadata?.userId;
      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('[Stripe] Payment succeeded:', paymentIntent.id);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('[Stripe] Payment failed:', paymentIntent.id);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log('[Stripe] Subscription cancelled:', subscription.id);
      // TODO: Revoke premium access
      break;
    }
    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// POST /api/create-checkout-session — Create a Stripe Checkout session
app.post('/api/create-checkout-session', limiter, async (req, res) => {
  try {
    const { priceId, userId, userEmail } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'priceId is required' });
    }

    const origin = req.headers.origin || 'http://localhost:3000';

    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout-cancel`,
      metadata: {},
    };

    // Attach user ID and email if provided
    if (userId) sessionParams.metadata.userId = userId;
    if (userEmail) sessionParams.metadata.userEmail = userEmail;

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[Stripe] /api/create-checkout-session error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/subscription-status — Stub: return mock subscription data
app.get('/api/subscription-status', limiter, async (req, res) => {
  // TODO: Replace with real Supabase lookup once user auth is integrated
  // const userId = req.headers['x-user-id'];
  res.json({
    subscription: 'free',
    plan: 'Free',
    expiresAt: null,
    message: 'Stub — integrate with Supabase user records once auth is wired up',
  });
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
  console.log(`[uLern] Supabase: ${process.env.SUPABASE_URL ? 'configured' : 'MISSING'}`);
});
