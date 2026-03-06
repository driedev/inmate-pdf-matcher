import OpenAI from 'openai';
import { ProcessResponse } from '@shared/schema';

// This is provided automatically by Replit AI Integrations Blueprint
// We are using the gpt-5.2 model for general text tasks
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function detectDocumentType(text: string): Promise<{ type: string; confidence: number }> {
  try {
    const prompt = `Classify the following text into one of these categories:
- Booking Summary
- Court Docket Notice
- Crash Report
- Unknown

Return JSON exactly like this:
{
  "type": "string",
  "confidence": number // between 0 and 1
}

Text:
${text.substring(0, 4000)} // truncate to avoid token limits just in case
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const resultString = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(resultString);
    
    return {
      type: result.type || "Unknown",
      confidence: typeof result.confidence === 'number' ? result.confidence : 0,
    };
  } catch (error) {
    console.error("Error detecting document type:", error);
    return { type: "Unknown", confidence: 0 };
  }
}
