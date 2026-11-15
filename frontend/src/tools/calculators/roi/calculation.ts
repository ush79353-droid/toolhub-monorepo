import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  CONTRIBUTION_FREQUENCY_OPTIONS,
  type ContributionFrequency,
  type PeriodUnit,
  type RoiResult,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundPercent(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = roundPercent(value);
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rounded);
}

export function periodToYears(value: number, unit: PeriodUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (unit === 'years') return value;
  return value / 12;
}

export function periodsPerYear(frequency: ContributionFrequency): number {
  return (
    CONTRIBUTION_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 0
  );
}

/** Calendar years between YYYY-MM-DD dates (UTC civil), using 365.25-day years. */
export function yearsBetweenDates(startIso: string, endIso: string): number | null {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return null;
  const ms = end.getTime() - start.getTime();
  if (!(ms > 0)) return null;
  const years = ms / (365.25 * 24 * 60 * 60 * 1000);
  return Number.isFinite(years) && years > 0 ? years : null;
}

function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (![y, mo, d].every(Number.isInteger)) return null;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

/** FV with end-of-period contributions, compounding each contribution period. */
export function futureValueWithContributions(
  principal: number,
  annualRateDecimal: number,
  years: number,
  contribution: number,
  contribPerYear: number
): number | null {
  if (![principal, annualRateDecimal, years, contribution, contribPerYear].every(Number.isFinite)) {
    return null;
  }
  if (principal < 0 || years <= 0 || contribution < 0) return null;
  if (annualRateDecimal < -0.999999) return null;

  if (contribPerYear <= 0 || contribution === 0) {
    const fv = principal * (1 + annualRateDecimal) ** years;
    return Number.isFinite(fv) ? fv : null;
  }

  const n = Math.round(years * contribPerYear);
  if (n <= 0) return null;
  const i = annualRateDecimal / contribPerYear;
  if (!Number.isFinite(i)) return null;

  let fv: number;
  if (Math.abs(i) < 1e-15) {
    fv = principal + contribution * n;
  } else {
    const growth = (1 + i) ** n;
    if (!Number.isFinite(growth)) return null;
    fv = principal * growth + (contribution * (growth - 1)) / i;
  }
  return Number.isFinite(fv) ? fv : null;
}

/** Solve annual rate (decimal) for a target FV with contributions (Newton). */
export function solveAnnualRateForFutureValue(
  principal: number,
  targetFv: number,
  years: number,
  contribution: number,
  contribPerYear: number
): number | null {
  if (![principal, targetFv, years, contribution, contribPerYear].every(Number.isFinite)) {
    return null;
  }
  if (principal < 0 || years <= 0 || contribution < 0 || targetFv < 0) return null;

  if (contribPerYear <= 0 || contribution === 0) {
    if (principal <= 0) return null;
    if (targetFv === 0) return -1;
    const ratio = targetFv / principal;
    if (ratio < 0) return null;
    const rate = ratio ** (1 / years) - 1;
    return Number.isFinite(rate) ? rate : null;
  }

  const totalContrib = contribution * Math.round(years * contribPerYear);
  const deposited = principal + totalContrib;
  if (deposited <= 0 && targetFv === 0) return 0;

  let rate = 0.08;
  for (let iter = 0; iter < 80; iter += 1) {
    const fv = futureValueWithContributions(
      principal,
      rate,
      years,
      contribution,
      contribPerYear
    );
    if (fv === null) return null;
    const err = fv - targetFv;
    if (Math.abs(err) < 1e-7) return rate;

    const bump = Math.max(1e-8, Math.abs(rate) * 1e-6);
    const fvHi = futureValueWithContributions(
      principal,
      rate + bump,
      years,
      contribution,
      contribPerYear
    );
    if (fvHi === null) return null;
    const deriv = (fvHi - fv) / bump;
    if (!Number.isFinite(deriv) || Math.abs(deriv) < 1e-14) return null;
    rate -= err / deriv;
    if (!Number.isFinite(rate) || rate <= -0.999999) return null;
  }
  return null;
}

/**
 * Basic ROI = (Returned − Total Investment) / Total Investment × 100
 * Annualized (no contributions): (Returned / Initial)^(1/years) − 1
 * With contributions: money-weighted IRR of cash flows (period contributions, terminal value).
 */
