"use client"

import { useTranslations } from "next-intl"
import { ClipboardList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrackerEmptyStateProps {
  onAddEntry: () => void
}

export function TrackerEmptyState({ onAddEntry }: TrackerEmptyStateProps) {
  const t = useTranslations("symptomTracker")

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-secondary">
        <ClipboardList className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">{t("emptyTitle")}</h3>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">{t("emptyDesc")}</p>

      <Button onClick={onAddEntry} className="gap-2">
        <Plus className="h-4 w-4" />
        {t("addFirstEntry")}
      </Button>
    </div>
  )
}
