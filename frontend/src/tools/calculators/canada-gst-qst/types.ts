import type { ProvinceCode } from './rates';

export interface CanadaGstQstInput {
  province: ProvinceCode;
  /** Amount before tax (CAD). */
  amountBeforeTax: string;
}

export interface CanadaGstQstTaxLineResult {
  key: string;
  label: string;
  ratePercentLabel: string;
  amount: number;
  formattedAmount: string;
}

export interface CanadaGstQstResult {
  province: ProvinceCode;
  provinceName: string;
  blurb: string;
  amountBeforeTax: number;
  taxLines: CanadaGstQstTaxLineResult[];
  totalTax: number;
  amountAfterTax: number;
  formattedBefore: string;
  formattedTotalTax: string;
  formattedAfter: string;
}

export type CanadaGstQstFieldErrors = {
  amountBeforeTax?: string;
  form?: string;
};

export function createDefaultInput(): CanadaGstQstInput {
  return {
    province: 'AB',
    amountBeforeTax: '',
  };
}
