import type { SupportedCurrency } from '@/tools/shared/currency';

export type AffordabilityMode = 'payment' | 'income';
export type IncomePeriod = 'annual' | 'monthly';
export type PaymentPeriod = 'monthly' | 'annual';
export type TermUnit = 'years' | 'months';
export type DownPaymentMode = 'amount' | 'percent';
export type ClosingCostMode = 'none' | 'amount' | 'percent';

export interface HomeAffordabilityInput {
  mode: AffordabilityMode;
  loanSpecOpen: boolean;
  additionalOpen: boolean;

  maximumPayment: string;
  paymentPeriod: PaymentPeriod;

  loanTermValue: string;
  loanTermUnit: TermUnit;
  annualInterestRate: string;

  income: string;
  incomePeriod: IncomePeriod;
  monthlyDebtPayments: string;

  downPaymentMode: DownPaymentMode;
  downPaymentAmount: string;
  downPaymentPercent: string;

  annualPropertyTaxRate: string;
  annualHomeownersInsurance: string;
  monthlyHoa: string;
  annualMortgageInsuranceRate: string;

  frontEndDtiLimit: string;
  backEndDtiLimit: string;

  closingCostMode: ClosingCostMode;
  closingCostAmount: string;
  closingCostPercent: string;

  currency: SupportedCurrency;
}

export type BindingLimit = 'front' | 'back' | 'tie' | 'payment';

export interface HomeAffordabilityResult {
  affordableHomePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeownersInsurance: number;
  monthlyHoa: number;
  monthlyMortgageInsurance: number;
  totalMonthlyHousingPayment: number;
  maximumHousingBudget: number;
  bindingLimit: BindingLimit;
  frontEndDti: number | null;
  backEndDti: number | null;
  estimatedClosingCosts: number;
  cashNeededAtClosing: number;
  currency: SupportedCurrency;
  formattedHomePrice: string;
  formattedLoanAmount: string;
  formattedDownPayment: string;
  formattedMonthlyPi: string;
  formattedMonthlyTax: string;
  formattedMonthlyInsurance: string;
  formattedMonthlyHoa: string;
  formattedMonthlyMi: string;
  formattedTotalHousing: string;
  formattedBudget: string;
  formattedClosingCosts: string;
  formattedCashAtClosing: string;
  warning: string | null;
}

export type HomeAffordabilityFieldErrors = Partial<
  Record<
    | 'maximumPayment'
    | 'loanTermValue'
    | 'annualInterestRate'
    | 'income'
    | 'monthlyDebtPayments'
    | 'downPaymentAmount'
    | 'downPaymentPercent'
    | 'annualPropertyTaxRate'
    | 'annualHomeownersInsurance'
    | 'monthlyHoa'
    | 'annualMortgageInsuranceRate'
    | 'frontEndDtiLimit'
    | 'backEndDtiLimit'
    | 'closingCostAmount'
    | 'closingCostPercent'
    | 'form',
    string
  >
>;

export function createDefaultInput(): HomeAffordabilityInput {
  return {
    mode: 'payment',
    loanSpecOpen: true,
    additionalOpen: false,
    maximumPayment: '',
    paymentPeriod: 'monthly',
    loanTermValue: '',
    loanTermUnit: 'years',
    annualInterestRate: '',
    income: '',
    incomePeriod: 'annual',
    monthlyDebtPayments: '0',
    downPaymentMode: 'amount',
    downPaymentAmount: '',
    downPaymentPercent: '',
    annualPropertyTaxRate: '0',
    annualHomeownersInsurance: '0',
    monthlyHoa: '0',
    annualMortgageInsuranceRate: '0',
    frontEndDtiLimit: '28',
    backEndDtiLimit: '36',
    closingCostMode: 'none',
    closingCostAmount: '',
    closingCostPercent: '',
    currency: 'PKR',
  };
}
