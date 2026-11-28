/**
 * Ticket Optimizer pure engine — timestamp DP for min-cost ticket covers.
 * Money compared in integer cents. Months = fixed 30 days (labeled).
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type {
  DurationUnit,
  FrequencyUnit,
  LongValidityUnit,
  ShortValidityUnit,
  StrategyRow,
  TicketOptimizerInput,
  TicketOptimizerResult,
  TicketRecommendation,
  TicketType,
} from './types';

export const MAX_TRIPS = 1500;

export function toDays(value: number, unit: DurationUnit): number {
  return unit === 'weeks' ? value * 7 : value;
}

export function shortValidityToHours(
  value: number,
  unit: ShortValidityUnit,
): number {
  if (unit === 'hours') return value;
  if (unit === 'days') return value * 24;
  return value * 7 * 24;
}

export function longValidityToHours(
  value: number,
  unit: LongValidityUnit,
): number {
  if (unit === 'days') return value * 24;
  if (unit === 'weeks') return value * 7 * 24;
  return value * 30 * 24; // months30
}

export function convertShortValidity(
  value: number,
  from: ShortValidityUnit,
  to: ShortValidityUnit,
): number {
  const h = shortValidityToHours(value, from);
  if (to === 'hours') return h;
  if (to === 'days') return h / 24;
  return h / (7 * 24);
}

export function convertLongValidity(
  value: number,
  from: LongValidityUnit,
  to: LongValidityUnit,
): number {
  const h = longValidityToHours(value, from);
  if (to === 'days') return h / 24;
  if (to === 'weeks') return h / (7 * 24);
  return h / (30 * 24);
}

export function convertDuration(
  value: number,
  from: DurationUnit,
  to: DurationUnit,
): number {
  const d = toDays(value, from);
  return to === 'weeks' ? d / 7 : d;
}

/** Round money to integer cents for comparisons. */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export interface TravelSchedule {
  timestampsHours: number[];
  totalDays: number;
  assumptionNote: string;
}

/**
 * Build an ordered trip timeline (hours from day-0 midnight).
 * Daily: `trips` each day. Weekly: `trips` each week, distributed in-window.
 */
export function generateTravelSchedule(
  trips: number,
  frequencyUnit: FrequencyUnit,
  travelDuration: number,
  travelDurationUnit: DurationUnit,
): TravelSchedule {
  const totalDays = toDays(travelDuration, travelDurationUnit);
  const stamps: number[] = [];

  if (frequencyUnit === 'day') {
    for (let d = 0; d < totalDays; d++) {
      for (let k = 0; k < trips; k++) {
        const hour =
          trips === 1 ? 8 : 8 + (k * 12) / Math.max(1, trips - 1);
        stamps.push(d * 24 + hour);
      }
    }
    return {
      timestampsHours: stamps,
      totalDays,
      assumptionNote: `Estimate assumes ${trips} trip(s) each day for ${totalDays} consecutive day(s), spaced through daytime hours.`,
    };
  }

  for (let weekStart = 0; weekStart < totalDays; weekStart += 7) {
    const daysInWeek = Math.min(7, totalDays - weekStart);
    for (let k = 0; k < trips; k++) {
      const dayOffset = k % daysInWeek;
      const slot = Math.floor(k / daysInWeek);
      const hour = Math.min(20, 8 + slot * 2);
      stamps.push((weekStart + dayOffset) * 24 + hour);
    }
  }
  stamps.sort((a, b) => a - b);

  return {
    timestampsHours: stamps,
    totalDays,
    assumptionNote: `Estimate assumes ${trips} trip(s) each week, distributed across days inside each week of a ${totalDays}-day window (not a custom weekday calendar).`,
  };
}

export function calculateTotalTrips(schedule: TravelSchedule): number {
  return schedule.timestampsHours.length;
}

export function calculateSingleTicketCost(
  totalTrips: number,
  singlePrice: number,
): number {
  return fromCents(toCents(singlePrice) * totalTrips);
}

type ChoiceKind = TicketType;

interface DpChoice {
  kind: ChoiceKind;
  nextIndex: number;
  costCents: number;
}

interface OptimizeOptions {
  timestampsHours: number[];
  singleCents: number;
  shortEnabled: boolean;
  shortCents: number;
  shortValidityHours: number;
  longEnabled: boolean;
  longCents: number;
  longValidityHours: number;
}

function nextUncovered(
  stamps: number[],
  startIndex: number,
  validityHours: number,
): number {
  const end = stamps[startIndex]! + validityHours;
  let j = startIndex;
  while (j < stamps.length && stamps[j]! < end) j += 1;
  return j;
}

