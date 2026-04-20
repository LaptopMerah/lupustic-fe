"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import LogoImg from "@/app/Lupustic.png"
import { MessageSquare, Activity, Plus, PanelLeft, ClipboardPenLine } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { listSessions } from "@/lib/api/chat"
import { useSidebarCollapsed } from "@/components/layout/SidebarProvider"
import { SidebarUserFooter } from "@/components/layout/SidebarUserFooter"
import type { SessionSummary } from "@/types"

function formatShortDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso))
}

export function AppSidebar() {
  const t = useTranslations("sidebar")
  const locale = useLocale()
  const pathname = usePathname()
  const { collapsed, toggleCollapsed } = useSidebarCollapsed()
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)

  const formatRelativeDate = useCallback(
    (iso: string): string => {
      const date = new Date(iso)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000)
      if (diffDays === 0) return t("today")
      if (diffDays === 1) return t("yesterday")
      if (diffDays < 7) return t("daysAgo", { days: diffDays })
      return formatShortDate(iso, locale)
    },
    [t, locale]
  )

  const classificationLabel = useCallback(
    (c: string | null): string => {
      if (!c) return t("unknown")
      return c === "lupus" ? t("lupus") : t("other")
    },
    [t]
  )

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true)
    try {
      const data = await listSessions()
      setSessions(data)
    } catch {
      setSessions([])
    } finally {
      setSessionsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const isOnTrackerPage = pathname.startsWith("/symptom-tracker")
  const isOnActivityTrackerPage = pathname.startsWith("/activity-tracker")
  const isOnScanPage = pathname.startsWith("/scan")

  const chatSessions = useMemo(
    () =>
      [...sessions].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      }),
    [sessions]
  )

  const activeChatId = useMemo(() => {
    const match = pathname.match(/^\/chat\/(.+)$/)
    return match ? match[1] : null
  }, [pathname])

  const navItems = [
    {
      href: "/scan",
      label: t("newScan"),
      icon: Plus,
      active: isOnScanPage,
      activeClass: "bg-primary text-primary-foreground",
      hoverClass: "hover:bg-primary/10 hover:text-primary",
    },
    {
      href: "/symptom-tracker",
      label: t("symptomTracker"),
      icon: Activity,
      active: isOnTrackerPage,
      activeClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
      hoverClass: "hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400",
    },
    {
      href: "/activity-tracker",
      label: t("activityTracker"),
      icon: ClipboardPenLine,
      active: isOnActivityTrackerPage,
      activeClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
      hoverClass: "hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400",
    },
  ]

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-[width] duration-200",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <div className={cn("flex h-fit items-center border-b border-border px-3", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/">
            <Image src={LogoImg} alt="Lupustic" className="h-12 my-2 w-auto scale-150" priority />
          </Link>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
          className="flex size-8 my-2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="px-2 py-2 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon, active, activeClass, hoverClass }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center rounded-md px-2.5 py-2.5 text-sm font-medium transition-colors",
              collapsed ? "justify-center gap-0" : "gap-2.5",
              active ? activeClass : cn("text-muted-foreground", hoverClass)
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </div>

      <Separator />

      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("chatHistory")}
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
              <nav className="space-y-0.5">
                {chatSessions.map((session) => {
                  const isActive = activeChatId === session.session_id
                  return (
                    <Link
                      key={session.session_id}
                      href={`/chat/${session.session_id}`}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
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
                  )
                })}
              </nav>
            ) : (
              <p className="px-2.5 text-xs text-muted-foreground italic">
                {t("noSessions")}
              </p>
            )}
          </div>
        </div>
      )}

      {collapsed && <div className="flex-1" />}

      <SidebarUserFooter />
    </aside>
  )
}
