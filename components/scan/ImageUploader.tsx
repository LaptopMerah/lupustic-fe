"use client";

import { useRef, useCallback, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Drop zone / Preview */}
      {previewUrl && selectedFile ? (
        <div className="relative w-full max-w-md">
          <div className="overflow-hidden rounded-lg border border-border shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected skin image for analysis"
              className="h-64 w-full object-cover"
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
      ) : (
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
            "flex w-full max-w-md cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors duration-200",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
          aria-label="Drop an image here or click to browse"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
            {isDragOver ? (
              <ImageIcon className="h-7 w-7 text-primary" />
            ) : (
              <Upload className="h-7 w-7 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drag & drop your skin photo here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse — JPEG, PNG, WebP up to {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>
      )}

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

      {/* Analyze button */}
      {selectedFile && (
        <Button
          size="lg"
          className="rounded-lg"
          onClick={onAnalyze}
          disabled={isLoading}
          aria-label="Analyze uploaded image for lupus indicators"
        >
          Analyze Image
        </Button>
      )}
    </div>
  );
}
