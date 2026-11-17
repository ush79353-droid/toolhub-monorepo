import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last intentionally edited field (drives recalculation). */
export type MarginVatDriver =
  | 'vat'
  | 'netCost'
  | 'grossCost'
  | 'margin'
  | 'markup'
  | 'netPrice'
  | 'grossPrice'
  | 'profit';

/** Which pricing percentage is pinned when solving price from cost. */
export type PricingPin = 'margin' | 'markup';

export interface MarginVatInput {
  vatPercent: string;
  netCost: string;
  netCostCurrency: SupportedCurrency;
  grossCost: string;
  grossCostCurrency: SupportedCurrency;
  marginPercent: string;
  markupPercent: string;
  netPrice: string;
  netPriceCurrency: SupportedCurrency;
  grossPrice: string;
  grossPriceCurrency: SupportedCurrency;
  profit: string;
  profitCurrency: SupportedCurrency;
  driver: MarginVatDriver;
  pricingPin: PricingPin;
}

export interface MarginVatResult {
  vatPercent: number;
  formattedVatPercent: string;
  netCost: number | null;
  netCostCurrency: SupportedCurrency;
  formattedNetCost: string;
  grossCost: number | null;
  grossCostCurrency: SupportedCurrency;
  formattedGrossCost: string;
  marginPercent: number | null;
  formattedMarginPercent: string;
  markupPercent: number | null;
  formattedMarkupPercent: string;
  netPrice: number | null;
  netPriceCurrency: SupportedCurrency;
  formattedNetPrice: string;
  grossPrice: number | null;
  grossPriceCurrency: SupportedCurrency;
  formattedGrossPrice: string;
  profit: number | null;
  profitCurrency: SupportedCurrency;
  formattedProfit: string;
}

export type MarginVatFieldErrors = {
  vatPercent?: string;
  netCost?: string;
  grossCost?: string;
  marginPercent?: string;
  markupPercent?: string;
  netPrice?: string;
  grossPrice?: string;
  profit?: string;
  form?: string;
};

export function createDefaultInput(): MarginVatInput {
  return {
    vatPercent: '',
    netCost: '',
    netCostCurrency: 'PKR',
    grossCost: '',
    grossCostCurrency: 'PKR',
    marginPercent: '',
    markupPercent: '',
    netPrice: '',
    netPriceCurrency: 'PKR',
    grossPrice: '',
    grossPriceCurrency: 'PKR',
    profit: '',
    profitCurrency: 'PKR',
    driver: 'netCost',
    pricingPin: 'margin',
  };
}
