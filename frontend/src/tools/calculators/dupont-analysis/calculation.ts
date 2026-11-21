import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface DupontMathInput {
  sales: number;
  netIncome: number;
  totalAssets: number;
  totalEquity: number;
}

export interface DupontMathResult {
  netProfitMargin: number;
  totalAssetTurnover: number;
  financialLeverage: number;
  returnOnEquity: number;
  directRoe: number;
  negativeEquity: boolean;
}

/**
 * Three-factor DuPont:
 * ROE = (NI/Sales) × (Sales/Assets) × (Assets/Equity)
 * Ratios returned as decimals (NPM and ROE), not percent.
 */
export function calculateDupontAnalysis(
  input: DupontMathInput
): DupontMathResult | null {
  const { sales, netIncome, totalAssets, totalEquity } = input;

  if (
    !Number.isFinite(sales) ||
    !Number.isFinite(netIncome) ||
    !Number.isFinite(totalAssets) ||
    !Number.isFinite(totalEquity)
  ) {
    return null;
  }
  if (!(sales > 0) || !(totalAssets > 0) || totalEquity === 0) {
    return null;
  }

  const netProfitMargin = netIncome / sales;
  const totalAssetTurnover = sales / totalAssets;
  const financialLeverage = totalAssets / totalEquity;
  const returnOnEquity =
    netProfitMargin * totalAssetTurnover * financialLeverage;
  const directRoe = netIncome / totalEquity;

  if (
    !Number.isFinite(netProfitMargin) ||
    !Number.isFinite(totalAssetTurnover) ||
    !Number.isFinite(financialLeverage) ||
    !Number.isFinite(returnOnEquity) ||
    !Number.isFinite(directRoe)
  ) {
    return null;
  }

  return {
    netProfitMargin,
    totalAssetTurnover,
    financialLeverage,
    returnOnEquity,
    directRoe,
    negativeEquity: totalEquity < 0,
  };
}

export function formatDupontMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDupontPercent(decimal: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(decimal * 100);
}

export function formatDupontRatio(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function interpretDupont(
  roe: number,
  npm: number,
  tat: number,
  fl: number
): string {
  return `ROE is ${formatDupontPercent(roe)}% from net profit margin ${formatDupontPercent(npm)}% × asset turnover ${formatDupontRatio(tat)}× × financial leverage ${formatDupontRatio(fl)}×. High ROE can reflect profitability, efficiency, or leverage — not automatically financial health.`;
}
