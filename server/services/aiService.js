import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export class AIService {
  async generateViralPost(audience, niche) {
    const prompt = this.buildPrompt(audience, niche)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7
    })

    return JSON.parse(completion.choices[0].message.content)
  }

  buildPrompt(audience, niche) {
    return `Generate viral ${niche} post for:
Audience: ${JSON.stringify(audience)}
Max 280 chars, use top emojis/hashtags, strong CTA. JSON only.`
  }
}

export const aiService = new AIService()