import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserUsage, type UserPlan } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const usage = await getUserUsage(user.id, user.plan as UserPlan);

    return NextResponse.json(usage);
  } catch (error: any) {
    console.error("Dashboard usage error:", error);
    return NextResponse.json(
      { error: error.message || "Kullanım bilgileri yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
