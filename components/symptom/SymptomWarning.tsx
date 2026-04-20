"use client";

import { AlertTriangle } from "lucide-react";

interface SymptomWarningProps {
  children: React.ReactNode;
}

/**
 * Styled amber warning/explanation block.
 * Used for the "==" descriptive lines in the symptom tree.
 */
export function SymptomWarning({ children }: SymptomWarningProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
