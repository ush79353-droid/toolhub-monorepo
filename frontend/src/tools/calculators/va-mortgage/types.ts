export type VaEligibility =
  | 'active_veteran'
  | 'reservist_national_guard'
  | 'surviving_spouses';

export type YesNo = 'yes' | 'no';

export type FundingFeePayment = 'financed' | 'upfront';

export type DownPaymentUnit = 'percent' | 'amount';

export const VA_ELIGIBILITY_OPTIONS: readonly {
  value: VaEligibility;
  label: string;
}[] = [
  { value: 'active_veteran', label: 'Active/Veteran' },
  { value: 'reservist_national_guard', label: 'Reservist/National Guard' },
  { value: 'surviving_spouses', label: 'Surviving Spouses' },
];

/**
 * VA purchase/construction funding fee rates effective 2023-04-07
 * (va.gov Housing Assistance — same table for Veterans, active duty,
 * National Guard, and Reserve). Fee is a percent of the base loan amount.
 */
export const VA_PURCHASE_FUNDING_FEE_RATES = {
  firstUse: {
    under5: 2.15,
    from5: 1.5,
    from10: 1.25,
  },
  subsequentUse: {
    under5: 3.3,
    from5: 1.5,
    from10: 1.25,
  },
} as const;

export interface VaMortgageInput {
  homePrice: string;
  downPayment: string;
  downPaymentUnit: DownPaymentUnit;
  loanTermYears: string;
  interestRatePercent: string;
  eligibility: VaEligibility;
  usedVaLoanBefore: YesNo;
  serviceRelatedDisability: YesNo;
  fundingFeePayment: FundingFeePayment;
}

export interface VaMortgageResult {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  baseLoanAmount: number;
  fundingFeeRatePercent: number;
  fundingFee: number;
  fundingFeeExempt: boolean;
  loanAmount: number;
  monthlyPayment: number;
  paymentCount: number;
  totalOfPayments: number;
  totalInterest: number;
  principalSharePercent: number;
  interestSharePercent: number;
  fundingFeeFinanced: boolean;
  formattedHomePrice: string;
  formattedDownPayment: string;
  formattedFundingFee: string;
  formattedFundingFeeRatePercent: string;
  formattedLoanAmount: string;
  formattedMonthlyPayment: string;
  formattedTotalOfPayments: string;
  formattedTotalInterest: string;
}

export type VaMortgageFieldErrors = {
  homePrice?: string;
  downPayment?: string;
  loanTermYears?: string;
  interestRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): VaMortgageInput {
  return {
    homePrice: '500000',
    downPayment: '0',
    downPaymentUnit: 'percent',
    loanTermYears: '30',
    interestRatePercent: '7.319',
    eligibility: 'active_veteran',
    usedVaLoanBefore: 'no',
    serviceRelatedDisability: 'no',
    fundingFeePayment: 'financed',
  };
}
