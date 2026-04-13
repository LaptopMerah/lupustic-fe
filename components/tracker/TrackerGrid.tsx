"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackerCard } from "./TrackerCard";
import { TrackerEmptyState } from "./TrackerEmptyState";
import type { TrackerEntry } from "@/types";

interface TrackerGridProps {
  entries: TrackerEntry[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onAddEntry: () => void;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function TrackerGrid({
  entries,
  isLoading,
  onDelete,
  onAddEntry,
}: TrackerGridProps) {
  // Sort entries by datetime descending (newest first)
  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      ),
    [entries]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (sortedEntries.length === 0) {
    return <TrackerEmptyState onAddEntry={onAddEntry} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {sortedEntries.map((entry, i) => (
        <div
          key={entry.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both"
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <TrackerCard entry={entry} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
