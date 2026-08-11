import { cookies } from "next/headers";

export async function serverFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("FestJunction_token")?.value;

  const baseUrl = process.env.API_URL || "http://localhost:5000/api";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const resData = (await res.json().catch(() => null)) as T | null;

    if (!res.ok) {
      const errorResponse = resData as { message?: string } | null;
      return {
        ok: false,
        status: res.status,
        error: errorResponse?.message || "An error occurred during request",
      };
    }

    return {
      ok: true,
      status: res.status,
      data: resData ?? undefined,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Network error";
    return {
      ok: false,
      status: 500,
      error: errorMessage,
    };
  }
}
