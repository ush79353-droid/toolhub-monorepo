import type { SupportedCurrency } from '@/tools/shared/currency';

export type CashFlowActivity = 'deposit' | 'withdrawal';

export interface CashFlowTransaction {
  id: string;
  activity: CashFlowActivity;
  amount: string;
  date: string;
}

export interface CashFlowSectionInput {
  startingBalance: string;
  startingDate: string;
  endingBalance: string;
  endingDate: string;
  transactions: CashFlowTransaction[];
  currency: SupportedCurrency;
}

export interface CashFlowSectionResult {
  startingBalance: number;
  endingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netExternalContributions: number;
  investmentPeriodDays: number;
  annualizedReturnPercent: number;
  currency: SupportedCurrency;
  formattedStartingBalance: string;
  formattedEndingBalance: string;
  formattedTotalDeposits: string;
  formattedTotalWithdrawals: string;
  formattedNetExternalContributions: string;
  formattedAnnualizedReturn: string;
}

export interface InvestmentReturnEntry {
  id: string;
  returnPercentage: string;
  holdingYears: string;
  holdingMonths: string;
}

export interface AverageSectionInput {
  entries: InvestmentReturnEntry[];
}

export interface AverageSectionResult {
  validEntryCount: number;
  annualizedReturnsPercent: number[];
  averageAnnualizedReturnPercent: number;
  cumulativeReturnPercent: number;
  totalHoldingMonths: number;
  overallAnnualizedReturnPercent: number;
  formattedAverageAnnualizedReturn: string;
  formattedCumulativeReturn: string;
  formattedOverallAnnualizedReturn: string;
  formattedAnnualizedReturns: string[];
}

export type CashFlowFieldErrors = {
  startingBalance?: string;
  startingDate?: string;
  endingBalance?: string;
  endingDate?: string;
  form?: string;
} & Partial<Record<string, string>>;

export type AverageFieldErrors = {
  form?: string;
} & Partial<Record<string, string>>;

let txId = 0;
export function createTransaction(
  partial?: Partial<CashFlowTransaction>,
): CashFlowTransaction {
  txId += 1;
  return {
    id: `tx-${txId}`,
    activity: 'deposit',
    amount: '',
    date: '',
    ...partial,
  };
}

let invId = 0;
export function createInvestmentEntry(
  partial?: Partial<InvestmentReturnEntry>,
): InvestmentReturnEntry {
  invId += 1;
  return {
    id: `inv-${invId}`,
    returnPercentage: '',
    holdingYears: '',
    holdingMonths: '',
    ...partial,
  };
}

export function createDefaultCashFlowInput(): CashFlowSectionInput {
  return {
    startingBalance: '',
    startingDate: '',
    endingBalance: '',
    endingDate: '',
    transactions: [createTransaction(), createTransaction(), createTransaction()],
    currency: 'PKR',
  };
}

export function createDefaultAverageInput(): AverageSectionInput {
  return {
    entries: [
      createInvestmentEntry(),
      createInvestmentEntry(),
      createInvestmentEntry(),
    ],
  };
}

/** Spec-style cash-flow example: 10k → 12.1k over exactly 730 days → ~10%. */
export function createCashFlowExampleInput(): CashFlowSectionInput {
  return {
    startingBalance: '10000',
    startingDate: '2025-01-01',
    endingBalance: '12100',
    endingDate: '2027-01-01',
    transactions: [createTransaction(), createTransaction()],
    currency: 'PKR',
  };
}

/** Spec example: 10%, -2%, 15% → cumulative 24.07%. */
export function createAverageExampleInput(): AverageSectionInput {
  return {
    entries: [
      createInvestmentEntry({
        returnPercentage: '10',
        holdingYears: '1',
        holdingMonths: '2',
      }),
      createInvestmentEntry({
        returnPercentage: '-2',
        holdingYears: '0',
        holdingMonths: '5',
      }),
      createInvestmentEntry({
        returnPercentage: '15',
        holdingYears: '2',
        holdingMonths: '3',
      }),
    ],
  };
}
