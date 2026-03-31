#!/usr/bin/env node
/**
 * generate-all-visuals.js
 * ========================
 * Batch-generates all lesson visuals via ComfyUI RunPod.
 * Generates both scene backgrounds AND avatar portraits for all 17 lessons.
 *
 * Usage:
 *   node scripts/generate-all-visuals.js          # Generate all lessons
 *   node scripts/generate-all-visuals.js 1 2 3    # Generate lessons 1, 2, 3 only
 *   node scripts/generate-all-visuals.js --scene  # Scene backgrounds only
 *   node scripts/generate-all-visuals.js --avatar # Avatar portraits only
 *
 * Requires:
 *   RUNPOD_COMFY_API_URL and RUNPOD_COMFY_API_KEY in .env
 *   dotenv (auto-loaded via require('dotenv'))
 *
 * Output:
 *   outputs/lesson-visuals/lesson-{id}-scene.png
 *   outputs/lesson-visuals/lesson-{id}-avatar.png
 *   lesson-visuals-manifest.json  (index of all generated URLs/paths)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { generateLessonVisual, getLessonTheme } = require('../lib/comfyui-client.js');

const OUTPUT_DIR = path.join(__dirname, '..', 'outputs', 'lesson-visuals');
const MANIFEST_PATH = path.join(__dirname, '..', 'outputs', 'lesson-visuals-manifest.json');

// Parse CLI args
const args = process.argv.slice(2);
const sceneOnly = args.includes('--scene');
const avatarOnly = args.includes('--avatar');
const lessonIds = args.filter(arg => !arg.startsWith('--')).map(Number).filter(n => !isNaN(n));

// Resolve type
let visualType = 'both';
if (sceneOnly && !avatarOnly) visualType = 'scene';
if (avatarOnly && !sceneOnly) visualType = 'avatar';

async function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`[setup] Created output directory: ${OUTPUT_DIR}`);
  }
}

async function downloadAndSaveImage(imageData, filename) {
  // imageData can be a URL string or a base64 data URI
  if (!imageData) return null;

  try {
    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:')) {
        // Base64 data URI — decode and save
        const base64 = imageData.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');
        const filepath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filepath, buffer);
        console.log(`  [saved] ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        return filepath;
      } else if (imageData.startsWith('http')) {
        // URL — download it
        const response = await fetch(imageData);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        const filepath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filepath, buffer);
        console.log(`  [saved] ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        return filepath;
      }
    }
  } catch (err) {
    console.warn(`  [warn] Could not save ${filename}: ${err.message}`);
  }
  return null;
}

async function generateForLesson(lessonId) {
  const theme = getLessonTheme(lessonId);
  if (!theme) {
    console.warn(`[skip]  Lesson ${lessonId} — no theme defined`);
    return null;
  }

  console.log(`\n[lesson ${lessonId}] ${theme.theme}`);
  console.log(`  type: ${visualType}`);

  const result = await generateLessonVisual(lessonId, visualType);

  const entry = {
    lessonId,
    theme: theme.theme,
    avatarStyle: theme.avatarStyle,
    scenePath: null,
    avatarPath: null
  };

  if (result.sceneUrl) {
    const scenePath = await downloadAndSaveImage(
      result.sceneUrl,
      `lesson-${lessonId}-scene.png`
    );
    entry.scenePath = scenePath;
  }

  if (result.avatarUrl) {
    const avatarPath = await downloadAndSaveImage(
      result.avatarUrl,
      `lesson-${lessonId}-avatar.png`
    );
    entry.avatarPath = avatarPath;
  }

  return entry;
}

async function main() {
  console.log('===============================================');
  console.log(' uLern-Polish — ComfyUI Lesson Visuals Generator');
  console.log('===============================================');
  console.log(`Type:   ${visualType}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  // Check credentials
  if (!process.env.RUNPOD_COMFY_API_URL || !process.env.RUNPOD_COMFY_API_KEY) {
    console.error('\n[ERROR] RUNPOD_COMFY_API_URL and RUNPOD_COMFY_API_KEY must be set in .env');
    console.error('See .env.example for the ComfyUI configuration template.');
    process.exit(1);
  }

  await ensureOutputDir();

  // Determine which lessons to process
  const { LESSON_THEMES } = require('../lib/lesson-themes.js');
  const allLessonIds = Object.keys(LESSON_THEMES).map(Number);
  const targetLessonIds = lessonIds.length > 0
    ? lessonIds.filter(id => allLessonIds.includes(id))
    : allLessonIds;

  console.log(`\nLessons: ${targetLessonIds.join(', ')}`);
  console.log(`Total:   ${targetLessonIds.length} lesson(s)\n`);

  const manifest = { generatedAt: new Date().toISOString(), lessons: [] };

  for (const lessonId of targetLessonIds) {
    try {
      const entry = await generateForLesson(lessonId);
      if (entry) manifest.lessons.push(entry);
    } catch (err) {
      console.error(`[ERROR] Lesson ${lessonId} failed: ${err.message}`);
      manifest.lessons.push({ lessonId, error: err.message });
    }
  }

  // Save manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n[done] Manifest saved to: ${MANIFEST_PATH}`);

  const succeeded = manifest.lessons.filter(l => !l.error).length;
  const failed = manifest.lessons.filter(l => l.error).length;
  console.log(`\nResults: ${succeeded} succeeded, ${failed} failed`);
  console.log('===============================================');
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
