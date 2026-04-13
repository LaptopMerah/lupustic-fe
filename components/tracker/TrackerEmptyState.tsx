"use client";

import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackerEmptyStateProps {
  onAddEntry: () => void;
}

export function TrackerEmptyState({ onAddEntry }: TrackerEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-secondary">
        <ClipboardList className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">
        No entries yet
      </h3>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        Start tracking your skin symptoms to monitor changes over time.
        Consistent tracking helps you and your doctor spot patterns early.
      </p>

      <Button onClick={onAddEntry} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Your First Entry
      </Button>
    </div>
  );
}
