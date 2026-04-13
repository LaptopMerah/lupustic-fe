import { apiFetch } from "./client";
import type { ChatRequest, ChatResponse, SessionHistoryResponse, SessionSummary } from "@/types";

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

/**
 * List all chat sessions for the authenticated user.
 * GET /sessions
 */
export async function listSessions(): Promise<SessionSummary[]> {
  const response = await apiFetch<{ sessions: SessionSummary[] }>("/sessions");
  return response.sessions;
}
