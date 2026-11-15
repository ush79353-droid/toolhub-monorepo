import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DcfResult } from './types';

function formatPlainMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * FCFF two-year DCF with Gordon terminal value:
 * TV = FCFF₂ × (1+g) / (WACC − g)
 * EV = FCFF₁/(1+WACC) + (FCFF₂+TV)/(1+WACC)²
 * Equity = EV + Cash − Debt
 * Share = Equity / Shares
 */
export function calculateFcffDcf(input: {
  firstFcff: number;
  secondFcff: number;
  cash: number;
  outstandingDebt: number;
  growthPercent: number;
  waccPercent: number;
  outstandingShares: number;
  currency: SupportedCurrency;
}): DcfResult | null {
  const {
    firstFcff,
    secondFcff,
    cash,
    outstandingDebt,
    growthPercent,
    waccPercent,
    outstandingShares,
    currency,
  } = input;

  if (
    ![firstFcff, secondFcff, cash, outstandingDebt, growthPercent, waccPercent, outstandingShares].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(outstandingShares > 0)) return null;
  if (cash < 0 || outstandingDebt < 0) return null;

  const g = growthPercent / 100;
  const wacc = waccPercent / 100;
  if (!(wacc > g)) return null;
  if (!(wacc > -1)) return null;

  const terminalValue = (secondFcff * (1 + g)) / (wacc - g);
  if (!Number.isFinite(terminalValue)) return null;

  const enterpriseValue =
    firstFcff / (1 + wacc) + (secondFcff + terminalValue) / (1 + wacc) ** 2;
  if (!Number.isFinite(enterpriseValue)) return null;

  const equityValue = enterpriseValue + cash - outstandingDebt;
  if (!Number.isFinite(equityValue)) return null;

  const estimatedShareValue = equityValue / outstandingShares;
  if (!Number.isFinite(estimatedShareValue)) return null;

  return {
    method: 'fcff',
    currency,
    enterpriseValue,
    equityValue,
    estimatedShareValue,
    outstandingShares,
    formattedEnterpriseValue: formatPlainMoney(enterpriseValue, currency),
    formattedEquityValue: formatPlainMoney(equityValue, currency),
    formattedShareValue: formatPlainMoney(estimatedShareValue, currency),
  };
}

/**
 * EPS equity DCF (earnings capitalized at cost of equity — not FCFF/WACC).
 * Assumption: EPS is used as a per-share earnings proxy for an equity Gordon model.
 * TV/share = EPS₂ × (1+g) / (r − g)
 * Share = EPS₁/(1+r) + (EPS₂+TV)/(1+r)²
 * Equity = Share × Outstanding shares
 * Enterprise value is not produced in this mode.
 */
export function calculateEpsDcf(input: {
  firstEps: number;
  secondEps: number;
  growthPercent: number;
  costOfEquityPercent: number;
  outstandingShares: number;
  currency: SupportedCurrency;
}): DcfResult | null {
  const {
    firstEps,
    secondEps,
    growthPercent,
    costOfEquityPercent,
    outstandingShares,
    currency,
  } = input;

  if (
    ![firstEps, secondEps, growthPercent, costOfEquityPercent, outstandingShares].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(outstandingShares > 0)) return null;

  const g = growthPercent / 100;
  const r = costOfEquityPercent / 100;
  if (!(r > g)) return null;
  if (!(r > -1)) return null;

  const terminalPerShare = (secondEps * (1 + g)) / (r - g);
  if (!Number.isFinite(terminalPerShare)) return null;

  const estimatedShareValue =
    firstEps / (1 + r) + (secondEps + terminalPerShare) / (1 + r) ** 2;
  if (!Number.isFinite(estimatedShareValue)) return null;

  const equityValue = estimatedShareValue * outstandingShares;
  if (!Number.isFinite(equityValue)) return null;

  return {
    method: 'eps',
    currency,
    enterpriseValue: null,
    equityValue,
    estimatedShareValue,
    outstandingShares,
    formattedEnterpriseValue: null,
    formattedEquityValue: formatPlainMoney(equityValue, currency),
    formattedShareValue: formatPlainMoney(estimatedShareValue, currency),
  };
}
