"use client"

import { useTranslations } from "next-intl"
import { ShieldCheck, Timer, Lock, Wallet, Globe, Smile } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function BuiltForEveryone() {
  const t = useTranslations("builtForEveryone")

  const features = [
    { icon: ShieldCheck, title: t("f1Title"), desc: t("f1Desc") },
    { icon: Timer, title: t("f2Title"), desc: t("f2Desc") },
    { icon: Lock, title: t("f3Title"), desc: t("f3Desc") },
    { icon: Wallet, title: t("f4Title"), desc: t("f4Desc") },
    { icon: Globe, title: t("f5Title"), desc: t("f5Desc") },
    { icon: Smile, title: t("f6Title"), desc: t("f6Desc") },
  ]

  return (
    <section className="border-b border-border py-16 md:py-24 bg-indigo-50/40 dark:bg-indigo-950/20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl dark:text-indigo-100">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card
                key={idx}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-linear-to-br from-fuchsia-100/80 via-purple-100/50 to-indigo-100/80 dark:from-fuchsia-950/40 dark:via-purple-900/40 dark:to-indigo-950/40 border border-white/60 dark:border-white/10"
              >
                <CardContent className="flex flex-col items-center text-center p-8 gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 dark:bg-black/20 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
