/** WHO AUDIT (Alcohol Use Disorders Identification Test) — full 10-item screen. */

export type Sex = 'female' | 'male';

/** Frequency options for Q1 (0–4). */
export type AuditQ1 = 0 | 1 | 2 | 3 | 4;
/** Typical quantity Q2 (0–4). */
export type AuditQ2 = 0 | 1 | 2 | 3 | 4;
/** Frequency options for Q3–Q8 (0–4). */
export type AuditFreq = 0 | 1 | 2 | 3 | 4;
/** Lifetime injury/concern Q9–Q10 scored 0 / 2 / 4. */
export type AuditLifetime = 0 | 2 | 4;

export interface AuditScoreInput {
  sex: Sex;
  q1: AuditQ1;
  q2: AuditQ2;
  q3: AuditFreq;
  q4: AuditFreq;
  q5: AuditFreq;
  q6: AuditFreq;
  q7: AuditFreq;
  q8: AuditFreq;
  q9: AuditLifetime;
  q10: AuditLifetime;
}

export interface AuditScoreResult {
  consumption: number;
  dependence: number;
  harm: number;
  total: number;
  interpretation: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AuditScoreFieldErrors = {
  form?: string;
};

/** Screenshot defaults: Female; Monthly or less; 3–4 drinks; rest Never → total 2. */
export function createDefaultInput(): AuditScoreInput {
  return {
    sex: 'female',
    q1: 1,
    q2: 1,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0,
    q9: 0,
    q10: 0,
  };
}

export function createEmptyInput(): AuditScoreInput {
  return createDefaultInput();
}

export function inputsEqual(a: AuditScoreInput, b: AuditScoreInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const Q1_OPTIONS: readonly { value: AuditQ1; label: string }[] = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Monthly or less' },
  { value: 2, label: '2–4 times a month' },
  { value: 3, label: '2–3 times a week' },
  { value: 4, label: '4 or more times a week' },
];

export const Q2_OPTIONS: readonly { value: AuditQ2; label: string }[] = [
  { value: 0, label: '1–2 drinks' },
  { value: 1, label: '3–4 drinks' },
  { value: 2, label: '5–6 drinks' },
  { value: 3, label: '7–9 drinks' },
  { value: 4, label: '10 or more drinks' },
];

export const FREQ_OPTIONS: readonly { value: AuditFreq; label: string }[] = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Less than monthly' },
  { value: 2, label: 'Monthly' },
  { value: 3, label: 'Weekly' },
  { value: 4, label: 'Daily or almost daily' },
];

export const LIFETIME_OPTIONS: readonly {
  value: AuditLifetime;
  label: string;
}[] = [
  { value: 0, label: 'Never' },
  { value: 2, label: 'Yes, but not in the last year' },
  { value: 4, label: 'Yes, during the last year' },
];
