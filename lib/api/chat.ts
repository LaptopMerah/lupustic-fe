import { apiFetch } from "./client";
import type { ChatRequest, ChatResponse, SessionHistoryResponse } from "@/types";

/**
 * Continue an existing chat session with a text question.
 * POST /chat — application/json
 */
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

/**
 * Retrieve the full conversation history for a session.
 * GET /chat/:session_id/history
 */
export async function getChatHistory(
  sessionId: string
): Promise<SessionHistoryResponse> {
  return apiFetch<SessionHistoryResponse>(`/chat/${sessionId}/history`);
}
