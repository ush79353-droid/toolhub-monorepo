import type { SupportedCurrency } from '@/tools/shared/currency';

/** Fixed FHA upfront MIP rate implied by the reference screenshot (not editable). */
export const FHA_UPFRONT_MIP_RATE = 0.0175;

export type MonetaryResultKey =
  | 'totalDownPayment'
  | 'baseLoanAmount'
  | 'upfrontMip'
  | 'monthlyMortgagePayment'
  | 'monthlyMip'
  | 'totalFhaLoanAmount'
  | 'totalMonthlyPayment'
  | 'totalCostOfLoan';

export interface FhaLoanInput {
  homePrice: string;
  homePriceCurrency: SupportedCurrency;
  downPaymentPercent: string;
  loanTermYears: string;
  interestRatePercent: string;
  annualMipPercent: string;
  totalDownPaymentCurrency: SupportedCurrency;
  baseLoanAmountCurrency: SupportedCurrency;
  upfrontMipCurrency: SupportedCurrency;
  monthlyMortgagePaymentCurrency: SupportedCurrency;
  monthlyMipCurrency: SupportedCurrency;
  totalFhaLoanAmountCurrency: SupportedCurrency;
  totalMonthlyPaymentCurrency: SupportedCurrency;
  totalCostOfLoanCurrency: SupportedCurrency;
}

export interface FhaLoanResult {
  /** Canonical amounts in home-price currency (full precision). */
  totalDownPaymentInHome: number;
  baseLoanAmountInHome: number;
  upfrontMipInHome: number;
  monthlyMortgagePaymentInHome: number;
  monthlyMipInHome: number;
  totalFhaLoanAmountInHome: number;
  totalMonthlyPaymentInHome: number;
  totalCostOfLoanInHome: number;
  /** Display amounts after FX. */
  totalDownPayment: number;
  baseLoanAmount: number;
  upfrontMip: number;
  monthlyMortgagePayment: number;
  monthlyMip: number;
  totalFhaLoanAmount: number;
  totalMonthlyPayment: number;
  totalCostOfLoan: number;
  formattedTotalDownPayment: string;
  formattedBaseLoanAmount: string;
  formattedUpfrontMip: string;
  formattedMonthlyMortgagePayment: string;
  formattedMonthlyMip: string;
  formattedTotalFhaLoanAmount: string;
  formattedTotalMonthlyPayment: string;
  formattedTotalCostOfLoan: string;
  totalDownPaymentCurrency: SupportedCurrency;
  baseLoanAmountCurrency: SupportedCurrency;
  upfrontMipCurrency: SupportedCurrency;
  monthlyMortgagePaymentCurrency: SupportedCurrency;
  monthlyMipCurrency: SupportedCurrency;
  totalFhaLoanAmountCurrency: SupportedCurrency;
  totalMonthlyPaymentCurrency: SupportedCurrency;
  totalCostOfLoanCurrency: SupportedCurrency;
  periodicInterestRatePercent: number;
  formattedPeriodicInterestRatePercent: string;
  numberOfPayments: number;
}

export type FhaLoanFieldErrors = {
  homePrice?: string;
  downPaymentPercent?: string;
  loanTermYears?: string;
  interestRatePercent?: string;
  annualMipPercent?: string;
  form?: string;
};

export function createDefaultInput(): FhaLoanInput {
  return {
    homePrice: '200000',
    homePriceCurrency: 'PKR',
    downPaymentPercent: '10',
    loanTermYears: '30',
    interestRatePercent: '3',
    annualMipPercent: '0.85',
    totalDownPaymentCurrency: 'PKR',
    baseLoanAmountCurrency: 'PKR',
    upfrontMipCurrency: 'PKR',
    monthlyMortgagePaymentCurrency: 'PKR',
    monthlyMipCurrency: 'PKR',
    totalFhaLoanAmountCurrency: 'PKR',
    totalMonthlyPaymentCurrency: 'PKR',
    totalCostOfLoanCurrency: 'PKR',
  };
}
