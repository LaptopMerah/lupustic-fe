// — API Wrapper —
export interface ResponseWrapper<T> {
  status: boolean;
  data: T;
}

// — Symptoms —
export interface SymptomsPayload {
  hair_loss: boolean;
  fever_of_unknown_origin: boolean;
  seizures: boolean;
  mouth_sores: boolean;
  joint_pain: boolean;
  butterfly_rash: boolean;
}

export const DEFAULT_SYMPTOMS: SymptomsPayload = {
  hair_loss: false,
  fever_of_unknown_origin: false,
  seizures: false,
  mouth_sores: false,
  joint_pain: false,
  butterfly_rash: false,
};

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
  image_classification: string;
  image_confidence: number;
  clinical_domains?: Record<string, unknown> | number | null;
  clinical_domains_point?: number | null;
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
  scanData?: {
    classification: string;
    image_classification: string;
    image_confidence: number;
    clinical_domains_point: number;
  };
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
  image_classification: string | null;
  confidence: number | null;
  clinical_domains?: Record<string, unknown> | null;
  clinical_domains_point?: number| null;
  messages: MessageOut[];
}

// — Sessions List —
export interface SessionSummary {
  session_id: string;
  created_at: string | null;
  classification: string | null;
  image_classification: string | null;
  confidence: number | null;
  clinical_domains?: Record<string, unknown> | null;
}

export interface SessionsListResponse {
  sessions: SessionSummary[];
}

// — Shared —
export type RiskLevel = "HIGH" | "MODERATE" | "LOW";

export type ScanResult = "lupus" | "not_lupus";

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// — Auth —
export interface UserRegister {
  name: string;
  email: string;
  password?: string;
  gender: "male" | "female";
  dob?: string | null;
  phone_number?: string | null;
}

export interface UserLogin {
  email: string;
  password?: string;
}

export interface UserUpdatePayload {
  name?: string;
  gender?: "male" | "female" | null;
  dob?: string | null;
  phone_number?: string | null;
  password?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export type RoleEnum = "user" | "admin" | "member" | "institution";

export interface UserOut {
  id: string;
  name: string;
  email: string;
  gender?: "male" | "female" | null;
  dob?: string | null;
  phone_number?: string | null;
  role?: RoleEnum;
  created_at: string;
}

// — Tracker (Records) —
export interface TrackerEntry {
  id: string;
  user_id: string;
  image: string;           // URL path returned by /upload/image
  name: string;            // "Where does it appear?"
  desc: string;            // "Describe it"
  datetime: string;        // ISO 8601 date-time
}

export interface CreateTrackerPayload {
  image: File;
  name: string;
  desc: string;
}

export interface UpdateTrackerPayload {
  image?: File;
  name?: string | null;
  desc?: string | null;
}

// — Activity Tracker (API response shape) —
export interface ActivityTrackerRecord {
  id: string;
  user_id: string;
  data: Record<string, unknown>;
  datetime: string;
}

export interface CreateActivityTrackerPayload {
  data: Record<string, unknown>;
}

export interface UpdateActivityTrackerPayload {
  data?: Record<string, unknown> | null;
}

// — SLEDAI-2K (frontend scoring model — maps into ActivityTracker.data) —
export interface SledaiRecord {
  id: string;
  user_id: string;
  score: number;
  answers: SledaiAnswers;
  notes: string | null;
  created_at: string;
}

export interface CreateSledaiPayload {
  score: number;
  answers: SledaiAnswers;
  notes?: string;
}

// — SLEDAI-2K —
export type SledaiCategory =
  | "neuropsychiatric"
  | "musculoskeletal"
  | "renal"
  | "skin"
  | "serosal"
  | "immunologic"
  | "constitutional";

export interface SledaiCriterion {
  id: string;
  label: string;
  description: string;
  weight: 8 | 4 | 2 | 1;
  category: SledaiCategory;
}

export type SledaiAnswers = Record<string, boolean>;

export type SledaiActivityLevel = "none" | "mild" | "moderate" | "high" | "very-high";
