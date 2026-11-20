import type { SupportedCurrency } from '@/tools/shared/currency';

export type IncomePeriod = 'monthly' | 'annually';

export interface CapRateInput {
  /** Section A — primary cap-rate path */
  propertyValue: string;
  grossRentalIncome: string;
  incomePeriod: IncomePeriod;
  otherIncome: string;
  vacancyRate: string;
  operatingExpenses: string;

  /** Section B — independent reverse valuation */
  reverseNoi: string;
  reverseCapRate: string;

  /** Section C — independent required NOI */
  requiredPropertyValue: string;
  targetCapRate: string;

  currency: SupportedCurrency;
}

export interface CapRateResult {
  /** Primary path */
  annualGrossRental: number;
  annualOtherIncome: number;
  potentialGrossIncome: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  noi: number;
  capRatePercent: number | null;
  operatingExpenseRatio: number | null;

  /** Reverse path */
  estimatedPropertyValue: number | null;

  /** Required NOI path */
  requiredAnnualNoi: number | null;
  requiredMonthlyNoi: number | null;

  currency: SupportedCurrency;
  formattedAnnualGrossRental: string;
  formattedPotentialGrossIncome: string;
  formattedVacancyLoss: string;
  formattedEffectiveGrossIncome: string;
  formattedNoi: string;
  formattedCapRate: string | null;
  formattedExpenseRatio: string | null;
  formattedEstimatedPropertyValue: string | null;
  formattedRequiredAnnualNoi: string | null;
  formattedRequiredMonthlyNoi: string | null;
}

export type CapRateFieldErrors = {
  propertyValue?: string;
  grossRentalIncome?: string;
  otherIncome?: string;
  vacancyRate?: string;
  operatingExpenses?: string;
  reverseNoi?: string;
  reverseCapRate?: string;
  requiredPropertyValue?: string;
  targetCapRate?: string;
  form?: string;
};

export function createDefaultInput(): CapRateInput {
  return {
    propertyValue: '',
    grossRentalIncome: '',
    incomePeriod: 'annually',
    otherIncome: '',
    vacancyRate: '0',
    operatingExpenses: '',
    reverseNoi: '',
    reverseCapRate: '',
    requiredPropertyValue: '',
    targetCapRate: '',
    currency: 'USD',
  };
}
