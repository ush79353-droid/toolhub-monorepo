import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which side last drove application-fee sync (avoids circular updates). */
export type ApplicationFeeSource = 'percent' | 'amount';

export interface HomeImprovementLoanInput {
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  termYears: string;
  termMonths: string;
  interestRatePercent: string;
  applicationFeePercent: string;
  applicationFee: string;
  applicationFeeCurrency: SupportedCurrency;
  homeLoanFees: string;
  homeLoanFeesCurrency: SupportedCurrency;
  /** Tracks last-edited application-fee side for sync. */
  applicationFeeSource: ApplicationFeeSource;
}

export interface AnnualChartPoint {
  year: number;
  loanBalance: number;
  principalPaid: number;
  interestPaid: number;
}

export interface HomeImprovementLoanResult {
  monthlyPayment: number;
  aprPercent: number;
  paymentCount: number;
  termYears: number;
  termMonths: number;
  loanPrincipal: number;
  totalInterest: number;
  loanFees: number;
  applicationFeeInLoan: number;
  homeLoanFeesInLoan: number;
  totalPayments: number;
  chartPoints: AnnualChartPoint[];
  currency: SupportedCurrency;
  formattedMonthlyPayment: string;
  formattedApr: string;
  formattedLoanTerm: string;
  formattedLoanPrincipal: string;
  formattedTotalInterest: string;
  formattedLoanFees: string;
  formattedTotalPayments: string;
}

export type HomeImprovementLoanFieldErrors = {
  loanAmount?: string;
  termYears?: string;
  termMonths?: string;
  interestRatePercent?: string;
  applicationFeePercent?: string;
  applicationFee?: string;
  homeLoanFees?: string;
  form?: string;
};

export function createDefaultInput(): HomeImprovementLoanInput {
  return {
    loanAmount: '50000',
    loanCurrency: 'PKR',
    termYears: '5',
    termMonths: '0',
    interestRatePercent: '7.5',
    applicationFeePercent: '0.4',
    applicationFee: '200',
    applicationFeeCurrency: 'PKR',
    homeLoanFees: '0',
    homeLoanFeesCurrency: 'PKR',
    applicationFeeSource: 'percent',
  };
}
