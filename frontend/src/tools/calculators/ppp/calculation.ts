/**
 * PPP salary: S_B = S_A × (PPP_B / PPP_A)
 * Bilateral PPP rate: E_PPP = PPP_B / PPP_A  (target LCU per 1 source LCU)
 * Market: S_market = S_A × E_M
 * Relative price level: R = E_PPP / E_M  (same quotation direction)
 * Dataset: World Bank WDI GDP PPP (PA.NUS.PPP) — not consumption PPP.
 */

export function toAnnualSalary(
  salary: number,
  period: 'yearly' | 'monthly'
): number | null {
  if (!Number.isFinite(salary) || salary < 0) return null;
  return period === 'monthly' ? salary * 12 : salary;
}

export function fromAnnualToPeriod(
  annual: number,
  period: 'yearly' | 'monthly'
): number {
  return period === 'monthly' ? annual / 12 : annual;
}

export function calculateInternationalDollarValue(
  salary: number,
  sourcePPP: number
): number | null {
  if (
    !Number.isFinite(salary) ||
    !Number.isFinite(sourcePPP) ||
    salary < 0 ||
    sourcePPP <= 0
  ) {
    return null;
  }
  return salary / sourcePPP;
}

export function calculatePPPSalary(args: {
  salary: number;
  sourcePPP: number;
  targetPPP: number;
}): number | null {
  const { salary, sourcePPP, targetPPP } = args;
  if (
    !Number.isFinite(salary) ||
    !Number.isFinite(sourcePPP) ||
    !Number.isFinite(targetPPP) ||
    salary < 0 ||
    sourcePPP <= 0 ||
    targetPPP <= 0
  ) {
    return null;
  }
  return salary * (targetPPP / sourcePPP);
}

export function calculateBilateralPPPRate(args: {
  sourcePPP: number;
  targetPPP: number;
}): number | null {
  const { sourcePPP, targetPPP } = args;
  if (
    !Number.isFinite(sourcePPP) ||
    !Number.isFinite(targetPPP) ||
    sourcePPP <= 0 ||
    targetPPP <= 0
  ) {
    return null;
  }
  return targetPPP / sourcePPP;
}

export function calculateMarketConvertedSalary(args: {
  salary: number;
  marketExchangeRate: number;
}): number | null {
  const { salary, marketExchangeRate } = args;
  if (
    !Number.isFinite(salary) ||
    !Number.isFinite(marketExchangeRate) ||
    salary < 0 ||
    marketExchangeRate <= 0
  ) {
    return null;
  }
  return salary * marketExchangeRate;
}

export function calculateRelativePriceLevel(args: {
  pppExchangeRate: number;
  marketExchangeRate: number;
}): number | null {
  const { pppExchangeRate, marketExchangeRate } = args;
  if (
    !Number.isFinite(pppExchangeRate) ||
    !Number.isFinite(marketExchangeRate) ||
    pppExchangeRate <= 0 ||
    marketExchangeRate <= 0
  ) {
    return null;
  }
  return pppExchangeRate / marketExchangeRate;
}

/** Official FX is LCU per USD → target LCU per 1 source LCU */
export function bilateralMarketFromUsdLegs(
  sourceLcuPerUsd: number,
  targetLcuPerUsd: number
): number | null {
  if (
    !Number.isFinite(sourceLcuPerUsd) ||
    !Number.isFinite(targetLcuPerUsd) ||
    sourceLcuPerUsd <= 0 ||
    targetLcuPerUsd <= 0
  ) {
    return null;
  }
  return targetLcuPerUsd / sourceLcuPerUsd;
}

export function formatMoney(amount: number, currency: string, digits = 2): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: /^[A-Z]{3}$/.test(currency) ? currency : 'USD',
      currencyDisplay: 'code',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `${amount.toFixed(digits)} ${currency}`;
  }
}

export function formatRate(value: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function formatPppFactor(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
