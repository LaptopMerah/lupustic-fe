const BASE_URL = "https://lupus-ai-dev.aryagading.com";

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAuthToken(token: string) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
  document.cookie = `auth_token=${encodeURIComponent(token)}; expires=${expires}; path=/`;
}

export function removeAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
import type { ResponseWrapper } from "@/types";


export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options?.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch (err) {
    throw new Error("Network error. Please check your connection.", { cause: err });
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (typeof errorBody === "object" && errorBody !== null && "message" in errorBody) {
        errorMessage = String(errorBody.message);
      } else if (typeof errorBody === "object" && errorBody !== null && "detail" in errorBody) {
        errorMessage = String(errorBody.detail);
      }
    } catch {
      // ignore JSON parse errors for error body
    }
    throw new Error(errorMessage);
  }

  const json = await response.json();

  // Unwrap ResponseWrapper if present
  if (
    typeof json === "object" &&
    json !== null &&
    "status" in json &&
    "data" in json
  ) {
    return (json as ResponseWrapper<T>).data;
  }

  return json as T;
}
