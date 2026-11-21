import type { SupportedCurrency } from '@/tools/shared/currency';

export type MagiMoneyFieldKey =
  | 'agi'
  | 'foreignEarnedIncome'
  | 'foreignHousingCost'
  | 'nonTaxableSocialBenefits'
  | 'selfEmploymentTaxes'
  | 'iraContributions'
  | 'passiveIncomeOrLosses'
  | 'others'
  | 'employerPaidAdoptionBenefits'
  | 'savingsBondInterest'
  | 'studentLoanInterest'
  | 'qualifiedTuitionExpenses';

export type MagiCurrencyKey = `${MagiMoneyFieldKey}Currency` | 'magiCurrency';

export interface MagiInput {
  agi: string;
  agiCurrency: SupportedCurrency;
  foreignEarnedIncome: string;
  foreignEarnedIncomeCurrency: SupportedCurrency;
  foreignHousingCost: string;
  foreignHousingCostCurrency: SupportedCurrency;
  nonTaxableSocialBenefits: string;
  nonTaxableSocialBenefitsCurrency: SupportedCurrency;
  selfEmploymentTaxes: string;
  selfEmploymentTaxesCurrency: SupportedCurrency;
  iraContributions: string;
  iraContributionsCurrency: SupportedCurrency;
  passiveIncomeOrLosses: string;
  passiveIncomeOrLossesCurrency: SupportedCurrency;
  others: string;
  othersCurrency: SupportedCurrency;
  employerPaidAdoptionBenefits: string;
  employerPaidAdoptionBenefitsCurrency: SupportedCurrency;
  savingsBondInterest: string;
  savingsBondInterestCurrency: SupportedCurrency;
  studentLoanInterest: string;
  studentLoanInterestCurrency: SupportedCurrency;
  qualifiedTuitionExpenses: string;
  qualifiedTuitionExpensesCurrency: SupportedCurrency;
  magiCurrency: SupportedCurrency;
  incomeExpensesOpen: boolean;
  otherIncomeOpen: boolean;
}

export interface MagiResult {
  magiCanonical: number;
  magi: number;
  agiCurrency: SupportedCurrency;
  magiCurrency: SupportedCurrency;
  formattedMagi: string;
}

export type MagiFieldErrors = Partial<Record<MagiMoneyFieldKey, string>> & {
  form?: string;
};

export const MAGI_MONEY_FIELDS: readonly {
  key: MagiMoneyFieldKey;
  currencyKey: MagiCurrencyKey;
  allowNegative: boolean;
}[] = [
  { key: 'agi', currencyKey: 'agiCurrency', allowNegative: true },
  {
    key: 'foreignEarnedIncome',
    currencyKey: 'foreignEarnedIncomeCurrency',
    allowNegative: false,
  },
  {
    key: 'foreignHousingCost',
    currencyKey: 'foreignHousingCostCurrency',
    allowNegative: false,
  },
  {
    key: 'nonTaxableSocialBenefits',
    currencyKey: 'nonTaxableSocialBenefitsCurrency',
    allowNegative: false,
  },
  {
    key: 'selfEmploymentTaxes',
    currencyKey: 'selfEmploymentTaxesCurrency',
    allowNegative: false,
  },
  {
    key: 'iraContributions',
    currencyKey: 'iraContributionsCurrency',
    allowNegative: false,
  },
  {
    key: 'passiveIncomeOrLosses',
    currencyKey: 'passiveIncomeOrLossesCurrency',
    allowNegative: true,
  },
  { key: 'others', currencyKey: 'othersCurrency', allowNegative: true },
  {
    key: 'employerPaidAdoptionBenefits',
    currencyKey: 'employerPaidAdoptionBenefitsCurrency',
    allowNegative: false,
  },
  {
    key: 'savingsBondInterest',
    currencyKey: 'savingsBondInterestCurrency',
    allowNegative: false,
  },
  {
    key: 'studentLoanInterest',
    currencyKey: 'studentLoanInterestCurrency',
    allowNegative: false,
  },
  {
    key: 'qualifiedTuitionExpenses',
    currencyKey: 'qualifiedTuitionExpensesCurrency',
    allowNegative: false,
  },
] as const;

const ZERO = '0';
const PKR = 'PKR' as SupportedCurrency;

export function createDefaultInput(): MagiInput {
  return {
    agi: '',
    agiCurrency: PKR,
    foreignEarnedIncome: ZERO,
    foreignEarnedIncomeCurrency: PKR,
    foreignHousingCost: ZERO,
    foreignHousingCostCurrency: PKR,
    nonTaxableSocialBenefits: ZERO,
    nonTaxableSocialBenefitsCurrency: PKR,
    selfEmploymentTaxes: ZERO,
    selfEmploymentTaxesCurrency: PKR,
    iraContributions: ZERO,
    iraContributionsCurrency: PKR,
    passiveIncomeOrLosses: ZERO,
    passiveIncomeOrLossesCurrency: PKR,
    others: ZERO,
    othersCurrency: PKR,
    employerPaidAdoptionBenefits: ZERO,
    employerPaidAdoptionBenefitsCurrency: PKR,
    savingsBondInterest: ZERO,
    savingsBondInterestCurrency: PKR,
    studentLoanInterest: ZERO,
    studentLoanInterestCurrency: PKR,
    qualifiedTuitionExpenses: ZERO,
    qualifiedTuitionExpensesCurrency: PKR,
    magiCurrency: PKR,
    incomeExpensesOpen: true,
    otherIncomeOpen: true,
  };
}