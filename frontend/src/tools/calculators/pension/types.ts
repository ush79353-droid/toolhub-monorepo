import type { SupportedCurrency } from '@/tools/shared/currency';

export interface PensionInput {
  retirementAge: string;
  lumpSum: string;
  investmentReturn: string;
  monthlyPension: string;
  cola: string;
  currency: SupportedCurrency;
}

export interface PensionYearRow {
  yearIndex: number;
  ageEnd: number;
  annualPension: number;
  cumulativePension: number;
  remainingLumpSum: number;
  depletedDuringYear: boolean;
}

export interface PensionResult {
  retirementAge: number;
  lumpSum: number;
  annualReturnPercent: number;
  monthlyPension: number;
  colaPercent: number;
  breakEvenAge: number | null;
  breakEvenLabel: string;
  yearsToDepletion: number | null;
  horizonYears: number;
  yearRows: PensionYearRow[];
  summaryMessage: string;
  assumptionNotes: string[];
  currency: SupportedCurrency;
  formattedLumpSum: string;
  formattedMonthlyPension: string;
  formattedBreakEvenBalance: string | null;
}

export type PensionFieldErrors = {
  form?: string;
  retirementAge?: string;
  lumpSum?: string;
  investmentReturn?: string;
  monthlyPension?: string;
  cola?: string;
};

/** Screenshot defaults: age 65 · $800,000 · 5% · $5,000/mo · COLA 3.5%. */
export function createDefaultInput(): PensionInput {
  return {
    retirementAge: '65',
    lumpSum: '800000',
    investmentReturn: '5',
    monthlyPension: '5000',
    cola: '3.5',
    currency: 'USD',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'USD'
): PensionInput {
  return {
    retirementAge: '',
    lumpSum: '',
    investmentReturn: '',
    monthlyPension: '',
    cola: '',
    currency,
  };
}
