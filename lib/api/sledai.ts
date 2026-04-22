import type {
  ActivityTrackerRecord,
  CreateActivityTrackerPayload,
  UpdateActivityTrackerPayload,
} from "@/types";
import { apiFetch } from "@/lib/api/client";

export async function getSledaiRecords(): Promise<ActivityTrackerRecord[]> {
  return apiFetch<ActivityTrackerRecord[]>("/activity-tracker");
}

export async function getSledaiRecord(id: string): Promise<ActivityTrackerRecord> {
  return apiFetch<ActivityTrackerRecord>(`/activity-tracker/${id}`);
}

export async function createSledaiRecord(
  payload: CreateActivityTrackerPayload
): Promise<ActivityTrackerRecord> {
  return apiFetch<ActivityTrackerRecord>("/activity-tracker", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateSledaiRecord(
  id: string,
  payload: UpdateActivityTrackerPayload
): Promise<ActivityTrackerRecord> {
  return apiFetch<ActivityTrackerRecord>(`/activity-tracker/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteSledaiRecord(id: string): Promise<boolean> {
  return apiFetch<boolean>(`/activity-tracker/${id}`, { method: "DELETE" });
}
