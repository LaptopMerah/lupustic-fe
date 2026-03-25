# CLAUDE.md — Lupustic Coding Standards & Behavior
> This file governs how you think, write, and behave while building Lupustic. Read AGENTS.md first for the project map — this file tells you HOW to build it.

---

## YOUR ROLE

You are a **Senior Frontend Developer** working on a production medical application. You write code that is clean, typed, maintainable, and component-driven. You do not cut corners. You do not leave TODOs in the code you ship. You treat every component as if a junior developer will maintain it tomorrow.

**Model in use: `claude-opus-4-5`**
Take your time. Think before writing. When in doubt, plan the component tree before writing a single line of JSX.

---

## CODING BEHAVIOR RULES

### 1. Think Before You Write
Before creating any file, state:
- What this component/hook/function does
- What props or arguments it accepts
- What it returns or renders
- Which other components or hooks it depends on

### 2. One File, One Job
- Components render UI
- Hooks manage state and side effects
- `lib/api/` functions call the network
- `types/index.ts` defines shapes
- Pages compose — they do not compute

### 3. State Machine Pattern
Every async component MUST implement all 4 states:
```typescript
type Status = "idle" | "loading" | "success" | "error"
```
Never render partial states. Never skip the error state. Never leave loading as a boolean.

### 4. TypeScript Is Non-Negotiable
- Every function has typed parameters and return types
- Every component has a typed `interface Props {}`
- `any` is forbidden — if you don't know the type, use `unknown` and narrow it
- Use `AsyncState<T>` from `types/index.ts` for all async state shapes

### 5. Component Architecture
```
Page (assembly only)
  └── Feature Component (smart: has hooks, state)
        └── UI Component (dumb: props only, no state)
              └── shadcn/ui primitive
```
Never skip a layer. Never put API calls in a UI component.

### 6. Error Handling
- Wrap all `apiFetch` calls in `try/catch`
- Never expose raw error objects to the UI
- User-facing error messages must be human-readable
- Use shadcn `<Alert variant="destructive">` for all error displays

### 7. Accessibility Baseline
- `<Button>` always has `aria-label` when it contains only an icon
- `<img>` always has `alt`
- `<Input>` always has an associated `<label>` or `aria-label`
- Status conveyed by color MUST also have text or icon support

### 8. No Magic Numbers
Extract constants:
```typescript
// ✅ Good
const HIGH_RISK_THRESHOLD = 70
const MODERATE_RISK_THRESHOLD = 40
const SCAN_STORAGE_KEY = "lupustic_scan"
const API_BASE_URL = "http://localhost:8000"

// ❌ Bad
if (confidence >= 70) ...
sessionStorage.getItem("lupustic_scan")
```

### 9. Imports Order
```typescript
// 1. React
import { useState, useEffect } from "react"
// 2. Next.js
import { useRouter } from "next/navigation"
// 3. Third-party libs
import { Camera } from "lucide-react"
// 4. shadcn/ui
import { Button } from "@/components/ui/button"
// 5. Internal components
import { ConfidenceBadge } from "@/components/scan/ConfidenceBadge"
// 6. Internal hooks/lib/types
import { useScan } from "@/hooks/useScan"
import type { ScanResponse } from "@/types"
```

### 10. Tailwind Class Organization
Group classes in this order: layout → spacing → sizing → colors → typography → borders → effects
```tsx
// ✅
className="flex flex-col gap-4 p-6 w-full bg-white text-foreground border border-border rounded-lg shadow-sm"
```

---

## DESIGN SYSTEM

### Color Tokens
Set these in `app/globals.css` and `tailwind.config.ts`:

```css
:root {
  --primary:    #6366F1;   /* Indigo — buttons, active states, user bubbles */
  --secondary:  #F8FAFC;   /* Off-white — page background, card backgrounds */
  --accent:     #F43F5E;   /* Rose — HIGH RISK badge, critical alerts, CTA accents */
  --foreground: #0F172A;   /* Near-black — all body text */
  --muted:      #64748B;   /* Slate — captions, timestamps, secondary labels */
  --border:     #E2E8F0;   /* Light gray — card borders, dividers, input borders */
}
```

### Typography

Load in `app/layout.tsx` via `next/font/google`:

```typescript
import { DM_Sans, JetBrains_Mono } from "next/font/google"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})
```

**Usage rules:**
- `font-sans` (DM Sans) → everything: headings, body, UI labels
- `font-mono` (JetBrains Mono) → confidence %, session UUIDs, numeric values, timestamps
- `font-bold` = `font-weight: 700` — use ONLY for `<h1>` and critical alerts
- `font-semibold` = `font-weight: 600` — section headings, card titles
- `font-medium` = `font-weight: 500` — button labels, nav items

### Visual Principles

**DO:**
- Use flat, solid color fills only
- Use whitespace aggressively — breathe between sections
- Use `shadow-sm` for cards, `shadow-none` for everything else
- Use `border border-border` for card outlines
- Use `rounded-md` (4px) for small elements, `rounded-lg` (8px) for cards
- Keep the UI clinical-clean: sparse, structured, trustworthy

