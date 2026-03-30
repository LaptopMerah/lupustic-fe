"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, SwitchCamera, X, Upload, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  onUploadClick: () => void;
}

type FacingMode = "user" | "environment";
type PermissionPhase = "asking" | "granted" | "denied";

export function CameraCapture({ onCapture, onClose, onUploadClick }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<PermissionPhase>("asking");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [isCapturing, setIsCapturing] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(
    async (facing: FacingMode) => {
      setError(null);
      setIsReady(false);

      stopStream();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;
        setPhase("granted");
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          setPhase("denied");
          setError(
            "Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda."
          );
        } else if (err instanceof DOMException && err.name === "NotFoundError") {
          setPhase("denied");
          setError("Tidak ditemukan kamera pada perangkat ini.");
        } else {
          setError("Gagal mengakses kamera. Silakan coba lagi.");
        }
      }
    },
    [stopStream]
  );

  // Check if permission was already granted on mount
  useEffect(() => {
    let cancelled = false;

    async function checkExistingPermission() {
      try {
        // navigator.permissions.query is supported in most modern browsers
        const result = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });

        if (cancelled) return;

        if (result.state === "granted") {
          // Already granted — skip the asking screen
          setPhase("granted");
          startCamera(facingMode);
        }
        // "prompt" or "denied" — stay on asking screen
      } catch {
        // permissions.query not supported — stay on asking screen
      }
    }

    checkExistingPermission();

    return () => {
      cancelled = true;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── Attachment logic ─────
  // Effect to handle video element when phase is granted and stream is ready
  useEffect(() => {
    if (phase === "granted" && streamRef.current && videoRef.current && !isReady) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video
        .play()
        .then(() => {
          setIsReady(true);
        })
        .catch((err) => {
          console.error("Error playing video:", err);
          // If it fails to play, don't show the error immediately,
          // as it might be a temporary state during mount.
          // However, if it's persistent, we might want to show it.
        });
    }
  }, [phase, isReady]);

  const handleAllowCamera = useCallback(() => {
    startCamera(facingMode);
  }, [facingMode, startCamera]);

  const handleSwitchCamera = useCallback(() => {
    const next: FacingMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }, [facingMode, startCamera]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    setIsCapturing(true);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const file = new File([blob], `capture-${timestamp}.jpg`, {
            type: "image/jpeg",
          });
          stopStream();
          onCapture(file);
        }
        setIsCapturing(false);
      },
      "image/jpeg",
      0.92
    );
  }, [onCapture, stopStream]);

  const handleClose = useCallback(() => {
    stopStream();
    onClose();
  }, [stopStream, onClose]);

  // ───── Permission asking screen ─────
  if (phase === "asking" || phase === "denied") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Close camera"
          style={{ top: "max(1rem, env(safe-area-inset-top))" }}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex max-w-sm flex-col items-center gap-6 text-center">
          {/* Icon */}
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full",
              phase === "denied" ? "bg-destructive/20" : "bg-primary/20"
            )}
          >
            {phase === "denied" ? (
              <Camera className="h-10 w-10 text-destructive" />
            ) : (
              <ShieldCheck className="h-10 w-10 text-primary" />
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-white">
              {phase === "denied"
                ? "Akses Kamera Ditolak"
                : "Izin Akses Kamera"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              {phase === "denied"
                ? error ??
                  "Akses kamera ditolak. Silakan ubah izin kamera di pengaturan browser Anda, lalu coba lagi."
                : "Lupustic membutuhkan akses kamera untuk mengambil foto area kulit yang terdampak. Foto hanya digunakan untuk analisis dan tidak disimpan."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-3">
            {phase === "denied" ? (
              <>
                <Button
                  size="lg"
                  onClick={handleAllowCamera}
                  className="w-full rounded-xl"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Coba Lagi
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    onUploadClick();
                  }}
                  className="w-full rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload dari Galeri
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={handleAllowCamera}
                  className="w-full rounded-xl"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Izinkan Kamera
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleClose}
                  className="w-full rounded-xl text-white/50 hover:text-white hover:bg-white/10"
                >
                  Nanti Saja
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ───── Camera viewfinder (granted) ─────
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Camera viewfinder — fills all available space */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            isReady ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Loading state */}
        {!isReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <p className="text-sm text-white/70">Memulai kamera…</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/20">
              <Camera className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-sm text-white/80">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => startCamera(facingMode)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Viewfinder overlay corners */}
        {isReady && (
          <div className="pointer-events-none absolute inset-8 sm:inset-16">
            <div className="absolute left-0 top-0 h-10 w-10 border-l-[3px] border-t-[3px] border-white/70 rounded-tl-lg" />
            <div className="absolute right-0 top-0 h-10 w-10 border-r-[3px] border-t-[3px] border-white/70 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 h-10 w-10 border-b-[3px] border-l-[3px] border-white/70 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 h-10 w-10 border-b-[3px] border-r-[3px] border-white/70 rounded-br-lg" />
          </div>
        )}

        {/* Flash overlay for capture feedback */}
        {isCapturing && (
          <div className="absolute inset-0 animate-pulse bg-white/40" />
        )}

        {/* Close button (top-left) */}
        <button
          onClick={handleClose}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Close camera"
          style={{ top: "max(1rem, env(safe-area-inset-top))" }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Controls bar — pinned to bottom */}
      <div
        className="flex items-center justify-between bg-black/90 px-6 py-6 backdrop-blur-sm"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        {/* Upload from gallery button */}
        <button
          onClick={() => {
            stopStream();
            onUploadClick();
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Upload from gallery"
        >
          <Upload className="h-5 w-5" />
        </button>

        {/* Capture button */}
        <button
          onClick={handleCapture}
          disabled={!isReady || isCapturing}
          className="group flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-white transition-all active:scale-95 disabled:opacity-30"
          aria-label="Take photo"
        >
          <div className="h-[58px] w-[58px] rounded-full bg-white transition-all group-hover:bg-white/80 group-active:bg-primary" />
        </button>

        {/* Switch camera */}
        <button
          onClick={handleSwitchCamera}
          disabled={!isReady}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          aria-label="Switch camera"
        >
          <SwitchCamera className="h-5 w-5" />
        </button>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
