"use client";

import { useRouter } from "next/navigation";
import {
  Thermometer,
  CircleDot,
  Scissors,
  Zap,
  Bone,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SymptomCollapsible } from "./SymptomCollapsible";
import { SymptomWarning } from "./SymptomWarning";
import { useSymptomChecker } from "@/hooks/useSymptomChecker";
import type { SymptomState } from "@/hooks/useSymptomChecker";

/** Small helper: a checkbox row inside a collapsible */
function SubQuestion({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="mt-0.5 shrink-0"
      />
      <Label
        htmlFor={id}
        className="text-sm leading-relaxed cursor-pointer text-foreground/80"
      >
        {label}
      </Label>
    </div>
  );
}

export function SymptomChecker() {
  const router = useRouter();
  const {
    state,
    toggle,
    errors,
    validate,
    saveToSession,
  } = useSymptomChecker();

  const handleSubmit = () => {
    if (!validate()) return;
    saveToSession();
    const tempUuid = crypto.randomUUID();
    router.push(`/chat/${tempUuid}`);
  };

  // Helper to create a toggle handler
  const t = (key: keyof SymptomState) => () => toggle(key);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-14">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ClipboardCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Pemeriksaan Gejala
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Centang gejala yang Anda alami. Klik untuk membuka detail setiap
          gejala.
        </p>
      </div>

      {/* Symptom sections */}
      <div className="space-y-3">
        {/* ───────── 1. DEMAM ───────── */}
        <SymptomCollapsible
          id="fever"
          icon={<Thermometer className="h-5 w-5" />}
          title="Demam lebih dari 38°C"
          subtitle="Demam yang tidak diketahui penyebabnya"
          checked={state.fever}
          onCheckedChange={t("fever")}
        >
          <SubQuestion
            id="fever-unknown"
            label="Tidak diketahui penyebabnya"
            checked={state.feverUnknownCause}
            onChange={t("feverUnknownCause")}
          />

          {state.feverUnknownCause && (
            <div className="space-y-3 pl-6 border-l-2 border-primary/20">
              <SymptomWarning>
                Tidak batuk, nyeri saat berkemih, diare, atau luka bernanah.
                Tidak sedang menderita kanker. Tidak terjadi setelah
                mengkonsumsi obat.
              </SymptomWarning>
            </div>
          )}

          <SubQuestion
            id="fever-recurring"
            label="Sudah beberapa hari/minggu atau berulang"
            checked={state.feverRecurring}
            onChange={t("feverRecurring")}
          />
          <SubQuestion
            id="fever-fatigue"
            label="Merasa lelah dan turun berat badan"
            checked={state.feverFatigue}
            onChange={t("feverFatigue")}
          />

          {errors.fever && (
            <p className="text-xs font-medium text-destructive">{errors.fever}</p>
          )}
        </SymptomCollapsible>

        {/* ───────── 2. SARIAWAN ───────── */}
        <SymptomCollapsible
          id="mouth-sores"
          icon={<CircleDot className="h-5 w-5" />}
          title="Sariawan di Area Mulut atau Hidung"
          subtitle="Pada langit-langit mulut, gusi, atau bagian dalam hidung"
          checked={state.oralUlcers}
          onCheckedChange={t("oralUlcers")}
        >
          <SymptomWarning>
            Bukan disebabkan oleh tergigit, kawat gigi, obat, atau makanan.
          </SymptomWarning>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Contoh gambar:</p>
            <Image
              src="/images/mouth_sores.jpg"
              width={320}
              height={200}
              alt="Contoh sariawan pada mulut"
              className="max-w-xs rounded-lg mx-auto border border-border object-cover"
            />
          </div>
        </SymptomCollapsible>

        {/* ───────── 3. RAMBUT RONTOK ───────── */}
        <SymptomCollapsible
          id="hair-loss"
          icon={<Scissors className="h-5 w-5" />}
          title="Rambut Rontok atau Pitak"
          subtitle="Kerontokan rambut di beberapa tempat"
          checked={state.nonScarringAlopecia}
          onCheckedChange={t("nonScarringAlopecia")}
        >
          <SymptomWarning>
            Pada area rontok tidak ada keropeng, nanah, atau bekas luka
            permanen. Terdapat rambut-rambut pendek dan rapuh di sepanjang garis
            rambut dahi (Lupus Hair).
          </SymptomWarning>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Contoh gambar:</p>
            <Image
              src="/images/hair_loss.jpeg"
              width={320}
              height={200}
              alt="Contoh rambut rontok lupus"
              className="max-w-xs rounded-lg mx-auto border border-border object-cover"
            />
          </div>
        </SymptomCollapsible>

        {/* ───────── 4. KEJANG ───────── */}
        <SymptomCollapsible
          id="seizures"
          icon={<Zap className="h-5 w-5" />}
          title="Riwayat Kejang"
          subtitle="Kejang yang bukan disebabkan oleh kondisi lain"
          checked={state.seizures}
          onCheckedChange={t("seizures")}
        >
          <SymptomWarning>
            Bukan karena epilepsi, gangguan elektrolit berat, kadar gula darah
            yang sangat rendah (hipoglikemia), atau infeksi.
          </SymptomWarning>

          <SymptomWarning>
            Bukan karena obat, alkohol, ataupun zat terlarang.
          </SymptomWarning>
        </SymptomCollapsible>

        {/* ───────── 5. NYERI SENDI ───────── */}
        <SymptomCollapsible
          id="joint-pain"
          icon={<Bone className="h-5 w-5" />}
          title="Nyeri, Kaku, atau Bengkak pada Sendi"
          subtitle="Nyeri sendi pada satu atau lebih titik"
          checked={state.jointInvolvement}
          onCheckedChange={t("jointInvolvement")}
        >
          <SubQuestion
            id="joint-multiple"
            label="Terjadi pada 2 titik sendi atau lebih"
            checked={state.jointInvolvementMultiple}
            onChange={t("jointInvolvementMultiple")}
          />

          {state.jointInvolvementMultiple && (
            <div className="space-y-3 pl-6 border-l-2 border-primary/20">
              <SymptomWarning>
                Tidak disebabkan oleh jatuh, terbentur, atau aktivitas fisik
                berlebih baru-baru ini.
              </SymptomWarning>
              <SymptomWarning>
                Tidak sedang didiagnosis menderita asam urat atau pengapuran
                sendi.
              </SymptomWarning>
            </div>
          )}

          <SubQuestion
            id="joint-stiff-morning"
            label="Sendi terasa kaku, berat, atau sulit digerakkan saat bangun tidur"
            checked={state.jointInvolvementStiffMorning}
            onChange={t("jointInvolvementStiffMorning")}
          />
          <SubQuestion
            id="joint-swollen"
            label="Sendi terlihat bengkak"
            checked={state.jointInvolvementSwollen}
            onChange={t("jointInvolvementSwollen")}
          />

          {errors.jointInvolvement && (
            <p className="text-xs font-medium text-destructive">{errors.jointInvolvement}</p>
          )}
        </SymptomCollapsible>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <Button
          onClick={handleSubmit}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          size="lg"
        >
          Lanjutkan ke Konsultasi
          <ArrowRight className="h-5 w-5" />
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Hasil pemeriksaan gejala akan digunakan oleh AI untuk memberikan
          konsultasi yang lebih akurat.
        </p>
      </div>
    </div>
  );
}
