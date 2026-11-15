import type { MoneyFactorResult, MoneyFactorSourceField } from './types';

/** Lease money-factor conversion: MF = APR% / 2400; APR% = MF × 2400 */
export const MONEY_FACTOR_DIVISOR = 2400;

function formatInterestRate(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(Number(value.toFixed(8)));
}

/** Keep enough precision for lease money factors such as 0.00250 */
function formatMoneyFactor(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const fixed = value.toFixed(8);
  const trimmed = fixed.replace(/\.?0+$/, '');
  return trimmed === '-0' ? '0' : trimmed;
}

export function calculateFromInterestRate(interestRatePercent: number): MoneyFactorResult | null {
  if (!Number.isFinite(interestRatePercent) || interestRatePercent < 0) return null;
  const moneyFactor = interestRatePercent / MONEY_FACTOR_DIVISOR;
  if (!Number.isFinite(moneyFactor)) return null;
  return {
    interestRatePercent,
    moneyFactor,
    formattedInterestRate: formatInterestRate(interestRatePercent),
    formattedMoneyFactor: formatMoneyFactor(moneyFactor),
  };
}

export function calculateFromMoneyFactor(moneyFactor: number): MoneyFactorResult | null {
  if (!Number.isFinite(moneyFactor) || moneyFactor < 0) return null;
  const interestRatePercent = moneyFactor * MONEY_FACTOR_DIVISOR;
  if (!Number.isFinite(interestRatePercent)) return null;
  return {
    interestRatePercent,
    moneyFactor,
    formattedInterestRate: formatInterestRate(interestRatePercent),
    formattedMoneyFactor: formatMoneyFactor(moneyFactor),
  };
}

export function calculateMoneyFactor(
  sourceField: MoneyFactorSourceField,
  value: number
): MoneyFactorResult | null {
  return sourceField === 'interestRate'
    ? calculateFromInterestRate(value)
    : calculateFromMoneyFactor(value);
}
