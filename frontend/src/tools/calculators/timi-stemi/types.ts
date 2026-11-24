/**
 * TIMI Risk Score for STEMI — Morrow et al., Circulation 2000.
 * Age band is unset until the user chooses; score stays blank until then.
 */

export type TimiStemiAgeBand = 'under65' | 'age65to74' | 'age75plus';

export type YesNo = 'yes' | 'no';

export interface TimiStemiInput {
  /** null until an age radio is chosen (screenshot / prompt). */
  ageBand: TimiStemiAgeBand | null;
  /** Combined history: diabetes, hypertension, or angina (1 point). */
  diabetesHypertensionOrAngina: boolean;
  heartRateOver100: boolean;
  sbpUnder100: boolean;
  timeToTreatmentOver4h: boolean;
  /** Published cutoff is weight &lt;67 kg; screenshot labels 150 lbs (67 kg). */
  weightUnder67kg: boolean;
  killipClassIiToIv: YesNo;
  anteriorStElevationOrLbbb: YesNo;
}

export interface TimiStemiBreakdown {
  agePoints: number;
  historyPoints: number;
  heartRatePoints: number;
  sbpPoints: number;
  delayPoints: number;
  weightPoints: number;
  killipPoints: number;
  anteriorOrLbbbPoints: number;
}

export interface TimiStemiResult {
  totalScore: number;
  breakdown: TimiStemiBreakdown;
  formattedScore: string;
  /** Observed 30-day mortality % from Morrow InTIME II derivation (score &gt;8 → 35.9). */
  mortality30DayPercent: number;
  formattedMortality: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type TimiStemiFieldErrors = {
  ageBand?: string;
  form?: string;
};

/** Screenshot defaults: age unset; factors unchecked; Killip/anterior No. */
export function createDefaultInput(): TimiStemiInput {
  return {
    ageBand: null,
    diabetesHypertensionOrAngina: false,
    heartRateOver100: false,
    sbpUnder100: false,
    timeToTreatmentOver4h: false,
    weightUnder67kg: false,
    killipClassIiToIv: 'no',
    anteriorStElevationOrLbbb: 'no',
  };
}

export function createEmptyInput(): TimiStemiInput {
  return createDefaultInput();
}

/** Educational fixture: age &lt;65 alone → score 0 · 0.8% 30-day mortality. */
export function createExampleInput(): TimiStemiInput {
  return {
    ...createDefaultInput(),
    ageBand: 'under65',
  };
}

export function inputsEqual(a: TimiStemiInput, b: TimiStemiInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const AGE_OPTIONS: readonly {
  value: TimiStemiAgeBand;
  label: string;
}[] = [
  { value: 'under65', label: '< 65 years old' },
  { value: 'age65to74', label: '65-74 years old' },
  /**
   * Screenshot shows “> 75 years old”; Morrow/TIMI scoring uses age ≥75 (+3).
   * Label uses ≥75 so age 75 is scored correctly.
   */
  { value: 'age75plus', label: '≥ 75 years old' },
];

export const FACTOR_OPTIONS: readonly {
  key: keyof Pick<
    TimiStemiInput,
    | 'diabetesHypertensionOrAngina'
    | 'heartRateOver100'
    | 'sbpUnder100'
    | 'timeToTreatmentOver4h'
    | 'weightUnder67kg'
  >;
  label: string;
}[] = [
  {
    key: 'diabetesHypertensionOrAngina',
    label: 'Presence of diabetes, hypertension or angina pectoris',
  },
  { key: 'heartRateOver100', label: 'Heart rate > 100 bpm' },
  {
    key: 'sbpUnder100',
    label: 'SBP (systolic blood pressure) < 100 mmHg',
  },
  { key: 'timeToTreatmentOver4h', label: 'Time to treatment > 4 hours' },
  {
    key: 'weightUnder67kg',
    label: 'Body weight less than 150 lbs (67 kg)',
  },
];

export const YES_NO_OPTIONS: readonly { value: YesNo; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];
