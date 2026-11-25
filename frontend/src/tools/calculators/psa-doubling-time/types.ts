export type DoublingTimeUnit = 'days' | 'months' | 'years';

export interface PsaDoublingTimeInput {
  olderDate: string;
  olderPsa: string;
  newerDate: string;
  newerPsa: string;
  doublingTimeUnit: DoublingTimeUnit;
  showSlopeAndVelocity: boolean;
}

export interface PsaDoublingTimeResult {
  formattedDoublingTime: string | null;
  formattedPsaVelocity: string | null;
  formattedLogSlope: string | null;
  trend: 'rising' | 'falling' | 'unchanged';
  elapsedDays: number;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type PsaDoublingTimeFieldErrors = {
  form?: string;
  olderDate?: string;
  olderPsa?: string;
  newerDate?: string;
  newerPsa?: string;
};

export function createEmptyInput(): PsaDoublingTimeInput {
  return {
    olderDate: '',
    olderPsa: '',
    newerDate: '',
    newerPsa: '',
    doublingTimeUnit: 'months',
    showSlopeAndVelocity: false,
  };
}

/** Fixture: PSA 2 → 4 over 90 days → DT 90 days. */
export function createExampleInput(): PsaDoublingTimeInput {
  return {
    olderDate: '2024-01-01',
    olderPsa: '2',
    newerDate: '2024-03-31',
    newerPsa: '4',
    doublingTimeUnit: 'days',
    showSlopeAndVelocity: false,
  };
}

export function inputsEqual(
  a: PsaDoublingTimeInput,
  b: PsaDoublingTimeInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const DOUBLING_TIME_UNIT_LABELS: Record<DoublingTimeUnit, string> = {
  days: 'days',
  months: 'mos',
  years: 'yrs',
};