"use client";

import { useState, useCallback } from "react";
import type { ScanResponse, AsyncState } from "@/types";

// TODO: Replace mock with real API call when backend is ready
// import { analyzeImage } from "@/lib/api/scan";
async function mockAnalyze(): Promise<ScanResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { result: "lupus", confidence: 87 };
}

interface UseScanReturn {
  state: AsyncState<ScanResponse>;
  selectedFile: File | null;
  previewUrl: string | null;
  selectFile: (file: File) => void;
  clearFile: () => void;
  scan: () => Promise<void>;
  reset: () => void;
}

export function useScan(): UseScanReturn {
  const [state, setState] = useState<AsyncState<ScanResponse>>({
    status: "idle",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectFile = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const clearFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  const scan = useCallback(async () => {
    if (!selectedFile) return;

    setState({ status: "loading" });

    try {
      const data = await mockAnalyze();
      setState({ status: "success", data });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to analyze image. Please try again.";
      setState({ status: "error", message });
    }
  }, [selectedFile]);

  const reset = useCallback(() => {
    clearFile();
    setState({ status: "idle" });
  }, [clearFile]);

  return {
    state,
    selectedFile,
    previewUrl,
    selectFile,
    clearFile,
    scan,
    reset,
  };
}
