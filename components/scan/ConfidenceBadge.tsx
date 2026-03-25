import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatConfidence, getRiskLevel } from "@/lib/utils";

interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const risk = getRiskLevel(confidence);

  const colorClasses = {
    HIGH: "bg-accent text-accent-foreground",
    MODERATE: "bg-amber-500 text-white",
    LOW: "bg-green-500 text-white",
  };

  const labels = {
    HIGH: "HIGH RISK",
    MODERATE: "MODERATE",
    LOW: "LOW RISK",
  };

  return (
    <div className="flex items-center gap-3">
      <Badge
        className={cn(
          "rounded-md px-3 py-1 text-xs font-semibold",
          colorClasses[risk]
        )}
      >
        {labels[risk]}
      </Badge>
      <span className="font-mono text-2xl font-bold text-foreground">
        {formatConfidence(confidence)}
      </span>
    </div>
  );
}
