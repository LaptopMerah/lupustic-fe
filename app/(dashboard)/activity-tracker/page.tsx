"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SledaiGrid } from "@/components/sledai/SledaiGrid";
import { useSledai } from "@/hooks/useSledai";

export default function ActivityTrackerPage() {
  const { records, isLoading, error, removeRecord } = useSledai();

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Activity Tracker</h1>
            <p className="text-xs text-muted-foreground">SLEDAI-2K disease activity records</p>
          </div>
          <Button asChild size="sm" className="gap-2">
            <Link href="/activity-tracker/create">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Assessment</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <SledaiGrid records={records} isLoading={isLoading} onDelete={removeRecord} />
      </div>
    </>
  );
}
