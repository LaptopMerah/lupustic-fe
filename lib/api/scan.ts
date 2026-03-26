import { apiFetch } from "./client";
import type { ClassificationResponse, FirstChatResponse } from "@/types";

/**
 * Classify a skin image only (no chat session).
 * POST /classify — multipart/form-data
 */
export async function classifyImage(
  image: File
): Promise<ClassificationResponse> {
  const formData = new FormData();
  formData.append("image", image);

  return apiFetch<ClassificationResponse>("/classify", {
    method: "POST",
    body: formData,
  });
}

/**
 * Classify a skin image AND start a chat session in one call.
 * POST /first-chat — multipart/form-data
 * Returns classification result + first AI answer + session_id.
 */
export async function analyzeImage(
  image: File
): Promise<FirstChatResponse> {
  const formData = new FormData();
  formData.append("image", image);

  return apiFetch<FirstChatResponse>("/first-chat", {
    method: "POST",
    body: formData,
  });
}
