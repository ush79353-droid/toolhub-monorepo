export interface HomeEquityLoanInput {
  loanAmount: string;
  annualInterestRatePercent: string;
  loanTermYears: string;
  /** Screenshot checkbox. Closing-cost fields are not defined in project data. */
  includeClosingCosts: boolean;
}

export interface HomeEquityLoanResult {
  monthlyPayment: number;
  paymentCount: number;
  totalOfPayments: number;
  totalInterest: number;
  principal: number;
  principalSharePercent: number;
  interestSharePercent: number;
  formattedMonthlyPayment: string;
  formattedTotalOfPayments: string;
  formattedTotalInterest: string;
  formattedPrincipal: string;
}

export type HomeEquityLoanFieldErrors = {
  loanAmount?: string;
  annualInterestRatePercent?: string;
  loanTermYears?: string;
  form?: string;
};

export function createDefaultInput(): HomeEquityLoanInput {
  return {
    loanAmount: '150000',
    annualInterestRatePercent: '8',
    loanTermYears: '15',
    includeClosingCosts: false,
  };
}
