# AGENTS.md — Lupustic Project Map
> Read this file first before touching any code. This is the single source of truth for architecture, routes, and API contracts.

---

## PROJECT CONTEXT

**App name:** `lupustic`
**Purpose:** Medical web app for early detection of Systemic Lupus Erythematosus (SLE). Users upload a photo of skin lesions → computer vision model returns a result → user is directed to an AI chat room for follow-up symptom consultation.
**Scope:** Frontend only. Backend is at `http://localhost:8000` (dummy during dev).

---

## TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Use `app/` directory, no `pages/` |
| Language | **TypeScript** | Strict mode on, no `any` |
| UI Library | **shadcn/ui** | Radix primitives under the hood |
| Styling | **Tailwind CSS v4** | `cn()` for conditional classes |
| State | **React hooks + Context** | No Redux, no Zustand |
| HTTP | **fetch** (native) | Typed wrapper in `lib/api/client.ts` |
| Icons | **Lucide React** | Only Lucide, no mixing icon libs |
| UUID | `crypto.randomUUID()` | Built-in, no package needed |
| Fonts | **Google Fonts** | DM Sans + JetBrains Mono |

---

## PROJECT STRUCTURE

```
lupustic/
├── app/
│   ├── layout.tsx                  # Root layout: Navbar + font variables + Providers
│   ├── page.tsx                    # Route: / → Home
│   ├── scan/
│   │   └── page.tsx                # Route: /scan → Computer Vision
│   └── chat/
│       └── [uuid]/
│           └── page.tsx            # Route: /chat/[uuid] → AI Chatbot
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky nav, active route highlight, mobile Sheet
│   │   └── Footer.tsx              # Minimal footer with disclaimer
│   ├── home/
│   │   ├── HeroSection.tsx         # Headline + CTA + decorative SVG
│   │   ├── HowItWorks.tsx          # 3-step process row
│   │   ├── FeatureCard.tsx         # Reusable card for features grid
│   │   └── MedicalDisclaimer.tsx   # Bold disclaimer banner
│   ├── scan/
│   │   ├── ImageUploader.tsx       # Drag & drop + click upload, image preview
│   │   ├── ScanResult.tsx          # Layout wrapper for result panel
│   │   ├── ConfidenceBadge.tsx     # % badge with risk color coding
│   │   └── ResultActionCard.tsx    # CTA after result (go to chat / retry)
│   └── chat/
│       ├── ChatContainer.tsx       # ScrollArea wrapper + message list
│       ├── ChatMessage.tsx         # Single message bubble (user/assistant/system)
│       ├── ChatInput.tsx           # Input + Send button (sticky bottom)
│       └── TypingIndicator.tsx     # Animated dots while AI responds
│
├── hooks/
│   ├── useScan.ts                  # All scan state: idle→loading→success→error
│   └── useChat.ts                  # Chat state, message history, send handler
│
├── lib/
│   ├── api/
│   │   ├── client.ts               # Base fetch wrapper with error handling
│   │   ├── scan.ts                 # analyzeImage() → POST /scan
│   │   └── chat.ts                 # sendMessage(), getChatHistory()
│   └── utils.ts                    # cn(), formatConfidence(), getRiskLevel()
│
└── types/
    └── index.ts                    # All shared TypeScript interfaces
```

> **Rule:** Page files (`app/**/page.tsx`) must contain ZERO business logic. Pages are assembly only — they import and compose components. Logic lives in hooks. Data-fetching logic lives in `lib/api/`.

---

## ROUTES & PAGE SPECS

### `/ — Home`

Sections rendered in order:

1. **`<HeroSection />`**
   - `h1`: `"Early Lupus Detection, Powered by AI"`
   - `p`: `"Upload a photo of your skin. Our computer vision model analyzes potential Lupus indicators in seconds."`
   - Primary `<Button>` → `router.push('/scan')`
   - Subtle medical disclaimer badge below button
   - Decorative SVG (abstract cell/skin pattern) on the right — use inline SVG or placeholder

2. **`<HowItWorks />`** — horizontal 3-column layout
   - Step 1 → icon: `Camera` — "Upload a Skin Photo"
   - Step 2 → icon: `ScanLine` — "AI Analyzes for Lupus Indicators"
   - Step 3 → icon: `MessageSquare` — "Consult with AI on Your Results"

3. **Feature Cards Grid** — 3x `<FeatureCard />` in a 3-col grid
   - "Computer Vision Scan" / "Confidence Scoring" / "AI Consultation"

4. **`<MedicalDisclaimer />`**
   - Text: `"This tool is NOT a substitute for professional medical advice. Always consult a licensed physician."`

---

### `/scan — Computer Vision`

State machine: `idle → loading → success | error`

```
IDLE:
  <ImageUploader />
    - Drag & drop zone or click-to-browse
    - Accept: image/jpeg, image/png, image/webp
    - Max size: 10MB (validate client-side)
    - Show image preview thumbnail after selection
    - "Analyze Image" <Button> → calls useScan()

LOADING:
  - Overlay or replace uploader with <Skeleton /> blocks
  - Text: "Analyzing your skin sample..."
  - Do NOT show a spinner alone — use skeleton layout

SUCCESS:
  <ScanResult />
    ├── Left: uploaded image preview (img tag, object-cover)
    └── Right: result panel
          ├── <ConfidenceBadge confidence={n} />
          │     ≥ 70%  → bg accent red  — label: "HIGH RISK"
          │     40–69% → bg amber-500   — label: "MODERATE"
          │     < 40%  → bg green-500   — label: "LOW RISK"
          ├── <Progress value={confidence} /> (shadcn Progress)
          ├── Result text:
          │     result === "lupus"     → "Potential Lupus Indicators Detected"
          │     result === "not_lupus" → "No Lupus Indicators Detected"
          └── <ResultActionCard />
                IF lupus:
                  → <Button> "Proceed"
                  → crypto.randomUUID() → navigate to /chat/[uuid]
                  → store { result, confidence } in sessionStorage key: "lupustic_scan"
                IF not_lupus:
                  → <Button variant="outline"> "Scan Another Image"
                  → soft copy: "No indicators found. If you have concerns, please consult a physician."

ERROR:
  <Alert variant="destructive">
    "Unable to analyze image. Please try again."
  </Alert>
  + retry button
```

