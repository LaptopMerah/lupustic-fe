"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrackerEntry, CreateTrackerPayload, UpdateTrackerPayload } from "@/types";
import {
  getTrackerEntries,
  createTrackerEntry,
  updateTrackerEntry,
  deleteTrackerEntry,
} from "@/lib/api/tracker";

interface UseTrackerReturn {
  entries: TrackerEntry[];
  isLoading: boolean;
  error: string | null;
  addEntry: (payload: CreateTrackerPayload) => Promise<void>;
  editEntry: (id: string, payload: UpdateTrackerPayload) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useTracker(): UseTrackerReturn {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTrackerEntries();
      setEntries(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load tracker entries";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = useCallback(async (payload: CreateTrackerPayload) => {
    const newEntry = await createTrackerEntry(payload);
    // Optimistically prepend
    setEntries((prev) => [newEntry, ...prev]);
  }, []);

  const editEntry = useCallback(
    async (id: string, payload: UpdateTrackerPayload) => {
      const updatedEntry = await updateTrackerEntry(id, payload);
      // Optimistically replace the entry
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? updatedEntry : e))
      );
    },
    []
  );

  const removeEntry = useCallback(async (id: string) => {
    await deleteTrackerEntry(id);
    // Optimistically remove
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return {
    entries,
    isLoading,
    error,
    addEntry,
    editEntry,
    removeEntry,
    refetch: fetchEntries,
  };
}
