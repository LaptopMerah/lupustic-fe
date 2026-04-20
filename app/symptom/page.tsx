"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScanContext } from "@/lib/ScanContext";
import { SymptomChecker } from "@/components/symptom/SymptomChecker";

export default function SymptomPage() {
  const router = useRouter();
  const { imageFile } = useScanContext();

  // Redirect to /scan if no image was uploaded
  useEffect(() => {
    if (!imageFile) {
      router.replace("/scan");
    }
  }, [imageFile, router]);

  // Don't render until we confirm image exists
  if (!imageFile) return null;

  return <SymptomChecker />;
}
