import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await serverFetch<ApiResponse<unknown>>("/reviews", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: res.error || res.data?.message || "Failed to submit review",
        },
        { status: res.status || 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: res.data.message || "Review submitted successfully",
      data: res.data.data,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 },
    );
  }
}
