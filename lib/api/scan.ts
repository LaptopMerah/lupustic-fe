import { apiFetch } from "./client";
import type { FirstChatResponse, SymptomsPayload } from "@/types";

/**
 * Classify a skin image AND start a chat session in one call.
 * POST /first-chat — multipart/form-data
 * Sends image + symptom booleans.
 * Returns classification result + first AI answer + session_id.
 */
export async function analyzeImage(
  image: File,
  symptoms: SymptomsPayload
): Promise<FirstChatResponse> {
  const formData = new FormData();
  formData.append("image", image);

  // Append each symptom boolean as a form field
  formData.append("hair_loss", String(symptoms.hair_loss));
  formData.append("fever_of_unknown_origin", String(symptoms.fever_of_unknown_origin));
  formData.append("seizures", String(symptoms.seizures));
  formData.append("mouth_sores", String(symptoms.mouth_sores));
  formData.append("joint_pain", String(symptoms.joint_pain));
  formData.append("butterfly_rash", String(symptoms.butterfly_rash));

  return apiFetch<FirstChatResponse>("/first-chat", {
    method: "POST",
    body: formData,
  });
}
