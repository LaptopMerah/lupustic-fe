"use client"

import { useTranslations } from "next-intl"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function PricingSection() {
  const t = useTranslations("pricing")

  const freeBenefits = [t("free1"), t("free2"), t("free3")]
  const premiumBenefits = [t("premium1"), t("premium2"), t("premium3")]

  return (
    <section className="border-b border-border py-20 bg-indigo-50/30 dark:bg-background">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-indigo-950 dark:text-indigo-50">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          <Card className="w-full relative overflow-hidden border-border shadow-sm hover:shadow-md transition-all dark:bg-card flex flex-col">
            <CardHeader className="text-center pt-10 pb-4">
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                {t("freeTitle")}
              </CardTitle>
              <CardDescription className="text-base h-10">{t("freeDesc")}</CardDescription>
              <div className="mt-8 font-semibold flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold tracking-tight text-foreground">IDR 0</span>
              </div>
            </CardHeader>

            <CardContent className="px-8 py-6 space-y-4 flex-grow">
              <ul className="space-y-4 text-sm md:text-base text-muted-foreground">
                {freeBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="px-8 py-6">
              <Button asChild variant="outline" className="w-full h-12 text-base font-semibold transition-all hover:-translate-y-0.5">
                <Link href="/scan">{t("tryForFree")}</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full relative overflow-hidden border-indigo-200 dark:border-indigo-800 shadow-xl dark:bg-indigo-950/20 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="absolute top-0 right-0 py-1 px-3 bg-indigo-500 text-white text-xs font-bold tracking-wider uppercase rounded-bl-lg">
              {t("recommended")}
            </div>

            <CardHeader className="text-center pt-10 pb-4">
              <CardTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {t("premiumTitle")}
              </CardTitle>
              <CardDescription className="text-base h-10 text-indigo-900/70 dark:text-indigo-200/70">
                {t("premiumDesc")}
              </CardDescription>
              <div className="mt-8 font-semibold flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  IDR 49K
                </span>
                <span className="text-muted-foreground font-medium">{t("perMonth")}</span>
              </div>
            </CardHeader>

            <CardContent className="px-8 py-6 space-y-4 flex-grow">
              <ul className="space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-300">
                {premiumBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 flex-grow">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="px-8 py-6">
              <Button asChild className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <Link href="/scan">{t("getStarted")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
