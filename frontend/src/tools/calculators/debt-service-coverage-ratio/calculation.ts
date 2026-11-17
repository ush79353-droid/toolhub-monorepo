import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MoneyFrequency, TermUnit } from './types';

export function formatDscrMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display DSCR with two decimals; never NaN/Infinity. */
export function formatDscr(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ratio);
}

export function termToMonths(term: number, unit: TermUnit): number | null {
  if (!(term > 0) || !Number.isFinite(term)) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!(months > 0) || !Number.isFinite(months)) return null;
  return Math.round(months);
}

/**
 * Convert a recurring money amount into a monthly equivalent.
 * / mo → as-is; / yr → ÷ 12.
 */
export function toMonthlyAmount(
  amount: number,
  frequency: MoneyFrequency
): number | null {
  if (!Number.isFinite(amount)) return null;
  if (frequency === 'mo') return amount;
  if (frequency === 'yr') return amount / 12;
  return null;
}

/**
 * Standard amortizing monthly payment.
 * M = P × r / (1 − (1+r)^(-n)); zero interest → P / n.
 */
export function amortizingMonthlyPayment(input: {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
}): number | null {
  const { principal, annualRatePercent, termMonths } = input;
  if (!(principal > 0) || !(termMonths > 0)) return null;
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;

  const r = annualRatePercent / 1200;
  if (r === 0) {
    const payment = principal / termMonths;
    return Number.isFinite(payment) ? payment : null;
  }

  const denom = 1 - Math.pow(1 + r, -termMonths);
  if (!(denom > 0)) return null;
  const payment = (principal * r) / denom;
  return Number.isFinite(payment) ? payment : null;
}

/**
 * Omni NOI builder: NOI = (1 − expenses%)(1 − vacancy%) × GI
 * expenses/vacancy are percents of gross income (0–100+ allowed mathematically).
 */
export function calculateNoiFromComponents(input: {
  grossIncome: number;
  expensesPercent: number;
  vacancyPercent: number;
}): number | null {
  const { grossIncome, expensesPercent, vacancyPercent } = input;
  if (![grossIncome, expensesPercent, vacancyPercent].every(Number.isFinite)) {
    return null;
  }
  if (grossIncome < 0 || expensesPercent < 0 || vacancyPercent < 0) return null;

  const noi =
    (1 - expensesPercent / 100) * (1 - vacancyPercent / 100) * grossIncome;
  return Number.isFinite(noi) ? noi : null;
}

/**
 * DSCR = monthly NOI / monthly debt service.
 * Debt service must be > 0; never returns NaN/Infinity.
 */
export function calculateDscr(input: {
  monthlyNoi: number;
  monthlyDebtService: number;
}): number | null {
  const { monthlyNoi, monthlyDebtService } = input;
  if (![monthlyNoi, monthlyDebtService].every(Number.isFinite)) return null;
  if (!(monthlyDebtService > 0)) return null;

  const ratio = monthlyNoi / monthlyDebtService;
  return Number.isFinite(ratio) ? ratio : null;
}