/**
 * Exact DP: dp[i] = min cost (cents) to cover trips i..n-1.
 * Tie-break: lower cost → fewer tickets → fewer types → single < short < long.
 */
export function optimizeTicketCombination(opts: OptimizeOptions): {
  costCents: number;
  purchases: Array<{ kind: ChoiceKind; index: number }>;
  tieBreakUsed: boolean;
} {
  const n = opts.timestampsHours.length;
  if (n === 0) {
    return { costCents: 0, purchases: [], tieBreakUsed: false };
  }

  const INF = Number.MAX_SAFE_INTEGER;
  const dp = new Array<number>(n + 1).fill(INF);
  const choice = new Array<DpChoice | null>(n).fill(null);
  const ticketCount = new Array<number>(n + 1).fill(0);
  const typeMask = new Array<number>(n + 1).fill(0);
  dp[n] = 0;

  const typeBit = (k: ChoiceKind): number =>
    k === 'single' ? 1 : k === 'shortTerm' ? 2 : 4;

  const kindRank = (k: ChoiceKind): number =>
    k === 'single' ? 0 : k === 'shortTerm' ? 1 : 2;

  let tieBreakUsed = false;

  for (let i = n - 1; i >= 0; i--) {
    const candidates: DpChoice[] = [
      {
        kind: 'single',
        nextIndex: i + 1,
        costCents: opts.singleCents + dp[i + 1]!,
      },
    ];

    if (opts.shortEnabled && opts.shortValidityHours > 0) {
      const next = nextUncovered(
        opts.timestampsHours,
        i,
        opts.shortValidityHours,
      );
      candidates.push({
        kind: 'shortTerm',
        nextIndex: next,
        costCents: opts.shortCents + dp[next]!,
      });
    }

    if (opts.longEnabled && opts.longValidityHours > 0) {
      const next = nextUncovered(
        opts.timestampsHours,
        i,
        opts.longValidityHours,
      );
      candidates.push({
        kind: 'longTerm',
        nextIndex: next,
        costCents: opts.longCents + dp[next]!,
      });
    }

    let best: DpChoice = candidates[0]!;
    let bestTickets = 1 + ticketCount[best.nextIndex]!;
    let bestMask = typeBit(best.kind) | typeMask[best.nextIndex]!;

    for (let c = 1; c < candidates.length; c++) {
      const cand = candidates[c]!;
      const tCount = 1 + ticketCount[cand.nextIndex]!;
      const mask = typeBit(cand.kind) | typeMask[cand.nextIndex]!;
      const typeCount = bitCount(mask);
      const bestTypeCount = bitCount(bestMask);

      if (cand.costCents < best.costCents) {
        best = cand;
        bestTickets = tCount;
        bestMask = mask;
        continue;
      }
      if (cand.costCents > best.costCents) continue;

      tieBreakUsed = true;
      if (tCount < bestTickets) {
        best = cand;
        bestTickets = tCount;
        bestMask = mask;
        continue;
      }
      if (tCount > bestTickets) continue;

      if (typeCount < bestTypeCount) {
        best = cand;
        bestTickets = tCount;
        bestMask = mask;
        continue;
      }
      if (typeCount > bestTypeCount) continue;

      if (kindRank(cand.kind) < kindRank(best.kind)) {
        best = cand;
        bestTickets = tCount;
        bestMask = mask;
      }
    }

    dp[i] = best.costCents;
    choice[i] = best;
    ticketCount[i] = bestTickets;
    typeMask[i] = bestMask;
  }

  const purchases: Array<{ kind: ChoiceKind; index: number }> = [];
  let i = 0;
  while (i < n) {
    const ch = choice[i]!;
    purchases.push({ kind: ch.kind, index: i });
    i = ch.nextIndex;
  }

  return { costCents: dp[0]!, purchases, tieBreakUsed };
}

function bitCount(mask: number): number {
  let n = 0;
  let m = mask;
  while (m) {
    n += m & 1;
    m >>= 1;
  }
  return n;
}

function countPurchases(
  purchases: Array<{ kind: ChoiceKind }>,
): Record<TicketType, number> {
  const counts: Record<TicketType, number> = {
    single: 0,
    shortTerm: 0,
    longTerm: 0,
  };
  for (const p of purchases) counts[p.kind] += 1;
  return counts;
}

