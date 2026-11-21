import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  formatLifeExpectancyDefault,
  suggestedGovernmentPensionMonthly,
  suggestedLifeExpectancy,
} from './longevity-defaults';

export type Sex = 'female' | 'male';

export type MoneyPeriod = 'month' | 'year';

export type RetirementCountryCode =
  | 'US'
  | 'GB'
  | 'CA'
  | 'AU'
  | 'PL'
  | 'DE'
  | 'IN'
  | 'OTHER';

export interface RetirementInput {
  sex: Sex;
  currentAge: string;
  country: RetirementCountryCode;
  retirementAge: string;
  lifeExpectancy: string;
  /** Ongoing savings contribution amount (period selected separately). */
  savingsAmount: string;
  savingsPeriod: MoneyPeriod;
  alreadySaved: string;
  investmentReturn: string;
  governmentPension: string;
  governmentPensionPeriod: MoneyPeriod;
  costOfLiving: string;
  costOfLivingPeriod: MoneyPeriod;
  /** Result display period for retirement income / money-left rows. */
  incomeDisplayPeriod: MoneyPeriod;
  currency: SupportedCurrency;
}

export interface RetirementResult {
  sex: Sex;
  country: RetirementCountryCode;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  annualReturnPercent: number;
  alreadySaved: number;
  annualSavings: number;
  totalSavingsAtRetirement: number;
  governmentPensionAnnual: number;
  incomeFromSavingsAnnual: number;
  totalRetirementIncomeAnnual: number;
  costOfLivingAnnual: number;
  budgetCoveragePercent: number | null;
  moneyLeftAnnual: number;
  alreadyRetired: boolean;
  insufficientFunds: boolean;
  depletedBeforeLifeExpectancy: boolean;
  currency: SupportedCurrency;
  incomeDisplayPeriod: MoneyPeriod;
  formattedTotalSavings: string;
  formattedIncomeFromSavings: string;
  formattedGovernmentPension: string;
  formattedTotalIncome: string;
  formattedCostOfLiving: string;
  formattedMoneyLeft: string;
  budgetCoverageLabel: string;
  summaryMessage: string;
  assumptionNotes: string[];
  /** Nominal figures only — not inflation-adjusted. */
  figuresAreNominal: true;
}

export type RetirementFieldErrors = {
  form?: string;
  currentAge?: string;
  retirementAge?: string;
  lifeExpectancy?: string;
  savingsAmount?: string;
  alreadySaved?: string;
  investmentReturn?: string;
  governmentPension?: string;
  costOfLiving?: string;
};

export const MONEY_PERIOD_OPTIONS: ReadonlyArray<{
  value: MoneyPeriod;
  label: string;
}> = [
  { value: 'month', label: 'mo' },
  { value: 'year', label: 'yr' },
];

export const COUNTRY_OPTIONS: ReadonlyArray<{
  value: RetirementCountryCode;
  label: string;
}> = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'PL', label: 'Poland' },
  { value: 'DE', label: 'Germany' },
  { value: 'IN', label: 'India' },
  { value: 'OTHER', label: 'Other' },
];

/** Screenshot-aligned defaults: female · US · retire 67 · LE 81.4 · 7% return. */
export function createDefaultInput(): RetirementInput {
  const sex: Sex = 'female';
  const country: RetirementCountryCode = 'US';
  return {
    sex,
    currentAge: '40',
    country,
    retirementAge: '67',
    lifeExpectancy: formatLifeExpectancyDefault(
      suggestedLifeExpectancy(country, sex)
    ),
    savingsAmount: '500',
    savingsPeriod: 'month',
    alreadySaved: '50000',
    investmentReturn: '7',
    governmentPension: String(suggestedGovernmentPensionMonthly(country)),
    governmentPensionPeriod: 'month',
    costOfLiving: '4000',
    costOfLivingPeriod: 'month',
    incomeDisplayPeriod: 'month',
    currency: 'USD',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'USD'
): RetirementInput {
  return {
    sex: 'female',
    currentAge: '',
    country: 'US',
    retirementAge: '',
    lifeExpectancy: '',
    savingsAmount: '',
    savingsPeriod: 'month',
    alreadySaved: '',
    investmentReturn: '',
    governmentPension: '',
    governmentPensionPeriod: 'month',
    costOfLiving: '',
    costOfLivingPeriod: 'month',
    incomeDisplayPeriod: 'month',
    currency,
  };
}
