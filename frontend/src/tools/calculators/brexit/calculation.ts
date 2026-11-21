import {
  FRANCE_AREA_KM2,
  GROUP_LABELS,
  MS_PER_WEEK,
  MS_PER_YEAR,
  OPPORTUNITY_ITEMS,
  POST_BREXIT_RATE_START_ISO,
  PRE_2020_WEEKLY_LOSS_GBP,
  RUBBISH_DENSITY_KG_PER_M3,
  SOURCE_SUMMARY,
  type OpportunityItem,
} from './constants';
import type { CostRateUnit, OpportunityQuantity } from './types';

export function weeklyFromUnit(amount: number, unit: CostRateUnit): number {
  if (!Number.isFinite(amount)) return NaN;
  switch (unit) {
    case 'sec':
      return amount * (MS_PER_WEEK / 1000);
    case 'day':
      return amount * 7;
    case 'wk':
      return amount;
    case 'yr':
      return amount / 52;
    default:
      return NaN;
  }
}

export function formatGbp(amount: number, fractionDigits = 0): string {
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatCount(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 0,
  }).format(Math.floor(n));
}

/**
 * GDP-loss integral with dual weekly rates:
 * [since, cutoff) @ preWeekly; [cutoff, till] @ postWeekly.
 * Open intervals clipped; negative spans contribute 0.
 */
export function gdpLossGbp(
  sinceMs: number,
  tillMs: number,
  postWeeklyGbp: number,
  preWeeklyGbp = PRE_2020_WEEKLY_LOSS_GBP,
  cutoffMs = Date.parse(POST_BREXIT_RATE_START_ISO)
): { pre2020: number; post2020: number; total: number } {
  if (
    !(Number.isFinite(sinceMs) && Number.isFinite(tillMs) && Number.isFinite(postWeeklyGbp))
  ) {
    return { pre2020: NaN, post2020: NaN, total: NaN };
  }
  if (!(postWeeklyGbp >= 0) || !(preWeeklyGbp >= 0)) {
    return { pre2020: NaN, post2020: NaN, total: NaN };
  }
  if (tillMs <= sinceMs) {
    return { pre2020: 0, post2020: 0, total: 0 };
  }

  const preDurationMs =
    sinceMs >= cutoffMs ? 0 : Math.max(0, Math.min(tillMs, cutoffMs) - sinceMs);
  const postFrom = Math.max(sinceMs, cutoffMs);
  const postDurationMs = tillMs <= cutoffMs ? 0 : Math.max(0, tillMs - postFrom);

  const pre2020 = (preDurationMs / MS_PER_WEEK) * preWeeklyGbp;
  const post2020 = (postDurationMs / MS_PER_WEEK) * postWeeklyGbp;
  return { pre2020, post2020, total: pre2020 + post2020 };
}

export function opportunityQuantities(costSoFarGbp: number): OpportunityQuantity[] {
  if (!(costSoFarGbp >= 0) || !Number.isFinite(costSoFarGbp)) return [];
  return OPPORTUNITY_ITEMS.map((item: OpportunityItem) => ({
    id: item.id,
    label: item.label,
    group: GROUP_LABELS[item.group],
    unitCostGbp: item.unitCostGbp,
    quantity:
      item.unitCostGbp > 0 ? Math.floor(costSoFarGbp / item.unitCostGbp) : 0,
    note: item.note,
  }));
}

/**
 * Tonnes of rubbish covering France at 1 m depth:
 * area_m2 = (tonnes * 1000 / density); france_equiv = area_m2 / (france_km2 * 1e6)
 */
export function franceRubbishEquivalent(tonnes: number): number | null {
  if (!(tonnes >= 0) || !Number.isFinite(tonnes)) return null;
  const volumeM3 = (tonnes * 1000) / RUBBISH_DENSITY_KG_PER_M3;
  const franceM2 = FRANCE_AREA_KM2 * 1_000_000;
  return volumeM3 / franceM2;
}

export function calculateBrexitCost(args: {
  sinceMs: number;
  tillMs: number;
  currentWeeklyLossGbp: number;
  governmentSpendingGbp: number;
}): {
  pre2020LossGbp: number;
  post2020LossGbp: number;
  costSoFarGbp: number;
  opportunities: OpportunityQuantity[];
  franceRubbishEquiv: number | null;
  explanation: string;
  sourceSummary: string;
} {
  const { sinceMs, tillMs, currentWeeklyLossGbp, governmentSpendingGbp } = args;

  if (
    !Number.isFinite(sinceMs) ||
    !Number.isFinite(tillMs) ||
    !Number.isFinite(currentWeeklyLossGbp) ||
    !Number.isFinite(governmentSpendingGbp)
  ) {
    throw new Error('Please enter valid numerical values.');
  }
  if (currentWeeklyLossGbp < 0) {
    throw new Error('Current cost rate cannot be negative.');
  }
  if (governmentSpendingGbp < 0) {
    throw new Error('Government spending cannot be negative.');
  }
  if (tillMs < sinceMs) {
    throw new Error('The end time must be on or after the start time.');
  }

  const loss = gdpLossGbp(sinceMs, tillMs, currentWeeklyLossGbp);
  const costSoFarGbp = governmentSpendingGbp + loss.total;

  if (!Number.isFinite(costSoFarGbp)) {
    throw new Error('Cost so far is not a finite number.');
  }

  const opportunities = opportunityQuantities(costSoFarGbp);
  const rubbish = opportunities.find((o) => o.id === 'rubbishTonnes');
  const franceRubbishEquiv = rubbish
    ? franceRubbishEquivalent(rubbish.quantity)
    : null;

  const years = (tillMs - sinceMs) / MS_PER_YEAR;
  const explanation = [
    `Illustrative cost so far ${formatGbp(costSoFarGbp)} over ~${years.toFixed(2)} years:`,
    `government add-on ${formatGbp(governmentSpendingGbp)}`,
    `+ pre-2020 GDP-loss estimate ${formatGbp(loss.pre2020)}`,
    `+ post-2020 GDP-loss estimate ${formatGbp(loss.post2020)}.`,
  ].join(' ');

  return {
    pre2020LossGbp: loss.pre2020,
    post2020LossGbp: loss.post2020,
    costSoFarGbp,
    opportunities,
    franceRubbishEquiv,
    explanation,
    sourceSummary: SOURCE_SUMMARY,
  };
}
