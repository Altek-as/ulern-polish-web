/**
 * ComfyUI RunPod API Client for uLern-Polish
 * Generates lesson scene backgrounds and avatar portraits via SDXL on RunPod
 *
 * Used by:
 *   - server.js (CJS, via dynamic import in generateLessonVisualCJS)
 *   - scripts/generate-all-visuals.js (standalone CLI)
 */

const RUNPOD_API_URL = process.env.RUNPOD_COMFY_API_URL;
const RUNPOD_API_KEY = process.env.RUNPOD_COMFY_API_KEY;

// Lazy-load themes to avoid CJS/ESM conflicts
let _themes = null;
function getThemes() {
  if (!_themes) {
    try {
      // Try CJS first (when required from server.js)
      _themes = require('./lesson-themes.js').LESSON_THEMES;
    } catch {
      // Fallback: ESM import (when run as module)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      _themes = require('./lesson-themes.js').LESSON_THEMES;
    }
  }
  return _themes;
}

if (!RUNPOD_API_URL || !RUNPOD_API_KEY) {
  console.warn('[ComfyUI] RUNPOD_COMFY_API_URL or RUNPOD_COMFY_API_KEY not set — lesson visuals will return placeholder URLs');
}

/**
 * Submit a ComfyUI image generation job to RunPod
 * @param {string} prompt - SDXL positive prompt
 * @param {string} negativePrompt - SDXL negative prompt
 * @param {number} width - Image width (default 1024)
 * @param {number} height - Image height (default 1024)
 * @param {number} steps - Inference steps (default 25)
 * @param {number} cfg - CFG scale (default 7)
 * @returns {Promise<string>} - RunPod job ID
 */
async function submitComfyUIJob(prompt, negativePrompt, width = 1024, height = 1024, steps = 25, cfg = 7) {
  if (!RUNPOD_API_URL || !RUNPOD_API_KEY) {
    throw new Error('ComfyUI RunPod credentials not configured. Set RUNPOD_COMFY_API_URL and RUNPOD_COMFY_API_KEY in .env');
  }

  // Standard SDXL Base workflow for RunPod ComfyUI endpoint
  // Adapted for the rpa_GRYA5VWDN1CCAVGT4FPR539NT9GTDPD7X4L4O0IC1urw46 endpoint
  const workflowPayload = {
    prompt: {
      "3": {
        "inputs": {
          "seed": Math.floor(Math.random() * 9999999999),
          "steps": steps,
          "cfg": cfg,
          "sampler_name": "euler",
          "scheduler": "normal",
          "positive": ["6", "0"],
          "negative": ["7", "0"],
          "latent_image": ["18", "0"]
        },
        "class_type": "KSampler"
      },
      "6": {
        "inputs": { "text": prompt },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": { "text": negativePrompt || 'blurry, low quality, distorted, deformed, ugly, bad anatomy, text, watermark, logo, cartoon, illustration' },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "samples": ["3", "0"],
          "vae": ["9", "0"]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": {
          "location": " kiri-highgpu-workspace/ComfyUI/models/vae/",
          "model_name": "ae.safetensors"
        },
        "class_type": "VAELoader"
      },
      "18": {
        "inputs": {
          "width": width,
          "height": height,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      }
    }
  };

  const response = await fetch(`${RUNPOD_API_URL}/v1/run`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RUNPOD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workflowPayload)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ComfyUI RunPod error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.id || data.jobId;
}

/**
 * Poll for ComfyUI job completion
 * @param {string} jobId - RunPod job ID
 * @param {number} maxWaitMs - Max time to wait in ms (default 120000)
 * @returns {Promise<object>} - Job output
 */
async function pollComfyUIJob(jobId, maxWaitMs = 120000) {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const response = await fetch(`${RUNPOD_API_URL}/v1/status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${RUNPOD_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ComfyUI status poll error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const status = data.status;

    if (status === 'succeeded') {
      return data;
    } else if (status === 'failed') {
      throw new Error(`ComfyUI job failed: ${JSON.stringify(data)}`);
    }

    // Wait 5 seconds between polls
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  throw new Error(`ComfyUI job timed out after ${maxWaitMs}ms`);
}

/**
 * Extract image URL from ComfyUI job result
 * Handles various output formats from RunPod ComfyUI
 */
function extractImageUrl(result) {
  if (!result) return null;

  // Direct image URL string
  if (typeof result === 'string') return result;

  // RunPod ComfyUI output structure
  const output = result.output || result;
  if (output.images && output.images.length > 0) {
    return output.images[0];
  }

  // Direct images array
  if (Array.isArray(output) && output.length > 0) {
    return output[0];
  }

  return null;
}

/**
 * Generate a lesson visual (scene background and/or avatar portrait)
 * @param {number} lessonId
 * @param {'scene'|'avatar'|'both'} type
 * @returns {Promise<{sceneUrl?: string, avatarUrl?: string}>}
 */
async function generateLessonVisual(lessonId, type = 'both') {
  const themes = getThemes();
  const theme = themes[lessonId];

  if (!theme) {
    throw new Error(`No theme defined for lesson ${lessonId}`);
  }

  const negativePrompt = 'blurry, low quality, distorted, deformed, ugly, bad anatomy, text, watermark, logo, cartoon, illustration';
  const result = {};

  if (type === 'scene' || type === 'both') {
    console.log(`[ComfyUI] Generating scene for lesson ${lessonId}: ${theme.theme}`);
    const jobId = await submitComfyUIJob(
      theme.scenePrompt,
      negativePrompt,
      1024, 1024, 25, 7
    );
    const jobResult = await pollComfyUIJob(jobId);
    result.sceneUrl = extractImageUrl(jobResult);
  }

  if (type === 'avatar' || type === 'both') {
    console.log(`[ComfyUI] Generating avatar for lesson ${lessonId}: ${theme.avatarStyle}`);
    const jobId = await submitComfyUIJob(
      theme.avatarPrompt,
      negativePrompt + ', NSFW',
      1024, 1024, 25, 7
    );
    const jobResult = await pollComfyUIJob(jobId);
    result.avatarUrl = extractImageUrl(jobResult);
  }

  return result;
}

/**
 * Get theme data for a lesson without generating images
 */
function getLessonTheme(lessonId) {
  const themes = getThemes();
  return themes[lessonId] || null;
}

module.exports = {
  submitComfyUIJob,
  pollComfyUIJob,
  generateLessonVisual,
  getLessonTheme
};
