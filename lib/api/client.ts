// const BASE_URL = "https://lupus-ai-dev.aryagading.com";
const BASE_URL = "http://127.0.0.1:8000";

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
      }
    } catch {
      // ignore JSON parse errors for error body
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
