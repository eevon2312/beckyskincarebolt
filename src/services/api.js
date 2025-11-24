const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SKIN_ANALYSIS_MODEL = 'google/gemini-2.5-flash';
const PRODUCT_ANALYSIS_MODEL = 'google/gemini-2.5-flash';

if (!OPENROUTER_API_KEY) {
  console.error('❌ OpenRouter API key is missing!');
}

function stripMarkdown(text) {
  let cleaned = text.replace(/```json\n?/g, '');
  cleaned = cleaned.replace(/```\n?/g, '');
  cleaned = cleaned.trim();
  return cleaned;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callOpenRouter(prompt, imageBase64, model) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    throw new Error('Please add your OpenRouter API key to the .env file');
  }

  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: prompt
        },
        {
          type: 'image_url',
          image_url: {
            url: imageBase64
          }
        }
      ]
    }
  ];

  console.log('📡 Calling OpenRouter API');
  console.log('🔑 OpenRouter endpoint:', OPENROUTER_API_URL);

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://skincare-app.local',
      'X-Title': 'Skincare Analysis App'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 8000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenRouter API error:', errorData);
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ OpenRouter API response received');

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid API response format');
  }

  return data.choices[0].message.content;
}

export async function analyzeSkin(imageBase64) {
  try {
    console.log('🔍 API: Starting skin analysis');
    console.log('📊 Using model:', SKIN_ANALYSIS_MODEL);
    console.log('🔑 OpenRouter endpoint:', OPENROUTER_API_URL);
    console.log('API Key available:', OPENROUTER_API_KEY ? 'YES' : 'NO');
    console.log('Image data length:', imageBase64?.length || 0);

    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key is missing');
    }

    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const prompt = `You are a board-certified dermatologist conducting a detailed skin analysis. Examine this facial photo with clinical precision and provide evidence-based recommendations.

ANALYSIS PROTOCOL:
1. Examine skin type indicators:
   - Pore size and visibility
   - Oil/shine distribution
   - Texture and smoothness
   - Hydration levels
   - Sensitivity markers

2. Identify ALL visible concerns:
   - Acne types (comedonal, papular, pustular, nodular, cystic)
   - Inflammation patterns and severity
   - Pigmentation irregularities (PIH, melasma, sun damage)
   - Texture issues (roughness, unevenness, scarring)
   - Vascular concerns (redness, broken capillaries)
   - Signs of aging (fine lines, loss of elasticity)
   - Pore congestion and enlargement

3. Note exact anatomical locations:
   - Be specific: "mid-forehead", "lower left cheek", "perioral area", "T-zone"
   - Describe distribution patterns

4. Assess severity objectively:
   - Mild: Minimal impact, limited area (<25% of face)
   - Moderate: Noticeable impact, several areas (25-50%)
   - Severe: Significant impact, widespread (>50%)

5. Provide targeted, evidence-based recommendations:
   - Match ingredients to SPECIFIC concerns identified
   - Include concentration guidance when relevant
   - Specify application timing and frequency
   - Prioritize treatments by effectiveness

CRITICAL RULES:
- Base analysis ONLY on what you observe in THIS photo
- Do not make generic assumptions
- Be specific about locations and concern types
- Provide personalized advice, not template responses
- Include encouraging observations about healthy skin aspects

Return ONLY valid JSON (no markdown, no code blocks, no explanatory text):

{
  "skinType": "oily|dry|combination|sensitive|normal",
  "healthScore": 78,
  "concerns": [
    {
      "type": "Specific clinical term (e.g., 'Inflammatory Pustular Acne', 'Post-inflammatory Erythema', 'Comedonal Acne', 'Hyperpigmentation')",
      "severity": "mild|moderate|severe",
      "location": "Precise anatomical location (e.g., 'bilateral cheeks', 'central forehead', 'chin and jawline', 'perioral region')",
      "description": "Detailed clinical observation: What exactly do you see? Include characteristics like color, distribution, quantity, stage of development"
    }
  ],
  "recommendations": [
    {
      "ingredient": "Specific active ingredient with percentage if standard (e.g., 'Benzoyl Peroxide 2.5%', 'Niacinamide 10%', 'Retinol 0.5%')",
      "reason": "Precise mechanism: How this ingredient addresses the SPECIFIC concern you identified in THIS photo",
      "productType": "Cleanser|Toner|Serum|Treatment|Moisturizer|Sunscreen|Mask",
      "usage": "AM|PM|Both"
    }
  ],
  "positives": [
    "Specific positive observations about THIS person's skin health (e.g., 'Good skin barrier function evident by intact texture', 'Even skin tone in unaffected areas', 'Healthy hydration levels visible')"
  ],
  "nextSteps": [
    "Concrete, actionable steps prioritized by importance (e.g., 'Apply hydrocolloid patches to active pustules before bed', 'Introduce BHA exfoliant 2x weekly, gradually increasing', 'Switch to fragrance-free, non-comedogenic products')"
  ]
}

REMEMBER: This is a real person seeking specific guidance. Provide analysis worthy of a professional dermatology consultation.`;

    const responseText = await callOpenRouter(prompt, imageBase64, SKIN_ANALYSIS_MODEL);
    const cleanedText = stripMarkdown(responseText);
    const data = JSON.parse(cleanedText);

    if (!data.skinType || !data.healthScore) {
      throw new Error("Invalid response format");
    }

    return data;

  } catch (error) {
    console.error("❌ Skin analysis error:", error);
    console.error('Error details:', error.message);
    throw error;
  }
}

