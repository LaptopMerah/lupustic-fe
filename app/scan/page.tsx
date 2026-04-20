"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useScan } from "@/hooks/useScan"
import { ImageUploader } from "@/components/scan/ImageUploader"
import { ScanLine } from "lucide-react"

export default function ScanPage() {
  const t = useTranslations("scan")
  const router = useRouter()
  const { selectedFile, previewUrl, selectFile, clearFile } = useScan()

  const handleProceed = () => {
    if (!selectedFile) return
    router.push("/symptom")
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ScanLine className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ImageUploader
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        onSelect={selectFile}
        onClear={clearFile}
        onAnalyze={handleProceed}
        isLoading={false}
      />
    </div>
  )
}
