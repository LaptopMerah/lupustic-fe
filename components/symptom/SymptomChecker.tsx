"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Thermometer,
  CircleDot,
  Scissors,
  Zap,
  Bone,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SymptomCollapsible } from "./SymptomCollapsible"
import { SymptomWarning } from "./SymptomWarning"
import { useSymptomChecker } from "@/hooks/useSymptomChecker"
import type { SymptomState } from "@/hooks/useSymptomChecker"

function SubQuestion({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="mt-0.5 shrink-0"
      />
      <Label htmlFor={id} className="text-sm leading-relaxed cursor-pointer text-foreground/80">
        {label}
      </Label>
    </div>
  )
}

export function SymptomChecker() {
  const t = useTranslations("symptomChecker")
  const router = useRouter()
  const { state, toggle, errors, validate, saveToSession } = useSymptomChecker()

  const handleSubmit = () => {
    if (!validate()) return
    saveToSession()
    const tempUuid = crypto.randomUUID()
    router.push(`/chat/${tempUuid}`)
  }

  const tog = (key: keyof SymptomState) => () => toggle(key)

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ClipboardCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{t("subtitle")}</p>
      </div>

      <div className="space-y-3">
        {/* ── Fever ── */}
        <SymptomCollapsible
          id="fever"
          icon={<Thermometer className="h-5 w-5" />}
          title={t("feverTitle")}
          subtitle={t("feverSubtitle")}
          checked={state.fever}
          onCheckedChange={tog("fever")}
        >
          <SubQuestion
            id="fever-unknown"
            label={t("feverSubUnknown")}
            checked={state.feverUnknownCause}
            onChange={tog("feverUnknownCause")}
          />

          {state.feverUnknownCause && (
            <div className="space-y-3 pl-6 border-l-2 border-primary/20">
              <SymptomWarning>{t("feverWarning")}</SymptomWarning>
            </div>
          )}

          <SubQuestion
            id="fever-recurring"
            label={t("feverSubRecurring")}
            checked={state.feverRecurring}
            onChange={tog("feverRecurring")}
          />
          <SubQuestion
            id="fever-fatigue"
            label={t("feverSubFatigue")}
            checked={state.feverFatigue}
            onChange={tog("feverFatigue")}
          />

          {errors.fever && (
            <p className="text-xs font-medium text-destructive">{errors.fever}</p>
          )}
        </SymptomCollapsible>

        {/* ── Mouth Sores ── */}
        <SymptomCollapsible
          id="mouth-sores"
          icon={<CircleDot className="h-5 w-5" />}
          title={t("mouthTitle")}
          subtitle={t("mouthSubtitle")}
          checked={state.oralUlcers}
          onCheckedChange={tog("oralUlcers")}
        >
          <SymptomWarning>{t("mouthWarning")}</SymptomWarning>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{t("exampleImage")}</p>
            <Image
              src="/images/mouth_sores.jpg"
              width={320}
              height={200}
              alt={t("mouthImgAlt")}
              className="max-w-xs rounded-lg mx-auto border border-border object-cover"
            />
          </div>
        </SymptomCollapsible>

        {/* ── Hair Loss ── */}
        <SymptomCollapsible
          id="hair-loss"
          icon={<Scissors className="h-5 w-5" />}
          title={t("hairTitle")}
          subtitle={t("hairSubtitle")}
          checked={state.nonScarringAlopecia}
          onCheckedChange={tog("nonScarringAlopecia")}
        >
          <SymptomWarning>{t("hairWarning")}</SymptomWarning>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{t("exampleImage")}</p>
            <Image
              src="/images/hair_loss.jpeg"
              width={320}
              height={200}
              alt={t("hairImgAlt")}
              className="max-w-xs rounded-lg mx-auto border border-border object-cover"
            />
          </div>
        </SymptomCollapsible>

        {/* ── Seizures ── */}
        <SymptomCollapsible
          id="seizures"
          icon={<Zap className="h-5 w-5" />}
          title={t("seizureTitle")}
          subtitle={t("seizureSubtitle")}
          checked={state.seizures}
          onCheckedChange={tog("seizures")}
        >
          <SymptomWarning>{t("seizureWarning1")}</SymptomWarning>
          <SymptomWarning>{t("seizureWarning2")}</SymptomWarning>
        </SymptomCollapsible>

        {/* ── Joint Pain ── */}
        <SymptomCollapsible
          id="joint-pain"
          icon={<Bone className="h-5 w-5" />}
          title={t("jointTitle")}
          subtitle={t("jointSubtitle")}
          checked={state.jointInvolvement}
          onCheckedChange={tog("jointInvolvement")}
        >
          <SubQuestion
            id="joint-multiple"
            label={t("jointSubMultiple")}
            checked={state.jointInvolvementMultiple}
            onChange={tog("jointInvolvementMultiple")}
          />

          {state.jointInvolvementMultiple && (
            <div className="space-y-3 pl-6 border-l-2 border-primary/20">
              <SymptomWarning>{t("jointWarningTrauma")}</SymptomWarning>
              <SymptomWarning>{t("jointWarningGout")}</SymptomWarning>
            </div>
          )}

          <SubQuestion
            id="joint-stiff-morning"
            label={t("jointSubStiff")}
            checked={state.jointInvolvementStiffMorning}
            onChange={tog("jointInvolvementStiffMorning")}
          />
          <SubQuestion
            id="joint-swollen"
            label={t("jointSubSwollen")}
            checked={state.jointInvolvementSwollen}
            onChange={tog("jointInvolvementSwollen")}
          />

          {errors.jointInvolvement && (
            <p className="text-xs font-medium text-destructive">{errors.jointInvolvement}</p>
          )}
        </SymptomCollapsible>
      </div>

      <div className="mt-8">
        <Button
          onClick={handleSubmit}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          size="lg"
        >
          {t("submitBtn")}
          <ArrowRight className="h-5 w-5" />
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">{t("submitNote")}</p>
      </div>
    </div>
  )
}
