export const MONTH_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

export interface MortgageAmortizationInput {
  homePrice: string;
  downPaymentPercent: string;
  loanTermYears: string;
  interestRatePercent: string;
  includeOptionals: boolean;
  propertyTaxPercent: string;
  homeInsuranceAnnual: string;
  pmiInsuranceAnnual: string;
  hoaFeeAnnual: string;
  otherCostsAnnual: string;
  startMonth: number;
  startYear: string;
}

export interface MortgageAmortizationResult {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  totalMortgagePayments: number;
  totalInterest: number;
  paymentCount: number;
  monthlyPropertyTax: number;
  totalPropertyTax: number;
  monthlyHomeInsurance: number;
  totalHomeInsurance: number;
  monthlyPmi: number;
  totalPmi: number;
  monthlyHoa: number;
  totalHoa: number;
  monthlyOtherCosts: number;
  totalOtherCosts: number;
  monthlyOutOfPocket: number;
  totalOutOfPocket: number;
  payoffLabel: string;
  /** Chart shares of monthly out-of-pocket (0–100). */
  mortgageSharePercent: number;
  taxSharePercent: number;
  insuranceSharePercent: number;
  pmiSharePercent: number;
  hoaSharePercent: number;
  otherSharePercent: number;
  formattedHomePrice: string;
  formattedDownPayment: string;
  formattedLoanAmount: string;
  formattedMonthlyMortgage: string;
  formattedTotalMortgagePayments: string;
  formattedTotalInterest: string;
  formattedMonthlyPropertyTax: string;
  formattedTotalPropertyTax: string;
  formattedMonthlyHomeInsurance: string;
  formattedTotalHomeInsurance: string;
  formattedMonthlyPmi: string;
  formattedTotalPmi: string;
  formattedMonthlyHoa: string;
  formattedTotalHoa: string;
  formattedMonthlyOtherCosts: string;
  formattedTotalOtherCosts: string;
  formattedMonthlyOutOfPocket: string;
  formattedTotalOutOfPocket: string;
}

export type MortgageAmortizationFieldErrors = {
  homePrice?: string;
  downPaymentPercent?: string;
  loanTermYears?: string;
  interestRatePercent?: string;
  propertyTaxPercent?: string;
  homeInsuranceAnnual?: string;
  pmiInsuranceAnnual?: string;
  hoaFeeAnnual?: string;
  otherCostsAnnual?: string;
  startYear?: string;
  form?: string;
};

export function createDefaultInput(): MortgageAmortizationInput {
  return {
    homePrice: '500000',
    downPaymentPercent: '20',
    loanTermYears: '30',
    interestRatePercent: '7.319',
    includeOptionals: true,
    propertyTaxPercent: '1.2',
    homeInsuranceAnnual: '2500',
    pmiInsuranceAnnual: '0',
    hoaFeeAnnual: '0',
    otherCostsAnnual: '5000',
    startMonth: 11,
    startYear: '2026',
  };
}
