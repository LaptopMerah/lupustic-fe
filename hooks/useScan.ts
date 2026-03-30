"use client";

import { useState, useCallback } from "react";
import { useScanContext } from "@/lib/ScanContext";

interface UseScanReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  selectFile: (file: File) => void;
  clearFile: () => void;
}

/**
 * Simplified scan hook — only handles file selection.
 * No API call here; /first-chat is called from the chat room after symptom selection.
 */
export function useScan(): UseScanReturn {
  const { setImage } = useScanContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectFile = useCallback(
    (file: File) => {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Also store in context for the chat page
      setImage(file);
    },
    [setImage]
  );

  const clearFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  return {
    selectedFile,
    previewUrl,
    selectFile,
    clearFile,
  };
}
