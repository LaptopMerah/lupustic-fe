"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export function HeroSection() {
  const router = useRouter()
  const t = useTranslations("hero")

  return (
    <section className="border-b border-border relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl text-muted-foreground">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="flex items-center gap-2 mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full w-fit border border-emerald-200 dark:border-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t("accuracyBadge")}
          </div>
          <div className="flex flex-col mt-2 gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="rounded-lg"
              onClick={() => router.push("/scan")}
              aria-label="Start scanning for lupus indicators"
            >
              {t("startScanning")}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>{t("disclaimer")}</span>
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:justify-center" aria-hidden="true">
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-80 w-80 opacity-80"
          >
            <circle cx="200" cy="200" r="160" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="8 4" />
            <circle cx="200" cy="200" r="120" stroke="#6366F1" strokeWidth="1" opacity="0.5" />
            <circle cx="200" cy="200" r="80" stroke="#6366F1" strokeWidth="0.75" opacity="0.3" />
            <circle cx="200" cy="200" r="40" fill="#6366F1" opacity="0.08" />
            <circle cx="140" cy="140" r="6" fill="#F43F5E" opacity="0.6" />
            <circle cx="260" cy="150" r="4" fill="#6366F1" opacity="0.5" />
            <circle cx="170" cy="270" r="5" fill="#6366F1" opacity="0.4" />
            <circle cx="280" cy="250" r="3" fill="#F43F5E" opacity="0.5" />
            <circle cx="130" cy="220" r="3.5" fill="#6366F1" opacity="0.3" />
            <circle cx="240" cy="310" r="4" fill="#F43F5E" opacity="0.4" />
            <line x1="195" y1="195" x2="205" y2="205" stroke="#6366F1" strokeWidth="1.5" opacity="0.4" />
            <line x1="205" y1="195" x2="195" y2="205" stroke="#6366F1" strokeWidth="1.5" opacity="0.4" />
            <line x1="295" y1="195" x2="305" y2="205" stroke="#F43F5E" strokeWidth="1" opacity="0.3" />
            <line x1="305" y1="195" x2="295" y2="205" stroke="#F43F5E" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
