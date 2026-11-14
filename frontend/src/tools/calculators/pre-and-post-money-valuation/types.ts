import type { SupportedCurrency } from '@/tools/shared/currency';

export const PPM_FIELDS = [
  'investment',
  'equity',
  'preMoney',
  'postMoney',
] as const;

export type PpmField = (typeof PPM_FIELDS)[number];

export type PpmDraft = Record<PpmField, string> & {
  currency: SupportedCurrency;
  manual: Partial<Record<PpmField, true>>;
};

export type PpmValues = Partial<Record<PpmField, number>>;

export interface PpmSolveResult {
  values: PpmValues;
  errors: Partial<Record<PpmField | 'form', string>>;
  inconsistent: boolean;
}

export function createDefaultDraft(): PpmDraft {
  return {
    investment: '',
    equity: '',
    preMoney: '',
    postMoney: '',
    currency: 'PKR',
    manual: {},
  };
}
