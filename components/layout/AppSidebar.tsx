"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquare,
  Activity,
  Plus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { listSessions } from "@/lib/api/chat";
import type { SessionSummary } from "@/types";

// ─── Helpers ───────────────────────────────────────────────
function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatShortDate(iso);
}

function classificationLabel(c: string | null): string {
  if (!c) return "Unknown";
  return c === "lupus" ? "Lupus" : "Other";
}

// ─── Component ─────────────────────────────────────────────
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // ── Chat sessions state ──────────────────────────────────
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await listSessions();
      setSessions(data);
    } catch {
      // silently fail — chat history is non-critical
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // ── Route checks ────────────────────────────────────────────
  const isOnTrackerPage = pathname.startsWith("/tracker");
  const isOnScanPage = pathname.startsWith("/scan");


  const chatSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [sessions]);

  // ── Active chat session check ────────────────────────────
  const activeChatId = useMemo(() => {
    const match = pathname.match(/^\/chat\/(.+)$/);
    return match ? match[1] : null;
  }, [pathname]);


  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="px-2 py-2 flex flex-col gap-1">
        {/* ── 1. New Chat ─────────────────────────────────── */}
        <Link
          href="/scan"
          className={`flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm font-medium transition-colors ${isOnScanPage
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
        >
          <Plus className="h-4 w-4" />
          New Scan
        </Link>
        {/* ── 2. Symptom Tracker — nav link ────────────── */}
        <Link
          href="/tracker"
          className={`flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm font-medium transition-colors ${isOnTrackerPage
            ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
            : "text-muted-foreground hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400"
            }`}
        >
          <Activity className="h-4 w-4" />
          Symptom Tracker
        </Link>
      </div>

      <Separator />

      {/* ── 2. Chat History ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Chat History
          </p>
        </div>

        <div className="px-2 pb-3">
          {sessionsLoading ? (
            <div className="space-y-2 px-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : chatSessions.length > 0 ? (
            <>
              {/* Latest 4 sessions — always visible */}
              <nav className="space-y-0.5">
                {chatSessions.map((session) => {
                  const isActive = activeChatId === session.session_id;
                  return (
                    <Link
                      key={session.session_id}
                      href={`/chat/${session.session_id}`}
                      className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">
                          {classificationLabel(session.classification)}
                          {session.confidence !== null && (
                            <span className="ml-1 opacity-60">
                              {Math.round(session.confidence * 100)}%
                            </span>
                          )}
                        </p>
                        {session.created_at && (
                          <p className="text-[10px] font-mono text-muted-foreground">
                            {formatRelativeDate(session.created_at)}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </>
          ) : (
            <p className="px-2.5 text-xs text-muted-foreground italic">
              No chat sessions yet
            </p>
          )}
        </div>


      </div>
    </aside>
  );
}
