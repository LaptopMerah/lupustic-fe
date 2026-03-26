"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScan } from "@/hooks/useScan";
import { ImageUploader } from "@/components/scan/ImageUploader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, ScanLine } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const { state, selectedFile, previewUrl, selectFile, clearFile, scan, reset } =
    useScan();

  // Auto-navigate to chat on successful scan
  // The /first-chat endpoint returns a session_id — use that instead of crypto.randomUUID()
  useEffect(() => {
    if (state.status === "success") {
      const { session_id, classification, confidence, answer, sources } =
        state.data;

      sessionStorage.setItem(
        "lupustic_scan",
        JSON.stringify({
          session_id,
          classification,
          confidence,
          answer,
          sources,
        })
      );

      router.push(`/chat/${session_id}`);
    }
  }, [state, router]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ScanLine className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Skin Analysis
        </h1>
        <p className="mt-2 text-muted-foreground">
          Upload a clear photo of the affected skin area for AI-powered analysis
        </p>
      </div>

      {/* Idle state */}
      {state.status === "idle" && (
        <ImageUploader
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          onSelect={selectFile}
          onClear={clearFile}
          onAnalyze={scan}
          isLoading={false}
        />
      )}

      {/* Loading / Success (redirecting) state */}
      {(state.status === "loading" || state.status === "success") && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-md">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            {state.status === "loading"
              ? "Analyzing your skin sample..."
              : "Redirecting to consultation..."}
          </p>
        </div>
      )}

      {/* Error state */}
      {state.status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={reset}
            aria-label="Try again"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
