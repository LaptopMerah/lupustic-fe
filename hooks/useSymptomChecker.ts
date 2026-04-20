"use client";

import { useState, useCallback, useMemo } from "react";
import type { SymptomsPayload } from "@/types";

/** State shape for each main symptom and its sub-questions */
export interface SymptomState {
  fever: boolean;
  feverUnknownCause: boolean;
  feverRecurring: boolean;
  feverFatigue: boolean;

  oralUlcers: boolean;

  nonScarringAlopecia: boolean;

  seizures: boolean;

  jointInvolvement: boolean;
  jointInvolvementMultiple: boolean;
  jointInvolvementStiffMorning: boolean;
  jointInvolvementSwollen: boolean;
}

const INITIAL_STATE: SymptomState = {
  fever: false,
  feverUnknownCause: false,
  feverRecurring: false,
  feverFatigue: false,

  oralUlcers: false,

  nonScarringAlopecia: false,

  seizures: false,

  jointInvolvement: false,
  jointInvolvementMultiple: false,
  jointInvolvementStiffMorning: false,
  jointInvolvementSwollen: false,
};

export interface SymptomErrors {
  fever: string | null;
  jointInvolvement: string | null;
}

interface UseSymptomCheckerReturn {
  state: SymptomState;
  toggle: (key: keyof SymptomState) => void;
  payload: SymptomsPayload;
  errors: SymptomErrors;
  validate: () => boolean;
  saveToSession: () => void;
}

/**
 * Manages all symptom checker state and computes the final SymptomsPayload.
 * The sub-questions refine whether a symptom is truly lupus-related.
 */
export function useSymptomChecker(): UseSymptomCheckerReturn {
  const [state, setState] = useState<SymptomState>(INITIAL_STATE);
  const [errors, setErrors] = useState<SymptomErrors>({ fever: null, jointInvolvement: null });

  const toggle = useCallback((key: keyof SymptomState) => {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };

      // When unchecking a parent, also uncheck its children
      if (key === "fever" && next.fever === false) {
        next.feverUnknownCause = false;
        next.feverRecurring = false;
        next.feverFatigue = false;
      }
      if (key === "jointInvolvement" && next.jointInvolvement === false) {
        next.jointInvolvementMultiple = false;
        next.jointInvolvementStiffMorning = false;
        next.jointInvolvementSwollen = false;
      }
      if (key === "jointInvolvementMultiple" && next.jointInvolvementMultiple === false) {
        next.jointInvolvementStiffMorning = false;
        next.jointInvolvementSwollen = false;
      }

      return next;
    });
  }, []);

  /**
   * Compute the SymptomsPayload from current state.
   * Fever is positive when: fever + unknown cause (exclusions are info-only warnings).
   * Mouth sores / hair loss / seizures: just the main checkbox.
   * Joint pain: joint pain + multiple joints.
   */
  const payload = useMemo<SymptomsPayload>(() => {
    const feverPositive = state.fever && state.feverUnknownCause;
    const oralUlcersPositive = state.oralUlcers;
    const nonScarringAlopeciaPositive = state.nonScarringAlopecia;
    const seizuresPositive = state.seizures;
    const jointInvolvementPositive = state.jointInvolvement && state.jointInvolvementMultiple;

    return {
      hair_loss: nonScarringAlopeciaPositive,
      fever_of_unknown_origin: feverPositive,
      seizures: seizuresPositive,
      mouth_sores: oralUlcersPositive,
      joint_pain: jointInvolvementPositive,
      butterfly_rash: false, // Handled by scan image
    };
  }, [state]);

  /** Validate that checked parents have at least 1 sub-option selected */
  const validate = useCallback((): boolean => {
    const newErrors: SymptomErrors = { fever: null, jointInvolvement: null };
    let valid = true;

    if (state.fever && !state.feverUnknownCause && !state.feverRecurring && !state.feverFatigue) {
      newErrors.fever = "Pilih minimal 1 detail gejala demam";
      valid = false;
    }
    if (state.jointInvolvement && !state.jointInvolvementMultiple && !state.jointInvolvementStiffMorning && !state.jointInvolvementSwollen) {
      newErrors.jointInvolvement = "Pilih minimal 1 detail gejala nyeri sendi";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [state]);

  const saveToSession = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lupustic_symptoms", JSON.stringify(payload));
    }
  }, [payload]);

  return {
    state,
    toggle,
    payload,
    errors,
    validate,
    saveToSession,
  };
}
