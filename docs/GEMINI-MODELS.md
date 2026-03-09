# Gemini AI Models Guide

This document explains the available Gemini AI models and how to choose the right one for your use case.

## Available Models

### Gemini 2.0 Flash Experimental (Recommended) ⚡
**Model ID:** `gemini-2.0-flash-exp`

- **Best for:** General-purpose SEO tasks, fastest responses
- **Features:** Latest experimental multimodal (text, image, audio, video), native tool use
- **Speed:** Fastest
- **Cost:** Low
- **Max Tokens:** 8,192
- **Status:** Experimental (cutting-edge features)
- **Use cases:**
  - SEO audits
  - Meta tag generation
  - Content optimization
  - Keyword suggestions
  - Title generation

### Gemini 2.0 Flash (Stable) 🚀
**Model ID:** `gemini-2.0-flash`

- **Best for:** Production-ready general tasks
- **Features:** Stable version of 2.0 Flash, multimodal
- **Speed:** Fastest
- **Cost:** Low
- **Max Tokens:** 8,192
- **Status:** Stable (production ready)
- **Use cases:**
  - Production environments
  - Reliable SEO analysis
  - Content generation at scale

### Gemini 2.0 Flash Thinking 🧠
**Model ID:** `gemini-2.0-flash-thinking-exp`

- **Best for:** Complex reasoning and problem-solving
- **Features:** Enhanced reasoning capabilities
- **Speed:** Medium
- **Cost:** Low
- **Max Tokens:** 8,192
- **Status:** Experimental
- **Use cases:**
  - Complex SEO strategy planning
  - Content gap analysis
  - Competitive analysis
  - Advanced schema generation

### Gemini 1.5 Flash Latest 🔄
**Model ID:** `gemini-1.5-flash-latest`

- **Best for:** Always using the latest 1.5 Flash version
- **Features:** Auto-updates to newest 1.5 Flash
- **Speed:** Fast
- **Cost:** Low
- **Max Tokens:** 8,192
- **Use cases:**
  - When you want automatic updates
  - Stable production with latest features

### Gemini 1.5 Flash 📦
**Model ID:** `gemini-1.5-flash`

- **Best for:** Stable, proven tasks
- **Features:** Multimodal, proven reliability
- **Speed:** Fast
- **Cost:** Low
- **Max Tokens:** 8,192
- **Use cases:**
  - Legacy compatibility
  - Proven stable performance

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

### Gemini 1.5 Pro Latest 🎯
**Model ID:** `gemini-1.5-pro-latest`

- **Best for:** Always using the latest 1.5 Pro version
- **Features:** Auto-updates to newest 1.5 Pro, highest quality
- **Speed:** Medium
- **Cost:** Medium
- **Max Tokens:** 8,192
- **Use cases:**
  - Premium quality with auto-updates
  - Complex analysis requiring best quality

### Gemini 1.5 Pro 🏆
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

// Use latest experimental (recommended)
const result = await generateContent(prompt, {
  model: GEMINI_MODELS.FLASH_2_0_EXP,
  temperature: 0.7,
  maxTokens: 4096,
});

// Use stable 2.0 for production
const stableResult = await generateContent(prompt, {
  model: GEMINI_MODELS.FLASH_2_0,
  temperature: 0.7,
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
const speedModel = selectModelForTask('speed');         // Returns FLASH_2_0_EXP (en hızlı)
const qualityModel = selectModelForTask('quality');     // Returns PRO_1_5_LATEST (en kaliteli)
const costModel = selectModelForTask('cost');           // Returns FLASH_1_5_8B (en ucuz)
```

## Model Comparison

| Model | Speed | Cost | Quality | Status | Best For |
|-------|-------|------|---------|--------|----------|
| 2.0 Flash Exp | ⚡⚡⚡⚡ | 💰 | ⭐⭐⭐⭐ | Experimental | En hızlı, genel kullanım |
| 2.0 Flash | ⚡⚡⚡⚡ | 💰 | ⭐⭐⭐⭐ | Stable | Production |
| 2.0 Thinking | ⚡⚡ | 💰 | ⭐⭐⭐⭐⭐ | Experimental | Karmaşık analiz |
| 1.5 Flash Latest | ⚡⚡⚡ | 💰 | ⭐⭐⭐ | Auto-update | Otomatik güncelleme |
| 1.5 Flash | ⚡⚡⚡ | 💰 | ⭐⭐⭐ | Stable | Eski versiyon |
| 1.5 Flash-8B | ⚡⚡⚡⚡ | 💰 | ⭐⭐ | Stable | Yüksek hacim |
| 1.5 Pro Latest | ⚡⚡ | 💰💰 | ⭐⭐⭐⭐⭐ | Auto-update | Premium kalite |
| 1.5 Pro | ⚡⚡ | 💰💰 | ⭐⭐⭐⭐⭐ | Stable | Premium |

## Rate Limiting & Fallback

The system automatically falls back to `gemini-1.5-flash-8b` if rate limits are hit:

```typescript
// Automatic fallback on quota/rate limit errors
const result = await generateContent(prompt, {
  model: GEMINI_MODELS.FLASH_2_0_EXP,
});
// If rate limited, automatically retries with FLASH_1_5_8B
```

## Best Practices

1. **Default to Gemini 2.0 Flash Experimental** for best performance (en hızlı ve en iyi)
2. **Use Gemini 2.0 Flash (stable)** for production environments
3. **Use Thinking model** for complex analysis requiring reasoning
4. **Use Flash-8B** for high-volume, simple tasks
5. **Use Pro 1.5 Latest** when quality is critical
6. **Set appropriate temperature:**
   - 0.1-0.3: Factual, deterministic (SEO audits)
   - 0.7-0.9: Creative, varied (content ideas)
7. **Monitor costs** and adjust models based on usage

## Pricing (Approximate)

- **Flash models:** ~$0.075 per 1M input tokens
- **Pro models:** ~$1.25 per 1M input tokens
- **Output tokens:** Generally 2-3x input token cost

## Migration from Anthropic Claude

If migrating from Claude:
- Claude Sonnet → Gemini 2.0 Flash Experimental
- Claude Opus → Gemini 1.5 Pro Latest
- Claude Haiku → Gemini 1.5 Flash-8B

## Support

For issues or questions:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Model Pricing](https://ai.google.dev/pricing)
- [API Key Management](https://aistudio.google.com/app/apikey)
- [Available Models](https://ai.google.dev/gemini-api/docs/models/gemini)
