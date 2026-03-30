"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface ScanContextValue {
  /** The uploaded image file, available after scan page */
  imageFile: File | null;
  /** Object URL for preview */
  previewUrl: string | null;
  /** Store a file (called from scan page) */
  setImage: (file: File) => void;
  /** Clear the stored file (called after /first-chat succeeds) */
  clearImage: () => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setImage = useCallback((file: File) => {
    // Revoke previous URL if any
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setImageFile(file);
  }, []);

  const clearImage = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImageFile(null);
  }, []);

  return (
    <ScanContext.Provider value={{ imageFile, previewUrl, setImage, clearImage }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext(): ScanContextValue {
  const ctx = useContext(ScanContext);
  if (!ctx) {
    throw new Error("useScanContext must be used within a ScanProvider");
  }
  return ctx;
}
