import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CASH_FLOW_FREQUENCY_OPTIONS,
  COMPOUNDING_OPTIONS,
  type CashFlowFrequency,
  type CompoundFrequency,
  type PaymentTiming,
  type RateOfReturnResult,
  type TermUnit,
} from './types';

function formatRatePercent(rate: number): string {
  const rounded = Math.round(rate * 1000) / 1000;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(rounded);
}

export function termToYears(term: number, unit: TermUnit): number {
  return unit === 'yrs' ? term : term / 12;
}

export function compoundingPeriodsPerYear(compounding: CompoundFrequency): number {
  const found = COMPOUNDING_OPTIONS.find((o) => o.value === compounding);
  return found?.periodsPerYear ?? 12;
}

export function cashFlowPeriodsPerYear(frequency: CashFlowFrequency): number {
  const found = CASH_FLOW_FREQUENCY_OPTIONS.find((o) => o.value === frequency);
  return found?.periodsPerYear ?? 12;
}

/**
 * Effective rate per cash-flow period from annual nominal rate r
 * compounded m times per year, with f cash-flow periods per year:
 * i = (1 + r/m)^(m/f) − 1
 */
export function cashFlowPeriodRate(
  annualNominal: number,
  compoundingM: number,
  cashFlowF: number
): number | null {
  if (!(compoundingM > 0) || !(cashFlowF > 0)) return null;
  if (!(annualNominal > -compoundingM)) return null;
  const base = 1 + annualNominal / compoundingM;
  if (!(base > 0) || !Number.isFinite(base)) return null;
  const i = base ** (compoundingM / cashFlowF) - 1;
  return Number.isFinite(i) && i > -1 ? i : null;
}

/**
 * Projected final value given annual nominal rate r.
 * FV = PV × (1+i)^n + PMT × [((1+i)^n − 1) / i] × (beginning ? (1+i) : 1)
 * When PMT = 0 or i = 0, uses the corresponding closed form.
 */
export function projectedFinalValue(
  presentValue: number,
  annualNominal: number,
  years: number,
  compoundingM: number,
  payment: number,
  cashFlowF: number,
  timing: PaymentTiming
): number | null {
  if (![presentValue, annualNominal, years, compoundingM, payment, cashFlowF].every(Number.isFinite)) {
    return null;
  }
  if (!(years >= 0) || !(compoundingM > 0) || !(cashFlowF > 0)) return null;

  const n = years * cashFlowF;
  if (!Number.isFinite(n) || n < 0) return null;

  if (payment === 0) {
    const growth = (1 + annualNominal / compoundingM) ** (compoundingM * years);
    if (!Number.isFinite(growth)) return null;
    return presentValue * growth;
  }

  const i = cashFlowPeriodRate(annualNominal, compoundingM, cashFlowF);
  if (i === null) return null;

  if (i === 0) {
    // Beginning vs end: with zero interest, timing does not change total cash contributed.
    return presentValue + payment * n;
  }

  const growth = (1 + i) ** n;
  if (!Number.isFinite(growth)) return null;
  const annuity = ((growth - 1) / i) * (timing === 'beginning' ? 1 + i : 1);
  if (!Number.isFinite(annuity)) return null;
  return presentValue * growth + payment * annuity;
}

/**
 * Closed form when there are no periodic cash flows:
 * r = m × [(FV/PV)^(1/(m×t)) − 1]
 */
export function rateWithoutCashFlows(
  presentValue: number,
  finalAmount: number,
  years: number,
  compoundingM: number
): number | null {
  if (!(presentValue > 0) || !(finalAmount >= 0) || !(years > 0) || !(compoundingM > 0)) {
    return null;
  }
  const periods = compoundingM * years;
  if (!(periods > 0)) return null;
  const ratio = finalAmount / presentValue;
  if (!(ratio >= 0) || !Number.isFinite(ratio)) return null;
  if (ratio === 0) {
    // All capital lost over a positive term → rate approaches −m (100% loss per period).
    return -compoundingM;
  }
  const periodic = ratio ** (1 / periods) - 1;
  if (!Number.isFinite(periodic)) return null;
  const annual = compoundingM * periodic;
  return Number.isFinite(annual) ? annual : null;
}

function solveAnnualRate(
  presentValue: number,
  finalAmount: number,
  years: number,
  compoundingM: number,
  payment: number,
  cashFlowF: number,
  timing: PaymentTiming
): number | null {
  if (payment === 0) {
    return rateWithoutCashFlows(presentValue, finalAmount, years, compoundingM);
  }

  const f = (r: number) => {
    const fv = projectedFinalValue(
      presentValue,
      r,
      years,
      compoundingM,
      payment,
      cashFlowF,
      timing
    );
    if (fv === null) return Number.NaN;
    return fv - finalAmount;
  };

  // Bracket a root on (-m + eps, high]
  const lowBound = -compoundingM + 1e-9;
  let low = lowBound;
  let high = 10;
  let fLow = f(low);
  let fHigh = f(high);
  if (![fLow, fHigh].every(Number.isFinite)) return null;

  if (fLow * fHigh > 0) {
    let found = false;
    let prevR = low;
    let prevF = fLow;
    for (let i = 1; i <= 200; i += 1) {
      const mid = low + ((high - low) * i) / 200;
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
    if (!found) {
      // Expand high further for large returns
      for (const trial of [20, 50, 100, 500, 1000]) {
        const ft = f(trial);
        if (!Number.isFinite(ft)) continue;
        if (fLow * ft <= 0) {
          high = trial;
          fHigh = ft;
          found = true;
          break;
        }
      }
    }
    if (!found) return null;
  }

  let mid = 0;
  for (let i = 0; i < 100; i += 1) {
    mid = (low + high) / 2;
    const fm = f(mid);
    if (!Number.isFinite(fm)) return null;
    if (Math.abs(fm) < 1e-9 || Math.abs(high - low) < 1e-14) break;
    if (fLow * fm <= 0) {
      high = mid;
      fHigh = fm;
    } else {
      low = mid;
      fLow = fm;
    }
  }

  return Number.isFinite(mid) ? mid : null;
}

export function calculateRateOfReturn(
  initialInvestment: number,
  finalAmount: number,
  term: number,
  termUnit: TermUnit,
  compounding: CompoundFrequency,
  periodicCashFlow: number,
  cashFlowFrequency: CashFlowFrequency,
  paymentTiming: PaymentTiming,
  currency: SupportedCurrency
): RateOfReturnResult | null {
  if (
    ![initialInvestment, finalAmount, term, periodicCashFlow].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(initialInvestment > 0)) return null;
  if (!(finalAmount >= 0)) return null;
  if (!(term > 0)) return null;

  const years = termToYears(term, termUnit);
  if (!(years > 0) || !Number.isFinite(years)) return null;

  const m = compoundingPeriodsPerYear(compounding);
  const f = cashFlowPeriodsPerYear(cashFlowFrequency);
  const annual = solveAnnualRate(
    initialInvestment,
    finalAmount,
    years,
    m,
    periodicCashFlow,
    f,
    paymentTiming
  );
  if (annual === null || !Number.isFinite(annual)) return null;

  const annualRatePercent = annual * 100;
  if (!Number.isFinite(annualRatePercent)) return null;

  return {
    initialInvestment,
    finalAmount,
    termYears: years,
    compounding,
    compoundingPeriodsPerYear: m,
    periodicCashFlow,
    cashFlowFrequency,
    paymentTiming,
    annualRatePercent,
    currency,
    formattedRate: formatRatePercent(annualRatePercent),
  };
}
