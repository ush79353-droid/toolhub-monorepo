/** Historical US federal AMT tax years supported by this calculator. */
export type AmtTaxYear = 2022 | 2023;

export type AmtFilingStatus = 'single' | 'married-joint' | 'married-separate';

/**
 * Whether AMTI is kept in sync with AGI + non-deductible taxes (suggested)
 * or typed directly by the user (manual / Form 6251 line 4).
 */
export type AmtiSource = 'suggested' | 'manual';

/** Screenshot-first AMT inputs. Fixed USD — no FX. */
export interface AmtInput {
  taxYear: AmtTaxYear;
  adjustedGrossIncome: string;
  nonDeductibleTaxes: string;
  /** Alternative minimum taxable income (Form 6251 line 4 style). */
  amti: string;
  amtiSource: AmtiSource;
  filingStatus: AmtFilingStatus;
  /** AMT-permitted tax credits (default $0). */
  taxCredits: string;
}

export interface AmtResult {
  taxYear: AmtTaxYear;
  filingStatus: AmtFilingStatus;
  /** Raw AMTI before MFS add-on. */
  amtiEntered: number;
  /** MFS §55(d) add-on applied to AMTI (0 when not MFS). */
  mfsAddon: number;
  /** AMTI after any MFS add-on (Form 6251 line 4 as used). */
  amtiAdjusted: number;
  exemptionBase: number;
  exemptionPhasedOut: number;
  exemptionAllowed: number;
  /** Taxable excess after exemption — labeled “Taxable income” in the form. */
  taxableExcess: number;
  tentativeMinimumTax: number;
  creditsApplied: number;
  /** Tentative AMT after credits — not additional AMT vs regular tax. */
  tentativeAmtAfterCredits: number;
  formattedAmtiAdjusted: string;
  formattedExemptionAllowed: string;
  formattedTaxableExcess: string;
  formattedTentativeMinimumTax: string;
  formattedCreditsApplied: string;
  formattedTentativeAmtAfterCredits: string;
  summaryText: string;
  disclosures: readonly string[];
}

export type AmtFieldErrors = {
  adjustedGrossIncome?: string;
  nonDeductibleTaxes?: string;
  amti?: string;
  taxCredits?: string;
  form?: string;
};

export const TAX_YEAR_OPTIONS: readonly { year: AmtTaxYear; label: string }[] = [
  { year: 2022, label: '2022' },
  { year: 2023, label: '2023' },
];

export const FILING_STATUS_OPTIONS: readonly {
  value: AmtFilingStatus;
  label: string;
}[] = [
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married, filed jointly' },
  { value: 'married-separate', label: 'Married, filed separately' },
];

export function createDefaultInput(): AmtInput {
  return {
    taxYear: 2022,
    adjustedGrossIncome: '',
    nonDeductibleTaxes: '',
    amti: '',
    amtiSource: 'suggested',
    filingStatus: 'single',
    taxCredits: '0',
  };
}

/** Worked example: 2022 single, AMTI $200,000, no credits. */
export function createExampleInput(): AmtInput {
  return {
    taxYear: 2022,
    adjustedGrossIncome: '180000',
    nonDeductibleTaxes: '20000',
    amti: '200000',
    amtiSource: 'suggested',
    filingStatus: 'single',
    taxCredits: '0',
  };
}
