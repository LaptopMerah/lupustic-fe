"use client"

import { useState, useCallback, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SledaiCriterionRow } from "@/components/sledai/SledaiCriterionRow"
import { SledaiScoreDisplay } from "@/components/sledai/SledaiScoreDisplay"
import {
  SLEDAI_CRITERIA,
  SLEDAI_CATEGORY_LABELS,
  computeSledaiScore,
} from "@/lib/sledai"
import type { SledaiAnswers, SledaiCategory } from "@/types"

interface Props {
  onSubmit: (answers: SledaiAnswers, score: number, notes: string) => void
  isSaving: boolean
}

const CATEGORY_ORDER: SledaiCategory[] = [
  "neuropsychiatric",
  "musculoskeletal",
  "renal",
  "skin",
  "serosal",
  "immunologic",
  "constitutional",
]

const INITIAL_ANSWERS: SledaiAnswers = Object.fromEntries(
  SLEDAI_CRITERIA.map((c) => [c.id, false])
)

export function SledaiCalculator({ onSubmit, isSaving }: Props) {
  const t = useTranslations("activityTracker")
  const [answers, setAnswers] = useState<SledaiAnswers>(INITIAL_ANSWERS)
  const [notes, setNotes] = useState("")

  const handleChange = useCallback((id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }, [])

  const score = useMemo(() => computeSledaiScore(answers), [answers])

  const groupedCriteria = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      label: SLEDAI_CATEGORY_LABELS[category],
      criteria: SLEDAI_CRITERIA.filter((c) => c.category === category),
    }))
  }, [])

  return (
    <div>
      <SledaiScoreDisplay score={score} />

      <div className="p-6 space-y-8">
        {groupedCriteria.map(({ category, label, criteria }) => (
          <section key={category}>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                +{criteria[0].weight} each
              </span>
            </div>
            <div className="space-y-2">
              {criteria.map((criterion) => (
                <SledaiCriterionRow
                  key={criterion.id}
                  criterion={criterion}
                  checked={answers[criterion.id] ?? false}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>
        ))}

        <Separator />

        <div className="space-y-3">
          <label
            htmlFor="sledai-notes"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {t("notes")}
          </label>
          <textarea
            id="sledai-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("notesPlaceholder")}
            rows={3}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => onSubmit(answers, score, notes)}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  )
}
