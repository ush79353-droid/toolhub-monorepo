/**
 * Defensive Interval Ratio Calculator — pure engine (ADR-018).
 *
 * DA = C + MS + AR
 * ACE = OE − NCE
 * DCE = ACE / 365
 * DIR = DA / DCE  (days)
 *
 * Reverse:
 *   DA = DIR × DCE
 *   DCE = DA / DIR
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  DefensiveIntervalRatioInput,
  DefensiveIntervalRatioResult,
} from './types';
import { DAYS_PER_YEAR } from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateDefensiveAssets(
  cash: number,
  securities: number,
  receivables: number,
): number | null {
  if (
    !Number.isFinite(cash) ||
    !Number.isFinite(securities) ||
    !Number.isFinite(receivables) ||
    cash < 0 ||
    securities < 0 ||
    receivables < 0
  ) {
    return null;
  }
  const da = cash + securities + receivables;
  return Number.isFinite(da) ? da : null;
}

export function calculateAverageDailyCashExpenditure(
  annualOperatingExpenses: number,
  annualNonCashCharges: number,
  daysPerYear: number = DAYS_PER_YEAR,
): number | null {
  if (
    !Number.isFinite(annualOperatingExpenses) ||
    !Number.isFinite(annualNonCashCharges) ||
    !Number.isFinite(daysPerYear) ||
    annualOperatingExpenses < 0 ||
    annualNonCashCharges < 0 ||
    annualNonCashCharges > annualOperatingExpenses ||
    daysPerYear <= 0
  ) {
    return null;
  }
  const ace = annualOperatingExpenses - annualNonCashCharges;
  if (ace <= 0) return null;
  const dce = ace / daysPerYear;
  return Number.isFinite(dce) ? dce : null;
}

export function calculateDefensiveIntervalDays(
  defensiveAssets: number,
  dailyCashExpenditure: number,
): number | null {
  if (
    !Number.isFinite(defensiveAssets) ||
    !Number.isFinite(dailyCashExpenditure) ||
    defensiveAssets < 0 ||
    dailyCashExpenditure <= 0
  ) {
    return null;
  }
  const dir = defensiveAssets / dailyCashExpenditure;
  return Number.isFinite(dir) ? dir : null;
}

export function calculateRequiredDefensiveAssets(
  targetDays: number,
  dailyExpenditure: number,
): number | null {
  if (
    !Number.isFinite(targetDays) ||
    !Number.isFinite(dailyExpenditure) ||
    targetDays < 0 ||
    dailyExpenditure <= 0
  ) {
    return null;
  }
  const result = targetDays * dailyExpenditure;
  return Number.isFinite(result) ? result : null;
}

export function calculateMaximumDailyExpenditure(
  defensiveAssets: number,
  targetDays: number,
): number | null {
  if (
    !Number.isFinite(defensiveAssets) ||
    !Number.isFinite(targetDays) ||
    defensiveAssets < 0 ||
    targetDays <= 0
  ) {
    return null;
  }
  const result = defensiveAssets / targetDays;
  return Number.isFinite(result) ? result : null;
}

function fmtMoney(n: number, currency: DefensiveIntervalRatioInput['currency']): string {
  return formatCurrencyValue(n, currency);
}

function fmtDays(n: number): string {
  return `${n.toLocaleString('en-US', {
    maximumFractionDigits: 4,
  })} days`;
}

/**
 * Pure DIR engine. Never returns Infinity/NaN fields.
 * Rounding only in formatted display strings.
 */
