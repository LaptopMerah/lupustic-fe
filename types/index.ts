// — Scan (classify only) —
export interface ScanRequest {
  image: File;
}

export interface ClassificationResponse {
  classification: string;
  confidence: number; // 0–100 float
}

// — First Chat (classify + start session) —
export interface FirstChatResponse {
  session_id: string;
  classification: string;
  confidence: number;
  answer: string;
  sources: string[];
}

// — Chat —
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  role: MessageRole;
  content: string;
  sources?: string[];
  timestamp?: string; // ISO string, optional
  scanData?: { classification: string; confidence: number };
  interactive?: "symptoms";
}

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  session_id: string;
  answer: string;
  sources: string[];
}

// — Chat History —
export interface MessageOut {
  id: string;
  role: string;
  content: string;
  sources: string[] | null;
  created_at: string | null;
}

export interface SessionHistoryResponse {
  session_id: string;
  classification: string | null;
  confidence: number | null;
  messages: MessageOut[];
}

// — Shared —
export type RiskLevel = "HIGH" | "MODERATE" | "LOW";

export type ScanResult = "lupus" | "not_lupus";

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
