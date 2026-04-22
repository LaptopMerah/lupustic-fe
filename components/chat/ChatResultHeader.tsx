"use client"

import { useTranslations } from "next-intl"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ChatResultHeaderProps {
  classification: string
  imageClassification: string
  imageConfidence: number
  clinical_domains_point: number
}

export function ChatResultHeader({
  classification,
  imageClassification,
  imageConfidence,
  clinical_domains_point,
}: ChatResultHeaderProps) {
  const t = useTranslations("chatResult")
  const isLupus = classification === "lupus"
  const isImageLupus = imageClassification === "lupus"
  const confidencePercent = Math.round(imageConfidence * 100)

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border px-5 py-3 m-2",
        isLupus ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            isLupus ? "bg-red-100" : "bg-green-100"
          )}
        >
          {isLupus ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {isLupus ? t("lupusFound") : t("noLupus")}
          </p>
        </div>

        <Badge
          className={cn(
            "border-0",
            isLupus
              ? "bg-red-500 text-white hover:bg-red-500"
              : "bg-green-500 text-white hover:bg-green-500"
          )}
        >
          {isLupus ? t("positive") : t("negative")}
        </Badge>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border rounded-md border border-border bg-white/60 text-xs">
        <div className="flex flex-col items-center gap-0.5 px-3 py-2">
          <span className="text-muted-foreground">{t("confidence")}</span>
          <span className="font-mono font-semibold text-foreground">{confidencePercent}%</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-3 py-2">
          <span className="text-muted-foreground">{t("imageScan")}</span>
          <span className={cn("font-semibold", isImageLupus ? "text-red-600" : "text-green-600")}>
            {isImageLupus ? t("positive") : t("negative")}
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-3 py-2">
          <span className="text-muted-foreground">{t("symptomPoints")}</span>
          <span className="font-mono font-semibold text-foreground">{clinical_domains_point ?? 0}</span>
        </div>
      </div>
    </div>
  )
}
