"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSledaiActivityLevel,
  SLEDAI_ACTIVITY_LABELS,
  SLEDAI_CRITERIA,
} from "@/lib/sledai";
import type { SledaiRecord } from "@/types";

interface Props {
  record: SledaiRecord;
  onDelete: (id: string) => void;
}

const LEVEL_STYLES = {
  none: "bg-green-500/10 text-green-700 border-green-200",
  mild: "bg-amber-500/10 text-amber-700 border-amber-200",
  moderate: "bg-orange-500/10 text-orange-700 border-orange-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
  "very-high": "bg-red-700/10 text-red-800 border-red-300",
} as const;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function SledaiCard({ record, onDelete }: Props) {
  const level = getSledaiActivityLevel(record.score);
  const label = SLEDAI_ACTIVITY_LABELS[level];

  const positiveCount = SLEDAI_CRITERIA.filter(
    (c) => record.answers[c.id]
  ).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            SLEDAI-2K Score
          </p>
          <p className="font-mono text-4xl font-semibold text-foreground">
            {record.score}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium",
              LEVEL_STYLES[level]
            )}
          >
            {label}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete record"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(record.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{positiveCount} of {SLEDAI_CRITERIA.length} criteria positive</span>
        <span className="font-mono">{formatDate(record.created_at)}</span>
      </div>

      {record.notes && (
        <p className="text-xs text-muted-foreground border-t border-border pt-3 leading-relaxed">
          {record.notes}
        </p>
      )}
    </div>
  );
}
