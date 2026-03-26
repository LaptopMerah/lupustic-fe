"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatResultHeaderProps {
  classification: string;
  confidence: number;
}

export function ChatResultHeader({
  classification,
  confidence,
}: ChatResultHeaderProps) {
  const isLupus = classification === "lupus";
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border px-5 py-3 m-2",
        isLupus ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isLupus ? "bg-red-100" : "bg-green-100"
        )}
      >
        {isLupus ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {isLupus
            ? "Possible lupus indicators found"
            : "No lupus indicators detected"}
        </p>
        <p className="text-xs text-muted-foreground">
          Computer vision skin analysis &middot; {confidencePercent}% confidence
        </p>
      </div>

      {/* Badge */}
      <span
        className={cn(
          "shrink-0 rounded-md border px-3 py-1 text-xs font-medium",
          isLupus
            ? "border-red-200 bg-red-50 text-red-600"
            : "border-green-200 bg-green-50 text-green-600"
        )}
      >
        {isLupus ? "Positive" : "Negative"}
      </span>
    </div>
  );
}
