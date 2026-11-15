import type { SupportedCurrency } from '@/tools/shared/currency';

export const CPC_CPM_FIELDS = [
  'impressions',
  'cpc',
  'ctr',
  'clicks',
  'totalCost',
  'cpm',
] as const;

export type CpcCpmField = (typeof CPC_CPM_FIELDS)[number];

export type CpcCpmDraft = Record<CpcCpmField, string> & {
  currency: SupportedCurrency;
  /** Fields the user has typed (including blank after clear of that field is false). */
  manual: Partial<Record<CpcCpmField, true>>;
};

export type CpcCpmValues = Partial<Record<CpcCpmField, number>>;

export interface CpcCpmSolveResult {
  values: CpcCpmValues;
  errors: Partial<Record<CpcCpmField | 'form', string>>;
  inconsistent: boolean;
}

export function createDefaultDraft(): CpcCpmDraft {
  return {
    impressions: '',
    cpc: '',
    ctr: '',
    clicks: '',
    totalCost: '',
    cpm: '',
    currency: 'PKR',
    manual: {},
  };
}
