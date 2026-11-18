export type IncomeSource = 'annual' | 'monthly';

/** Only durations confirmed by the reference screenshot. */
export type RepaymentPeriodYears = 30;

/**
 * Screenshot-confirmed fixed-pricing option only.
 * 9.750% is the reference example rate shown in the UI — not verified as a
 * current official Pag-IBIG circular rate in this repository.
 */
export type FixedPricingOptionId = '30y-9.750';

export interface FixedPricingOption {
  id: FixedPricingOptionId;
  label: string;
  fixedYears: number;
  annualRatePercent: number;
}

export const REPAYMENT_PERIOD_OPTIONS: readonly {
  value: RepaymentPeriodYears;
  label: string;
}[] = [{ value: 30, label: '30 years' }];

export const FIXED_PRICING_OPTIONS: readonly FixedPricingOption[] = [
  {
    id: '30y-9.750',
    label: '30 years (9.750%)',
    fixedYears: 30,
    annualRatePercent: 9.75,
  },
];

export interface PagIbigHousingLoanInput {
  estimatedPropertyValue: string;
  loanAmount: string;
  repaymentPeriodYears: RepaymentPeriodYears;
  fixedPricingOptionId: FixedPricingOptionId;
  grossAnnualIncome: string;
  grossMonthlyIncome: string;
  incomeSource: IncomeSource;
  showOtherCalculatedValues: boolean;
}

export interface PagIbigHousingLoanResult {
  /** Always null until official Pag-IBIG property LTV rules are sourced. */
  loanableAmount: number | null;
  loanableUnavailableReason: string;
  monthlyPrincipalAndInterest: number;
  paymentCount: number;
  annualRatePercent: number;
  fixedPricingYears: number;
  rateCoversFullTerm: boolean;
  /** Always null until official insurance formula is sourced. */
  monthlyInsurancePremium: number | null;
  insuranceUnavailableReason: string;
  /** Null while insurance remains unspecified. */
  totalMonthlyAmortization: number | null;
  totalAmortizationUnavailableReason: string | null;
  formattedMonthlyPrincipalAndInterest: string;
  formattedGrossAnnualIncome: string;
  formattedGrossMonthlyIncome: string;
}

export type PagIbigHousingLoanFieldErrors = {
  estimatedPropertyValue?: string;
  loanAmount?: string;
  grossAnnualIncome?: string;
  grossMonthlyIncome?: string;
  form?: string;
};

export function createDefaultInput(): PagIbigHousingLoanInput {
  return {
    estimatedPropertyValue: '',
    loanAmount: '',
    repaymentPeriodYears: 30,
    fixedPricingOptionId: '30y-9.750',
    grossAnnualIncome: '',
    grossMonthlyIncome: '',
    incomeSource: 'annual',
    showOtherCalculatedValues: false,
  };
}

export function getFixedPricingOption(
  id: FixedPricingOptionId
): FixedPricingOption {
  return (
    FIXED_PRICING_OPTIONS.find((o) => o.id === id) ?? FIXED_PRICING_OPTIONS[0]!
  );
}
