import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SYMPTOMS = [
  { id: "hair_loss", label: "Hair loss", score: 2 },
  { id: "fever", label: "Fever with no apparent cause", score: 2 },
  { id: "seizures", label: "Seizures", score: 5 },
  { id: "mouth_sores", label: "Mouth sores", score: 2 },
  { id: "joint_pain", label: "Joint pain in 2 or more areas", score: 6 },
  { id: "butterfly_rash", label: "Butterfly rash (on the cheeks and nose)", score: 6 },
];

interface InteractiveSymptomsProps {
  onSend?: (content: string) => Promise<void>;
}

export function InteractiveSymptoms({ onSend }: InteractiveSymptomsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!onSend) return;
    setSubmitted(true);

    const selectedSymptoms = SYMPTOMS.filter(s => selected.has(s.id)).map(s => s.label);
    let message = "I experienced the following symptoms:\n";
    if (selectedSymptoms.length > 0) {
      message += selectedSymptoms.map(s => `- ${s}`).join("\n");
    } else {
      message = "I have not experienced any of those symptoms.";
    }

    onSend(message);
  };

  if (submitted) return null;

  return (
    <div className="mt-3 flex w-full flex-col gap-3 rounded-lg border border-border bg-white p-4 text-foreground shadow-sm">
      <div className="space-y-3">
        {SYMPTOMS.map((symptom) => (
          <div key={symptom.id} className="flex items-start space-x-3">
            <Checkbox
              id={symptom.id}
              checked={selected.has(symptom.id)}
              onCheckedChange={() => toggleSymptom(symptom.id)}
              className="mt-0.5"
            />
            <Label
              htmlFor={symptom.id}
              className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {symptom.label}
            </Label>
          </div>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        className="mt-2 w-full sm:w-auto self-end bg-[#6366F1] hover:bg-[#4F46E5] text-white"
        size="sm"
      >
        Submit Symptoms
      </Button>
    </div>
  );
}
