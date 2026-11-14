import type { SupportedCurrency } from '@/tools/shared/currency';

export const CPM_FIELDS = ['totalCost', 'cpm', 'impressions'] as const;
export type CpmField = (typeof CPM_FIELDS)[number];

export type CpmCampaignDraft = Record<CpmField, string> & {
  currency: SupportedCurrency;
  manual: Partial<Record<CpmField, true>>;
};

export type CpmValues = Partial<Record<CpmField, number>>;

export interface CpmSolveResult {
  values: CpmValues;
  errors: Partial<Record<CpmField | 'form', string>>;
  inconsistent: boolean;
}

export interface CpmDraft {
  primary: CpmCampaignDraft;
  secondary: CpmCampaignDraft;
  secondOpen: boolean;
}

export function createCampaignDraft(): CpmCampaignDraft {
  return {
    totalCost: '',
    cpm: '',
    impressions: '',
    currency: 'PKR',
    manual: {},
  };
}

export function createDefaultDraft(): CpmDraft {
  return {
    primary: createCampaignDraft(),
    secondary: createCampaignDraft(),
    secondOpen: false,
  };
}
