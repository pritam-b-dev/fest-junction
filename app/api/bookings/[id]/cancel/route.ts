import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const res = await serverFetch<ApiResponse<unknown>>(
      `/bookings/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status: "CANCELLED" }),
      },
    );

    if (!res.ok || !res.data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: res.error || res.data?.message || "Failed to cancel booking",
        },
        { status: res.status || 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: res.data.message || "Booking cancelled successfully",
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
