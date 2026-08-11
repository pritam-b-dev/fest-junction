import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, User } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const res = await serverFetch<ApiResponse<User>>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    if (!res.ok || !res.data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: res.error || res.data?.message || "Failed to update profile",
        },
        { status: res.status || 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: res.data.message || "Profile updated successfully",
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
