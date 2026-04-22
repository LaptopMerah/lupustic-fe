import { apiFetch } from "./client"
import type { UserOut, AdminUpdateUserPayload } from "@/types"

export async function listUsers(): Promise<UserOut[]> {
  return apiFetch<UserOut[]>("/users")
}

export async function updateUser(id: string, payload: AdminUpdateUserPayload): Promise<UserOut> {
  return apiFetch<UserOut>(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/users/${id}`, { method: "DELETE" })
}
