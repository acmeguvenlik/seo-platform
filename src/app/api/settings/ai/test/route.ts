import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, model } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required', message: 'Lütfen API anahtarı girin' },
        { status: 400 }
      );
    }

    // Test the API key with a simple request
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-flash-latest' });

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Test' }] }],
      generationConfig: {
        maxOutputTokens: 10,
      },
    });

    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      message: `✅ API bağlantısı başarılı! Model: ${model || 'gemini-flash-latest'}`,
      testResponse: text.substring(0, 50),
    });
  } catch (error: any) {
    console.error('API test failed:', error);
    
    let errorMessage = 'API bağlantısı başarısız!';
    
    if (error?.message?.includes('API_KEY_INVALID')) {
      errorMessage = '❌ Geçersiz API anahtarı';
    } else if (error?.message?.includes('quota')) {
      errorMessage = '❌ API kotası aşıldı';
    } else if (error?.message?.includes('model')) {
      errorMessage = '❌ Model bulunamadı veya desteklenmiyor';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        message: errorMessage,
        details: error?.message 
      },
      { status: 400 }
    );
  }
}
