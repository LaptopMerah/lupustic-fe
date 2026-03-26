import type { FirstChatResponse } from "@/types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ResultActionCard } from "./ResultActionCard";
import { Progress } from "@/components/ui/progress";

interface ScanResultProps {
  data: FirstChatResponse;
  previewUrl: string;
  onRetry: () => void;
}

export function ScanResult({ data, previewUrl, onRetry }: ScanResultProps) {
  const isLupus = data.classification === "Lupus";
  const confidencePercent = Math.round(data.confidence * 100);
  const resultText = isLupus
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

        <ConfidenceBadge confidence={confidencePercent} />

        <Progress value={confidencePercent} className="h-2" />

        <p className="text-base font-medium text-foreground">{resultText}</p>

        <ResultActionCard
          classification={data.classification}
          confidence={data.confidence}
          sessionId={data.session_id}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
