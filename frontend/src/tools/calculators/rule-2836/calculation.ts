import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export const FRONT_END_LIMIT = 28;
export const BACK_END_LIMIT = 36;

export function calculateItemizedHousingCosts(
  mortgage: number,
  propertyTaxes: number,
  insurance: number,
  hoa: number,
  other: number
): number | null {
  const parts = [mortgage, propertyTaxes, insurance, hoa, other];
  if (parts.some((v) => !Number.isFinite(v) || v < 0)) return null;
  const total = mortgage + propertyTaxes + insurance + hoa + other;
  return Number.isFinite(total) ? total : null;
}

export function calculateFrontEndRatio(
  housingCosts: number,
  monthlyIncome: number
): number | null {
  if (
    !Number.isFinite(housingCosts) ||
    housingCosts < 0 ||
    !Number.isFinite(monthlyIncome) ||
    monthlyIncome <= 0
  ) {
    return null;
  }
  const result = (housingCosts / monthlyIncome) * 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateTotalMonthlyDebt(
  housingCosts: number,
  otherDebts: number
): number | null {
  if (
    !Number.isFinite(housingCosts) ||
    housingCosts < 0 ||
    !Number.isFinite(otherDebts) ||
    otherDebts < 0
  ) {
    return null;
  }
  const result = housingCosts + otherDebts;
  return Number.isFinite(result) ? result : null;
}

export function calculateBackEndRatio(
  totalMonthlyDebt: number,
  monthlyIncome: number
): number | null {
  if (
    !Number.isFinite(totalMonthlyDebt) ||
    totalMonthlyDebt < 0 ||
    !Number.isFinite(monthlyIncome) ||
    monthlyIncome <= 0
  ) {
    return null;
  }
  const result = (totalMonthlyDebt / monthlyIncome) * 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateGuidelineLimits(
  income: number,
  otherDebts: number
): {
  maximumHousingCosts: number;
  maximumTotalDebt: number;
  housingCapacity: number;
} | null {
  if (
    !Number.isFinite(income) ||
    income <= 0 ||
    !Number.isFinite(otherDebts) ||
    otherDebts < 0
  ) {
    return null;
  }
  const maximumHousingCosts = income * (FRONT_END_LIMIT / 100);
  const maximumTotalDebt = income * (BACK_END_LIMIT / 100);
  const housingCapacity = Math.max(
    0,
    Math.min(maximumHousingCosts, maximumTotalDebt - otherDebts)
  );
  return { maximumHousingCosts, maximumTotalDebt, housingCapacity };
}

export function meetsGuideline(
  ratio: number,
  limit: number
): boolean {
  return Number.isFinite(ratio) && ratio <= limit + 1e-9;
}

export function formatRuleMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRulePercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function interpretRule2836(
  frontEndRatio: number | null,
  backEndRatio: number | null,
  meetsFront: boolean | null,
  meetsBack: boolean | null,
  status: string
): string {
  if (status === 'zeroIncome') {
    return 'Ratios are unavailable because gross monthly income must be greater than zero.';
  }
  if (frontEndRatio === null && backEndRatio === null) {
    return 'Enter gross monthly income, housing costs, and other debts to evaluate the 28/36 guidelines.';
  }
  const parts: string[] = [];
  if (frontEndRatio !== null && meetsFront !== null) {
    parts.push(
      meetsFront
        ? `Front-end ratio ${formatRulePercent(frontEndRatio)}% is within the 28% housing guideline.`
        : `Front-end ratio ${formatRulePercent(frontEndRatio)}% is above the 28% housing guideline.`
    );
  }
  if (backEndRatio !== null && meetsBack !== null) {
    parts.push(
      meetsBack
        ? `Back-end ratio ${formatRulePercent(backEndRatio)}% is within the 36% total-debt guideline.`
        : `Back-end ratio ${formatRulePercent(backEndRatio)}% is above the 36% total-debt guideline.`
    );
  }
  if (meetsFront === true && meetsBack === true) {
    parts.push(
      'Based on the 28/36 guideline, the entered housing expenses and monthly debt payments fall within both suggested limits. Actual mortgage eligibility depends on lender requirements and other circumstances.'
    );
  } else if (meetsFront !== null || meetsBack !== null) {
    parts.push(
      'These are general affordability guidelines, not a mortgage approval decision.'
    );
  }
  return parts.join(' ');
}