export function calculateRoi(input: {
  periodValue: number;
  periodUnit: PeriodUnit;
  initialInvestment: number;
  contributionFrequency: ContributionFrequency;
  contributionAmount: number;
  rateOfReturnPercent: number | null;
  returnedAmount: number | null;
  sourceField: 'rate' | 'returned';
  startDate: string;
  endDate: string;
  currency: SupportedCurrency;
}): RoiResult | null {
  const {
    periodValue,
    periodUnit,
    initialInvestment,
    contributionFrequency,
    contributionAmount,
    sourceField,
    startDate,
    endDate,
    currency,
  } = input;

  if (!Number.isFinite(initialInvestment) || initialInvestment <= 0) return null;
  const years = periodToYears(periodValue, periodUnit);
  if (years === null) return null;

  const ppy = periodsPerYear(contributionFrequency);
  const contrib =
    contributionFrequency === 'none' ? 0 : input.contributionAmount;
  if (contributionFrequency !== 'none') {
    if (!Number.isFinite(contrib) || contrib < 0) return null;
  }

  const nContrib = ppy > 0 ? Math.round(years * ppy) : 0;
  const totalContributions = contrib * nContrib;
  const totalInvestment = initialInvestment + totalContributions;
  if (!(totalInvestment > 0)) return null;

  let rateOfReturnPercent: number;
  let returnedAmount: number;

  if (sourceField === 'rate') {
    if (input.rateOfReturnPercent === null || !Number.isFinite(input.rateOfReturnPercent)) {
      return null;
    }
    if (input.rateOfReturnPercent <= -100) return null;
    rateOfReturnPercent = input.rateOfReturnPercent;
    const fv = futureValueWithContributions(
      initialInvestment,
      rateOfReturnPercent / 100,
      years,
      contrib,
      ppy
    );
    if (fv === null) return null;
    returnedAmount = fv;
  } else {
    if (input.returnedAmount === null || !Number.isFinite(input.returnedAmount)) {
      return null;
    }
    if (input.returnedAmount < 0) return null;
    returnedAmount = input.returnedAmount;
    const solved = solveAnnualRateForFutureValue(
      initialInvestment,
      returnedAmount,
      years,
      contrib,
      ppy
    );
    if (solved === null) return null;
    rateOfReturnPercent = solved * 100;
  }

  const totalGainLoss = returnedAmount - totalInvestment;
  const roiPercent = (totalGainLoss / totalInvestment) * 100;
  if (![returnedAmount, totalGainLoss, roiPercent, rateOfReturnPercent].every(Number.isFinite)) {
    return null;
  }

  const annualizedYears = yearsBetweenDates(startDate, endDate);
  let annualizedRoiPercent: number | null = null;
  if (annualizedYears !== null) {
    if (ppy <= 0 || contrib === 0) {
      if (returnedAmount === 0) {
        annualizedRoiPercent = -100;
      } else {
        const growth = returnedAmount / initialInvestment;
        if (growth >= 0) {
          const ann = (growth ** (1 / annualizedYears) - 1) * 100;
          annualizedRoiPercent = Number.isFinite(ann) ? ann : null;
        }
      }
    } else {
      // Money-weighted annualized return via Newton on period rate, then annualize.
      const ann = solveAnnualRateForFutureValue(
        initialInvestment,
        returnedAmount,
        annualizedYears,
        contrib,
        ppy
      );
      annualizedRoiPercent = ann === null ? null : ann * 100;
    }
  }

  const roundedReturned = roundMoney(returnedAmount);
  const roundedGain = roundMoney(totalGainLoss);
  const roundedInvested = roundMoney(totalInvestment);

  return {
    totalInvestment: roundedInvested,
    totalContributions: roundMoney(totalContributions),
    totalGainLoss: roundedGain,
    roiPercent: roundPercent(roiPercent),
    returnedAmount: roundedReturned,
    rateOfReturnPercent: roundPercent(rateOfReturnPercent),
    years,
    annualizedRoiPercent:
      annualizedRoiPercent === null ? null : roundPercent(annualizedRoiPercent),
    annualizedYears,
    currency,
    formattedTotalInvestment: formatMoney(roundedInvested, currency),
    formattedTotalGainLoss: formatMoney(roundedGain, currency),
    formattedReturnedAmount: formatMoney(roundedReturned, currency),
    formattedRoiPercent: formatPercent(roiPercent),
    formattedRateOfReturnPercent: formatPercent(rateOfReturnPercent),
    formattedAnnualizedRoiPercent:
      annualizedRoiPercent === null ? '' : formatPercent(annualizedRoiPercent),
  };
}
