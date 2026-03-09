# Gemini AI Models Guide

This document explains the available Gemini AI models and how to choose the right one for your use case.

## Available Models

### Gemini 2.0 Flash (Recommended) ⚡
**Model ID:** `gemini-2.0-flash-exp`

- **Best for:** General-purpose SEO tasks, fast responses
- **Features:** Multimodal (text, image, audio, video), native tool use
- **Speed:** Fastest
- **Cost:** Low
- **Max Tokens:** 8,192
- **Use cases:**
  - SEO audits
  - Meta tag generation
  - Content optimization
  - Keyword suggestions
  - Title generation

### Gemini 2.0 Flash Thinking 🧠
**Model ID:** `gemini-2.0-flash-thinking-exp-1219`

- **Best for:** Complex reasoning and problem-solving
- **Features:** Enhanced reasoning capabilities
- **Speed:** Medium
- **Cost:** Low
- **Max Tokens:** 8,192
- **Use cases:**
  - Complex SEO strategy planning
  - Content gap analysis
  - Competitive analysis
  - Advanced schema generation

### Gemini 1.5 Flash 🚀
**Model ID:** `gemini-1.5-flash`

- **Best for:** Stable, production-ready tasks
- **Features:** Multimodal, proven reliability
- **Speed:** Fast
- **Cost:** Low
- **Max Tokens:** 8,192
- **Use cases:**
  - Production environments
  - High-volume tasks
  - Reliable content generation

### Gemini 1.5 Flash-8B 💨
**Model ID:** `gemini-1.5-flash-8b`

- **Best for:** High-volume, cost-sensitive tasks
- **Features:** Smallest model, fastest responses
- **Speed:** Fastest
- **Cost:** Lowest
- **Max Tokens:** 8,192
- **Use cases:**
  - Bulk operations
  - Simple text generation
  - Cost optimization
  - Rate limit fallback

### Gemini 1.5 Pro 🎯
**Model ID:** `gemini-1.5-pro`

- **Best for:** Complex, high-quality tasks
- **Features:** Most capable, long context support
- **Speed:** Medium
- **Cost:** Medium
- **Max Tokens:** 8,192
- **Use cases:**
  - Complex content analysis
  - Long-form content generation
  - Detailed SEO reports
  - Premium features

## Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=your-api-key-here

# Optional - defaults to gemini-2.0-flash-exp
GEMINI_MODEL=gemini-2.0-flash-exp
```

### Programmatic Model Selection

```typescript
import { generateContent, GEMINI_MODELS } from '@/lib/gemini';

// Use specific model
const result = await generateContent(prompt, {
  model: GEMINI_MODELS.FLASH_2_0,
  temperature: 0.7,
  maxTokens: 4096,
});

// Use thinking model for complex tasks
const analysis = await generateContent(complexPrompt, {
  model: GEMINI_MODELS.FLASH_2_0_THINKING,
  temperature: 0.3,
});

// Use fast model for simple tasks
const quickResult = await generateContent(simplePrompt, {
  model: GEMINI_MODELS.FLASH_1_5_8B,
});
```

### Smart Model Selection

```typescript
import { selectModelForTask } from '@/lib/gemini';

// Automatically select best model for task type
const reasoningModel = selectModelForTask('reasoning'); // Returns FLASH_2_0_THINKING
const speedModel = selectModelForTask('speed');         // Returns FLASH_1_5_8B
const qualityModel = selectModelForTask('quality');     // Returns PRO_1_5
const costModel = selectModelForTask('cost');           // Returns FLASH_1_5_8B
```

## Model Comparison

| Model | Speed | Cost | Quality | Best For |
|-------|-------|------|---------|----------|
| 2.0 Flash | ⚡⚡⚡ | 💰 | ⭐⭐⭐⭐ | General use |
| 2.0 Thinking | ⚡⚡ | 💰 | ⭐⭐⭐⭐⭐ | Complex reasoning |
| 1.5 Flash | ⚡⚡⚡ | 💰 | ⭐⭐⭐ | Production |
| 1.5 Flash-8B | ⚡⚡⚡⚡ | 💰 | ⭐⭐ | High volume |
| 1.5 Pro | ⚡⚡ | 💰💰 | ⭐⭐⭐⭐⭐ | Premium quality |

## Rate Limiting & Fallback

The system automatically falls back to `gemini-1.5-flash-8b` if rate limits are hit:

```typescript
// Automatic fallback on quota/rate limit errors
const result = await generateContent(prompt, {
  model: GEMINI_MODELS.FLASH_2_0,
});
// If rate limited, automatically retries with FLASH_1_5_8B
```

## Best Practices

1. **Default to Gemini 2.0 Flash** for most tasks
2. **Use Thinking model** for complex analysis requiring reasoning
3. **Use Flash-8B** for high-volume, simple tasks
4. **Use Pro 1.5** only when quality is critical
5. **Set appropriate temperature:**
   - 0.1-0.3: Factual, deterministic (SEO audits)
   - 0.7-0.9: Creative, varied (content ideas)
6. **Monitor costs** and adjust models based on usage

## Pricing (Approximate)

- **Flash models:** ~$0.075 per 1M input tokens
- **Pro models:** ~$1.25 per 1M input tokens
- **Output tokens:** Generally 2-3x input token cost

## Migration from Anthropic Claude

If migrating from Claude:
- Claude Sonnet → Gemini 2.0 Flash
- Claude Opus → Gemini 1.5 Pro
- Claude Haiku → Gemini 1.5 Flash-8B

## Support

For issues or questions:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Model Pricing](https://ai.google.dev/pricing)
- [API Key Management](https://aistudio.google.com/app/apikey)
