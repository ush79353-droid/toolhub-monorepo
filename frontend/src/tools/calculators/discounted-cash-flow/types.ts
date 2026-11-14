import type { SupportedCurrency } from '@/tools/shared/currency';

export type DcfMethod = 'fcff' | 'eps';

export interface DcfInput {
  method: DcfMethod;
  firstFcff: string;
  secondFcff: string;
  firstEps: string;
  secondEps: string;
  cash: string;
  outstandingDebt: string;
  perpetualGrowthPercent: string;
  waccPercent: string;
  costOfEquityPercent: string;
  outstandingShares: string;
  currency: SupportedCurrency;
}

export interface DcfResult {
  method: DcfMethod;
  currency: SupportedCurrency;
  enterpriseValue: number | null;
  equityValue: number;
  estimatedShareValue: number;
  outstandingShares: number;
  formattedEnterpriseValue: string | null;
  formattedEquityValue: string;
  formattedShareValue: string;
}

export type DcfFieldErrors = {
  firstFcff?: string;
  secondFcff?: string;
  firstEps?: string;
  secondEps?: string;
  cash?: string;
  outstandingDebt?: string;
  perpetualGrowthPercent?: string;
  waccPercent?: string;
  costOfEquityPercent?: string;
  outstandingShares?: string;
  form?: string;
};

export function createDefaultInput(): DcfInput {
  return {
    method: 'fcff',
    firstFcff: '',
    secondFcff: '',
    firstEps: '',
    secondEps: '',
    cash: '',
    outstandingDebt: '',
    perpetualGrowthPercent: '',
    waccPercent: '',
    costOfEquityPercent: '',
    outstandingShares: '',
    currency: 'PKR',
  };
}