function buildRecommendations(
  counts: Record<TicketType, number>,
  singlePrice: number,
  shortPrice: number,
  longPrice: number,
): TicketRecommendation[] {
  const rows: TicketRecommendation[] = [
    {
      ticketType: 'single',
      quantity: counts.single,
      unitPrice: singlePrice,
      totalPrice: fromCents(toCents(singlePrice) * counts.single),
    },
    {
      ticketType: 'shortTerm',
      quantity: counts.shortTerm,
      unitPrice: shortPrice,
      totalPrice: fromCents(toCents(shortPrice) * counts.shortTerm),
    },
    {
      ticketType: 'longTerm',
      quantity: counts.longTerm,
      unitPrice: longPrice,
      totalPrice: fromCents(toCents(longPrice) * counts.longTerm),
    },
  ];
  return rows;
}

function strategyCostOnly(
  opts: OptimizeOptions,
  mode: 'single' | 'short' | 'long' | 'all',
): number | null {
  const restricted: OptimizeOptions = {
    ...opts,
    shortEnabled:
      mode === 'short' || mode === 'all' ? opts.shortEnabled : false,
    longEnabled: mode === 'long' || mode === 'all' ? opts.longEnabled : false,
  };
  if (mode === 'single') {
    restricted.shortEnabled = false;
    restricted.longEnabled = false;
  }
  if (mode === 'short' && !opts.shortEnabled) return null;
  if (mode === 'long' && !opts.longEnabled) return null;
  if (mode === 'short') {
    restricted.shortEnabled = true;
    restricted.longEnabled = false;
    // Short-only: still allow singles as fallback would change meaning.
    // Pure short-only means no singles — force singleCents very high? Brief
    // "Short-term passes only" — buy only short passes.
    // If we disable singles, DP must use only short. Always covers.
    const pure: OptimizeOptions = {
      ...restricted,
      singleCents: Number.MAX_SAFE_INTEGER / 4,
    };
    const { costCents } = optimizeTicketCombination(pure);
    if (costCents >= Number.MAX_SAFE_INTEGER / 8) return null;
    return fromCents(costCents);
  }
  if (mode === 'long') {
    const pure: OptimizeOptions = {
      ...restricted,
      shortEnabled: false,
      longEnabled: true,
      singleCents: Number.MAX_SAFE_INTEGER / 4,
    };
    const { costCents } = optimizeTicketCombination(pure);
    if (costCents >= Number.MAX_SAFE_INTEGER / 8) return null;
    return fromCents(costCents);
  }
  const { costCents } = optimizeTicketCombination(restricted);
  return fromCents(costCents);
}

export function calculateTicketSavings(
  individualCost: number,
  minimumCost: number,
): number {
  return fromCents(toCents(individualCost) - toCents(minimumCost));
}

export function calculateSavingsPercentage(
  savings: number,
  individualCost: number,
): number | null {
  if (individualCost <= 0) return null;
  return (savings / individualCost) * 100;
}

export function calculateAverageCostPerTrip(
  minimumCost: number,
  totalTrips: number,
): number | null {
  if (totalTrips <= 0) return null;
  return minimumCost / totalTrips;
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  return String(rounded);
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(n, currency);
}

export interface ParsedTicketParams {
  trips: number;
  frequencyUnit: FrequencyUnit;
  travelDuration: number;
  travelDurationUnit: DurationUnit;
  singleTicketPrice: number;
  currency: SupportedCurrency;
  compareShortTerm: boolean;
  compareLongTerm: boolean;
  shortTermTicketPrice: number;
  shortTermValidity: number;
  shortTermValidityUnit: ShortValidityUnit;
  longTermTicketPrice: number;
  longTermValidity: number;
  longTermValidityUnit: LongValidityUnit;
}

