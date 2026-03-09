import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Available Gemini Models
export const GEMINI_MODELS = {
  // Gemini 2.0 Models (Latest - March 2026)
  FLASH_2_0_EXP: 'gemini-2.0-flash-exp',
  FLASH_2_0: 'gemini-2.0-flash',
  FLASH_2_0_THINKING: 'gemini-2.0-flash-thinking-exp',
  
  // Gemini 1.5 Models (Stable)
  FLASH_1_5: 'gemini-1.5-flash',
  FLASH_1_5_LATEST: 'gemini-1.5-flash-latest',
  FLASH_1_5_8B: 'gemini-1.5-flash-8b',
  PRO_1_5: 'gemini-1.5-pro',
  PRO_1_5_LATEST: 'gemini-1.5-pro-latest',
  
  // Legacy Models
  PRO_1_0: 'gemini-1.0-pro',
} as const;

// Model configurations with capabilities
export const MODEL_CONFIGS = {
  [GEMINI_MODELS.FLASH_2_0_EXP]: {
    name: 'Gemini 2.0 Flash Experimental',
    description: 'Latest experimental multimodal model - fastest and most advanced',
    maxTokens: 8192,
    features: ['text', 'image', 'audio', 'video', 'tool-use', 'code-execution'],
    speed: 'fastest',
    cost: 'low',
  },
  [GEMINI_MODELS.FLASH_2_0]: {
    name: 'Gemini 2.0 Flash',
    description: 'Stable version of Gemini 2.0 Flash - production ready',
    maxTokens: 8192,
    features: ['text', 'image', 'audio', 'video', 'tool-use', 'code-execution'],
    speed: 'fastest',
    cost: 'low',
  },
  [GEMINI_MODELS.FLASH_2_0_THINKING]: {
    name: 'Gemini 2.0 Flash Thinking',
    description: 'Experimental model with enhanced reasoning and problem-solving',
    maxTokens: 8192,
    features: ['text', 'reasoning', 'problem-solving'],
    speed: 'medium',
    cost: 'low',
  },
  [GEMINI_MODELS.FLASH_1_5]: {
    name: 'Gemini 1.5 Flash',
    description: 'Fast and versatile multimodal model',
    maxTokens: 8192,
    features: ['text', 'image', 'audio', 'video'],
    speed: 'fast',
    cost: 'low',
  },
  [GEMINI_MODELS.FLASH_1_5_LATEST]: {
    name: 'Gemini 1.5 Flash Latest',
    description: 'Always points to the latest 1.5 Flash version',
    maxTokens: 8192,
    features: ['text', 'image', 'audio', 'video'],
    speed: 'fast',
    cost: 'low',
  },
  [GEMINI_MODELS.FLASH_1_5_8B]: {
    name: 'Gemini 1.5 Flash-8B',
    description: 'Smaller, faster model for high-volume tasks',
    maxTokens: 8192,
    features: ['text', 'image', 'audio', 'video'],
    speed: 'fastest',
    cost: 'lowest',
  },
  [GEMINI_MODELS.PRO_1_5]: {
    name: 'Gemini 1.5 Pro',
    description: 'Most capable model for complex tasks',
    maxTokens: 8192,
    features: ['text', 'image', 'audio', 'video', 'long-context'],
    speed: 'medium',
    cost: 'medium',
  },
  [GEMINI_MODELS.PRO_1_5_LATEST]: {
    name: 'Gemini 1.5 Pro Latest',
    description: 'Always points to the latest 1.5 Pro version',
    maxTokens: 8192,
    features: ['text', 'image', 'audio', 'video', 'long-context'],
    speed: 'medium',
    cost: 'medium',
  },
  [GEMINI_MODELS.PRO_1_0]: {
    name: 'Gemini 1.0 Pro',
    description: 'Legacy model for text-only tasks',
    maxTokens: 2048,
    features: ['text'],
    speed: 'medium',
    cost: 'low',
  },
} as const;

// Default model - Use Gemini 2.0 Flash Experimental for best performance
export const GEMINI_MODEL = process.env.GEMINI_MODEL || GEMINI_MODELS.FLASH_2_0_EXP;

// Export the AI instance
export const gemini = genAI;

// Helper function to get model
export function getGeminiModel(modelName: string = GEMINI_MODEL) {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }
  return genAI.getGenerativeModel({ model: modelName });
}

// Helper function to generate content with retry and model selection
export async function generateContent(
  prompt: string, 
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  }
) {
  const modelName = options?.model || GEMINI_MODEL;
  const model = getGeminiModel(modelName);
  
  const generationConfig = {
    temperature: options?.temperature ?? 0.7,
    maxOutputTokens: options?.maxTokens ?? 8192,
    topP: options?.topP ?? 0.95,
    topK: options?.topK ?? 40,
  };
  
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    // If rate limited or quota exceeded, try fallback model
    if (error?.message?.includes('quota') || error?.message?.includes('rate')) {
      console.log('Trying fallback model due to quota/rate limit...');
      const fallbackModel = getGeminiModel(GEMINI_MODELS.FLASH_1_5_8B);
      const result = await fallbackModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });
      return result.response.text();
    }
    
    throw error;
  }
}

// Helper function to generate content with streaming
export async function generateContentStream(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const modelName = options?.model || GEMINI_MODEL;
  const model = getGeminiModel(modelName);
  
  const generationConfig = {
    temperature: options?.temperature ?? 0.7,
    maxOutputTokens: options?.maxTokens ?? 8192,
  };
  
  try {
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    return result.stream;
  } catch (error) {
    console.error('Gemini API streaming error:', error);
    throw error;
  }
}

// Helper function to parse JSON from response
export function parseJSONFromResponse(text: string): any {
  // Remove markdown code blocks if present
  let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Try to find JSON in the response
  const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from AI response');
  }
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new Error('Invalid JSON in AI response');
  }
}

// Helper function to get model info
export function getModelInfo(modelName: string = GEMINI_MODEL) {
  return MODEL_CONFIGS[modelName as keyof typeof MODEL_CONFIGS] || MODEL_CONFIGS[GEMINI_MODELS.FLASH_2_0];
}

// Helper function to select best model for task
export function selectModelForTask(task: 'reasoning' | 'speed' | 'quality' | 'cost'): string {
  switch (task) {
    case 'reasoning':
      return GEMINI_MODELS.FLASH_2_0_THINKING;
    case 'speed':
      return GEMINI_MODELS.FLASH_2_0_EXP; // En hızlı model
    case 'quality':
      return GEMINI_MODELS.PRO_1_5_LATEST; // En kaliteli model
    case 'cost':
      return GEMINI_MODELS.FLASH_1_5_8B; // En ucuz model
    default:
      return GEMINI_MODELS.FLASH_2_0_EXP; // Varsayılan: En hızlı ve en iyi
  }
}
