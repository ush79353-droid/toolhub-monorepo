import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CarAffordabilityInput {
  monthlyPayment: string;
  availableMoney: string;
  tradeInValue: string;
  annualInterestRate: string;
  /** Omni-style: Yes shows term fields; No blocks calculation. */
  loanTermEnabled: boolean;
  loanTermYears: string;
  loanTermMonths: string;
  additionalOpen: boolean;
  salesTaxRate: string;
  dealerFees: string;
  registrationFees: string;
  otherUpfrontCosts: string;
  /** Optional allocation of available money; never added on top of available money. */
  downPayment: string;
  currency: SupportedCurrency;
}

export interface CarAffordabilityResult {
  monthlyPayment: number;
  loanAmount: number;
  totalLoanPayments: number;
  totalInterestPaid: number;
  availableMoney: number;
  cashContribution: number;
  tradeInValue: number;
  totalUpfrontCosts: number;
  salesTaxAmount: number;
  maximumCarValue: number;
  totalPurchaseCost: number;
  loanTermMonths: number;
  monthlyInterestRate: number;
  annualInterestRate: number;
  usedDownPaymentAllocation: boolean;
  currency: SupportedCurrency;
}

export type CarAffordabilityFieldErrors = Partial<
  Record<
    | 'monthlyPayment'
    | 'availableMoney'
    | 'tradeInValue'
    | 'annualInterestRate'
    | 'loanTermEnabled'
    | 'loanTermYears'
    | 'loanTermMonths'
    | 'salesTaxRate'
    | 'dealerFees'
    | 'registrationFees'
    | 'otherUpfrontCosts'
    | 'downPayment'
    | 'form',
    string
  >
>;

export function createDefaultInput(): CarAffordabilityInput {
  return {
    monthlyPayment: '',
    availableMoney: '',
    tradeInValue: '',
    annualInterestRate: '',
    loanTermEnabled: true,
    loanTermYears: '5',
    loanTermMonths: '0',
    additionalOpen: false,
    salesTaxRate: '',
    dealerFees: '',
    registrationFees: '',
    otherUpfrontCosts: '',
    downPayment: '',
    currency: 'USD',
  };
}

export function createExampleInput(): CarAffordabilityInput {
  return {
    monthlyPayment: '500',
    availableMoney: '5000',
    tradeInValue: '3000',
    annualInterestRate: '6',
    loanTermEnabled: true,
    loanTermYears: '5',
    loanTermMonths: '0',
    additionalOpen: false,
    salesTaxRate: '',
    dealerFees: '',
    registrationFees: '',
    otherUpfrontCosts: '',
    downPayment: '',
    currency: 'USD',
  };
}
