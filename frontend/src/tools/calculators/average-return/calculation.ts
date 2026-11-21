import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AverageSectionResult,
  CashFlowSectionResult,
} from './types';

export interface DatedCashFlow {
  amount: number;
  date: Date;
}

export interface PeriodReturnInput {
  periodReturnDecimal: number;
  holdingMonths: number;
}

const MS_PER_DAY = 86_400_000;

export function parseIsoDate(value: string): Date | null {
  const cleaned = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return null;
  const [y, m, d] = cleaned.split('-').map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d!));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m! - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return date;
}

export function daysBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** NPV of dated cash flows at annual rate r (decimal), day-count /365 from first flow. */
export function xirrNpv(flows: readonly DatedCashFlow[], rate: number): number {
  if (!(rate > -1) || !Number.isFinite(rate) || flows.length === 0) return Number.NaN;
  const t0 = flows[0]!.date.getTime();
  let npv = 0;
  for (const flow of flows) {
    const years = (flow.date.getTime() - t0) / (365 * MS_PER_DAY);
    const denom = Math.pow(1 + rate, years);
    if (!Number.isFinite(denom) || denom === 0) return Number.NaN;
    npv += flow.amount / denom;
  }
  return npv;
}

function xirrDerivative(flows: readonly DatedCashFlow[], rate: number): number {
  if (!(rate > -1) || !Number.isFinite(rate) || flows.length === 0) return Number.NaN;
  const t0 = flows[0]!.date.getTime();
  let d = 0;
  for (const flow of flows) {
    const years = (flow.date.getTime() - t0) / (365 * MS_PER_DAY);
    if (years === 0) continue;
    const denom = Math.pow(1 + rate, years + 1);
    if (!Number.isFinite(denom) || denom === 0) return Number.NaN;
    d += (-years * flow.amount) / denom;
  }
  return d;
}

export function hasOppositeSigns(flows: readonly DatedCashFlow[]): boolean {
  let pos = false;
  let neg = false;
  for (const flow of flows) {
    if (flow.amount > 0) pos = true;
    if (flow.amount < 0) neg = true;
    if (pos && neg) return true;
  }
  return false;
}

/**
 * Annualized money-weighted return (XIRR) with 365-day year convention.
 * Newton–Raphson with bisection fallback. Returns null if no stable root.
 */
export function calculateXIRR(flows: readonly DatedCashFlow[]): number | null {
  if (flows.length < 2) return null;
  if (!hasOppositeSigns(flows)) return null;
  if (!flows.every((f) => Number.isFinite(f.amount))) return null;

  const sorted = [...flows].sort((a, b) => a.date.getTime() - b.date.getTime());
  if (sorted[0]!.date.getTime() === sorted[sorted.length - 1]!.date.getTime()) {
    return null;
  }

  const f = (r: number) => xirrNpv(sorted, r);

  let r = 0.1;
  let converged = false;
  for (let i = 0; i < 80; i += 1) {
    const val = f(r);
    const deriv = xirrDerivative(sorted, r);
    if (!Number.isFinite(val) || !Number.isFinite(deriv)) break;
    if (Math.abs(val) < 1e-10) {
      converged = true;
      break;
    }
    if (Math.abs(deriv) < 1e-14) break;
    const next = r - val / deriv;
    if (!(next > -0.999999) || !Number.isFinite(next)) break;
    if (Math.abs(next - r) < 1e-12) {
      r = next;
      converged = true;
      break;
    }
    r = next;
  }

  if (!converged || !Number.isFinite(r) || !(r > -1)) {
    let low = -0.999999;
    let high = 10;
    let fLow = f(low);
    let fHigh = f(high);
    if (![fLow, fHigh].every(Number.isFinite)) return null;

    if (fLow * fHigh > 0) {
      let found = false;
      let prevR = low;
      let prevF = fLow;
      for (let i = 1; i <= 160; i += 1) {
        const mid = low + ((high - low) * i) / 160;
        const fm = f(mid);
        if (!Number.isFinite(fm)) continue;
        if (prevF * fm <= 0) {
          low = prevR;
          high = mid;
          fLow = prevF;
          fHigh = fm;
          found = true;
          break;
        }
        prevR = mid;
        prevF = fm;
      }
      if (!found) return null;
    }

    for (let i = 0; i < 120; i += 1) {
      const mid = (low + high) / 2;
      const fm = f(mid);
      if (!Number.isFinite(fm)) return null;
      if (Math.abs(fm) < 1e-10 || high - low < 1e-12) {
        r = mid;
        converged = true;
        break;
      }
      if (fLow * fm <= 0) {
        high = mid;
        fHigh = fm;
      } else {
        low = mid;
        fLow = fm;
      }
      r = mid;
    }
  }

  if (!converged || !Number.isFinite(r) || !(r > -1)) return null;
  const check = f(r);
  const scale = Math.max(
    1,
    ...sorted.map((flow) => Math.abs(flow.amount)),
  );
  if (!Number.isFinite(check) || Math.abs(check) > 1e-4 * scale) return null;
  return r;
}

export function buildCashFlowResult(
  startingBalance: number,
  endingBalance: number,
  startingDate: Date,
  endingDate: Date,
  deposits: number,
  withdrawals: number,
  annualizedReturn: number,
  currency: SupportedCurrency,
): CashFlowSectionResult {
  const net = deposits - withdrawals;
  const days = daysBetween(startingDate, endingDate);
  const sb = roundMoney(startingBalance, currency);
  const eb = roundMoney(endingBalance, currency);
  const td = roundMoney(deposits, currency);
  const tw = roundMoney(withdrawals, currency);
  const nn = roundMoney(net, currency);
  return {
    startingBalance: sb,
    endingBalance: eb,
    totalDeposits: td,
    totalWithdrawals: tw,
    netExternalContributions: nn,
    investmentPeriodDays: days,
    annualizedReturnPercent: annualizedReturn * 100,
    currency,
    formattedStartingBalance: formatMoney(sb, currency),
    formattedEndingBalance: formatMoney(eb, currency),
    formattedTotalDeposits: formatMoney(td, currency),
    formattedTotalWithdrawals: formatMoney(tw, currency),
    formattedNetExternalContributions: formatMoney(nn, currency),
    formattedAnnualizedReturn: formatPercent(annualizedReturn * 100),
  };
}

