# Vercel Deployment Setup Guide

This guide will help you configure environment variables in Vercel to fix the "AI service not configured" error.

## Required Environment Variables

### 1. Gemini API Key (Required for AI Tools)

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

**How to get:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

**How to add in Vercel:**
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your API key from Google AI Studio
   - **Environment:** Production, Preview, Development (select all)
5. Click "Save"

### 2. Gemini Model Selection (Optional)

```bash
GEMINI_MODEL=gemini-1.5-flash-latest
```

**Available models:**
- `gemini-1.5-flash-latest` (Default - Always latest stable, RECOMMENDED)
- `gemini-2.0-flash-exp` (Latest experimental, fastest but may change)
- `gemini-2.0-flash` (Stable 2.0 version)
- `gemini-2.0-flash-thinking-exp` (Enhanced reasoning)
- `gemini-1.5-flash` (Specific stable version)
- `gemini-1.5-flash-8b` (Lowest cost)
- `gemini-1.5-pro-latest` (Always latest Pro, highest quality)

**Recommendation:** Use `gemini-1.5-flash-latest` for automatic updates to the newest stable model.

### 3. Other Required Variables

Make sure these are also set in Vercel:

```bash
# Database
DATABASE_URL=your-neon-postgresql-url

# Redis Cache
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Authentication (if using Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
JWT_SECRET=your-jwt-secret-min-32-chars
```

## After Adding Environment Variables

1. **Redeploy your application:**
   - Go to "Deployments" tab
   - Click on the three dots (...) next to the latest deployment
   - Click "Redeploy"
   - Select "Use existing Build Cache" (optional)
   - Click "Redeploy"

2. **Verify the deployment:**
   - Wait for the deployment to complete
   - Visit your site
   - Try using an AI tool (e.g., AI SEO Audit)
   - The "AI service not configured" error should be gone

## Troubleshooting

### Error: "AI service not configured"
- **Cause:** GEMINI_API_KEY is not set or invalid
- **Solution:** 
  1. Check if GEMINI_API_KEY is added in Vercel
  2. Verify the API key is correct
  3. Make sure it's enabled for all environments
  4. Redeploy the application

### Error: "Module not found"
- **Cause:** Build cache issue
- **Solution:**
  1. Go to Settings > General
  2. Scroll to "Build & Development Settings"
  3. Clear build cache
  4. Redeploy

### Error: "Rate limit exceeded"
- **Cause:** Too many API requests
- **Solution:**
  1. The system automatically falls back to `gemini-1.5-flash-8b`
  2. Consider upgrading your Gemini API quota
  3. Implement request throttling

### 404 Errors for Some Tools
- **Cause:** Some tools are in config but not implemented yet
- **Solution:** These are planned features:
  - domain-authority-checker
  - competitor-analysis
  - keyword-research
  - duplicate-content-checker
  - language-detector
  - local-seo-checker
  - amp-validator
  - ai-content-gap-analyzer

## Environment Variable Priority

Vercel loads environment variables in this order:
1. Production environment (for production deployments)
2. Preview environment (for preview deployments)
3. Development environment (for local development)

Make sure to set variables for all environments you're using.

## Security Best Practices

1. **Never commit API keys to Git**
   - Use `.env.local` for local development
   - Add `.env.local` to `.gitignore`

2. **Rotate API keys regularly**
   - Generate new keys every 90 days
   - Update in Vercel immediately

3. **Use environment-specific keys**
   - Different keys for development/staging/production
   - Monitor usage per environment

4. **Enable API key restrictions**
   - Restrict by HTTP referrer (for web apps)
   - Restrict by IP address (for servers)
   - Set usage quotas

## Monitoring

After deployment, monitor:
- API usage in [Google AI Studio](https://aistudio.google.com/)
- Error logs in Vercel Dashboard
- Response times in Vercel Analytics

## Support

If you continue to have issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Contact support with error details

## Quick Checklist

- [ ] GEMINI_API_KEY added in Vercel
- [ ] All environments selected (Production, Preview, Development)
- [ ] Application redeployed
- [ ] AI tools tested and working
- [ ] No console errors
- [ ] All required environment variables set
