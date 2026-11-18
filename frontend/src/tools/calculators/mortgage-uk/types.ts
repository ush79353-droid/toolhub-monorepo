export const MONTH_OPTIONS: readonly { value: string; label: string }[] = [
  { value: '1', label: 'Jan' },
  { value: '2', label: 'Feb' },
  { value: '3', label: 'Mar' },
  { value: '4', label: 'Apr' },
  { value: '5', label: 'May' },
  { value: '6', label: 'Jun' },
  { value: '7', label: 'Jul' },
  { value: '8', label: 'Aug' },
  { value: '9', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

export interface MortgageUkInput {
  homePrice: string;
  depositPercent: string;
  loanTermYears: string;
  interestRatePercent: string;
  includeOptionals: boolean;
  taxesPercent: string;
  homeInsuranceAnnual: string;
  mortgageInsuranceAnnual: string;
  otherCostsAnnual: string;
  startMonth: string;
  startYear: string;
}

export interface MortgageUkChartSlice {
  key: 'mortgage' | 'taxes' | 'homeInsurance' | 'mortgageInsurance' | 'other';
  label: string;
  amount: number;
  percent: number;
}

export interface MortgageUkResult {
  loanAmount: number;
  depositAmount: number;
  paymentCount: number;
  interestOnlyMonthly: number;
  monthlyRepayment: number;
  totalMortgagePayments: number;
  totalInterest: number;
  taxesMonthly: number;
  taxesTotal: number;
  homeInsuranceMonthly: number;
  homeInsuranceTotal: number;
  mortgageInsuranceMonthly: number;
  mortgageInsuranceTotal: number;
  otherCostsMonthly: number;
  otherCostsTotal: number;
  outOfPocketMonthly: number;
  outOfPocketTotal: number;
  startLabel: string;
  payoffLabel: string;
  chartSlices: MortgageUkChartSlice[];
  formattedLoanAmount: string;
  formattedDepositAmount: string;
  formattedInterestOnlyMonthly: string;
  formattedMonthlyRepayment: string;
  formattedTotalMortgagePayments: string;
  formattedTotalInterest: string;
  formattedTaxesMonthly: string;
  formattedTaxesTotal: string;
  formattedHomeInsuranceMonthly: string;
  formattedHomeInsuranceTotal: string;
  formattedMortgageInsuranceMonthly: string;
  formattedMortgageInsuranceTotal: string;
  formattedOtherCostsMonthly: string;
  formattedOtherCostsTotal: string;
  formattedOutOfPocketMonthly: string;
  formattedOutOfPocketTotal: string;
}

export type MortgageUkFieldErrors = {
  homePrice?: string;
  depositPercent?: string;
  loanTermYears?: string;
  interestRatePercent?: string;
  taxesPercent?: string;
  homeInsuranceAnnual?: string;
  mortgageInsuranceAnnual?: string;
  otherCostsAnnual?: string;
  startMonth?: string;
  startYear?: string;
  form?: string;
};

export function createDefaultInput(): MortgageUkInput {
  return {
    homePrice: '500000',
    depositPercent: '25',
    loanTermYears: '25',
    interestRatePercent: '5',
    includeOptionals: true,
    taxesPercent: '1.2',
    homeInsuranceAnnual: '2500',
    mortgageInsuranceAnnual: '0',
    otherCostsAnnual: '6000',
    startMonth: '11',
    startYear: '2026',
  };
}