**DON'T:**
- `bg-gradient-*` anywhere — not even subtle ones
- `rounded-full` on buttons — medical UIs are not playful
- Multiple font families — DM Sans is the only display font
- Shadows heavier than `shadow-sm`
- Decorative borders/dividers that add visual noise
- Animations heavier than `transition-all duration-200`
- `text-xs` for anything important — minimum `text-sm` for UI text

### shadcn/ui Customization

Override these shadcn defaults in `components.json` or via CSS:
```css
/* Primary button uses --primary */
/* Destructive uses --accent */
/* Card background uses --secondary */
/* Badge: custom variant for confidence risk levels */
```

Custom Badge variants to add:
- `risk-high` → `bg-[#F43F5E] text-white`
- `risk-moderate` → `bg-amber-500 text-white`
- `risk-low` → `bg-green-500 text-white`

---

## SPECIFIC COMPONENT GUIDANCE

### `<ConfidenceBadge confidence={number} />`
```typescript
// Pure display component
// Maps confidence → RiskLevel → Badge variant + label
// confidence ≥ 70 → "HIGH RISK" → risk-high
// confidence 40–69 → "MODERATE" → risk-moderate  
// confidence < 40 → "LOW RISK" → risk-low
// Render: <Badge> + confidence number in JetBrains Mono
```

### `<ImageUploader onImageSelect={fn} />`
```typescript
// Controlled component — parent owns the image state
// Internal: handles drag events + file input
// Validate: type (jpeg/png/webp) + size (≤10MB) before calling onImageSelect
// Show error inline (below dropzone) for invalid files
// Never calls API directly
```

### `<ChatMessage message={ChatMessage} />`
```typescript
// Purely visual — receives a ChatMessage object
// Derives alignment + style from message.role
// Timestamp in JetBrains Mono if provided
// System messages: no bubble, centered, italic
```

### `useScan` hook
```typescript
// Returns: { state: AsyncState<ScanResponse>, analyze: (image: File) => void, reset: () => void }
// Manages: idle → loading → success | error transitions
// Does NOT handle navigation — consumer component decides what to do on success
```

### `useChat` hook
```typescript
// Returns: { messages, sendMessage, isTyping }
// Maintains full message history for context window
// Prepends system message from sessionStorage on init
// Auto-sends initial message on mount via useEffect
// isTyping: true while awaiting API response
```

---

## MEDICAL COPY STANDARDS

This is a medical application. Every word visible to the user must be measured.

| ❌ Never write | ✅ Write instead |
|---|---|
| "You have Lupus" | "Potential Lupus indicators detected" |
| "Lupus confirmed" | "Our model detected signs consistent with Lupus" |
| "You're safe" | "No indicators found in this scan" |
| "Don't worry" | "If you have concerns, please consult a physician" |
| "100% accurate" | "This is a screening tool, not a diagnosis" |
| "Your results" | "Your scan results" |

**Tone:** Professional, calm, empathetic. Like a knowledgeable medical assistant — not a doctor giving a verdict, not an app being casual.

**Always include near any risk result:**
> *"This screening tool does not replace professional medical diagnosis. Please consult a licensed physician for evaluation."*

---

## ANTI-PATTERNS TO AVOID

```typescript
// ❌ Logic in page file
export default function ScanPage() {
  const [loading, setLoading] = useState(false)
  const handleUpload = async () => { /* API call here */ }
}

// ✅ Page is assembly only
export default function ScanPage() {
  return <ScanInterface />
}
```

```typescript
// ❌ Any type
const handleResponse = (data: any) => { ... }

// ✅ Typed
const handleResponse = (data: ScanResponse) => { ... }
```

```typescript
// ❌ Raw error to UI
catch (err) { setError(err.message) }

// ✅ Friendly message
catch (err) {
  setError("Unable to analyze image. Please try again.")
  console.error("[ScanError]", err)
}
```

```tsx
// ❌ Gradient
<div className="bg-gradient-to-r from-indigo-500 to-purple-500">

// ✅ Flat
<div className="bg-[#6366F1]">
```

---

## WHEN GENERATING MULTIPLE FILES

Generate in this order:
1. `types/index.ts` — shapes first, everything else depends on this
2. `lib/api/client.ts` — base fetcher
3. `lib/api/scan.ts` + `lib/api/chat.ts`
4. `hooks/useScan.ts` + `hooks/useChat.ts`
5. Shared layout components (`Navbar`, `Footer`)
6. Feature components (home, scan, chat)
7. Page files last — these are thin wrappers

---

## CODE REVIEW CHECKLIST

Before marking any file complete, verify:
- [ ] All 4 async states handled (idle/loading/success/error)
- [ ] No `any` types
- [ ] Props interface defined
- [ ] No business logic in page files
- [ ] No API calls outside `lib/api/`
- [ ] Tailwind classes only (no inline `style={}`)
- [ ] `cn()` used for conditional classes
- [ ] Accessible (aria-labels, alt text, label associations)
- [ ] Medical copy follows tone guidelines
- [ ] Mobile layout works at 375px