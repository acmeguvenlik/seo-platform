import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = body?.apiKey || process.env.GEMINI_API_KEY;
    const model = body?.model || process.env.GEMINI_MODEL || 'gemini-flash-latest';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required', message: 'Lütfen API anahtarı girin' },
        { status: 400 }
      );
    }

    // Test the API key with a simple request
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }],
      generationConfig: {
        maxOutputTokens: 20,
        temperature: 0.1,
      },
    });

    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      message: `✅ API bağlantısı başarılı! Model: ${model}`,
      testResponse: text.substring(0, 100),
    });
  } catch (error: any) {
    console.error('API test failed:', error);
    
    let errorMessage = 'API bağlantısı başarısız!';
    let statusCode = 400;
    
    if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('invalid')) {
      errorMessage = '❌ Geçersiz API anahtarı';
    } else if (error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      errorMessage = '❌ API kotası aşıldı';
      statusCode = 429;
    } else if (error?.message?.includes('model') || error?.message?.includes('NOT_FOUND')) {
      errorMessage = '❌ Model bulunamadı veya desteklenmiyor';
    } else if (error?.message?.includes('permission') || error?.message?.includes('PERMISSION_DENIED')) {
      errorMessage = '❌ API anahtarı bu modele erişim izni yok';
      statusCode = 403;
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        message: errorMessage,
        details: error?.message || 'Unknown error'
      },
      { status: statusCode }
    );
  }
}
