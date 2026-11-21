import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AccrualRatioStatus } from './types';

/** NOA = Operating Assets − Operating Liabilities (signed result preserved). */
export function calculateNetOperatingAssets(
  operatingAssets: number,
  operatingLiabilities: number
): number | null {
  if (
    !Number.isFinite(operatingAssets) ||
    !Number.isFinite(operatingLiabilities) ||
    operatingAssets < 0 ||
    operatingLiabilities < 0
  ) {
    return null;
  }
  const noa = operatingAssets - operatingLiabilities;
  return Number.isFinite(noa) ? noa : null;
}

export function calculateAverageNetOperatingAssets(
  beginningNOA: number,
  endingNOA: number
): number | null {
  if (!Number.isFinite(beginningNOA) || !Number.isFinite(endingNOA)) {
    return null;
  }
  const avg = (beginningNOA + endingNOA) / 2;
  return Number.isFinite(avg) ? avg : null;
}

export function calculateChangeInNetOperatingAssets(
  beginningNOA: number,
  endingNOA: number
): number | null {
  if (!Number.isFinite(beginningNOA) || !Number.isFinite(endingNOA)) {
    return null;
  }
  const change = endingNOA - beginningNOA;
  return Number.isFinite(change) ? change : null;
}

export function calculateCashFlowAccruals(
  netIncome: number,
  operatingCashFlow: number
): number | null {
  if (!Number.isFinite(netIncome) || !Number.isFinite(operatingCashFlow)) {
    return null;
  }
  const accruals = netIncome - operatingCashFlow;
  return Number.isFinite(accruals) ? accruals : null;
}

/**
 * Denominator guard. Near-zero uses half of the currency's smallest display unit
 * so tiny float noise does not produce unstable ratios.
 */
export function validateAccrualRatioDenominator(
  averageNOA: number,
  currency: SupportedCurrency
): {
  status: Extract<
    AccrualRatioStatus,
    'valid' | 'zeroDenominator' | 'negativeDenominator'
  >;
  warningMessage: string | null;
} {
  if (!Number.isFinite(averageNOA)) {
    return {
      status: 'zeroDenominator',
      warningMessage: 'Average net operating assets is unavailable.',
    };
  }
  const digits = getCurrencyFractionDigits(currency);
  const epsilon = 0.5 * 10 ** -Math.max(0, digits);
  if (Math.abs(averageNOA) < epsilon) {
    return {
      status: 'zeroDenominator',
      warningMessage:
        'Average net operating assets is zero (or effectively zero), so the accrual ratio is undefined. Division by zero is not performed.',
    };
  }
  if (averageNOA < 0) {
    return {
      status: 'negativeDenominator',
      warningMessage:
        'Average net operating assets is negative. The mathematical ratio is shown, but usual earnings-quality interpretation may not apply. Absolute value is not used.',
    };
  }
  return { status: 'valid', warningMessage: null };
}

export function calculateBalanceSheetAccrualRatio(
  changeInNOA: number,
  averageNOA: number
): number | null {
  if (!Number.isFinite(changeInNOA) || !Number.isFinite(averageNOA)) {
    return null;
  }
  if (averageNOA === 0) return null;
  const ratio = changeInNOA / averageNOA;
  return Number.isFinite(ratio) ? ratio : null;
}

export function calculateCashFlowAccrualRatio(
  cashFlowAccruals: number,
  averageNOA: number
): number | null {
  if (!Number.isFinite(cashFlowAccruals) || !Number.isFinite(averageNOA)) {
    return null;
  }
  if (averageNOA === 0) return null;
  const ratio = cashFlowAccruals / averageNOA;
  return Number.isFinite(ratio) ? ratio : null;
}

export function interpretAccrualRatio(
  ratio: number | null,
  status: AccrualRatioStatus,
  method: 'balanceSheet' | 'cashFlow'
): string {
  const methodLabel =
    method === 'balanceSheet'
      ? 'balance-sheet accrual ratio'
      : 'cash-flow accrual ratio';

  if (status === 'zeroDenominator') {
    return 'Accrual ratio unavailable because average net operating assets is zero.';
  }
  if (ratio === null) {
    return 'Enter the required inputs for the selected method to calculate the accrual ratio.';
  }
  if (ratio > 0) {
    return `Positive ${methodLabel}: measured accruals are positive relative to average NOA. This is not automatic evidence of poor earnings quality or manipulation. Compare periods, peers, and cash-flow trends.`;
  }
  if (ratio < 0) {
    return `Negative ${methodLabel}: measured accruals are negative relative to average NOA. Meaning depends on accounting context and the selected formula.`;
  }
  return `Zero ${methodLabel}: no measured accrual difference under this formula. Zero does not mean perfect earnings quality.`;
}

export function formatAccrualMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatAccrualPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
