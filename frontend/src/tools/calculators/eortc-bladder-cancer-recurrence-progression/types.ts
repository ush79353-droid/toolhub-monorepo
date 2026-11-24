/**
 * EORTC NMIBC recurrence / progression risk tables (Sylvester 2006).
 * WHO 1973 grades G1–G3. All six factors start unanswered.
 */

export type TumorCount = 'single' | 'twoToSeven' | 'eightPlus';
export type TumorDiameter = 'under3cm' | 'ge3cm';
export type PriorRecurrenceRate = 'primary' | 'leOnePerYear' | 'gtOnePerYear';
export type DiseaseStage = 'ta' | 't1';
export type ConcomitantCis = 'no' | 'yes';
export type TumorGrade = 'g1' | 'g2' | 'g3';

export interface EortcBladderInput {
  tumorCount: TumorCount | null;
  tumorDiameter: TumorDiameter | null;
  priorRecurrenceRate: PriorRecurrenceRate | null;
  stage: DiseaseStage | null;
  concomitantCis: ConcomitantCis | null;
  grade: TumorGrade | null;
}

export interface EortcBladderResult {
  recurrencePoints: number;
  progressionPoints: number;
  recurrenceProb1YearPct: number;
  recurrenceProb5YearPct: number;
  progressionProb1YearPct: number;
  progressionProb5YearPct: number;
  formattedRecurrencePoints: string;
  formattedProgressionPoints: string;
  formattedRecurrence1Year: string;
  formattedRecurrence5Year: string;
  formattedProgression1Year: string;
  formattedProgression5Year: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type EortcBladderFieldErrors = {
  form?: string;
  tumorCount?: string;
  tumorDiameter?: string;
  priorRecurrenceRate?: string;
  stage?: string;
  concomitantCis?: string;
  grade?: string;
};

/** Screenshot-first: six radio groups unanswered until the user selects. */
export function createEmptyInput(): EortcBladderInput {
  return {
    tumorCount: null,
    tumorDiameter: null,
    priorRecurrenceRate: null,
    stage: null,
    concomitantCis: null,
    grade: null,
  };
}

export function createDefaultInput(): EortcBladderInput {
  return createEmptyInput();
}

/** Minimum-risk profile (all favorable factors). */
export function createMinProfileInput(): EortcBladderInput {
  return {
    tumorCount: 'single',
    tumorDiameter: 'under3cm',
    priorRecurrenceRate: 'primary',
    stage: 'ta',
    concomitantCis: 'no',
    grade: 'g1',
  };
}

/** Maximum-risk profile (all adverse factors). */
export function createMaxProfileInput(): EortcBladderInput {
  return {
    tumorCount: 'eightPlus',
    tumorDiameter: 'ge3cm',
    priorRecurrenceRate: 'gtOnePerYear',
    stage: 't1',
    concomitantCis: 'yes',
    grade: 'g3',
  };
}

/** Sylvester Table 7 example: 2–7, &lt;3 cm, ≤1/yr, Ta, no CIS, G1. */
export function createExampleInput(): EortcBladderInput {
  return {
    tumorCount: 'twoToSeven',
    tumorDiameter: 'under3cm',
    priorRecurrenceRate: 'leOnePerYear',
    stage: 'ta',
    concomitantCis: 'no',
    grade: 'g1',
  };
}

export function inputsEqual(a: EortcBladderInput, b: EortcBladderInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function isCompleteInput(input: EortcBladderInput): boolean {
  return (
    input.tumorCount != null &&
    input.tumorDiameter != null &&
    input.priorRecurrenceRate != null &&
    input.stage != null &&
    input.concomitantCis != null &&
    input.grade != null
  );
}

export const TUMOR_COUNT_OPTIONS: readonly {
  value: TumorCount;
  label: string;
}[] = [
  { value: 'single', label: 'Single' },
  { value: 'twoToSeven', label: '2-7' },
  { value: 'eightPlus', label: '8+' },
];

export const TUMOR_DIAMETER_OPTIONS: readonly {
  value: TumorDiameter;
  label: string;
}[] = [
  { value: 'under3cm', label: '< 3 cm' },
  { value: 'ge3cm', label: '≥ 3 cm' },
];

export const PRIOR_RECURRENCE_OPTIONS: readonly {
  value: PriorRecurrenceRate;
  label: string;
}[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'leOnePerYear', label: '≤ 1 recurrence / year' },
  { value: 'gtOnePerYear', label: '> 1 recurrence / year' },
];

export const STAGE_OPTIONS: readonly {
  value: DiseaseStage;
  label: string;
}[] = [
  { value: 'ta', label: 'Ta' },
  { value: 't1', label: 'T1' },
];

export const CIS_OPTIONS: readonly {
  value: ConcomitantCis;
  label: string;
}[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

export const GRADE_OPTIONS: readonly {
  value: TumorGrade;
  label: string;
}[] = [
  { value: 'g1', label: 'G1' },
  { value: 'g2', label: 'G2' },
  { value: 'g3', label: 'G3' },
];
