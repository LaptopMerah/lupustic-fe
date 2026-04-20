"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { useTranslations } from "next-intl"
import { Upload, ImageIcon, X, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CreateTrackerPayload } from "@/types"

interface TrackerFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: CreateTrackerPayload) => Promise<void>
}

const MAX_NAME_CHARS = 100
const MAX_DESC_CHARS = 500

export function TrackerFormModal({ open, onClose, onSubmit }: TrackerFormModalProps) {
  const t = useTranslations("trackerModal")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setImageFile(null)
    setImagePreview(null)
    setName("")
    setDesc("")
    setError(null)
    setFieldErrors({})
    setIsSubmitting(false)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, image: t("errorImageType") }))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, image: t("errorImageSize") }))
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next.image
      return next
    })
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function removeImage() {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (!imageFile) errors.image = t("errorImage")
    if (!name.trim()) errors.name = t("errorName")
    if (!desc.trim()) errors.desc = t("errorDesc")
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit({ image: imageFile!, name: name.trim(), desc: desc.trim() })
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorSave"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ImageIcon className="h-4 w-4" />
              {t("uploadPhoto")}
            </label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeImage}
                  className="absolute right-2 top-2 h-7 w-7 rounded-md bg-black/50 text-white hover:bg-black/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("dragDrop")}</p>
                <p className="text-xs text-muted-foreground/60">{t("fileHint")}</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            {fieldErrors.image && (
              <p className="text-xs text-destructive">{fieldErrors.image}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t("whereAppears")}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_CHARS))}
              placeholder={t("wherePlaceholder")}
              disabled={isSubmitting}
            />
            {fieldErrors.name && (
              <p className="text-xs text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t("describeIt")}</label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, MAX_DESC_CHARS))}
              placeholder={t("describePlaceholder")}
              rows={4}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between">
              {fieldErrors.desc ? (
                <p className="text-xs text-destructive">{fieldErrors.desc}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground">
                {desc.length}/{MAX_DESC_CHARS}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? t("saving") : t("saveEntry")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
