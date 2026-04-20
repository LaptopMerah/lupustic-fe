"use client";

import { useRef, useCallback, useState } from "react";
import {
  Camera,
  Upload,
  ImageIcon,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/scan/CameraCapture";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type InputMode = "choose" | "camera";

export function ImageUploader({
  selectedFile,
  previewUrl,
  onSelect,
  onClear,
  onAnalyze,
  isLoading,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<InputMode>("choose");

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a JPEG, PNG, or WebP image.");
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        setError(`File size must be under ${MAX_SIZE_MB}MB.`);
        return;
      }

      onSelect(file);
      setMode("choose");
    },
    [onSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleCameraCapture = useCallback(
    (file: File) => {
      validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleUploadFromGallery = useCallback(() => {
    setMode("choose");
    // Small delay so state updates before triggering the file picker
    setTimeout(() => inputRef.current?.click(), 100);
  }, []);

  // ───── Camera mode (fullscreen overlay) ─────
  if (mode === "camera" && !selectedFile) {
    return (
      <>
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setMode("choose")}
          onUploadClick={handleUploadFromGallery}
        />

        {/* Hidden file input (needs to be in DOM even during camera mode) */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload skin image"
        />
      </>
    );
  }

  // ───── Preview mode (image already selected) ─────
  if (previewUrl && selectedFile) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-md">
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected skin image for analysis"
              className="h-72 w-full object-cover"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="truncate text-sm text-muted-foreground">
              {selectedFile.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              aria-label="Remove selected image"
              disabled={isLoading}
            >
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {/* Analyze button */}
        <Button
          size="lg"
          className="rounded-lg"
          onClick={onAnalyze}
          disabled={isLoading}
          aria-label="Analyze uploaded image for lupus indicators"
        >
          Proceed
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  // ───── Choose mode (default — camera + upload options) ─────
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Primary action: open camera */}
      <button
        onClick={() => setMode("camera")}
        className={cn(
          "group flex w-full max-w-md cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200",
          "border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10"
        )}
        aria-label="Open camera to take a photo"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 transition-transform group-hover:scale-110">
          <Camera className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">
            Take a Photo
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open your camera to capture the affected skin area
          </p>
        </div>
      </button>

      {/* Divider */}
      <div className="flex w-full max-w-md items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Secondary action: drag & drop / file browser */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-200",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
        aria-label="Drop an image here or click to browse"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          {isDragOver ? (
            <ImageIcon className="h-6 w-6 text-primary" />
          ) : (
            <Upload className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Upload from Gallery
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag & drop or click to browse — JPEG, PNG, WebP up to{" "}
            {MAX_SIZE_MB}MB
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload skin image"
      />
    </div>
  );
}
