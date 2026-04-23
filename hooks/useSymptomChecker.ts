"use client";

import { useState, useCallback, useMemo } from "react";
import type { ClinicalDomainsPayload, ClinicalDomainEntry } from "@/types";

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
  payload: ClinicalDomainsPayload;
  errors: SymptomErrors;
  validate: () => boolean;
  saveToSession: () => void;
}

const NULL_DOMAIN: ClinicalDomainEntry = { point: 0, value: null };

export function useSymptomChecker(): UseSymptomCheckerReturn {
  const [state, setState] = useState<SymptomState>(INITIAL_STATE);
  const [errors, setErrors] = useState<SymptomErrors>({ fever: null, jointInvolvement: null });

  const toggle = useCallback((key: keyof SymptomState) => {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };

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

  const payload = useMemo<ClinicalDomainsPayload>(() => {
    // Constitutional: fever (2 pts) when fever is checked with unknown cause
    let constitutional: ClinicalDomainEntry = NULL_DOMAIN;
    if (state.fever) {
      if (state.feverUnknownCause && state.feverRecurring) {
        constitutional = { point: 2, value: "fever" };
      }
      else if (state.feverUnknownCause && state.feverFatigue) {
        constitutional = { point: 2, value: "fever" };
      }
    }

    // Mucocutaneous: oral ulcers (2 pts) or non-scarring alopecia (2 pts)
    let mucocutaneous: ClinicalDomainEntry = NULL_DOMAIN;
    if (state.oralUlcers && state.nonScarringAlopecia) {
      mucocutaneous = { point: 2, value: "oralUlcers & nonScarringAlopecia" };
    } else if (state.oralUlcers) {
      mucocutaneous = { point: 2, value: "oralUlcers" };
    } else if (state.nonScarringAlopecia) {
      mucocutaneous = { point: 2, value: "nonScarringAlopecia" };
    }

    // Musculoskeletal: jointInvolvement ≥2 joints (6 pts)
    let musculoskeletal: ClinicalDomainEntry = NULL_DOMAIN;
    if (state.jointInvolvement) {
      if (state.jointInvolvementMultiple && state.jointInvolvementSwollen) {
        musculoskeletal = { point: 6, value: "jointInvolvement" };
      }
      else if (state.jointInvolvementMultiple && state.jointInvolvementStiffMorning) {
        musculoskeletal = { point: 6, value: "jointInvolvement" };
      }
    }
    
    // Neuropsychiatric: seizure (5 pts)
    const neuropsychiatric: ClinicalDomainEntry =
      state.seizures ? { point: 5, value: "seizures" } : NULL_DOMAIN;

    return { constitutional, mucocutaneous, musculoskeletal, neuropsychiatric };
  }, [state]);

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
