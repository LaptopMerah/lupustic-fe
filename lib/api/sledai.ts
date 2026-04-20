import type { SledaiRecord, CreateSledaiPayload } from "@/types";
import { apiFetch } from "@/lib/api/client";

export async function getSledaiRecords(): Promise<SledaiRecord[]> {
  return apiFetch<SledaiRecord[]>("/activity-records");
}

export async function getSledaiRecord(id: string): Promise<SledaiRecord> {
  return apiFetch<SledaiRecord>(`/activity-records/${id}`);
}

export async function createSledaiRecord(
  payload: CreateSledaiPayload
): Promise<SledaiRecord> {
  return apiFetch<SledaiRecord>("/activity-records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteSledaiRecord(id: string): Promise<boolean> {
  return apiFetch<boolean>(`/activity-records/${id}`, { method: "DELETE" });
}