export async function analyzeProducts(imageBase64) {
  try {
    console.log('🔍 Starting product analysis...');
    console.log('📊 Using model:', PRODUCT_ANALYSIS_MODEL);
    console.log('🔑 OpenRouter endpoint:', OPENROUTER_API_URL);
    console.log('API Key available:', OPENROUTER_API_KEY ? 'YES' : 'NO');
    console.log('📸 Image data length:', imageBase64?.length || 0);
    console.log('📸 Image starts with:', imageBase64.substring(0, 50));

    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key is missing');
    }

    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const prompt = `Analyze these skincare products. Return ONLY valid JSON with NO extra text:

{
  "products": [
    {
      "name": "Product name",
      "brand": "Brand",
      "category": "cleanser|toner|serum|moisturizer|treatment",
      "keyIngredients": ["ingredient1", "ingredient2"]
    }
  ],
  "suggestions": [
    {
      "type": "redundancy|gap",
      "title": "Brief title",
      "description": "One sentence explanation"
    }
  ],
  "conflicts": [
    {
      "severity": "high|medium|low",
      "products": ["Product A", "Product B"],
      "issue": "Brief conflict description",
      "solution": "Brief solution"
    }
  ],
  "routine": {
    "AM": [
      {
        "step": 1,
        "category": "CLEANSER",
        "product": "Product name",
        "instructions": "Brief how-to"
      }
    ],
    "PM": [
      {
        "step": 1,
        "category": "CLEANSER",
        "product": "Product name",
        "instructions": "Brief how-to"
      }
    ]
  },
  "missing": [
    {
      "category": "What's missing",
      "importance": "critical|recommended",
      "reason": "Brief reason"
    }
  ]
}

Identify all visible products. Keep descriptions brief - one sentence each. Return complete valid JSON only.`;

    const responseText = await callOpenRouter(prompt, imageBase64, PRODUCT_ANALYSIS_MODEL);

    if (!responseText) {
      throw new Error("API returned empty response");
    }

    console.log("📝 Raw response length:", responseText.length);
    console.log("📝 First 500 chars:", responseText.substring(0, 500));

    // Aggressive cleanup
    let cleaned = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .trim();

    // Find JSON boundaries
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      console.error("❌ No valid JSON found");
      throw new Error("Could not find valid JSON in response");
    }

    // Extract ONLY the JSON object
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

    console.log("🧹 Cleaned length:", cleaned.length);
    console.log("🧹 Last 200 chars:", cleaned.substring(cleaned.length - 200));

    // Validate JSON structure before parsing
    if (!cleaned.endsWith('}')) {
      console.warn("⚠️ JSON doesn't end with }, attempting to fix...");
      cleaned = cleaned + '}';
    }

    try {
      const results = JSON.parse(cleaned);
      console.log("✅ Successfully parsed!");
      console.log("📦 Products:", results.products?.length || 0);
      console.log("💡 Suggestions:", results.suggestions?.length || 0);

      if (!results.products || results.products.length === 0) {
        throw new Error("No products could be identified. Please ensure product labels are clearly visible.");
      }

      if (!results.routine || !results.routine.AM || !results.routine.PM) {
        throw new Error("Invalid routine format in response");
      }

      return results;
    } catch (parseError) {
      console.error("❌ Parse failed:", parseError.message);
      throw new Error("Failed to parse API response. The response may be incomplete.");
    }

  } catch (error) {
    console.error("❌ Product analysis failed:", error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to analyze products: ${error.message}`);
  }
}
