export const MONTH_OPTIONS = [
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
] as const;

export interface CanadianMortgageInput {
  homePrice: string;
  downPaymentPercent: string;
  loanTermYears: string;
  interestRatePercent: string;
  includeOptionals: boolean;
  propertyTaxPercent: string;
  homeInsuranceAnnual: string;
  mortgageInsuranceAnnual: string;
  condoHoaFeeAnnual: string;
  otherCostsAnnual: string;
  startMonth: string;
  startYear: string;
}

export interface CanadianMortgageResult {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  paymentCount: number;
  monthlyMortgagePayment: number;
  totalMortgagePayments: number;
  totalInterest: number;
  monthlyPropertyTax: number;
  totalPropertyTax: number;
  monthlyHomeInsurance: number;
  totalHomeInsurance: number;
  monthlyMortgageInsurance: number;
  totalMortgageInsurance: number;
  monthlyCondoHoa: number;
  totalCondoHoa: number;
  monthlyOtherCosts: number;
  totalOtherCosts: number;
  monthlyOutOfPocket: number;
  totalOutOfPocket: number;
  mortgageSharePercent: number;
  propertyTaxSharePercent: number;
  homeInsuranceSharePercent: number;
  mortgageInsuranceSharePercent: number;
  condoHoaSharePercent: number;
  otherCostsSharePercent: number;
  payoffMonth: number;
  payoffYear: number;
  formattedPayoffDate: string;
  formattedHomePrice: string;
  formattedDownPayment: string;
  formattedLoanAmount: string;
  formattedMonthlyMortgagePayment: string;
  formattedTotalMortgagePayments: string;
  formattedTotalInterest: string;
  formattedMonthlyPropertyTax: string;
  formattedTotalPropertyTax: string;
  formattedMonthlyHomeInsurance: string;
  formattedTotalHomeInsurance: string;
  formattedMonthlyMortgageInsurance: string;
  formattedTotalMortgageInsurance: string;
  formattedMonthlyCondoHoa: string;
  formattedTotalCondoHoa: string;
  formattedMonthlyOtherCosts: string;
  formattedTotalOtherCosts: string;
  formattedMonthlyOutOfPocket: string;
  formattedTotalOutOfPocket: string;
}

export type CanadianMortgageFieldErrors = {
  homePrice?: string;
  downPaymentPercent?: string;
  loanTermYears?: string;
  interestRatePercent?: string;
  propertyTaxPercent?: string;
  homeInsuranceAnnual?: string;
  mortgageInsuranceAnnual?: string;
  condoHoaFeeAnnual?: string;
  otherCostsAnnual?: string;
  startMonth?: string;
  startYear?: string;
  form?: string;
};

export function createDefaultInput(): CanadianMortgageInput {
  return {
    homePrice: '800000',
    downPaymentPercent: '20',
    loanTermYears: '25',
    interestRatePercent: '5',
    includeOptionals: true,
    propertyTaxPercent: '0.3',
    homeInsuranceAnnual: '2500',
    mortgageInsuranceAnnual: '0',
    condoHoaFeeAnnual: '0',
    otherCostsAnnual: '6000',
    startMonth: '11',
    startYear: '2026',
  };
}