export function computeTicketOptimizer(
  p: ParsedTicketParams,
): TicketOptimizerResult {
  const schedule = generateTravelSchedule(
    p.trips,
    p.frequencyUnit,
    p.travelDuration,
    p.travelDurationUnit,
  );
  const totalTrips = calculateTotalTrips(schedule);
  const singleCents = toCents(p.singleTicketPrice);
  const shortCents = toCents(p.shortTermTicketPrice);
  const longCents = toCents(p.longTermTicketPrice);
  const shortHours = shortValidityToHours(
    p.shortTermValidity,
    p.shortTermValidityUnit,
  );
  const longHours = longValidityToHours(
    p.longTermValidity,
    p.longTermValidityUnit,
  );

  const opts: OptimizeOptions = {
    timestampsHours: schedule.timestampsHours,
    singleCents,
    shortEnabled: p.compareShortTerm,
    shortCents,
    shortValidityHours: shortHours,
    longEnabled: p.compareLongTerm,
    longCents,
    longValidityHours: longHours,
  };

  const optimized = optimizeTicketCombination(opts);
  const counts = countPurchases(optimized.purchases);
  const minimumCost = fromCents(optimized.costCents);
  const individualTicketCost = calculateSingleTicketCost(
    totalTrips,
    p.singleTicketPrice,
  );
  const savings = calculateTicketSavings(individualTicketCost, minimumCost);
  const savingsPercentage = calculateSavingsPercentage(
    savings,
    individualTicketCost,
  );
  const averageCostPerTrip = calculateAverageCostPerTrip(
    minimumCost,
    totalTrips,
  );
  const recommendations = buildRecommendations(
    counts,
    p.singleTicketPrice,
    p.shortTermTicketPrice,
    p.longTermTicketPrice,
  );
  const ticketsPurchased =
    counts.single + counts.shortTerm + counts.longTerm;

  const singleOnly = strategyCostOnly(opts, 'single')!;
  const strategies: StrategyRow[] = [
    {
      id: 'single',
      label: 'Individual tickets only',
      totalCost: singleOnly,
      savings: calculateTicketSavings(individualTicketCost, singleOnly),
      isOptimal: false,
    },
  ];
  if (p.compareShortTerm) {
    const c = strategyCostOnly(opts, 'short');
    if (c != null) {
      strategies.push({
        id: 'short',
        label: 'Short-term passes only',
        totalCost: c,
        savings: calculateTicketSavings(individualTicketCost, c),
        isOptimal: false,
      });
    }
  }
  if (p.compareLongTerm) {
    const c = strategyCostOnly(opts, 'long');
    if (c != null) {
      strategies.push({
        id: 'long',
        label: 'Long-term passes only',
        totalCost: c,
        savings: calculateTicketSavings(individualTicketCost, c),
        isOptimal: false,
      });
    }
  }
  strategies.push({
    id: 'optimized',
    label: 'Optimized combination',
    totalCost: minimumCost,
    savings,
    isOptimal: true,
  });

  const minStrategy = Math.min(...strategies.map((s) => toCents(s.totalCost)));
  for (const s of strategies) {
    s.isOptimal = toCents(s.totalCost) === minStrategy;
  }

  const parts: string[] = [];
  if (counts.shortTerm)
    parts.push(
      `${counts.shortTerm} short-term pass${counts.shortTerm === 1 ? '' : 'es'}`,
    );
  if (counts.longTerm)
    parts.push(
      `${counts.longTerm} long-term pass${counts.longTerm === 1 ? '' : 'es'}`,
    );
  if (counts.single)
    parts.push(
      `${counts.single} single ticket${counts.single === 1 ? '' : 's'}`,
    );
  if (parts.length === 0) parts.push('no tickets');

  const interpretation = `Based on your travel schedule (${schedule.assumptionNote}), the cheapest plan is ${parts.join(' + ')}. Estimated total ${money(minimumCost, p.currency)}, saving ${money(savings, p.currency)}${savingsPercentage != null ? ` (${fmt(savingsPercentage, 1)}%)` : ''} versus buying only individual tickets.`;

  const formulaSteps = [
    `Total trips N = ${totalTrips}`,
    `Single-ticket baseline Cs = ${totalTrips} × ${p.singleTicketPrice} = ${money(individualTicketCost, p.currency)}`,
    `Recommended: ${counts.single} single × ${p.singleTicketPrice} + ${counts.shortTerm} short × ${p.shortTermTicketPrice} + ${counts.longTerm} long × ${p.longTermTicketPrice}`,
    `Cmin = ${money(minimumCost, p.currency)}`,
    `Savings S = ${money(individualTicketCost, p.currency)} − ${money(minimumCost, p.currency)} = ${money(savings, p.currency)}`,
    savingsPercentage != null
      ? `S% = ${fmt(savingsPercentage, 2)}%`
      : 'S% = N/A (baseline cost is zero)',
  ];

  return {
    currency: p.currency,
    totalTrips,
    scheduleAssumption: schedule.assumptionNote,
    individualTicketCost,
    minimumCost,
    savings,
    savingsPercentage,
    averageCostPerTrip,
    ticketsPurchased,
    recommendations,
    strategies,
    tieBreakNote: optimized.tieBreakUsed
      ? 'Multiple combinations share this minimum cost; the plan with fewer tickets, then fewer ticket types, then preferring singles over passes, was chosen.'
      : null,
    formulaSteps,
    interpretation,
    minimumCostDisplay: money(minimumCost, p.currency),
    savingsDisplay: money(savings, p.currency),
    individualCostDisplay: money(individualTicketCost, p.currency),
    averageCostDisplay:
      averageCostPerTrip != null
        ? money(averageCostPerTrip, p.currency)
        : null,
  };
}

/** Live path used by validation after parsing form strings. */
export function evaluateFromInput(
  input: TicketOptimizerInput,
  parsed: ParsedTicketParams,
): TicketOptimizerResult {
  void input;
  return computeTicketOptimizer(parsed);
}
