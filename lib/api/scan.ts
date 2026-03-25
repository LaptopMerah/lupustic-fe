import { apiFetch } from "./client";
import type { ScanResponse } from "@/types";

export async function analyzeImage(image: File): Promise<ScanResponse> {
  const formData = new FormData();
  formData.append("image", image);

  return apiFetch<ScanResponse>("/scan", {
    method: "POST",
    body: formData,
  });
}
