"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SledaiGrid } from "@/components/sledai/SledaiGrid"
import { useSledai } from "@/hooks/useSledai"

export default function ActivityTrackerPage() {
  const t = useTranslations("activityTracker")
  const { records, isLoading, error, removeRecord } = useSledai()

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/activity-tracker/create">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("newAssessment")}</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-6">
        <SledaiGrid records={records} isLoading={isLoading} onDelete={removeRecord} />
      </div>
    </>
  )
}
