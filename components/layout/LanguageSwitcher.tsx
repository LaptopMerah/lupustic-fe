"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Globe, Check, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "id", label: "Indonesia", short: "ID" },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(newLocale: string) {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    startTransition(() => {
      router.refresh()
    })
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          aria-label="Switch language"
          className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{current.short}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => switchLocale(l.code)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="text-sm">{l.label}</span>
            {locale === l.code && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
