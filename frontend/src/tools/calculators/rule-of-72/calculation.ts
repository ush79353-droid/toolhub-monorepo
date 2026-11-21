/**
 * Rule of 72 Calculator — pure engine (ADR-018).
 *
 * Mental-math approximation (not exact compound growth):
 *   doublingTime ≈ 72 / increasePercent
 *   increasePercent ≈ 72 / doublingTime
 *
 * Optional exact comparison (discrete compound per period):
 *   T_exact = ln(2) / ln(1 + r)  where r = increasePercent / 100
 */

import {
  RULE_OF_72,
  type RuleOf72Input,
  type RuleOf72Result,
} from './types';

/** Reject absurd magnitudes that would produce unusable reciprocals. */
const MIN_ABS = 1e-12;
const MAX_ABS = 1e12;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function approximateDoublingTime(increasePercent: number): number | null {
  if (!Number.isFinite(increasePercent) || increasePercent <= 0) return null;
  if (increasePercent < MIN_ABS || increasePercent > MAX_ABS) return null;
  const t = RULE_OF_72 / increasePercent;
  return Number.isFinite(t) && t > 0 ? t : null;
}

export function approximateIncreasePercent(doublingTime: number): number | null {
  if (!Number.isFinite(doublingTime) || doublingTime <= 0) return null;
  if (doublingTime < MIN_ABS || doublingTime > MAX_ABS) return null;
  const r = RULE_OF_72 / doublingTime;
  return Number.isFinite(r) && r > 0 ? r : null;
}

/**
 * Exact periods to double at constant per-period rate r (decimal).
 * Requires r > −1 and r ≠ 0 so ln(1+r) is defined and non-zero.
 */
export function exactDoublingPeriods(increasePercent: number): number | null {
  if (!Number.isFinite(increasePercent)) return null;
  const r = increasePercent / 100;
  if (!(r > -1) || r === 0) return null;
  const denom = Math.log(1 + r);
  if (!Number.isFinite(denom) || denom === 0) return null;
  const t = Math.LN2 / denom;
  if (!Number.isFinite(t) || t <= 0) return null;
  return t;
}

export function formatNumber(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function calculateRuleOf72(input: RuleOf72Input): RuleOf72Result | null {
  const source = input.lastEdited;

  if (source === 'increase') {
    const increasePercent = num(input.increasePercent);
    if (increasePercent == null || increasePercent <= 0) return null;
    const doublingTime = approximateDoublingTime(increasePercent);
    if (doublingTime == null) return null;
    const exact = exactDoublingPeriods(increasePercent);
    const formattedIncrease = formatNumber(increasePercent);
    const formattedDoublingTime = formatNumber(doublingTime);
    const formattedExact =
      exact != null ? formatNumber(exact, 4) : null;
    return {
      increasePercent,
      doublingTime,
      exactDoublingTime: exact,
      formattedIncrease,
      formattedDoublingTime,
      formattedExactDoublingTime: formattedExact,
      source,
      formulaBreakdown: [
        'Rule of 72 (approx): T ≈ 72 ÷ r%',
        `T ≈ ${RULE_OF_72} ÷ ${formattedIncrease}`,
        `T ≈ ${formattedDoublingTime} periods`,
        exact != null
          ? `Exact compound: T = ln(2) / ln(1 + r) ≈ ${formattedExact} periods`
          : 'Exact compound: unavailable for this rate',
      ].join('\n'),
      explanation: `At about ${formattedIncrease}% growth per period, the Rule of 72 estimates doubling in roughly ${formattedDoublingTime} periods. This is a mental-math approximation, not an exact compound-growth result${
        exact != null
          ? ` (exact discrete compound ≈ ${formattedExact} periods)`
          : ''
      }.`,
    };
  }

  const doublingTime = num(input.doublingTime);
  if (doublingTime == null || doublingTime <= 0) return null;
  const increasePercent = approximateIncreasePercent(doublingTime);
  if (increasePercent == null) return null;
  const exact = exactDoublingPeriods(increasePercent);
  const formattedIncrease = formatNumber(increasePercent);
  const formattedDoublingTime = formatNumber(doublingTime);
  const formattedExact = exact != null ? formatNumber(exact, 4) : null;
  return {
    increasePercent,
    doublingTime,
    exactDoublingTime: exact,
    formattedIncrease,
    formattedDoublingTime,
    formattedExactDoublingTime: formattedExact,
    source,
    formulaBreakdown: [
      'Rule of 72 (approx): r% ≈ 72 ÷ T',
      `r% ≈ ${RULE_OF_72} ÷ ${formattedDoublingTime}`,
      `r% ≈ ${formattedIncrease}% per period`,
      exact != null
        ? `Exact compound at that rate: T = ln(2) / ln(1 + r) ≈ ${formattedExact} periods`
        : 'Exact compound: unavailable for this rate',
    ].join('\n'),
    explanation: `To double in about ${formattedDoublingTime} periods, the Rule of 72 implies roughly ${formattedIncrease}% growth per period. This is a mental-math approximation, not an exact compound-growth result${
      exact != null
        ? ` (exact discrete compound at that implied rate ≈ ${formattedExact} periods)`
        : ''
    }.`,
  };
}
