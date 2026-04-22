import { apiFetch } from "./client";
import type { FirstChatResponse, SymptomsPayload } from "@/types";

/**
 * Classify a skin image AND start a chat session in one call.
 * POST /first-chat — multipart/form-data
 * Sends image + clinical_domains (JSON string of symptom flags).
 * Returns classification result + first AI answer + session_id.
 */
export async function analyzeImage(
  image: File,
  symptoms: SymptomsPayload
): Promise<FirstChatResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("clinical_domains", JSON.stringify(symptoms));

  return apiFetch<FirstChatResponse>("/first-chat", {
    method: "POST",
    body: formData,
  });
}
