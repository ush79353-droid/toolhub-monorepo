import type { SupportedCurrency } from '@/tools/shared/currency';

export type ComparisonType = 'income' | 'age' | 'wealth';

export interface NetWorthAssets {
  primaryHome: string;
  holidayHome: string;
  otherRealEstate: string;
  stocksAndInvestments: string;
  motorVehicles: string;
  otherAssets: string;
  savingsAccounts: string;
  checkingAccounts: string;
  otherInvestments: string;
}

export interface NetWorthLiabilities {
  mortgage: string;
  carLoan: string;
  personalLoan: string;
  studentLoan: string;
  leasePurchase: string;
  consumerLoan: string;
  creditCardDebt: string;
  otherDebt: string;
}

export interface NetWorthInput {
  assets: NetWorthAssets;
  liabilities: NetWorthLiabilities;
  currency: SupportedCurrency;
  comparisonType: ComparisonType;
  comparisonGroupId: string;
}

export interface NetWorthBenchmark {
  id: string;
  label: string;
  meanUsd: number;
  medianUsd: number;
}

export interface NetWorthComparisonResult {
  type: ComparisonType;
  groupId: string;
  groupLabel: string;
  meanUsd: number;
  medianUsd: number;
  userNetWorth: number;
  differenceFromMean: number;
  /** Null when mean is 0. */
  percentVsMean: number | null;
  dataYear: number;
  source: string;
  note: string;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  /** Null when liabilities are 0. */
  assetToLiabilityRatio: number | null;
  comparison: NetWorthComparisonResult | null;
  currency: SupportedCurrency;
  summaryText: string;
}

export type NetWorthFieldErrors = {
  form?: string;
  assets?: string;
  liabilities?: string;
};

export const ASSET_FIELDS: readonly {
  key: keyof NetWorthAssets;
  label: string;
}[] = [
  { key: 'primaryHome', label: 'Primary home' },
  { key: 'holidayHome', label: 'Holiday home' },
  { key: 'otherRealEstate', label: 'Other real estate' },
  { key: 'stocksAndInvestments', label: 'Stocks and financial investments' },
  { key: 'motorVehicles', label: 'Motor vehicles' },
  { key: 'otherAssets', label: 'Other assets' },
  { key: 'savingsAccounts', label: 'Savings accounts' },
  { key: 'checkingAccounts', label: 'Checking accounts' },
  { key: 'otherInvestments', label: 'Other investments' },
] as const;

export const LIABILITY_FIELDS: readonly {
  key: keyof NetWorthLiabilities;
  label: string;
}[] = [
  { key: 'mortgage', label: 'Mortgage' },
  { key: 'carLoan', label: 'Car loan' },
  { key: 'personalLoan', label: 'Personal loan' },
  { key: 'studentLoan', label: 'Student loan' },
  { key: 'leasePurchase', label: 'Lease purchase' },
  { key: 'consumerLoan', label: 'Consumer loan' },
  { key: 'creditCardDebt', label: 'Credit card debt and store cards' },
  { key: 'otherDebt', label: 'Other debt' },
] as const;

function zeroAssets(): NetWorthAssets {
  return {
    primaryHome: '0',
    holidayHome: '0',
    otherRealEstate: '0',
    stocksAndInvestments: '0',
    motorVehicles: '0',
    otherAssets: '0',
    savingsAccounts: '0',
    checkingAccounts: '0',
    otherInvestments: '0',
  };
}

function zeroLiabilities(): NetWorthLiabilities {
  return {
    mortgage: '0',
    carLoan: '0',
    personalLoan: '0',
    studentLoan: '0',
    leasePurchase: '0',
    consumerLoan: '0',
    creditCardDebt: '0',
    otherDebt: '0',
  };
}

export function createDefaultInput(): NetWorthInput {
  return {
    assets: zeroAssets(),
    liabilities: zeroLiabilities(),
    currency: 'USD',
    comparisonType: 'income',
    comparisonGroupId: 'inc-40-59',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): NetWorthInput {
  return {
    assets: {
      primaryHome: '',
      holidayHome: '',
      otherRealEstate: '',
      stocksAndInvestments: '',
      motorVehicles: '',
      otherAssets: '',
      savingsAccounts: '',
      checkingAccounts: '',
      otherInvestments: '',
    },
    liabilities: {
      mortgage: '',
      carLoan: '',
      personalLoan: '',
      studentLoan: '',
      leasePurchase: '',
      consumerLoan: '',
      creditCardDebt: '',
      otherDebt: '',
    },
    currency,
    comparisonType: 'income',
    comparisonGroupId: 'inc-40-59',
  };
}

/** Example used in guide / load-example (illustrative worked numbers). */
export function createExampleInput(): NetWorthInput {
  return {
    assets: {
      primaryHome: '300000',
      holidayHome: '50000',
      otherRealEstate: '0',
      stocksAndInvestments: '80000',
      motorVehicles: '0',
      otherAssets: '10000',
      savingsAccounts: '30000',
      checkingAccounts: '10000',
      otherInvestments: '0',
    },
    liabilities: {
      mortgage: '180000',
      carLoan: '15000',
      personalLoan: '0',
      studentLoan: '0',
      leasePurchase: '0',
      consumerLoan: '0',
      creditCardDebt: '5000',
      otherDebt: '0',
    },
    currency: 'USD',
    comparisonType: 'income',
    comparisonGroupId: 'inc-40-59',
  };
}
