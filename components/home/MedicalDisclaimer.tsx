"use client"

import { useTranslations } from "next-intl"
import { AlertTriangle } from "lucide-react"

export function MedicalDisclaimer() {
  const t = useTranslations("disclaimer")

  return (
    <section className="border-b border-border bg-accent/5 py-10">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-accent" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
            {t("title")}
          </h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t.rich("body", {
            not: (chunks) => (
              <strong className="text-foreground">{chunks}</strong>
            ),
          })}
        </p>
      </div>
    </section>
  )
}
