import type { SupportedCurrency } from '@/tools/shared/currency';

export type AnnualizedReturnMode = 'total-return' | 'values';

export interface AnnualizedReturnDraft {
  mode: AnnualizedReturnMode;
  totalReturnPercent: string;
  holdingPeriodYears: string;
  beginningValue: string;
  endingValue: string;
  currency: SupportedCurrency;
}

export interface AnnualizedReturnResult {
  annualizedReturnPercent: number;
  display: string;
}

export type AnnualizedReturnField =
  | 'totalReturnPercent'
  | 'holdingPeriodYears'
  | 'beginningValue'
  | 'endingValue';

export type AnnualizedReturnFieldErrors = Partial<
  Record<AnnualizedReturnField | 'form', string>
>;

export function emptyAnnualizedReturnDraft(): AnnualizedReturnDraft {
  return {
    mode: 'total-return',
    totalReturnPercent: '',
    holdingPeriodYears: '',
    beginningValue: '',
    endingValue: '',
    currency: 'PKR',
  };
}
