import type { TrackerEntry, CreateTrackerPayload, UpdateTrackerPayload } from "@/types";
import { apiFetch } from "@/lib/api/client";

// ─── POST /upload/image ────────────────────────────────────
// Upload image first, returns a URL path string
async function uploadImage(image: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);

  return apiFetch<string>("/upload/image", {
    method: "POST",
    body: formData,
  });
}

// ─── GET /symptom-tracker ──────────────────────────────────────────
// List all symptom records for the current authenticated user
export async function getTrackerEntries(): Promise<TrackerEntry[]> {
  return apiFetch<TrackerEntry[]>("/symptom-tracker");
}

// ─── GET /symptom-tracker/:id ──────────────────────────────────────
export async function getTrackerEntry(id: string): Promise<TrackerEntry> {
  return apiFetch<TrackerEntry>(`/symptom-tracker/${id}`);
}

// ─── POST /symptom-tracker ─────────────────────────────────────────
// Two-step: upload image → create record with returned image path
export async function createTrackerEntry(
  payload: CreateTrackerPayload
): Promise<TrackerEntry> {
  // Step 1: Upload the image file
  const imagePath = await uploadImage(payload.image);

  // Step 2: Create the record with the image path
  return apiFetch<TrackerEntry>("/symptom-tracker", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: imagePath,
      name: payload.name,
      desc: payload.desc,
    }),
  });
}

// ─── PUT /symptom-tracker/:id ──────────────────────────────────────
// Update an existing symptom record. All fields are optional.
export async function updateTrackerEntry(
  id: string,
  payload: UpdateTrackerPayload
): Promise<TrackerEntry> {
  // If a new image file was provided, upload it first
  let imagePath: string | undefined;
  if (payload.image) {
    imagePath = await uploadImage(payload.image);
  }

  const body: Record<string, string | null> = {};
  if (imagePath !== undefined) body.image = imagePath;
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.desc !== undefined) body.desc = payload.desc;

  return apiFetch<TrackerEntry>(`/symptom-tracker/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── DELETE /symptom-tracker/:id ───────────────────────────────────
export async function deleteTrackerEntry(id: string): Promise<boolean> {
  return apiFetch<boolean>(`/symptom-tracker/${id}`, { method: "DELETE" });
}
