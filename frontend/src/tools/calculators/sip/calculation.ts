import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * SIP future value (ordinary annuity, end-of-month contributions):
 *   i = r / 12 / 100
 *   n = t × 12
 *   FV = P × [((1+i)^n − 1) / i] × (1+i)   when i ≠ 0
 *   FV = P × n                              when i = 0
 * Total investment = P × n
 * Factor = FV / Total investment
 */
export function calculateSip(input: {
  monthlyAmount: number;
  years: number;
  annualReturnPercent: number;
}): {
  totalInvestment: number;
  maturityAmount: number;
  multiplicationFactor: number;
} | null {
  const { monthlyAmount, years, annualReturnPercent } = input;
  if (![monthlyAmount, years, annualReturnPercent].every(Number.isFinite)) {
    return null;
  }
  if (monthlyAmount < 0 || years <= 0 || annualReturnPercent < 0) return null;

  const n = years * 12;
  if (!(n > 0) || !Number.isFinite(n)) return null;

  const totalInvestment = monthlyAmount * n;
  if (!Number.isFinite(totalInvestment)) return null;

  const i = annualReturnPercent / 12 / 100;
  let maturityAmount: number;
  if (i === 0) {
    maturityAmount = totalInvestment;
  } else {
    const growth = Math.pow(1 + i, n);
    if (!Number.isFinite(growth)) return null;
    maturityAmount = monthlyAmount * ((growth - 1) / i) * (1 + i);
  }
  if (!Number.isFinite(maturityAmount)) return null;

  const multiplicationFactor =
    totalInvestment === 0 ? 1 : maturityAmount / totalInvestment;
  if (!Number.isFinite(multiplicationFactor)) return null;

  return { totalInvestment, maturityAmount, multiplicationFactor };
}

export function formatSipMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatSipFactor(factor: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(factor);
}
