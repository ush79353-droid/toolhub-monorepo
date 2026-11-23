/**
 * Padua Prediction Score inputs (Barbar et al., JTH 2010).
 * Each grouped line is one checkbox / one point allotment even if both
 * diagnoses in the label apply.
 */
export interface PaduaInput {
  age70Plus: boolean;
  obesityBmi30: boolean;
  reducedMobility: boolean;
  hormonalTreatment: boolean;
  activeCancer: boolean;
  traumaOrSurgeryMonth: boolean;
  previousVte: boolean;
  thrombophilia: boolean;
  heartOrRespiratoryFailure: boolean;
  acuteMiOrIschemicStroke: boolean;
  acuteInfectionOrRheumatologic: boolean;
}

export interface PaduaBreakdown {
  age70Plus: number;
  obesityBmi30: number;
  reducedMobility: number;
  hormonalTreatment: number;
  activeCancer: number;
  traumaOrSurgeryMonth: number;
  previousVte: number;
  thrombophilia: number;
  heartOrRespiratoryFailure: number;
  acuteMiOrIschemicStroke: number;
  acuteInfectionOrRheumatologic: number;
}

export interface PaduaResult {
  totalScore: number;
  breakdown: PaduaBreakdown;
  formattedScore: string;
  /** Original Padua high-risk band: score ≥ 4. */
  highRiskBand: boolean;
  bandLabel: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type PaduaFieldErrors = {
  form?: string;
};

export function createDefaultInput(): PaduaInput {
  return {
    age70Plus: false,
    obesityBmi30: false,
    reducedMobility: false,
    hormonalTreatment: false,
    activeCancer: false,
    traumaOrSurgeryMonth: false,
    previousVte: false,
    thrombophilia: false,
    heartOrRespiratoryFailure: false,
    acuteMiOrIschemicStroke: false,
    acuteInfectionOrRheumatologic: false,
  };
}

export function createEmptyInput(): PaduaInput {
  return createDefaultInput();
}

/** Educational fixture: age ≥70 alone → 1 (low band). */
export function createExampleInput(): PaduaInput {
  return { ...createDefaultInput(), age70Plus: true };
}

export function inputsEqual(a: PaduaInput, b: PaduaInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const FACTOR_OPTIONS: readonly {
  key: keyof PaduaInput;
  label: string;
  detail?: string;
  points: 1 | 2 | 3;
}[] = [
  { key: 'age70Plus', label: 'Age ≥ 70 years', points: 1 },
  {
    key: 'obesityBmi30',
    label: 'Obesity (BMI ≥ 30)',
    detail: 'BMI = weight / (height²)',
    points: 1,
  },
  { key: 'reducedMobility', label: 'Reduced mobility', points: 3 },
  { key: 'hormonalTreatment', label: 'Ongoing hormonal treatment', points: 1 },
  {
    key: 'activeCancer',
    label: 'Active cancer',
    detail: 'Ongoing malignant process',
    points: 3,
  },
  {
    key: 'traumaOrSurgeryMonth',
    label: 'Trauma / surgery within last month',
    points: 2,
  },
  {
    key: 'previousVte',
    label: 'History of venous thromboembolism',
    detail:
      'e.g. DVT, Budd-Chiari, PE — excludes superficial vein thrombosis',
    points: 3,
  },
  {
    key: 'thrombophilia',
    label: 'Known thrombophilic condition',
    detail:
      'e.g. factor V Leiden, antiphospholipid syndrome, AT/PC/PS deficiency',
    points: 3,
  },
  {
    key: 'heartOrRespiratoryFailure',
    label: 'Heart failure / Respiratory failure',
    points: 1,
  },
  {
    key: 'acuteMiOrIschemicStroke',
    label: 'Myocardial infarction / Ischemic stroke',
    points: 1,
  },
  {
    key: 'acuteInfectionOrRheumatologic',
    label: 'Acute infection / Rheumatologic disease',
    detail: 'e.g. lupus, rheumatoid arthritis, scleroderma',
    points: 1,
  },
];