---

### `/chat/[uuid] — AI Consultation`

```
LAYOUT:
  ┌─────────────────────────────────────────┐
  │  <Navbar /> — shows "Session #[uuid]"   │
  ├─────────────────────────────────────────┤
  │                                         │
  │  <ChatContainer />  (flex-1, overflow)  │
  │    <ChatMessage role="system" />        │
  │    <ChatMessage role="assistant" />     │
  │    <ChatMessage role="user" />          │
  │    <TypingIndicator />  (conditional)   │
  │                                         │
  ├─────────────────────────────────────────┤
  │  <ChatInput />  (sticky bottom)         │
  │  [Input field .......] [Send <Button>]  │
  └─────────────────────────────────────────┘
```

**On page mount:**
1. Read `uuid` from `params`
2. Read scan result from `sessionStorage.getItem("lupustic_scan")` → parse JSON
3. If result exists → render first `<ChatMessage role="system">`:
   > `"Scan completed. Result: Potential Lupus Indicators Detected — Confidence: 87%. Starting consultation..."`
4. Auto-send first user message to API immediately after mount:
   > `"I just received a scan result: [result] with [confidence]% confidence. What should I know and what are the next steps?"`
5. Render AI response as `<ChatMessage role="assistant">`

**Message bubble styles:**
- `role="user"` → right-aligned, `bg-[#6366F1]` text-white
- `role="assistant"` → left-aligned, `bg-white` border border-border text-foreground
- `role="system"` → centered, text-sm italic text-muted-foreground, no bubble

**Enter key sends message.** Shift+Enter = newline.

---

## API LAYER

### Base URL
```typescript
// lib/api/client.ts
const BASE_URL = "http://localhost:8000"
```

### TypeScript Types (`types/index.ts`)

```typescript
// — Scan —
export interface ScanRequest {
  image: File
}

export interface ScanResponse {
  result: "lupus" | "not_lupus"
  confidence: number        // 0–100 float
  session_id?: string       // optional: backend may return this
}

// — Chat —
export type MessageRole = "user" | "assistant" | "system"

export interface ChatMessage {
  role: MessageRole
  content: string
  timestamp?: string        // ISO string, optional
}

export interface ChatRequest {
  session_id: string        // the UUID from the URL
  message: string
  history?: ChatMessage[]   // full conversation for context
}

export interface ChatResponse {
  reply: string
  session_id: string
}

// — Shared —
export type RiskLevel = "HIGH" | "MODERATE" | "LOW"

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
```

### API Functions

**`lib/api/scan.ts`**
```typescript
// POST /scan
// Content-Type: multipart/form-data
export async function analyzeImage(image: File): Promise<ScanResponse>
// FormData key: "image"
```

**`lib/api/chat.ts`**
```typescript
// POST /chat
// Content-Type: application/json
export async function sendMessage(payload: ChatRequest): Promise<ChatResponse>

// GET /chat/:uuid — load existing chat history (optional)
export async function getChatHistory(uuid: string): Promise<ChatMessage[]>
```

**`lib/api/client.ts`** — Base wrapper
```typescript
// Generic typed fetcher with:
// - Base URL prepended
// - Content-Type header management
// - Non-2xx response → throw Error with message from response body
// - Network failure → throw Error("Network error. Please check your connection.")
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T>
```

---

## SHADCN COMPONENTS TO INSTALL

```bash
npx shadcn@latest add button card badge input textarea separator skeleton alert scroll-area progress tooltip sheet
```

---

## NAVIGATION BEHAVIOR

- Logo `lupustic` (lowercase, styled) → `href="/"`
- Active route: primary color (`#6366F1`) with 2px underline
- Sticky top, `backdrop-blur-sm`, `bg-secondary/80`
- Mobile (<768px): hamburger icon → `<Sheet>` slide-in menu from right

---

## DELIVERABLES CHECKLIST

- [ ] `/` renders: Hero + HowItWorks + FeatureCards + MedicalDisclaimer
- [ ] `/scan` idle: drag & drop uploader with preview
- [ ] `/scan` loading: skeleton layout during API call
- [ ] `/scan` success: result panel with ConfidenceBadge + Progress + ResultActionCard
- [ ] `/scan` error: Alert with retry
- [ ] `/chat/[uuid]` renders with UUID in navbar
- [ ] `/chat/[uuid]` reads sessionStorage scan result → system message
- [ ] `/chat/[uuid]` auto-sends first message on mount
- [ ] Chat send/receive works via `localhost:8000/chat`
- [ ] Navbar active state works on all 3 routes
- [ ] Mobile responsive at 375px breakpoint
- [ ] All API logic isolated in `lib/api/`
- [ ] All business logic isolated in `hooks/`
- [ ] Zero `any` types in TypeScript
- [ ] All async operations have loading + error states