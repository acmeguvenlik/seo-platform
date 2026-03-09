import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Default model
export const GEMINI_MODEL = 'gemini-1.5-flash';

// Export the AI instance
export const gemini = genAI;

// Helper function to get model
export function getGeminiModel(modelName: string = GEMINI_MODEL) {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }
  return genAI.getGenerativeModel({ model: modelName });
}

// Helper function to generate content with retry
export async function generateContent(prompt: string, modelName?: string) {
  const model = getGeminiModel(modelName);
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Helper function to parse JSON from response
export function parseJSONFromResponse(text: string): any {
  // Try to find JSON in the response
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from AI response');
  }
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error('Invalid JSON in AI response');
  }
}
