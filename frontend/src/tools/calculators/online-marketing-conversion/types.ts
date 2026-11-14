import type { SupportedCurrency } from '@/tools/shared/currency';

export const OMC_FIELDS = [
  'impressions',
  'ctr',
  'visits',
  'visitsToLeads',
  'leads',
  'leadsToCustomers',
  'customers',
  'totalCost',
  'cpm',
  'cpc',
  'costPerLead',
  'costPerCustomer',
  'revenue',
  'roi',
  'revenuePerClick',
  'revenuePerLead',
  'revenuePerCustomer',
  'ordersPerCustomer',
  'customerLtv',
  'totalLifetimeRevenue',
] as const;

export type OmcField = (typeof OMC_FIELDS)[number];

export const PERCENT_FIELDS = new Set<OmcField>([
  'ctr',
  'visitsToLeads',
  'leadsToCustomers',
  'roi',
]);

export const MONEY_FIELDS = new Set<OmcField>([
  'totalCost',
  'cpm',
  'cpc',
  'costPerLead',
  'costPerCustomer',
  'revenue',
  'revenuePerClick',
  'revenuePerLead',
  'revenuePerCustomer',
  'customerLtv',
  'totalLifetimeRevenue',
]);

export type OmcValues = Partial<Record<OmcField, number>>;

export type OmcDraft = Record<OmcField, string> & {
  currency: SupportedCurrency;
  manual: Partial<Record<OmcField, true>>;
  ltvOpen: boolean;
};

export type OmcFieldErrors = Partial<Record<OmcField | 'form', string>>;

export interface OmcSolveResult {
  values: OmcValues;
  errors: OmcFieldErrors;
}

export function createDefaultDraft(): OmcDraft {
  const blank = Object.fromEntries(OMC_FIELDS.map((k) => [k, ''])) as Record<OmcField, string>;
  return {
    ...blank,
    currency: 'PKR',
    manual: {},
    ltvOpen: false,
  };
}
