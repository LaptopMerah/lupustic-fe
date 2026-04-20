"use client"

import { useTranslations } from "next-intl"
import { Camera, ScanLine, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function HowItWorks() {
  const t = useTranslations("howItWorks")

  const steps = [
    { icon: Camera, title: t("step1Title"), description: t("step1Desc") },
    { icon: ScanLine, title: t("step2Title"), description: t("step2Desc") },
    { icon: MessageSquare, title: t("step3Title"), description: t("step3Desc") },
  ]

  return (
    <section className="border-b border-border bg-card py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border border-border bg-background shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted font-mono text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
