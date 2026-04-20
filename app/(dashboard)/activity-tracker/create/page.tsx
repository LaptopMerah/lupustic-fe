"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SledaiCalculator } from "@/components/sledai/SledaiCalculator";
import { createSledaiRecord } from "@/lib/api/sledai";
import type { SledaiAnswers } from "@/types";

export default function ActivityTrackerCreatePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(answers: SledaiAnswers, score: number, notes: string) {
    setIsSaving(true);
    setError(null);
    try {
      await createSledaiRecord({ answers, score, notes: notes || undefined });
      router.push("/activity-tracker");
    } catch (err) {
      setError("Unable to save assessment. Please try again.");
      console.error("[SledaiCreate]", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="sticky top-0 z-20 border-b border-border bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-4">
          <Button variant="ghost" size="icon" aria-label="Back" asChild>
            <Link href="/activity-tracker">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">New Assessment</h1>
            <p className="text-xs text-muted-foreground">
              Systemic Lupus Erythematosus Disease Activity Index 2000
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-6 pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <SledaiCalculator onSubmit={handleSubmit} isSaving={isSaving} />
    </>
  );
}
