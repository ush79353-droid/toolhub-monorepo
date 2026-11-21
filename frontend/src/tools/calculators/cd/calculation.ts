import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  CD_COMPOUNDING_OPTIONS,
  type CdCompounding,
  type CdRateConvention,
  type CdResult,
  type CdScheduleEntry,
} from './types';

export function periodsPerYear(compounding: CdCompounding): number {
  return CD_COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 1;
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

/** APY = (1 + r/n)^n − 1 */
export function nominalToApy(nominalDecimal: number, n: number): number {
  if (!Number.isFinite(nominalDecimal) || !Number.isFinite(n) || n <= 0) return Number.NaN;
  if (nominalDecimal === 0) return 0;
  return (1 + nominalDecimal / n) ** n - 1;
}

/** r = n × ((1 + APY)^(1/n) − 1) */
export function apyToNominal(apyDecimal: number, n: number): number {
  if (!Number.isFinite(apyDecimal) || !Number.isFinite(n) || n <= 0) return Number.NaN;
  if (apyDecimal === 0) return 0;
  return n * ((1 + apyDecimal) ** (1 / n) - 1);
}

export function resolveNominalRate(
  ratePercent: number,
  convention: CdRateConvention,
  compounding: CdCompounding,
): { nominalDecimal: number; apyDecimal: number } | null {
  const entered = ratePercent / 100;
  const n = periodsPerYear(compounding);
  if (!Number.isFinite(entered) || entered < 0 || n <= 0) return null;
  if (convention === 'nominal') {
    const apyDecimal = nominalToApy(entered, n);
    if (!Number.isFinite(apyDecimal)) return null;
    return { nominalDecimal: entered, apyDecimal };
  }
  const nominalDecimal = apyToNominal(entered, n);
  if (!Number.isFinite(nominalDecimal)) return null;
  return { nominalDecimal, apyDecimal: entered };
}

/**
 * Balance after `yearsElapsed` using A = P × (1 + r/n)^(n × t).
 * Supports fractional t (partial periods). Bank day-count rules may differ.
 */
export function balanceAtYears(
  principal: number,
  nominalDecimal: number,
  compoundsPerYear: number,
  yearsElapsed: number,
): number {
  if (
    ![principal, nominalDecimal, compoundsPerYear, yearsElapsed].every(Number.isFinite)
  ) {
    return Number.NaN;
  }
  if (principal < 0 || compoundsPerYear <= 0 || yearsElapsed < 0) return Number.NaN;
  if (yearsElapsed === 0) return principal;
  if (nominalDecimal === 0) return principal;
  const base = 1 + nominalDecimal / compoundsPerYear;
  if (!(base > 0)) return Number.NaN;
  return principal * base ** (compoundsPerYear * yearsElapsed);
}

function durationLabel(years: number, months: number): string {
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`);
  if (months > 0) parts.push(`${months} month${months === 1 ? '' : 's'}`);
  return parts.join(', ') || '0';
}

function buildSchedule(params: {
  principal: number;
  nominalDecimal: number;
  compoundsPerYear: number;
  durationYears: number;
  stepYears: number;
  labelPrefix: string;
  currency: SupportedCurrency;
}): CdScheduleEntry[] {
  const {
    principal,
    nominalDecimal,
    compoundsPerYear,
    durationYears,
    stepYears,
    labelPrefix,
    currency,
  } = params;

  if (!(durationYears > 0) || !(stepYears > 0)) return [];

  const rows: CdScheduleEntry[] = [];
  let previous = principal;
  let period = 0;
  let elapsed = 0;

  while (elapsed < durationYears - 1e-12) {
    period += 1;
    const nextElapsed = Math.min(durationYears, elapsed + stepYears);
    const ending = balanceAtYears(
      principal,
      nominalDecimal,
      compoundsPerYear,
      nextElapsed,
    );
    if (!Number.isFinite(ending)) return [];

    const interest = ending - previous;
    const deposit = period === 1 ? principal : 0;
    const endingRounded = roundMoney(ending, currency);
    const interestRounded = roundMoney(interest, currency);
    const depositRounded = roundMoney(deposit, currency);
    const accumulatedInterest = roundMoney(ending - principal, currency);

    rows.push({
      period,
      label: `${labelPrefix} ${period}`,
      deposit: depositRounded,
      interest: interestRounded,
      endingBalance: endingRounded,
      principal: roundMoney(principal, currency),
      accumulatedInterest,
    });

    previous = ending;
    elapsed = nextElapsed;
  }

  // Reconcile last row to exact maturity balance (presentation rounding).
  if (rows.length > 0) {
    const maturity = roundMoney(
      balanceAtYears(principal, nominalDecimal, compoundsPerYear, durationYears),
      currency,
    );
    const last = rows[rows.length - 1]!;
    const priorEnding =
      rows.length > 1 ? rows[rows.length - 2]!.endingBalance : roundMoney(principal, currency);
    last.endingBalance = maturity;
    last.interest = roundMoney(maturity - priorEnding, currency);
    last.accumulatedInterest = roundMoney(maturity - principal, currency);
  }

  return rows;
}

export function generateAnnualCdSchedule(params: {
  principal: number;
  nominalDecimal: number;
  compoundsPerYear: number;
  durationYears: number;
  currency: SupportedCurrency;
}): CdScheduleEntry[] {
  return buildSchedule({
    ...params,
    stepYears: 1,
    labelPrefix: 'Year',
  });
}

export function generateMonthlyCdSchedule(params: {
  principal: number;
  nominalDecimal: number;
  compoundsPerYear: number;
  durationYears: number;
  currency: SupportedCurrency;
}): CdScheduleEntry[] {
  return buildSchedule({
    ...params,
    stepYears: 1 / 12,
    labelPrefix: 'Month',
  });
}

export function calculateCd(input: {
  initialDeposit: number;
  interestRatePercent: number;
  rateConvention: CdRateConvention;
  compounding: CdCompounding;
  depositYears: number;
  depositMonths: number;
  marginalTaxRatePercent: number;
  currency: SupportedCurrency;
}): CdResult | null {
  const {
    initialDeposit,
    interestRatePercent,
    rateConvention,
    compounding,
    depositYears,
    depositMonths,
    marginalTaxRatePercent,
    currency,
  } = input;

  if (
    ![
      initialDeposit,
      interestRatePercent,
      depositYears,
      depositMonths,
      marginalTaxRatePercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(initialDeposit > 0)) return null;
  if (interestRatePercent < 0 || interestRatePercent > 1000) return null;
  if (depositYears < 0 || depositMonths < 0 || depositMonths > 11) return null;
  if (marginalTaxRatePercent < 0 || marginalTaxRatePercent > 100) return null;

  const durationYears = depositYears + depositMonths / 12;
  if (!(durationYears > 0)) return null;

  const rates = resolveNominalRate(interestRatePercent, rateConvention, compounding);
  if (!rates) return null;

  const n = periodsPerYear(compounding);
  const grossRaw = balanceAtYears(
    initialDeposit,
    rates.nominalDecimal,
    n,
    durationYears,
  );
  if (!Number.isFinite(grossRaw)) return null;

  const grossFinalBalance = roundMoney(grossRaw, currency);
  const grossInterest = roundMoney(grossFinalBalance - initialDeposit, currency);
  const estimatedTax = roundMoney(grossInterest * (marginalTaxRatePercent / 100), currency);
  const netInterest = roundMoney(grossInterest - estimatedTax, currency);
  const afterTaxBalance = roundMoney(initialDeposit + netInterest, currency);

  const total = grossFinalBalance > 0 ? grossFinalBalance : 1;
  const principalSharePercent = (initialDeposit / total) * 100;
  const interestSharePercent = (Math.max(0, grossInterest) / total) * 100;

  const scheduleParams = {
    principal: initialDeposit,
    nominalDecimal: rates.nominalDecimal,
    compoundsPerYear: n,
    durationYears,
    currency,
  };

  return {
    initialDeposit: roundMoney(initialDeposit, currency),
    interestRatePercent,
    rateConvention,
    compounding,
    periodsPerYear: n,
    depositYears,
    depositMonths,
    durationYears,
    durationLabel: durationLabel(depositYears, depositMonths),
    nominalRatePercent: rates.nominalDecimal * 100,
    effectiveApyPercent: rates.apyDecimal * 100,
    grossFinalBalance,
    grossInterest,
    estimatedTax,
    netInterest,
    afterTaxBalance,
    principalSharePercent,
    interestSharePercent,
    annualSchedule: generateAnnualCdSchedule(scheduleParams),
    monthlySchedule: generateMonthlyCdSchedule(scheduleParams),
    currency,
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function formatPercent(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function shareCdText(result: CdResult): string {
  const compoundingLabel =
    CD_COMPOUNDING_OPTIONS.find((o) => o.value === result.compounding)?.label ??
    result.compounding;
  return [
    'CD Calculator — Omega Calculators',
    `Initial deposit: ${formatMoney(result.initialDeposit, result.currency)} ${result.currency}`,
    `Interest rate: ${formatPercent(result.interestRatePercent)}% (${result.rateConvention === 'apy' ? 'APY' : 'nominal APR'})`,
    `Compounding: ${compoundingLabel}`,
    `Deposit length: ${result.durationLabel}`,
    `Effective APY: ${formatPercent(result.effectiveApyPercent, 4)}%`,
    `End balance (gross): ${formatMoney(result.grossFinalBalance, result.currency)}`,
    `Total interest (gross): ${formatMoney(result.grossInterest, result.currency)}`,
    `Estimated tax: ${formatMoney(result.estimatedTax, result.currency)}`,
    `After-tax balance: ${formatMoney(result.afterTaxBalance, result.currency)}`,
  ].join('\n');
}
