import {
  DEFAULT_UK_CGT_TAX_YEAR,
  type UkCgtAssetType,
  type UkCgtTaxYearId,
} from './rates';

export type { UkCgtAssetType, UkCgtTaxYearId };

export interface CapitalGainsTaxUkInput {
  taxYear: UkCgtTaxYearId;
  /** Capital gains (£) as typed string. */
  capitalGains: string;
  assetType: UkCgtAssetType;
  assetsInTrust: boolean;
  /** Taxable annual income after Personal Allowance (HMRC definition). */
  annualIncome: string;
  otherIncome: string;
}

export interface CapitalGainsTaxUkResult {
  taxYear: UkCgtTaxYearId;
  assetType: UkCgtAssetType;
  assetsInTrust: boolean;
  capitalGains: number;
  annualIncome: number;
  otherIncome: number;
  totalAnnualIncome: number;
  annualExemptAmount: number;
  chargeableGains: number;
  basicRateBand: number;
  basicRateRoom: number;
  taxedAtBasic: number;
  taxedAtHigher: number;
  basicRate: number;
  higherRate: number;
  capitalGainsTax: number;
  formattedTotalAnnualIncome: string;
  formattedCapitalGainsTax: string;
  formattedChargeableGains: string;
  steps: string[];
  interpretation: string;
  explanation: string;
  disclaimer: string;
}

export type CapitalGainsTaxUkFieldErrors = {
  form?: string;
  capitalGains?: string;
  annualIncome?: string;
  otherIncome?: string;
};

export function createDefaultInput(): CapitalGainsTaxUkInput {
  return {
    taxYear: DEFAULT_UK_CGT_TAX_YEAR,
    capitalGains: '',
    assetType: 'shares',
    assetsInTrust: false,
    annualIncome: '',
    otherIncome: '0.00',
  };
}

export function createEmptyInput(): CapitalGainsTaxUkInput {
  return createDefaultInput();
}

/** GOV.UK worked example 1 (2026/27): taxable income £20,000 · gains £12,600 → CGT £1,728. */
export function createExampleInput(): CapitalGainsTaxUkInput {
  return {
    taxYear: '2026/27',
    capitalGains: '12600',
    assetType: 'shares',
    assetsInTrust: false,
    annualIncome: '20000',
    otherIncome: '0.00',
  };
}
