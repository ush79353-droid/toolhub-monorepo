import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface EvaMathInput {
  nopat: number;
  investedCapital: number;
  waccPercent: number;
}

export interface EvaMathResult {
  eva: number;
  capitalCharge: number;
  waccDecimal: number;
}

/**
 * EVA = NOPAT − (Invested Capital × WACC)
 * WACC input is a percent; convert to decimal for the capital charge.
 */
export function calculateEva(input: EvaMathInput): EvaMathResult | null {
  const { nopat, investedCapital, waccPercent } = input;

  if (
    !Number.isFinite(nopat) ||
    !Number.isFinite(investedCapital) ||
    !Number.isFinite(waccPercent)
  ) {
    return null;
  }
  if (investedCapital < 0) return null;
  if (waccPercent < 0 || waccPercent > 100) return null;

  const waccDecimal = waccPercent / 100;
  const capitalCharge = investedCapital * waccDecimal;
  const eva = nopat - capitalCharge;

  if (!Number.isFinite(capitalCharge) || !Number.isFinite(eva)) {
    return null;
  }

  return { eva, capitalCharge, waccDecimal };
}

/**
 * Invested capital (operating approach) = Operating Assets − Operating Liabilities
 */
export function calculateInvestedCapital(
  operatingAssets: number,
  operatingLiabilities: number
): number | null {
  if (
    !Number.isFinite(operatingAssets) ||
    !Number.isFinite(operatingLiabilities)
  ) {
    return null;
  }
  if (operatingAssets < 0 || operatingLiabilities < 0) return null;

  const investedCapital = operatingAssets - operatingLiabilities;
  if (!Number.isFinite(investedCapital) || investedCapital < 0) {
    return null;
  }
  return investedCapital;
}

export function formatEvaMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatWaccPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function interpretEva(
  eva: number,
  capitalCharge: number,
  symbol: string,
  currency: SupportedCurrency
): string {
  const charge = `${symbol}${formatEvaMoney(capitalCharge, currency)}`;
  const amount = `${symbol}${formatEvaMoney(eva, currency)}`;
  if (eva > 0) {
    return `Positive EVA of ${amount}: operating profit exceeds the capital charge of ${charge}.`;
  }
  if (eva < 0) {
    return `Negative EVA of ${amount}: operating profit is below the capital charge of ${charge}.`;
  }
  return `Zero EVA: operating profit exactly covers the capital charge of ${charge}.`;
}
