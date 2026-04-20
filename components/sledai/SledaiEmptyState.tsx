"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ClipboardList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SledaiEmptyState() {
  const t = useTranslations("activityTracker")

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="rounded-full bg-secondary p-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("emptyDesc")}</p>
      </div>
      <Button asChild size="sm" className="gap-2">
        <Link href="/activity-tracker/create">
          <Plus className="h-4 w-4" />
          {t("newAssessment")}
        </Link>
      </Button>
    </div>
  )
}
