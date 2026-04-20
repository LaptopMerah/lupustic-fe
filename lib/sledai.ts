import type { SledaiCriterion, SledaiAnswers, SledaiActivityLevel } from "@/types";

export const SLEDAI_CRITERIA: SledaiCriterion[] = [
  // Neuropsychiatric — weight 8
  {
    id: "seizure",
    label: "Recent onset seizure",
    description: "Exclude metabolic, infectious, or drug causes",
    weight: 8,
    category: "neuropsychiatric",
  },
  {
    id: "psychosis",
    label: "Psychosis",
    description:
      "Altered ability to function in normal activity due to severe disturbance in the perception of reality (hallucinations, incoherence, marked loose associations, impoverished thought content, marked illogical thinking, bizarre/disorganized/catatonic behavior); exclude uremia and drug causes",
    weight: 8,
    category: "neuropsychiatric",
  },
  {
    id: "organic_brain",
    label: "Organic brain syndrome",
    description:
      "Altered mental function with impaired orientation, memory, or other intellectual function (with rapid onset and fluctuating clinical features), inability to sustain attention to environment, and ≥2 of the following: perceptual disturbance, incoherent speech, insomnia or daytime drowsiness, and increased or decreased psychomotor activity; exclude metabolic, infectious, or drug causes",
    weight: 8,
    category: "neuropsychiatric",
  },
  {
    id: "visual_disturbance",
    label: "Visual disturbance",
    description:
      "Retinal changes of SLE (include cytoid bodies, retinal hemorrhages, serous exudates or hemorrhages in choroid, and optic neuritis); exclude hypertensive, infectious, or drug causes",
    weight: 8,
    category: "neuropsychiatric",
  },
  {
    id: "cranial_neuropathy",
    label: "New onset sensory or motor neuropathy involving cranial nerves",
    description: "",
    weight: 8,
    category: "neuropsychiatric",
  },
  {
    id: "lupus_headache",
    label: "Lupus headache",
    description:
      "Severe, persistent headache (may be migrainous but must be nonresponsive to narcotic analgesia)",
    weight: 8,
    category: "neuropsychiatric",
  },
  {
    id: "stroke",
    label: "New onset stroke",
    description: "Exclude arteriosclerosis",
    weight: 8,
    category: "neuropsychiatric",
  },
  {
    id: "vasculitis",
    label: "Vasculitis",
    description:
      "Ulceration, gangrene, tender finger nodules, periungual infarction, splinter hemorrhages or biopsy, and angiogram proof of vasculitis",
    weight: 8,
    category: "neuropsychiatric",
  },
  // Musculoskeletal — weight 4
  {
    id: "arthritis",
    label: "Arthritis",
    description:
      "≥2 joints with pain and signs of inflammation (i.e., tenderness, swelling, or effusion)",
    weight: 4,
    category: "musculoskeletal",
  },
  {
    id: "myositis",
    label: "Myositis",
    description:
      "Proximal muscle aching/weakness associated with elevated CPK/aldolase, EMG changes, or a biopsy showing myositis",
    weight: 4,
    category: "musculoskeletal",
  },
  // Renal — weight 4
  {
    id: "urinary_casts",
    label: "Heme-granular or RBC urinary casts",
    description: "",
    weight: 4,
    category: "renal",
  },
  {
    id: "hematuria",
    label: "Hematuria",
    description: ">5 RBC/high-power field; exclude stone, infection, or other cause",
    weight: 4,
    category: "renal",
  },
  {
    id: "proteinuria",
    label: "Proteinuria",
    description: ">0.5 g/24 hours",
    weight: 4,
    category: "renal",
  },
  {
    id: "pyuria",
    label: "Pyuria",
    description: ">5 WBC/high-power field; exclude infection",
    weight: 4,
    category: "renal",
  },
  // Skin — weight 2
  {
    id: "rash",
    label: "Inflammatory-type rash",
    description: "",
    weight: 2,
    category: "skin",
  },
  {
    id: "alopecia",
    label: "Alopecia",
    description: "",
    weight: 2,
    category: "skin",
  },
  {
    id: "mucosal_ulcers",
    label: "Oral or nasal mucosal ulcers",
    description: "",
    weight: 2,
    category: "skin",
  },
  // Serosal — weight 2
  {
    id: "pleuritis",
    label: "Pleuritic chest pain with pleural rub/effusion or pleural thickening",
    description: "",
    weight: 2,
    category: "serosal",
  },
  {
    id: "pericarditis",
    label: "Pericarditis",
    description:
      "Pericardial pain with ≥1 of the following: rub, effusion, or EKG/echocardiogram confirmation",
    weight: 2,
    category: "serosal",
  },
  // Immunologic — weight 2
  {
    id: "low_complement",
    label: "Low complement",
    description: "CH50, C3, or C4 decreased below lower limit of normal for lab",
    weight: 2,
    category: "immunologic",
  },
  {
    id: "high_dna_binding",
    label: "High DNA binding",
    description: "Increased above normal range for lab",
    weight: 2,
    category: "immunologic",
  },
  // Constitutional — weight 1
  {
    id: "fever",
    label: "Temp >100.4°F (38°C)",
    description: "Exclude infectious causes",
    weight: 1,
    category: "constitutional",
  },
  {
    id: "low_platelets",
    label: "Platelets <100 × 10\u2079/L",
    description: "Exclude drug causes",
    weight: 1,
    category: "constitutional",
  },
  {
    id: "low_wbc",
    label: "WBC <3 × 10\u2079/L",
    description: "Exclude drug causes",
    weight: 1,
    category: "constitutional",
  },
];

export const SLEDAI_CATEGORY_LABELS: Record<string, string> = {
  neuropsychiatric: "Neuropsychiatric",
  musculoskeletal: "Musculoskeletal",
  renal: "Renal",
  skin: "Skin",
  serosal: "Serosal",
  immunologic: "Immunologic",
  constitutional: "Constitutional",
};

export function computeSledaiScore(answers: SledaiAnswers): number {
  return SLEDAI_CRITERIA.reduce((total, criterion) => {
    return answers[criterion.id] ? total + criterion.weight : total;
  }, 0);
}

export function getSledaiActivityLevel(score: number): SledaiActivityLevel {
  if (score === 0) return "none";
  if (score <= 5) return "mild";
  if (score <= 10) return "moderate";
  if (score <= 19) return "high";
  return "very-high";
}

export const SLEDAI_ACTIVITY_LABELS: Record<SledaiActivityLevel, string> = {
  "none": "No Activity",
  "mild": "Mild Activity",
  "moderate": "Moderate Activity",
  "high": "High Activity",
  "very-high": "Very High Activity",
};
