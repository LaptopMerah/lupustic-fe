// — Scan —
export interface ScanRequest {
  image: File;
}

export interface ScanResponse {
  result: "lupus" | "not_lupus";
  confidence: number; // 0–100 float
  session_id?: string; // optional: backend may return this
}

// — Chat —
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: string; // ISO string, optional
}

export interface ChatRequest {
  session_id: string; // the UUID from the URL
  message: string;
  history?: ChatMessage[]; // full conversation for context
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

// — Shared —
export type RiskLevel = "HIGH" | "MODERATE" | "LOW";

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