/** Annualize a period return over M months: (1+R)^(12/M) − 1 */
export function calculateAnnualizedReturn(
  periodReturnDecimal: number,
  holdingMonths: number,
): number | null {
  if (!Number.isFinite(periodReturnDecimal) || periodReturnDecimal < -1) return null;
  if (!Number.isFinite(holdingMonths) || !(holdingMonths > 0)) return null;
  if (periodReturnDecimal === -1) {
    // Complete loss — annualized is still −100% for any positive horizon.
    return -1;
  }
  const annual = Math.pow(1 + periodReturnDecimal, 12 / holdingMonths) - 1;
  return Number.isFinite(annual) ? annual : null;
}

export function calculateCumulativeReturn(
  periodReturnsDecimal: readonly number[],
): number | null {
  if (periodReturnsDecimal.length === 0) return null;
  let product = 1;
  for (const r of periodReturnsDecimal) {
    if (!Number.isFinite(r) || r < -1) return null;
    product *= 1 + r;
  }
  const cumulative = product - 1;
  return Number.isFinite(cumulative) ? cumulative : null;
}

export function calculateAverageAnnualReturn(
  annualizedReturnsDecimal: readonly number[],
): number | null {
  if (annualizedReturnsDecimal.length === 0) return null;
  if (!annualizedReturnsDecimal.every(Number.isFinite)) return null;
  const sum = annualizedReturnsDecimal.reduce((a, b) => a + b, 0);
  return sum / annualizedReturnsDecimal.length;
}

export function calculateOverallAnnualizedReturn(
  cumulativeReturnDecimal: number,
  totalHoldingMonths: number,
): number | null {
  if (!Number.isFinite(cumulativeReturnDecimal) || cumulativeReturnDecimal < -1) {
    return null;
  }
  if (!Number.isFinite(totalHoldingMonths) || !(totalHoldingMonths > 0)) return null;
  if (cumulativeReturnDecimal === -1) return -1;
  const annual =
    Math.pow(1 + cumulativeReturnDecimal, 12 / totalHoldingMonths) - 1;
  return Number.isFinite(annual) ? annual : null;
}

export function calculateAverageAndCumulative(
  entries: readonly PeriodReturnInput[],
): AverageSectionResult | null {
  if (entries.length === 0) return null;

  const annualized: number[] = [];
  const periodReturns: number[] = [];
  let totalMonths = 0;

  for (const entry of entries) {
    const ann = calculateAnnualizedReturn(
      entry.periodReturnDecimal,
      entry.holdingMonths,
    );
    if (ann === null) return null;
    annualized.push(ann);
    periodReturns.push(entry.periodReturnDecimal);
    totalMonths += entry.holdingMonths;
  }

  const average = calculateAverageAnnualReturn(annualized);
  const cumulative = calculateCumulativeReturn(periodReturns);
  if (average === null || cumulative === null) return null;
  const overall = calculateOverallAnnualizedReturn(cumulative, totalMonths);
  if (overall === null) return null;

  return {
    validEntryCount: entries.length,
    annualizedReturnsPercent: annualized.map((r) => r * 100),
    averageAnnualizedReturnPercent: average * 100,
    cumulativeReturnPercent: cumulative * 100,
    totalHoldingMonths: totalMonths,
    overallAnnualizedReturnPercent: overall * 100,
    formattedAverageAnnualizedReturn: formatPercent(average * 100),
    formattedCumulativeReturn: formatPercent(cumulative * 100),
    formattedOverallAnnualizedReturn: formatPercent(overall * 100),
    formattedAnnualizedReturns: annualized.map((r) => formatPercent(r * 100)),
  };
}

export function shareCashFlowText(
  result: CashFlowSectionResult,
  path = '/tools/average-return-calculator',
): string {
  return [
    'Average Return Calculator: Cash Flow (XIRR) | Omega Calculators',
    '',
    `Starting balance: ${result.formattedStartingBalance} ${result.currency}`,
    `Ending balance: ${result.formattedEndingBalance} ${result.currency}`,
    `Total deposits: ${result.formattedTotalDeposits} ${result.currency}`,
    `Total withdrawals: ${result.formattedTotalWithdrawals} ${result.currency}`,
    `Net external contributions: ${result.formattedNetExternalContributions} ${result.currency}`,
    `Investment period: ${result.investmentPeriodDays} days`,
    `Average annual return (money-weighted): ${result.formattedAnnualizedReturn}%`,
    '',
    'Currency changes formatting only.',
    path,
  ].join('\n');
}

export function shareAverageText(
  result: AverageSectionResult,
  path = '/tools/average-return-calculator',
): string {
  return [
    'Average Return Calculator: Average & Cumulative | Omega Calculators',
    '',
    `Valid periods: ${result.validEntryCount}`,
    `Arithmetic average of annualized returns: ${result.formattedAverageAnnualizedReturn}%`,
    `Cumulative return: ${result.formattedCumulativeReturn}%`,
    `Total holding months: ${result.totalHoldingMonths}`,
    `Overall annualized compounded return: ${result.formattedOverallAnnualizedReturn}%`,
    '',
    path,
  ].join('\n');
}
