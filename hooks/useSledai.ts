"use client";

import { useState, useEffect, useCallback } from "react";
import type { SledaiRecord } from "@/types";
import { getSledaiRecords, deleteSledaiRecord } from "@/lib/api/sledai";

interface UseSledaiReturn {
  records: SledaiRecord[];
  isLoading: boolean;
  error: string | null;
  removeRecord: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useSledai(): UseSledaiReturn {
  const [records, setRecords] = useState<SledaiRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSledaiRecords();
      setRecords(data);
    } catch (err) {
      setError("Unable to load activity records. Please try again.");
      console.error("[useSledai]", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const removeRecord = useCallback(async (id: string) => {
    await deleteSledaiRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, isLoading, error, removeRecord, refetch: fetchRecords };
}
