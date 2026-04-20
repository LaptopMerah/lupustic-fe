"use client"

import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-2 md:px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lupustic. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