export function calculateDefensiveIntervalRatio(
  input: DefensiveIntervalRatioInput,
): DefensiveIntervalRatioResult | null {
  const { solveTarget, currency } = input;
  const daysPerYear = DAYS_PER_YEAR;

  if (solveTarget === 'requiredAssets') {
    const targetDays = num(input.targetDays);
    const dce = num(input.dailyCashExpenditure);
    if (targetDays == null || dce == null) return null;
    const da = calculateRequiredDefensiveAssets(targetDays, dce);
    if (da === null) return null;

    return {
      solveTarget,
      currency,
      cashAndCashEquivalents: 0,
      marketableSecurities: 0,
      accountsReceivable: 0,
      defensiveAssets: da,
      annualOperatingExpenses: 0,
      annualNonCashCharges: 0,
      annualCashOperatingExpenditure: dce * daysPerYear,
      averageDailyCashExpenditure: dce,
      daysPerYear,
      defensiveIntervalDays: targetDays,
      formattedCash: '—',
      formattedSecurities: '—',
      formattedReceivables: '—',
      formattedDefensiveAssets: fmtMoney(da, currency),
      formattedOperatingExpenses: '—',
      formattedNonCashCharges: '—',
      formattedAnnualCashExpenditure: fmtMoney(dce * daysPerYear, currency),
      formattedDailyExpenditure: fmtMoney(dce, currency),
      formattedDirDays: fmtDays(targetDays),
      formulaBreakdown: [
        'Required Defensive Assets = Target Days × Daily Cash Expenditure',
        `= ${targetDays} × ${fmtMoney(dce, currency)}`,
        `= ${fmtMoney(da, currency)}`,
      ].join('\n'),
      steps: [
        `Target defensive interval = ${fmtDays(targetDays)}`,
        `Average daily cash expenditure = ${fmtMoney(dce, currency)}`,
        'Apply DA = DIR × DCE',
        `Required defensive assets = ${fmtMoney(da, currency)}`,
      ],
      interpretation: `To cover approximately ${fmtDays(targetDays)} of average cash operating expenditures at ${fmtMoney(dce, currency)} per day, about ${fmtMoney(da, currency)} of qualifying defensive assets would be required under these assumptions.`,
      explanation:
        'This reverse solve uses target days and a stated daily cash expenditure. It does not guarantee liquidity under all operating conditions.',
    };
  }

  if (solveTarget === 'maxDailyExpenditure') {
    const da = num(input.defensiveAssetsDirect);
    const targetDays = num(input.targetDays);
    if (da == null || targetDays == null) return null;
    const dce = calculateMaximumDailyExpenditure(da, targetDays);
    if (dce === null) return null;

    return {
      solveTarget,
      currency,
      cashAndCashEquivalents: 0,
      marketableSecurities: 0,
      accountsReceivable: 0,
      defensiveAssets: da,
      annualOperatingExpenses: 0,
      annualNonCashCharges: 0,
      annualCashOperatingExpenditure: dce * daysPerYear,
      averageDailyCashExpenditure: dce,
      daysPerYear,
      defensiveIntervalDays: targetDays,
      formattedCash: '—',
      formattedSecurities: '—',
      formattedReceivables: '—',
      formattedDefensiveAssets: fmtMoney(da, currency),
      formattedOperatingExpenses: '—',
      formattedNonCashCharges: '—',
      formattedAnnualCashExpenditure: fmtMoney(dce * daysPerYear, currency),
      formattedDailyExpenditure: fmtMoney(dce, currency),
      formattedDirDays: fmtDays(targetDays),
      formulaBreakdown: [
        'Maximum Daily Cash Expenditure = Defensive Assets ÷ Target Days',
        `= ${fmtMoney(da, currency)} ÷ ${targetDays}`,
        `= ${fmtMoney(dce, currency)} per day`,
      ].join('\n'),
      steps: [
        `Available defensive assets = ${fmtMoney(da, currency)}`,
        `Target defensive interval = ${fmtDays(targetDays)}`,
        'Apply DCE = DA / DIR',
        `Maximum average daily cash expenditure = ${fmtMoney(dce, currency)}`,
      ],
      interpretation: `With ${fmtMoney(da, currency)} of defensive assets and a ${fmtDays(targetDays)} target interval, average daily cash spending of about ${fmtMoney(dce, currency)} would exhaust those assets in the target period under stable-spend assumptions.`,
      explanation:
        'This reverse solve holds defensive assets and target days fixed. Actual runway depends on asset liquidity, collection timing, and spending volatility.',
    };
  }

  // Mode A: calculate DIR
  const cash = num(input.cashAndCashEquivalents);
  const ms = num(input.marketableSecurities);
  const ar = num(input.accountsReceivable);
  const oe = num(input.annualOperatingExpenses);
  const nce = num(input.annualNonCashCharges);
  if (
    cash == null ||
    ms == null ||
    ar == null ||
    oe == null ||
    nce == null
  ) {
    return null;
  }
  if (cash < 0 || ms < 0 || ar < 0 || oe < 0 || nce < 0) return null;
  if (nce > oe) return null;

  const da = calculateDefensiveAssets(cash, ms, ar);
  if (da === null) return null;

  const ace = oe - nce;
  if (ace <= 0) return null;

  const dce = ace / daysPerYear;
  if (!Number.isFinite(dce) || dce <= 0) return null;

  const dir = calculateDefensiveIntervalDays(da, dce);
  if (dir === null) return null;

  const formulaBreakdown = [
    'Defensive Assets',
    '= Cash + Marketable Securities + Accounts Receivable',
    `= ${fmtMoney(cash, currency)} + ${fmtMoney(ms, currency)} + ${fmtMoney(ar, currency)}`,
    `= ${fmtMoney(da, currency)}`,
    '',
    'Annual Cash Operating Expenditure',
    '= Operating Expenses − Non-Cash Charges',
    `= ${fmtMoney(oe, currency)} − ${fmtMoney(nce, currency)}`,
    `= ${fmtMoney(ace, currency)}`,
    '',
    'Average Daily Cash Expenditure',
    `= ${fmtMoney(ace, currency)} / ${daysPerYear}`,
    `= ${fmtMoney(dce, currency)}`,
    '',
    'Defensive Interval Ratio',
    `= ${fmtMoney(da, currency)} / ${fmtMoney(dce, currency)}`,
    `= ${fmtDays(dir)}`,
  ].join('\n');

  const steps = [
    `Defensive assets DA = ${fmtMoney(cash, currency)} + ${fmtMoney(ms, currency)} + ${fmtMoney(ar, currency)} = ${fmtMoney(da, currency)}`,
    `Annual cash operating expenditure ACE = ${fmtMoney(oe, currency)} − ${fmtMoney(nce, currency)} = ${fmtMoney(ace, currency)}`,
    `Average daily cash expenditure DCE = ${fmtMoney(ace, currency)} ÷ ${daysPerYear} = ${fmtMoney(dce, currency)}`,
    `DIR = DA ÷ DCE = ${fmtMoney(da, currency)} ÷ ${fmtMoney(dce, currency)} = ${fmtDays(dir)}`,
  ];

  return {
    solveTarget: 'dir',
    currency,
    cashAndCashEquivalents: cash,
    marketableSecurities: ms,
    accountsReceivable: ar,
    defensiveAssets: da,
    annualOperatingExpenses: oe,
    annualNonCashCharges: nce,
    annualCashOperatingExpenditure: ace,
    averageDailyCashExpenditure: dce,
    daysPerYear,
    defensiveIntervalDays: dir,
    formattedCash: fmtMoney(cash, currency),
    formattedSecurities: fmtMoney(ms, currency),
    formattedReceivables: fmtMoney(ar, currency),
    formattedDefensiveAssets: fmtMoney(da, currency),
    formattedOperatingExpenses: fmtMoney(oe, currency),
    formattedNonCashCharges: fmtMoney(nce, currency),
    formattedAnnualCashExpenditure: fmtMoney(ace, currency),
    formattedDailyExpenditure: fmtMoney(dce, currency),
    formattedDirDays: fmtDays(dir),
    formulaBreakdown,
    steps,
    interpretation: `The company has sufficient qualifying defensive assets to cover approximately ${fmtDays(dir)} of average cash operating expenditures, assuming the input assets are available and spending remains at the calculated average rate.`,
    explanation:
      'A higher defensive interval generally indicates longer coverage from liquid defensive assets, but industry, cash-flow timing, asset quality, and unexpected obligations still matter. This is not a guarantee of solvency.',
  };
}
