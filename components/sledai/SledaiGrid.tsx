"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SledaiCard } from "@/components/sledai/SledaiCard";
import { SledaiEmptyState } from "@/components/sledai/SledaiEmptyState";
import type { SledaiRecord } from "@/types";

interface Props {
  records: SledaiRecord[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function SledaiGrid({ records, isLoading, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return <SledaiEmptyState />;
  }

  const sorted = [...records].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((record) => (
        <SledaiCard key={record.id} record={record} onDelete={onDelete} />
      ))}
    </div>
  );
}
