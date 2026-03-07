import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserHistory } from "@/lib/usage-logger";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const history = await getUserHistory(user.id, limit, offset);

    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Dashboard history error:", error);
    return NextResponse.json(
      { error: error.message || "Geçmiş yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
