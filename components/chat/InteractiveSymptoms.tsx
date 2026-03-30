"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { SymptomsPayload } from "@/types";

const SYMPTOMS: {
  id: keyof SymptomsPayload;
  label: string;
}[] = [
  { id: "hair_loss", label: "Hair loss" },
  { id: "fever_of_unknown_origin", label: "Fever with no apparent cause" },
  { id: "seizures", label: "Seizures" },
  { id: "mouth_sores", label: "Mouth sores" },
  { id: "joint_pain", label: "Joint pain in 2 or more areas" },
  { id: "butterfly_rash", label: "Butterfly rash (on the cheeks and nose)" },
];

interface InteractiveSymptomsProps {
  onSubmit: (symptoms: SymptomsPayload) => void;
  disabled?: boolean;
}

export function InteractiveSymptoms({
  onSubmit,
  disabled,
}: InteractiveSymptomsProps) {
  const [selected, setSelected] = useState<Set<keyof SymptomsPayload>>(
    new Set()
  );
  const [submitted, setSubmitted] = useState(false);

  const toggleSymptom = (id: keyof SymptomsPayload) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const payload: SymptomsPayload = {
      hair_loss: selected.has("hair_loss"),
      fever_of_unknown_origin: selected.has("fever_of_unknown_origin"),
      seizures: selected.has("seizures"),
      mouth_sores: selected.has("mouth_sores"),
      joint_pain: selected.has("joint_pain"),
      butterfly_rash: selected.has("butterfly_rash"),
    };
    onSubmit(payload);
  };

  const isDisabled = disabled || submitted;

  return (
    <div className="flex w-full px-4 py-1.5 justify-start">
      <div className="max-w-[80%] rounded-lg border border-border bg-white text-foreground overflow-hidden md:max-w-[70%]">
        <div className="px-4 py-3">
          <p className="mb-3 text-sm font-medium text-foreground">
            Before we begin, please select any symptoms you have experienced:
          </p>
          <div className="space-y-2.5">
            {SYMPTOMS.map((symptom) => (
              <div key={symptom.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`symptom-${symptom.id}`}
                  checked={selected.has(symptom.id)}
                  onCheckedChange={() => toggleSymptom(symptom.id)}
                  disabled={isDisabled}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={`symptom-${symptom.id}`}
                  className="text-sm leading-none cursor-pointer"
                >
                  {symptom.label}
                </Label>
              </div>
            ))}
          </div>
          {!submitted && (
            <Button
              onClick={handleSubmit}
              disabled={disabled}
              className="mt-4 w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
              size="sm"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit & Start Consultation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
