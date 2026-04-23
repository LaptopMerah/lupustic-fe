import { apiFetch } from "./client";
import type { FirstChatResponse, ClinicalDomainsPayload } from "@/types";

export async function analyzeImage(
  image: File,
  domains: ClinicalDomainsPayload
): Promise<FirstChatResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("clinical_domains", JSON.stringify(domains));

  return apiFetch<FirstChatResponse>("/first-chat", {
    method: "POST",
    body: formData,
  });
}
