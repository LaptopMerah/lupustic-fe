"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SymptomCollapsibleProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  checked: boolean;
  onCheckedChange: () => void;
  children: React.ReactNode;
  id: string;
}

/**
 * A collapsible section for a main symptom.
 * The collapsible opens/closes automatically based on the checked state.
 * No separate chevron — checking the checkbox expands the section.
 */
export function SymptomCollapsible({
  icon,
  title,
  subtitle,
  checked,
  onCheckedChange,
  children,
  id,
}: SymptomCollapsibleProps) {
  return (
    <Collapsible open={checked}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border transition-all duration-200",
          checked
            ? "border-primary/40 bg-primary/[0.03] shadow-sm shadow-primary/10"
            : "border-border bg-card hover:border-primary/20"
        )}
      >
        {/* Header — checkbox toggles both check and open/close */}
        <label
          htmlFor={`symptom-main-${id}`}
          className="flex cursor-pointer items-center gap-3 px-4 py-4"
        >
          <Checkbox
            id={`symptom-main-${id}`}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className="shrink-0"
          />
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
              checked
                ? "bg-primary/15 text-primary"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm font-semibold transition-colors",
                checked ? "text-primary" : "text-foreground"
              )}
            >
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </label>

        {/* Expandable content — opens when checked */}
        <CollapsibleContent>
          <div className="border-t border-border/50 px-4 pb-4 pt-3">
            <div className="space-y-3 pl-[52px]">{children}</div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
