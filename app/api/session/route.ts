import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiResponse, User } from "@/lib/types";

export async function GET() {
  const res = await serverFetch<ApiResponse<User>>("/auth/me");

  if (!res.ok || !res.data?.success) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: res.data.data });
}
