import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence)}%`;
}

export function getRiskLevel(confidence: number): RiskLevel {
  if (confidence >= 70) return "HIGH";
  if (confidence >= 40) return "MODERATE";
  return "LOW";
}
