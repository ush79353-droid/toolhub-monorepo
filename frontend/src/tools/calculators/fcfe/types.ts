import type { SupportedCurrency } from '@/tools/shared/currency';

export type FcfeMethod =
  | 'netIncome'
  | 'ebitda'
  | 'ebit'
  | 'cfo'
  | 'fcff';

export type NetBorrowingSource = 'debtBalances' | 'direct';

export type FcfeStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'taxAssumptionRequired';

export interface FcfeInput {
  method: FcfeMethod;
  netIncome: string;
  ebitda: string;
  ebit: string;
  operatingCashFlow: string;
  freeCashFlowToFirm: string;
  interestExpense: string;
  effectiveTaxRate: string;
  beginningTotalDebt: string;
  endingTotalDebt: string;
  netBorrowingSource: NetBorrowingSource;
  directNetBorrowing: string;
  depreciationAmortization: string;
  fixedCapitalInvestment: string;
  workingCapitalInvestment: string;
  currency: SupportedCurrency;
}

export interface FcfeResult {
  method: FcfeMethod;
  netBorrowing: number;
  calculatedNetIncome: number | null;
  freeCashFlowToEquity: number;
  status: FcfeStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedNetBorrowing: string;
  formattedCalculatedNetIncome: string | null;
  formattedFreeCashFlowToEquity: string;
}

export type FcfeFieldErrors = {
  netIncome?: string;
  ebitda?: string;
  ebit?: string;
  operatingCashFlow?: string;
  freeCashFlowToFirm?: string;
  interestExpense?: string;
  effectiveTaxRate?: string;
  beginningTotalDebt?: string;
  endingTotalDebt?: string;
  directNetBorrowing?: string;
  depreciationAmortization?: string;
  fixedCapitalInvestment?: string;
  workingCapitalInvestment?: string;
  form?: string;
};

export const FCFE_METHOD_OPTIONS: readonly {
  value: FcfeMethod;
  label: string;
}[] = [
  { value: 'netIncome', label: 'Net income' },
  {
    value: 'ebitda',
    label:
      'Earnings before interest, taxes, depreciation, and amortization (EBITDA)',
  },
  {
    value: 'ebit',
    label: 'Earnings before interest and taxes (EBIT)',
  },
  {
    value: 'cfo',
    label: 'Cash flow from operations (CFO)',
  },
  {
    value: 'fcff',
    label: 'Free cash flow to firm (FCFF)',
  },
] as const;

export function createDefaultInput(): FcfeInput {
  return {
    method: 'netIncome',
    netIncome: '',
    ebitda: '',
    ebit: '',
    operatingCashFlow: '',
    freeCashFlowToFirm: '',
    interestExpense: '',
    effectiveTaxRate: '',
    beginningTotalDebt: '',
    endingTotalDebt: '',
    netBorrowingSource: 'debtBalances',
    directNetBorrowing: '',
    depreciationAmortization: '',
    fixedCapitalInvestment: '',
    workingCapitalInvestment: '',
    currency: 'PKR',
  };
}
