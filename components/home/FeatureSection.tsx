"use client"

import { useTranslations } from "next-intl"
import { Eye, BarChart3, MessageCircle, CalendarClock } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

export function FeatureSection() {
  const t = useTranslations("features")

  const features = [
    { icon: Eye, title: t("f1Title"), description: t("f1Desc") },
    { icon: BarChart3, title: t("f2Title"), description: t("f2Desc") },
    { icon: MessageCircle, title: t("f3Title"), description: t("f3Desc") },
    { icon: CalendarClock, title: t("f4Title"), description: t("f4Desc") },
  ]

  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
