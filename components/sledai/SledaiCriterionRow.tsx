"use client";

import { cn } from "@/lib/utils";
import type { SledaiCriterion } from "@/types";

interface Props {
  criterion: SledaiCriterion;
  checked: boolean;
  onChange: (id: string, value: boolean) => void;
}

export function SledaiCriterionRow({ criterion, checked, onChange }: Props) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{criterion.label}</p>
        {criterion.description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {criterion.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        <button
          type="button"
          aria-label={`Mark ${criterion.label} as No`}
          onClick={() => onChange(criterion.id, false)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            !checked
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
          )}
        >
          No &nbsp;0
        </button>
        <button
          type="button"
          aria-label={`Mark ${criterion.label} as Yes`}
          onClick={() => onChange(criterion.id, true)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            checked
              ? "bg-violet-600 text-white"
              : "bg-secondary text-muted-foreground hover:bg-violet-500/10 hover:text-violet-600"
          )}
        >
          Yes &nbsp;+{criterion.weight}
        </button>
      </div>
    </div>
  );
}
