import { apiFetch } from "./client";
import type { ChatMessage, ChatRequest, ChatResponse } from "@/types";

export async function sendMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getChatHistory(uuid: string): Promise<ChatMessage[]> {
  return apiFetch<ChatMessage[]>(`/chat/${uuid}`);
}
