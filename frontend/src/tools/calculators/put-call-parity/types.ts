import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which parity field is solved when exactly three values are entered. */
export type PutCallParitySolveTarget =
  | 'call'
  | 'put'
  | 'pvStrike'
  | 'spot';

export type PvTimeUnit = 'years' | 'months';

export interface PutCallParityInput {
  callPrice: string;
  callCurrency: SupportedCurrency;
  putPrice: string;
  putCurrency: SupportedCurrency;
  pvStrike: string;
  pvStrikeCurrency: SupportedCurrency;
  spotPrice: string;
  spotCurrency: SupportedCurrency;
  /** Expandable PV(K) helper */
  pvHelperOpen: boolean;
  helperStrike: string;
  helperStrikeCurrency: SupportedCurrency;
  helperRatePercent: string;
  helperTime: string;
  helperTimeUnit: PvTimeUnit;
}

export interface PutCallParityResult {
  solveTarget: PutCallParitySolveTarget;
  /** Canonical amounts in spot currency after FX. */
  callCanonical: number;
  putCanonical: number;
  pvStrikeCanonical: number;
  spotCanonical: number;
  /** Display amount for the solved field in its own currency. */
  solvedAmount: number;
  solvedCurrency: SupportedCurrency;
  formattedSolved: string;
  formattedCall: string;
  formattedPut: string;
  formattedPvStrike: string;
  formattedSpot: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  parityCheck: string;
}

export type PutCallParityFieldErrors = {
  form?: string;
  callPrice?: string;
  putPrice?: string;
  pvStrike?: string;
  spotPrice?: string;
  helperStrike?: string;
  helperRatePercent?: string;
  helperTime?: string;
};

export function createDefaultInput(): PutCallParityInput {
  return {
    callPrice: '',
    callCurrency: 'PKR',
    putPrice: '',
    putCurrency: 'PKR',
    pvStrike: '',
    pvStrikeCurrency: 'PKR',
    spotPrice: '',
    spotCurrency: 'PKR',
    pvHelperOpen: false,
    helperStrike: '',
    helperStrikeCurrency: 'PKR',
    helperRatePercent: '',
    helperTime: '',
    helperTimeUnit: 'years',
  };
}

export function createEmptyInput(): PutCallParityInput {
  return createDefaultInput();
}

/** Worked example: C=10, PV(K)=95, S=100 → P = C+PV(K)−S = 5. */
export function createExampleInput(): PutCallParityInput {
  return {
    callPrice: '10',
    callCurrency: 'PKR',
    putPrice: '',
    putCurrency: 'PKR',
    pvStrike: '95',
    pvStrikeCurrency: 'PKR',
    spotPrice: '100',
    spotCurrency: 'PKR',
    pvHelperOpen: false,
    helperStrike: '100',
    helperStrikeCurrency: 'PKR',
    helperRatePercent: '5',
    helperTime: '1',
    helperTimeUnit: 'years',
  };
}
