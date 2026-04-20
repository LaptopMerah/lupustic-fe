"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { getSledaiActivityLevel } from "@/lib/sledai"
import type { SledaiActivityLevel } from "@/types"

interface Props {
  score: number
}

const LEVEL_STYLES: Record<SledaiActivityLevel, string> = {
  "none": "bg-green-500/10 text-green-700 border-green-200",
  "mild": "bg-amber-500/10 text-amber-700 border-amber-200",
  "moderate": "bg-orange-500/10 text-orange-700 border-orange-200",
  "high": "bg-red-500/10 text-red-700 border-red-200",
  "very-high": "bg-red-700/10 text-red-800 border-red-300",
}

const ACTIVITY_LABEL_KEYS: Record<SledaiActivityLevel, string> = {
  "none": "activityNone",
  "mild": "activityMild",
  "moderate": "activityModerate",
  "high": "activityHigh",
  "very-high": "activityVeryHigh",
}

export function SledaiScoreDisplay({ score }: Props) {
  const t = useTranslations("activityTracker")
  const level = getSledaiActivityLevel(score)
  const label = t(ACTIVITY_LABEL_KEYS[level])

  return (
    <div className="sticky top-18.25 z-10 border-b border-border bg-secondary/90 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            SLEDAI-2K Score
          </p>
          <p className="font-mono text-3xl font-semibold text-foreground">{score}</p>
        </div>

        <div className={cn("rounded-lg border px-4 py-2 text-sm font-medium", LEVEL_STYLES[level])}>
          {label}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground italic">
        {t("screeningDisclaimer")}
      </p>
    </div>
  )
}
