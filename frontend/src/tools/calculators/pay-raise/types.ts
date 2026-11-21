import type { SupportedCurrency } from '@/tools/shared/currency';

/** Period fields shared by before-raise, raise amount, and after-raise. */
export type PayRaisePeriodField = 'hourly' | 'weekly' | 'monthly' | 'annual';

/** Authoritative raise driver: percentage or one monetary period. */
export type PayRaiseRaiseSource = 'percentage' | PayRaisePeriodField;

export interface PayRaiseCalculatorInput {
  hoursPerWeek: string;
  beforeSource: PayRaisePeriodField;
  beforeHourly: string;
  beforeHourlyCurrency: SupportedCurrency;
  beforeWeekly: string;
  beforeWeeklyCurrency: SupportedCurrency;
  beforeMonthly: string;
  beforeMonthlyCurrency: SupportedCurrency;
  beforeAnnual: string;
  beforeAnnualCurrency: SupportedCurrency;
  raiseSource: PayRaiseRaiseSource;
  raisePercentage: string;
  raiseHourly: string;
  raiseHourlyCurrency: SupportedCurrency;
  raiseWeekly: string;
  raiseWeeklyCurrency: SupportedCurrency;
  raiseMonthly: string;
  raiseMonthlyCurrency: SupportedCurrency;
  raiseAnnual: string;
  raiseAnnualCurrency: SupportedCurrency;
  afterHourlyCurrency: SupportedCurrency;
  afterWeeklyCurrency: SupportedCurrency;
  afterMonthlyCurrency: SupportedCurrency;
  afterAnnualCurrency: SupportedCurrency;
}

export interface PayRaiseCalculatorResult {
  hoursPerWeek: number;
  beforeCurrency: SupportedCurrency;
  beforeHourlyCanonical: number;
  beforeWeeklyCanonical: number;
  beforeMonthlyCanonical: number;
  beforeAnnualCanonical: number;
  raiseAnnualCanonical: number;
  raiseHourlyCanonical: number;
  raiseWeeklyCanonical: number;
  raiseMonthlyCanonical: number;
  /** Null when original annual pay is 0 and raise &gt; 0 (undefined %). */
  raisePercentage: number | null;
  percentageUndefined: boolean;
  afterHourlyCanonical: number;
  afterWeeklyCanonical: number;
  afterMonthlyCanonical: number;
  afterAnnualCanonical: number;
  beforeHourly: number;
  beforeWeekly: number;
  beforeMonthly: number;
  beforeAnnual: number;
  raiseHourly: number;
  raiseWeekly: number;
  raiseMonthly: number;
  raiseAnnual: number;
  afterHourly: number;
  afterWeekly: number;
  afterMonthly: number;
  afterAnnual: number;
  formattedBeforeHourly: string;
  formattedBeforeWeekly: string;
  formattedBeforeMonthly: string;
  formattedBeforeAnnual: string;
  formattedRaisePercentage: string;
  formattedRaiseHourly: string;
  formattedRaiseWeekly: string;
  formattedRaiseMonthly: string;
  formattedRaiseAnnual: string;
  formattedAfterHourly: string;
  formattedAfterWeekly: string;
  formattedAfterMonthly: string;
  formattedAfterAnnual: string;
  beforeSource: PayRaisePeriodField;
  raiseSource: PayRaiseRaiseSource;
}

export type PayRaiseCalculatorFieldErrors = {
  hoursPerWeek?: string;
  beforeHourly?: string;
  beforeWeekly?: string;
  beforeMonthly?: string;
  beforeAnnual?: string;
  raisePercentage?: string;
  raiseHourly?: string;
  raiseWeekly?: string;
  raiseMonthly?: string;
  raiseAnnual?: string;
  form?: string;
};

export function createDefaultInput(): PayRaiseCalculatorInput {
  return {
    hoursPerWeek: '40',
    beforeSource: 'hourly',
    beforeHourly: '',
    beforeHourlyCurrency: 'PKR',
    beforeWeekly: '',
    beforeWeeklyCurrency: 'PKR',
    beforeMonthly: '',
    beforeMonthlyCurrency: 'PKR',
    beforeAnnual: '',
    beforeAnnualCurrency: 'PKR',
    raiseSource: 'percentage',
    raisePercentage: '',
    raiseHourly: '',
    raiseHourlyCurrency: 'PKR',
    raiseWeekly: '',
    raiseWeeklyCurrency: 'PKR',
    raiseMonthly: '',
    raiseMonthlyCurrency: 'PKR',
    raiseAnnual: '',
    raiseAnnualCurrency: 'PKR',
    afterHourlyCurrency: 'PKR',
    afterWeeklyCurrency: 'PKR',
    afterMonthlyCurrency: 'PKR',
    afterAnnualCurrency: 'PKR',
  };
}
