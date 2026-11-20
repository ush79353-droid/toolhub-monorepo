/** Fixed USD draft for federal estate tax estimate (decedents dying in 2026). */

export interface EstateTaxInput {
  residence: string;
  investments: string;
  savings: string;
  vehicles: string;
  retirement: string;
  lifeInsurance: string;
  otherAssets: string;
  debts: string;
  funeralAdmin: string;
  charitable: string;
  stateDeathTaxes: string;
  /** Tax-free lifetime gifts (annual-exclusion style) — informational; not adjusted taxable gifts. */
  taxFreeLifetimeGifts: string;
}

export interface EstateTaxResult {
  grossEstate: number;
  allowableDeductions: number;
  taxableEstate: number;
  basicExclusionAmount: number;
  applicableCreditAmount: number;
  tentativeTax: number;
  estimatedFederalEstateTax: number;
  taxFreeLifetimeGifts: number;
  taxYear: 2026;
  formattedGrossEstate: string;
  formattedAllowableDeductions: string;
  formattedTaxableEstate: string;
  formattedBasicExclusion: string;
  formattedFederalEstateTax: string;
  summaryText: string;
}

export type EstateTaxFieldErrors = Partial<Record<keyof EstateTaxInput, string>> & {
  form?: string;
};

export function createDefaultInput(): EstateTaxInput {
  return {
    residence: '0',
    investments: '0',
    savings: '0',
    vehicles: '0',
    retirement: '0',
    lifeInsurance: '0',
    otherAssets: '0',
    debts: '0',
    funeralAdmin: '0',
    charitable: '0',
    stateDeathTaxes: '0',
    taxFreeLifetimeGifts: '0',
  };
}
