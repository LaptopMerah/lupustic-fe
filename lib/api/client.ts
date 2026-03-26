const BASE_URL = "https://lupus-ai-dev.aryagading.com";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error("Network error. Please check your connection.");
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
