/**
 * Breast Cancer Recurrence Risk — O'Rourke et al. 1994 local-recurrence index
 * after simple mastectomy (educational lookup).
 */

export type TumorGrade = 'I' | 'II' | 'III';
export type LymphNodeStatus = 'negative' | 'positive';
export type LviStatus = 'none' | 'present';

export interface BreastCancerRecurrenceInput {
  grade: TumorGrade | null;
  lymphNodes: LymphNodeStatus | null;
  lvi: LviStatus | null;
}

export interface BreastCancerRecurrenceResult {
  score: number;
  /** Local recurrence risk percent from the published score table. */
  riskPercent: number;
  formattedScore: string;
  formattedRiskPercent: string;
  riskSentence: string;
  cohortNote: string;
}

export type BreastCancerRecurrenceFieldErrors = {
  grade?: string;
  lymphNodes?: string;
  lvi?: string;
  form?: string;
};

export const GRADE_OPTIONS: readonly { id: TumorGrade; label: string }[] = [
  { id: 'I', label: 'I' },
  { id: 'II', label: 'II' },
  { id: 'III', label: 'III' },
] as const;

export const LYMPH_NODE_OPTIONS: readonly {
  id: LymphNodeStatus;
  label: string;
}[] = [
  { id: 'negative', label: 'Negative' },
  { id: 'positive', label: 'Positive' },
] as const;

export const LVI_OPTIONS: readonly { id: LviStatus; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'present', label: 'Present' },
] as const;

/** Screenshot: all radios unselected; score and sentence blank. */
export function createDefaultInput(): BreastCancerRecurrenceInput {
  return {
    grade: null,
    lymphNodes: null,
    lvi: null,
  };
}

export function createEmptyInput(): BreastCancerRecurrenceInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: BreastCancerRecurrenceInput,
  b: BreastCancerRecurrenceInput
): boolean {
  return (
    a.grade === b.grade &&
    a.lymphNodes === b.lymphNodes &&
    a.lvi === b.lvi
  );
}
