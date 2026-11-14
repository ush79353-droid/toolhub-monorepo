import type { SupportedCurrency } from '@/tools/shared/currency';

export type CagrField = 'cagrPercent' | 'periods' | 'initialValue' | 'finalValue';

export interface CagrDraft {
  cagrPercent: string;
  periods: string;
  initialValue: string;
  finalValue: string;
  currency: SupportedCurrency;
  /** Fields the user typed (non-empty). Never overwrite these. */
  userOwned: Partial<Record<CagrField, boolean>>;
  /** Last field auto-filled by the solver (safe to refresh). */
  solvedField: CagrField | null;
}

export interface CagrChangeInValue {
  absoluteChange: number;
  percentChange: number;
  absoluteDisplay: string;
  percentDisplay: string;
}

export interface CagrResult {
  cagrPercent: number;
  periods: number;
  initialValue: number;
  finalValue: number;
  solvedField: CagrField | null;
  displays: Record<CagrField, string>;
  change: CagrChangeInValue | null;
}

export type CagrFieldErrors = Partial<Record<CagrField | 'form', string>>;

export function emptyCagrDraft(): CagrDraft {
  return {
    cagrPercent: '',
    periods: '',
    initialValue: '',
    finalValue: '',
    currency: 'PKR',
    userOwned: {},
    solvedField: null,
  };
}
