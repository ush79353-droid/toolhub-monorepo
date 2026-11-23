/** HAS-BLED educational major-bleeding risk score (Pisters 2010). */

export type YesNo = 'yes' | 'no';

export interface HasBledInput {
  hypertension: YesNo;
  abnormalRenal: YesNo;
  abnormalLiver: YesNo;
  strokeHistory: YesNo;
  bleeding: YesNo;
  labileInr: YesNo;
  ageOver65: YesNo;
  alcohol: YesNo;
  drugs: YesNo;
}

export type RiskBand = 'low' | 'intermediate' | 'high';

export interface HasBledResult {
  score: number;
  formattedScore: string;
  riskBand: RiskBand;
  riskBandLabel: string;
  interpretation: string;
  /** Approximate annual major-bleed incidence % from Pisters OAC rates. */
  bleedingRiskPercent: number | null;
  formattedBleedingRisk: string;
  /** Major bleeds per 100 patient-years (Pisters 2010 OAC column). */
  eventsPer100PatientYears: number | null;
  formattedEventsRate: string;
  rateNote: string;
  patientYearNote: string;
  disclaimer: string;
  sourceLabel: string;
}

export type HasBledFieldErrors = { form?: string };

/** Screenshot defaults: all No → score 0. */
export function createDefaultInput(): HasBledInput {
  return {
    hypertension: 'no',
    abnormalRenal: 'no',
    abnormalLiver: 'no',
    strokeHistory: 'no',
    bleeding: 'no',
    labileInr: 'no',
    ageOver65: 'no',
    alcohol: 'no',
    drugs: 'no',
  };
}

export function createEmptyInput(): HasBledInput {
  return createDefaultInput();
}

export function createExampleInput(): HasBledInput {
  return {
    ...createDefaultInput(),
    hypertension: 'yes',
    ageOver65: 'yes',
    drugs: 'yes',
  };
}

export function inputsEqual(a: HasBledInput, b: HasBledInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const FACTOR_OPTIONS: readonly {
  key: keyof HasBledInput;
  label: string;
  tip: string;
}[] = [
  {
    key: 'hypertension',
    label: 'Hypertension',
    tip: 'Uncontrolled hypertension — systolic BP >160 mmHg (Pisters 2010).',
  },
  {
    key: 'abnormalRenal',
    label: 'Abnormal renal function',
    tip: 'Chronic dialysis, renal transplant, or serum creatinine ≥200 µmol/L (1 point).',
  },
  {
    key: 'abnormalLiver',
    label: 'Abnormal liver function',
    tip: 'Chronic hepatic disease or marked biochemical derangement (1 point, independent of renal).',
  },
  {
    key: 'strokeHistory',
    label: 'Stroke history',
    tip: 'Prior stroke history (1 point).',
  },
  {
    key: 'bleeding',
    label: 'Bleeding',
    tip: 'Prior major bleeding or predisposition such as anemia (1 point).',
  },
  {
    key: 'labileInr',
    label: 'Labile INR',
    tip: 'Unstable/high INRs or time in therapeutic range <60% on warfarin (1 point).',
  },
  {
    key: 'ageOver65',
    label: 'Age > 65 years',
    tip: 'Age strictly greater than 65 years (65 alone does not score; 66+ does).',
  },
  {
    key: 'alcohol',
    label: 'Alcohol use > 8 drinks per week',
    tip: 'Excess alcohol (≥8 drinks/week). Scores independently from drugs (1 point).',
  },
  {
    key: 'drugs',
    label: 'Drugs predisposing to bleeding',
    tip: 'Concomitant antiplatelet agents or NSAIDs (1 point, independent of alcohol).',
  },
];
