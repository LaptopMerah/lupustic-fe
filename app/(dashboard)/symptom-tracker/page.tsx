"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTracker } from "@/hooks/useTracker"
import { TrackerGrid } from "@/components/tracker/TrackerGrid"
import { TrackerFormModal } from "@/components/tracker/TrackerFormModal"

export default function SymptomTrackerPage() {
  const t = useTranslations("symptomTracker")
  const { entries, isLoading, error, addEntry, removeEntry } = useTracker()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
          <Button onClick={() => setModalOpen(true)} className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t("addEntry")}</span>
          </Button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <TrackerGrid
          entries={entries}
          isLoading={isLoading}
          onDelete={removeEntry}
          onAddEntry={() => setModalOpen(true)}
        />
      </div>

      <TrackerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addEntry}
      />
    </>
  )
}
