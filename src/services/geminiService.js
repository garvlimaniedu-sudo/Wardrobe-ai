const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

async function callGemini(parts) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] })
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Gemini API error')
  }
  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

export async function getDailyOutfit(userProfile, wardrobeItems) {
  if (!wardrobeItems || wardrobeItems.length === 0) {
    return null
  }
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
  const prompt = `You are a professional personal stylist. Today is ${today}.

Person's profile:
- Name: ${userProfile.full_name || 'User'}
- Body type: ${userProfile.body_type || 'not specified'}
- Skin tone: ${userProfile.skin_tone || 'not specified'}
- Height: ${userProfile.height ? userProfile.height + 'cm' : 'not specified'}
- Preferred styles: ${(userProfile.preferred_styles || []).join(', ') || 'not specified'}

Their wardrobe:
${wardrobeItems.map(i => `- ${i.name} (${i.category}, ${i.colour || 'colour unspecified'}, ${i.season || 'all season'}, ${i.occasion || 'everyday'})`).join('\n')}

Suggest a complete outfit for today from their wardrobe. List each item clearly. Explain why this combination works for their body type and skin tone. Give one tip to elevate the look. Keep the tone warm, personal, and encouraging. Format clearly with the outfit first, then explanation, then tip.`

  return callGemini([{ text: prompt }])
}

export async function getDressingRoomAssessment(userProfile, base64Image, mimeType = 'image/jpeg') {
  const prompt = `You are a professional personal stylist. The person in this photo is trying on clothes and wants your honest assessment.

Their profile:
- Body type: ${userProfile.body_type || 'not specified'}
- Skin tone: ${userProfile.skin_tone || 'not specified'}
- Height: ${userProfile.height ? userProfile.height + 'cm' : 'not specified'}
- Gender: ${userProfile.gender || 'not specified'}
- Preferred styles: ${(userProfile.preferred_styles || []).join(', ') || 'not specified'}

Please tell them:
1. Does this outfit suit them and why?
2. What works well about this look?
3. What would you change or improve?
4. One alternative outfit suggestion.

Keep the tone warm, honest, and encouraging — like a trusted friend who is a stylist.`

  return callGemini([
    { text: prompt },
    { inline_data: { mime_type: mimeType, data: base64Image } }
  ])
}
