"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, RefreshCw } from "lucide-react"

interface ResultActionCardProps {
  classification: string
  confidence: number
  sessionId: string
  onRetry: () => void
}

export function ResultActionCard({
  classification,
  confidence,
  sessionId,
  onRetry,
}: ResultActionCardProps) {
  const t = useTranslations("scanResult")
  const router = useRouter()
  const isLupus = classification === "Lupus"

  const handleProceedToChat = () => {
    sessionStorage.setItem(
      "lupustic_scan",
      JSON.stringify({ session_id: sessionId, classification, confidence })
    )
    router.push(`/chat/${sessionId}`)
  }

  if (isLupus) {
    return (
      <Card className="border border-border bg-accent/5">
        <CardContent className="flex flex-col gap-3 p-4">
          <p className="text-sm text-muted-foreground">{t("recommendConsult")}</p>
          <Button
            className="rounded-lg"
            onClick={handleProceedToChat}
            aria-label="Proceed to AI consultation"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("proceedConsultation")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border bg-green-50">
      <CardContent className="flex flex-col gap-3 p-4">
        <p className="text-sm text-muted-foreground">{t("noIndicators")}</p>
        <Button
          variant="outline"
          className="rounded-lg"
          onClick={onRetry}
          aria-label="Scan another image"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("scanAnother")}
        </Button>
      </CardContent>
    </Card>
  )
}
