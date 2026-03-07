import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCheckoutSession, STRIPE_PLANS } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  plan: z.enum(["PRO_MONTHLY", "PRO_YEARLY", "ENTERPRISE_MONTHLY", "ENTERPRISE_YEARLY"]),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = checkoutSchema.parse(body);

    const priceId = STRIPE_PLANS[plan].priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe henüz yapılandırılmamış" },
        { status: 503 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    try {
      const session = await createCheckoutSession({
        userId: user.id,
        priceId,
        successUrl: `${baseUrl}/dashboard?upgraded=true`,
        cancelUrl: `${baseUrl}/pricing`,
      });

      return NextResponse.json({ url: session.url });
    } catch (sessionError: any) {
      if (sessionError.message?.includes("Stripe not configured")) {
        return NextResponse.json(
          { error: "Ödeme sistemi henüz aktif değil. Lütfen daha sonra tekrar deneyin." },
          { status: 503 }
        );
      }
      throw sessionError;
    }
  } catch (error: any) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: error.message || "Ödeme oturumu oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
