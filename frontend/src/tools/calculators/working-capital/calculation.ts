import {
  calculateCurrentRatio,
  calculateWorkingCapital,
  formatCrMoney,
  formatCurrentRatio,
} from '@/tools/calculators/current-ratio/calculation';
import type { SupportedCurrency } from '@/tools/shared/currency';

export {
  calculateWorkingCapital,
  calculateCurrentRatio as calculateWorkingCapitalRatio,
  formatCrMoney as formatWcMoney,
  formatCurrentRatio as formatWcRatio,
};

/** Average WC = (Beginning WC + Ending WC) / 2. Signed averages allowed. */
export function calculateAverageWorkingCapital(
  beginningWorkingCapital: number,
  endingWorkingCapital: number
): number | null {
  if (
    !Number.isFinite(beginningWorkingCapital) ||
    !Number.isFinite(endingWorkingCapital)
  ) {
    return null;
  }
  const average =
    beginningWorkingCapital / 2 + endingWorkingCapital / 2;
  return Number.isFinite(average) ? average : null;
}

/** Change in WC = Ending − Beginning. */
export function calculateChangeInWorkingCapital(
  beginningWorkingCapital: number,
  endingWorkingCapital: number
): number | null {
  if (
    !Number.isFinite(beginningWorkingCapital) ||
    !Number.isFinite(endingWorkingCapital)
  ) {
    return null;
  }
  const change = endingWorkingCapital - beginningWorkingCapital;
  return Number.isFinite(change) ? change : null;
}

/**
 * WCT = Revenue / Average WC.
 * Null when average WC is exactly zero (undefined — never Infinity).
 * Negative average WC may yield a signed turnover (with UI warning).
 */
export function calculateWorkingCapitalTurnover(
  revenue: number,
  averageWorkingCapital: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    revenue < 0 ||
    !Number.isFinite(averageWorkingCapital) ||
    averageWorkingCapital === 0
  ) {
    return null;
  }
  const turnover = revenue / averageWorkingCapital;
  return Number.isFinite(turnover) ? turnover : null;
}

export function formatWcTurnover(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function interpretWorkingCapital(
  workingCapital: number | null,
  workingCapitalRatio: number | null,
  averageWorkingCapital: number | null,
  turnover: number | null,
  status: string
): string {
  if (status === 'zeroLiabilities') {
    return 'Working capital ratio is unavailable because current liabilities equal zero. Working capital (assets − liabilities) is still shown when both balances are provided.';
  }
  if (status === 'zeroAverageWc') {
    return 'Working capital turnover is unavailable because average working capital equals zero.';
  }

  const parts: string[] = [];

  if (workingCapital !== null) {
    if (Math.abs(workingCapital) < 5e-12) {
      parts.push('Working capital is zero; current assets equal current liabilities.');
    } else if (workingCapital > 0) {
      parts.push(
        `Positive working capital of ${formatPlain(workingCapital)} means current assets exceed current liabilities.`
      );
    } else {
      parts.push(
        `Negative working capital of ${formatPlain(workingCapital)} means current liabilities exceed current assets; not automatically insolvency.`
      );
    }
  }

  if (workingCapitalRatio !== null) {
    parts.push(
      `Working capital ratio (current ratio) is ${formatCurrentRatio(workingCapitalRatio)}.`
    );
  }

  if (turnover !== null && averageWorkingCapital !== null) {
    if (averageWorkingCapital < 0) {
      parts.push(
        `Signed turnover of ${formatWcTurnover(turnover)}x uses a negative average WC; interpret with caution; efficiency comparisons may not apply.`
      );
    } else {
      parts.push(
        `Working capital turnover of ${formatWcTurnover(turnover)}x means about ${formatWcTurnover(turnover)} of revenue per 1 of average working capital.`
      );
    }
  }

  return parts.length > 0
    ? parts.join(' ')
    : 'Enter current assets and liabilities (and optional turnover inputs) to calculate working capital metrics.';
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSignedMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const abs = formatCrMoney(Math.abs(amount), currency);
  if (amount < 0) return `-${abs}`;
  return abs;
}
