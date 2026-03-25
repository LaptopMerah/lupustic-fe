import type { ScanResponse } from "@/types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ResultActionCard } from "./ResultActionCard";
import { Progress } from "@/components/ui/progress";

interface ScanResultProps {
  data: ScanResponse;
  previewUrl: string;
  onRetry: () => void;
}

export function ScanResult({ data, previewUrl, onRetry }: ScanResultProps) {
  const resultText =
    data.result === "lupus"
      ? "Potential Lupus Indicators Detected"
      : "No Lupus Indicators Detected";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image preview */}
      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Analyzed skin image"
          className="h-72 w-full object-cover md:h-80"
        />
      </div>

      {/* Result panel */}
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            Analysis Result
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on our AI model&apos;s analysis
          </p>
        </div>

        <ConfidenceBadge confidence={data.confidence} />

        <Progress value={data.confidence} className="h-2" />

        <p className="text-base font-medium text-foreground">{resultText}</p>

        <ResultActionCard
          result={data.result}
          confidence={data.confidence}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
