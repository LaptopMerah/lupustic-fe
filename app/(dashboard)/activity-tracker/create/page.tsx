"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SledaiCalculator } from "@/components/sledai/SledaiCalculator"
import { createSledaiRecord } from "@/lib/api/sledai"
import type { SledaiAnswers } from "@/types"

export default function ActivityTrackerCreatePage() {
  const t = useTranslations("activityTracker")
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(answers: SledaiAnswers, score: number, notes: string) {
    setIsSaving(true)
    try {
      await createSledaiRecord({ data: { answers, score, notes: notes || undefined } })
      toast.success(t("saveAssessment"))
      router.push("/activity-tracker")
    } catch (err) {
      toast.error(t("errorSave"))
      console.error("[SledaiCreate]", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="sticky top-0 z-20 border-b border-border bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-4">
          <Button variant="ghost" size="icon" aria-label="Back" asChild>
            <Link href="/activity-tracker">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("createTitle")}</h1>
            <p className="text-xs text-muted-foreground">{t("createSubtitle")}</p>
          </div>
        </div>
      </div>

      <SledaiCalculator onSubmit={handleSubmit} isSaving={isSaving} />
    </>
  )
}
