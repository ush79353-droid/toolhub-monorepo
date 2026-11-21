/**
 * Lumpsum Calculator — one-time investment compound growth (educational).
 *
 * FV = PV (1 + r/n)^(n t)   |   continuous: FV = PV e^(r t)
 * Modes solve for PV, FV, r, or t. Inflation: RealFV = FV / (1+i)^t
 * Rates stored as percent points in UI; converted to decimals internally.
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  type CompoundingFrequency,
  type LumpsumInput,
  type LumpsumResult,
  type LumpsumScheduleRow,
  type TermUnit,
} from './types';

const MAX_TERM_YEARS = 100;
const RATE_EPS = 1e-15;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function scale(currency: SupportedCurrency): number {
  return 10 ** getCurrencyFractionDigits(currency);
}

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const s = scale(currency);
  return Math.round(amount * s) / s;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function formatPercent(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  })}%`;
}

export function periodsPerYear(
  frequency: CompoundingFrequency,
): number | null {
  const row = COMPOUNDING_OPTIONS.find((o) => o.value === frequency);
  return row ? row.periodsPerYear : null;
}

export function termToYears(value: number, unit: TermUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return unit === 'months' ? value / 12 : value;
}

export function calculateFutureValue(
  pv: number,
  annualReturnPercent: number,
  termYears: number,
  frequency: CompoundingFrequency,
): number | null {
  if (![pv, annualReturnPercent, termYears].every(Number.isFinite)) return null;
  if (pv < 0 || termYears < 0) return null;
  if (termYears === 0) return pv;
  const r = annualReturnPercent / 100;
  if (frequency === 'continuously') {
    const fv = pv * Math.exp(r * termYears);
    return Number.isFinite(fv) ? fv : null;
  }
  const n = periodsPerYear(frequency);
  if (n == null || n <= 0) return null;
  const base = 1 + r / n;
  if (!(base > 0)) return null;
  const fv = pv * base ** (n * termYears);
  return Number.isFinite(fv) ? fv : null;
}

export function calculateInitialLumpsum(
  fv: number,
  annualReturnPercent: number,
  termYears: number,
  frequency: CompoundingFrequency,
): number | null {
  if (![fv, annualReturnPercent, termYears].every(Number.isFinite)) return null;
  if (fv < 0 || termYears < 0) return null;
  if (termYears === 0) return fv;
  const r = annualReturnPercent / 100;
  if (frequency === 'continuously') {
    const pv = fv * Math.exp(-r * termYears);
    return Number.isFinite(pv) ? pv : null;
  }
  const n = periodsPerYear(frequency);
  if (n == null || n <= 0) return null;
  const base = 1 + r / n;
  if (!(base > 0)) return null;
  const pv = fv / base ** (n * termYears);
  return Number.isFinite(pv) ? pv : null;
}

export function calculateRequiredReturn(
  pv: number,
  fv: number,
  termYears: number,
  frequency: CompoundingFrequency,
): number | null {
  if (![pv, fv, termYears].every(Number.isFinite)) return null;
  if (pv <= 0 || fv <= 0 || termYears <= 0) return null;
  if (frequency === 'continuously') {
    const r = Math.log(fv / pv) / termYears;
    return Number.isFinite(r) ? r * 100 : null;
  }
  const n = periodsPerYear(frequency);
  if (n == null || n <= 0) return null;
  const ratio = fv / pv;
  const power = 1 / (n * termYears);
  const inner = ratio ** power;
  if (!Number.isFinite(inner) || inner <= 0) return null;
  const r = n * (inner - 1);
  return Number.isFinite(r) ? r * 100 : null;
}

export function calculateInvestmentTerm(
  pv: number,
  fv: number,
  annualReturnPercent: number,
  frequency: CompoundingFrequency,
): number | null {
  if (![pv, fv, annualReturnPercent].every(Number.isFinite)) return null;
  if (pv <= 0 || fv <= 0) return null;
  if (Math.abs(fv - pv) < RATE_EPS) return 0;
  const r = annualReturnPercent / 100;
  if (frequency === 'continuously') {
    if (Math.abs(r) < RATE_EPS) return null;
    // Growth needed but r ≤ 0 and FV > PV → unreachable
    if (fv > pv && r <= 0) return null;
    if (fv < pv && r >= 0) return null;
    const t = Math.log(fv / pv) / r;
    return Number.isFinite(t) && t >= 0 ? t : null;
  }
  const n = periodsPerYear(frequency);
  if (n == null || n <= 0) return null;
  const base = 1 + r / n;
  if (!(base > 0) || Math.abs(base - 1) < RATE_EPS) {
    // r ≈ 0
    return fv === pv ? 0 : null;
  }
  if (fv > pv && base <= 1) return null;
  if (fv < pv && base >= 1) return null;
  const t = Math.log(fv / pv) / (n * Math.log(base));
  return Number.isFinite(t) && t >= 0 ? t : null;
}

export function calculateEffectiveAnnualRate(
  annualReturnPercent: number,
  frequency: CompoundingFrequency,
): number | null {
  if (!Number.isFinite(annualReturnPercent)) return null;
  const r = annualReturnPercent / 100;
  if (frequency === 'continuously') {
    const ear = Math.exp(r) - 1;
    return Number.isFinite(ear) ? ear * 100 : null;
  }
  const n = periodsPerYear(frequency);
  if (n == null || n <= 0) return null;
  const base = 1 + r / n;
  if (!(base > 0)) return null;
  const ear = base ** n - 1;
  return Number.isFinite(ear) ? ear * 100 : null;
}

export function calculateInflationAdjustedValue(
  fv: number,
  inflationPercent: number,
  termYears: number,
): number | null {
  if (![fv, inflationPercent, termYears].every(Number.isFinite)) return null;
  if (fv < 0 || termYears < 0) return null;
  if (inflationPercent <= -100) return null;
  if (termYears === 0) return fv;
  const i = inflationPercent / 100;
  const denom = (1 + i) ** termYears;
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const real = fv / denom;
  return Number.isFinite(real) ? real : null;
}

export function calculateInvestmentEndDate(
  startDateIso: string,
  termYears: number,
): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDateIso)) return null;
  if (!Number.isFinite(termYears) || termYears < 0) return null;
  const [ys, ms, ds] = startDateIso.split('-').map(Number);
  if (ys == null || ms == null || ds == null) return null;
  const totalMonths = termYears * 12;
  const wholeMonths = Math.floor(totalMonths + 1e-10);
  const fracMonth = totalMonths - wholeMonths;
  const d = new Date(Date.UTC(ys, ms - 1, ds, 12, 0, 0));
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCMonth(d.getUTCMonth() + wholeMonths);
  d.setUTCDate(d.getUTCDate() + Math.round(fracMonth * 30.436875));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function calculateInvestmentGrowthSchedule(
  pv: number,
  annualReturnPercent: number,
  termYears: number,
  frequency: CompoundingFrequency,
  inflationPercent: number,
  currency: SupportedCurrency,
): LumpsumScheduleRow[] | null {
  if (termYears <= 0) return [];
  const years = Math.ceil(termYears - 1e-12);
  if (years > MAX_TERM_YEARS) return null;
  const rows: LumpsumScheduleRow[] = [];
  let opening = pv;
  for (let y = 1; y <= years; y++) {
    const span = Math.min(1, termYears - (y - 1));
    const closing = calculateFutureValue(
      opening,
      annualReturnPercent,
      span,
      frequency,
    );
    if (closing == null) return null;
    const elapsed = Math.min(y, termYears);
    const real = calculateInflationAdjustedValue(
      closing,
      inflationPercent,
      elapsed,
    );
    if (real == null) return null;
    rows.push({
      year: y,
      openingBalance: roundMoney(opening, currency),
      returns: roundMoney(closing - opening, currency),
      closingBalance: roundMoney(closing, currency),
      inflationAdjustedBalance: roundMoney(real, currency),
    });
    opening = closing;
  }
  return rows;
}

function modePrimaryLabel(
  mode: LumpsumInput['mode'],
): string {
  switch (mode) {
    case 'initial-lumpsum':
      return 'Required Initial Lumpsum';
    case 'final-balance':
      return 'Estimated Final Balance';
    case 'expected-return':
      return 'Required Annual Return';
    case 'investment-term':
      return 'Required Investment Term';
  }
}

export function calculateLumpsumFromInput(
  input: LumpsumInput,
): LumpsumResult | null {
  const inflationRate = num(input.inflationRate);
  if (inflationRate == null || inflationRate <= -100) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) return null;

  const { currency, mode, compoundingFrequency } = input;
  let pv: number | null = null;
  let fv: number | null = null;
  let rPercent: number | null = null;
  let termYears: number | null = null;

  if (mode === 'initial-lumpsum') {
    fv = num(input.targetAmount);
    rPercent = num(input.annualReturn);
    const tv = num(input.termValue);
    if (fv == null || rPercent == null || tv == null) return null;
    if (fv < 0 || tv <= 0) return null;
    termYears = termToYears(tv, input.termUnit);
    if (termYears == null || termYears <= 0 || termYears > MAX_TERM_YEARS) {
      return null;
    }
    pv = calculateInitialLumpsum(fv, rPercent, termYears, compoundingFrequency);
  } else if (mode === 'final-balance') {
    pv = num(input.initialInvestment);
    rPercent = num(input.annualReturn);
    const tv = num(input.termValue);
    if (pv == null || rPercent == null || tv == null) return null;
    if (pv < 0 || tv <= 0) return null;
    termYears = termToYears(tv, input.termUnit);
    if (termYears == null || termYears <= 0 || termYears > MAX_TERM_YEARS) {
      return null;
    }
    fv = calculateFutureValue(pv, rPercent, termYears, compoundingFrequency);
  } else if (mode === 'expected-return') {
    pv = num(input.initialInvestment);
    fv = num(input.targetAmount);
    const tv = num(input.termValue);
    if (pv == null || fv == null || tv == null) return null;
    if (pv <= 0 || fv <= 0 || tv <= 0) return null;
    termYears = termToYears(tv, input.termUnit);
    if (termYears == null || termYears <= 0 || termYears > MAX_TERM_YEARS) {
      return null;
    }
    rPercent = calculateRequiredReturn(
      pv,
      fv,
      termYears,
      compoundingFrequency,
    );
  } else {
    pv = num(input.initialInvestment);
    fv = num(input.targetAmount);
    rPercent = num(input.annualReturn);
    if (pv == null || fv == null || rPercent == null) return null;
    if (pv <= 0 || fv <= 0) return null;
    termYears = calculateInvestmentTerm(
      pv,
      fv,
      rPercent,
      compoundingFrequency,
    );
    if (termYears == null || termYears > MAX_TERM_YEARS) return null;
  }

  if (pv == null || fv == null || rPercent == null || termYears == null) {
    return null;
  }
  if (![pv, fv, rPercent, termYears].every(Number.isFinite)) return null;

  const ear = calculateEffectiveAnnualRate(rPercent, compoundingFrequency);
  if (ear == null) return null;
  const realFv = calculateInflationAdjustedValue(fv, inflationRate, termYears);
  if (realFv == null) return null;
  const endDate = calculateInvestmentEndDate(input.startDate, termYears);
  if (!endDate) return null;

  const schedule = calculateInvestmentGrowthSchedule(
    pv,
    rPercent,
    termYears,
    compoundingFrequency,
    inflationRate,
    currency,
  );
  if (!schedule) return null;

  // Reconcile final schedule row with FV
  if (schedule.length > 0) {
    const last = schedule[schedule.length - 1]!;
    last.closingBalance = roundMoney(fv, currency);
    last.returns = roundMoney(fv - last.openingBalance, currency);
    last.inflationAdjustedBalance = roundMoney(realFv, currency);
  }

  const totalReturns = fv - pv;
  const inflationImpact = fv - realFv;
  const realGain = realFv - pv;
  const termMonths = termYears * 12;

  let primaryValue: number;
  let formattedPrimary: string;
  if (mode === 'expected-return') {
    primaryValue = rPercent;
    formattedPrimary = formatPercent(rPercent, 4);
  } else if (mode === 'investment-term') {
    primaryValue = termYears;
    formattedPrimary = `${termYears.toLocaleString('en-US', {
      maximumFractionDigits: 4,
    })} years (${termMonths.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })} months)`;
  } else if (mode === 'initial-lumpsum') {
    primaryValue = pv;
    formattedPrimary = money(pv, currency);
  } else {
    primaryValue = fv;
    formattedPrimary = money(fv, currency);
  }

  const steps = [
    `Mode: ${modePrimaryLabel(mode)}`,
    `Compounding: ${compoundingFrequency} (n=${periodsPerYear(compoundingFrequency) ?? 'continuous'})`,
    `PV = ${money(pv, currency)}`,
    `FV = ${money(fv, currency)}`,
    `Nominal r = ${formatPercent(rPercent)} / year`,
    `Term t = ${termYears.toFixed(6)} years`,
    `EAR = ${formatPercent(ear)}`,
    `Inflation i = ${formatPercent(inflationRate)} → real FV ${money(realFv, currency)}`,
    `End date ≈ ${endDate}`,
  ];

  const formulaBreakdown = [
    'FV = PV (1 + r/n)^(n t)   |   continuous: FV = PV e^(r t)',
    'PV = FV / (1 + r/n)^(n t)   |   continuous: PV = FV e^(-r t)',
    'r = n [(FV/PV)^(1/(n t)) − 1]   |   continuous: r = ln(FV/PV)/t',
    't = ln(FV/PV) / (n ln(1+r/n))   |   continuous: t = ln(FV/PV)/r',
    'RealFV = FV / (1+i)^t',
    'EAR = (1+r/n)^n − 1   |   continuous: e^r − 1',
  ].join('\n');

  const interpretation =
    mode === 'initial-lumpsum'
      ? `To reach ${money(fv, currency)} in ${termYears.toFixed(2)} years at ${formatPercent(rPercent)} nominal (${compoundingFrequency}), you need about ${money(pv, currency)} today.`
      : mode === 'final-balance'
        ? `Investing ${money(pv, currency)} for ${termYears.toFixed(2)} years at ${formatPercent(rPercent)} (${compoundingFrequency}) grows to about ${money(fv, currency)}.`
        : mode === 'expected-return'
          ? `Growing ${money(pv, currency)} to ${money(fv, currency)} in ${termYears.toFixed(2)} years (${compoundingFrequency}) requires about ${formatPercent(rPercent)} nominal annual return.`
          : `At ${formatPercent(rPercent)} (${compoundingFrequency}), ${money(pv, currency)} reaches ${money(fv, currency)} in about ${termYears.toFixed(4)} years.`;

  const explanation =
    'Educational projection using compound interest. Expected returns and inflation are assumptions, not guarantees. Weekly uses 52 periods/year and daily uses 365. Real values are purchasing power in start-date currency units.';

  return {
    currency,
    mode,
    initialInvestment: roundMoney(pv, currency),
    finalBalance: roundMoney(fv, currency),
    totalReturns: roundMoney(totalReturns, currency),
    investmentTermYears: termYears,
    investmentTermMonths: termMonths,
    nominalAnnualReturn: rPercent,
    effectiveAnnualReturn: ear,
    inflationRate,
    inflationAdjustedBalance: roundMoney(realFv, currency),
    inflationImpact: roundMoney(inflationImpact, currency),
    realGain: roundMoney(realGain, currency),
    compoundingFrequency,
    startDate: input.startDate,
    endDate,
    schedule,
    primaryLabel: modePrimaryLabel(mode),
    primaryValue,
    formattedPrimary,
    formattedFinalBalance: money(fv, currency),
    formattedInitial: money(pv, currency),
    formattedReturns: money(totalReturns, currency),
    formattedRealBalance: money(realFv, currency),
    steps,
    formulaBreakdown,
    interpretation,
    explanation,
  };
}
