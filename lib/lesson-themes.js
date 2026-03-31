/**
 * Lesson Visual Themes for uLern-Polish
 * Plain CommonJS module — used by server.js and comfyui-client.js
 * Maps each lesson ID to scene/avatar generation prompts
 */

const LESSON_THEMES = {
  1: {
    theme: 'polish_classroom',
    scenePrompt: 'Cozy Polish language classroom interior, warm afternoon light through tall windows, wooden desks with Polish textbooks and alphabet charts on walls, colorful letter cards displayed (ą, ć, ę, ł, ń, ó, ś, ź, ż), globe of Poland on shelf, cozy learning atmosphere, soft bokeh background, cinematic lighting, 8k photorealistic',
    avatarPrompt: 'Warm friendly Polish teacher, mid-30s, kind smile, casual smart casual outfit, standing in classroom, pointing at alphabet chart, photorealistic, soft lighting, 8k portrait',
    avatarStyle: 'portrait_teacher'
  },
  2: {
    theme: 'street_cafe',
    scenePrompt: 'Charming Warsaw old town street cafe on cobblestone street, two people greeting each other warmly, warm golden hour light, outdoor seating with coffee cups, fairy lights, blooming window boxes, Polish flag bunting in background, European cafe atmosphere, photorealistic, cinematic',
    avatarPrompt: 'Friendly Polish woman, late 20s, bright smile, casual stylish outfit, outdoor cafe setting, soft natural lighting, 8k portrait, photorealistic',
    avatarStyle: 'portrait_casual'
  },
  3: {
    theme: 'market_square',
    scenePrompt: 'Colorful Polish market square, bustling morning scene, fruit and vegetable stalls with bright displays, numbers and prices on wooden signs, people shopping, warm sunlight, European market atmosphere, flower stalls nearby, photorealistic, 8k, cinematic lighting',
    avatarPrompt: 'Friendly Polish market vendor, middle-aged woman, warm smile, traditional Polish scarf, standing behind colorful fruit stall, market setting, natural soft lighting, 8k portrait photorealistic',
    avatarStyle: 'portrait_vendor'
  },
  4: {
    theme: 'home_study',
    scenePrompt: 'Cozy Polish home study room, wooden desk with laptop, verb conjugation charts on the wall in Polish, warm evening lamp light, books in Polish language, open notebook with handwritten verbs, plants on windowsill, rain outside window, hygge atmosphere, photorealistic, 8k',
    avatarPrompt: 'Polish student, young adult, focused concentration, casual hoodie, sitting at wooden desk in cozy study, notebook with Polish verbs, warm lamp light, photorealistic, 8k portrait',
    avatarStyle: 'portrait_student'
  },
  5: {
    theme: 'traditional_restaurant',
    scenePrompt: 'Traditional Polish restaurant interior, rustic wooden tables set for dinner, pierogi and bigos on the menu board, warm candlelight, red and white checkered tablecloths, Polish folk art on walls, waiter in traditional outfit, cozy pub atmosphere, photorealistic, 8k, cinematic',
    avatarPrompt: 'Friendly Polish waiter, 30s, smart casual, holding menu, standing in traditional Polish restaurant, warm amber lighting, photorealistic 8k portrait',
    avatarStyle: 'portrait_waiter'
  },
  6: {
    theme: 'city_street_intersection',
    scenePrompt: 'Warsaw city street intersection, pedestrian crossing with direction signs, street signs in Polish, person holding map, modern city architecture, sunny day, people asking for directions, tram lines on street, urban European city, photorealistic, 8k, cinematic',
    avatarPrompt: 'Friendly Polish local, 30s man, pointing directions on street corner, wearing casual jacket, holding unfolded map, city street background, natural daylight, photorealistic 8k portrait',
    avatarStyle: 'portrait_local'
  },
  7: {
    theme: 'clock_tower_square',
    scenePrompt: 'Polish city main square with ornate clock tower, seasonal scene with autumn leaves or spring flowers, market stalls in background, people glancing at watches, calendar visible, Rynek market square architecture, European plaza, beautiful golden hour light, 8k photorealistic cinematic',
    avatarPrompt: 'Cheerful Polish woman checking elegant wristwatch, 20s, standing in historic market square, wearing seasonal outfit, soft smile, natural daylight, 8k photorealistic portrait',
    avatarStyle: 'portrait_seasonal'
  },
  8: {
    theme: 'home_living_room',
    scenePrompt: 'Warm Polish family living room, multigenerational family gathering, grandmother and grandfather with grandchildren, family photos on mantelpiece, comfortable couch, tea and cakes on coffee table, Christmas decorations or summer afternoon light, warm domestic atmosphere, photorealistic, 8k, cinematic',
    avatarPrompt: 'Warm smiling Polish grandmother, 60s, cozy living room setting, holding teacup, intergenerational warmth, soft warm lighting, photorealistic 8k portrait',
    avatarStyle: 'portrait_grandparent'
  },
  9: {
    theme: 'art_studio',
    scenePrompt: 'Bright colorful art studio, paint palette with vivid colors, colorful clothing items on display, color theory charts on wall, paint tubes and brushes scattered, large windows with natural light, creative artistic atmosphere, photorealistic 8k, cinematic',
    avatarPrompt: 'Creative Polish artist, 30s, colorful paint-smattered apron, holding colorful fabric swatches, standing in bright art studio, playful creative expression, natural window light, 8k photorealistic portrait',
    avatarStyle: 'portrait_artist'
  },
  10: {
    theme: 'boutique_shop',
    scenePrompt: 'Stylish Polish boutique clothing store, elegant displays of dresses and suits, fitting rooms with mirrors, sale signs in Polish, warm boutique lighting, wooden racks with colorful clothing, boutique shopping experience, European fashion store, 8k photorealistic cinematic',
    avatarPrompt: 'Stylish Polish shop assistant, 20s woman, elegant outfit, standing in boutique clothing store, holding garment, warm boutique lighting, 8k photorealistic portrait',
    avatarStyle: 'portrait_shop_assistant'
  },
  11: {
    theme: 'train_station_platform',
    scenePrompt: 'Polish PKP train station platform, modern train arriving, departure board showing Polish city names, luggage on platform, passengers boarding, station architecture with European design, golden morning light through station roof, photorealistic 8k cinematic',
    avatarPrompt: 'Polish traveller, 30s woman with suitcase, standing on train platform, departure board visible behind, station setting, natural station lighting, 8k photorealistic portrait',
    avatarStyle: 'portrait_traveller'
  },
  12: {
    theme: 'city_park_weather',
    scenePrompt: 'Polish city park in dynamic weather, autumn golden leaves or spring blossoms, people with umbrellas in light rain, bright sunny day with clouds, lake with ducks, park benches, diverse seasonal weather scenes, beautiful Polish urban park, 8k photorealistic cinematic',
    avatarPrompt: 'Friendly Polish person, 30s, holding colorful umbrella, standing in beautiful city park, dynamic weather atmosphere, soft natural light, 8k photorealistic portrait',
    avatarStyle: 'portrait_park'
  },
  13: {
    theme: 'modern_clinic',
    scenePrompt: 'Modern Polish medical clinic interior, clean reception area with Polish signage, doctor in white coat with stethoscope, medical equipment visible, pharmacy counter in background, professional healthcare environment, bright clinical lighting, photorealistic 8k cinematic',
    avatarPrompt: 'Professional Polish female doctor, 40s, white coat, friendly professional smile, stethoscope, standing in modern clinic, warm but clinical lighting, 8k photorealistic portrait',
    avatarStyle: 'portrait_doctor'
  },
  14: {
    theme: 'university_lecture_hall',
    scenePrompt: 'University lecture hall in Poland, blackboard with Polish grammar diagrams and case charts, students taking notes, professor at podium, grammar reference posters on walls (Mianownik, Dopełniacz, Celownik etc.), academic atmosphere, warm university lighting, photorealistic 8k cinematic',
    avatarPrompt: 'Polish university professor, 50s man, academic attire, standing at university lecture hall, gesturing at grammar board, warm academic lighting, 8k photorealistic portrait',
    avatarStyle: 'portrait_professor'
  },
  15: {
    theme: 'modern_home_office',
    scenePrompt: 'Modern Polish home office, dual monitors with code and web browser, fast internet router, Polish keyboard, tech gadget setup, smartphone and tablet, LED desk lamp, clean minimal Scandinavian design, afternoon light through window, photorealistic 8k cinematic',
    avatarPrompt: 'Polish IT professional, 30s man, casual smart tech worker, sitting at modern home office desk with monitors, focused friendly expression, warm LED desk lighting, 8k photorealistic portrait',
    avatarStyle: 'portrait_tech'
  },
  16: {
    theme: 'smartphone_call',
    scenePrompt: 'Beautiful Polish person holding modern smartphone, video call on screen showing friendly face, sitting in modern apartment, soft portrait lighting, contemporary urban interior, mobile phone in hand, communication technology, photorealistic 8k portrait style',
    avatarPrompt: 'Friendly Polish person, 30s, holding smartphone making video call, smiling warmly at screen, modern urban apartment background, soft flattering portrait lighting, 8k photorealistic',
    avatarStyle: 'portrait_phone'
  },
  17: {
    theme: 'modern_office_building',
    scenePrompt: 'Modern Polish corporate office interior, open plan workspace, Polish colleagues in business casual attire in meeting room, professional office environment, city skyline visible through glass walls, corporate business atmosphere, 8k photorealistic cinematic',
    avatarPrompt: 'Professional Polish business woman, 30s, smart business casual outfit, standing in modern office corridor, professional confident smile, corporate setting, natural office lighting, 8k photorealistic portrait',
    avatarStyle: 'portrait_business'
  }
};

module.exports = { LESSON_THEMES };
