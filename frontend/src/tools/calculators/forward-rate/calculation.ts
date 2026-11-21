/**
 * Forward Rate Calculator — pure engine (ADR-018).
 *
 * Annual compounding implied forward rate between two spot rates:
 *
 *   f = [ ((1 + S₂)^n₂ / (1 + S₁)^n₁ ) ^ (1 / (n₂ − n₁)) − 1 ] × 100
 *
 * S₁, S₂ are decimal spot rates (percent ÷ 100); n₁, n₂ are times in years;
 * require n₂ > n₁ and (1+S) > 0 for each spot.
 */

import type {
  ForwardRateInput,
  ForwardRateResult,
  ForwardRateTimeUnit,
} from './types';

const MAX_ABS_RATE = 1e6;
const MAX_YEARS = 1e6;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Convert a period value in the selected unit to years. */
export function toYears(value: number, unit: ForwardRateTimeUnit): number {
  return unit === 'months' ? value / 12 : value;
}

/**
 * Annual-compounding forward rate as a decimal (not percent).
 * Returns null when inputs are outside the domain (no Infinity/NaN).
 */
export function calculateForwardRateDecimal(
  n1Years: number,
  s1Decimal: number,
  n2Years: number,
  s2Decimal: number,
): number | null {
  if (
    !Number.isFinite(n1Years) ||
    !Number.isFinite(n2Years) ||
    !Number.isFinite(s1Decimal) ||
    !Number.isFinite(s2Decimal)
  ) {
    return null;
  }
  if (n2Years <= n1Years) return null;
  const base1 = 1 + s1Decimal;
  const base2 = 1 + s2Decimal;
  if (base1 <= 0 || base2 <= 0) return null;

  const ratio = Math.pow(base2, n2Years) / Math.pow(base1, n1Years);
  if (!Number.isFinite(ratio) || ratio <= 0) return null;

  const exponent = 1 / (n2Years - n1Years);
  const growth = Math.pow(ratio, exponent);
  if (!Number.isFinite(growth) || growth <= 0) return null;

  const f = growth - 1;
  if (!Number.isFinite(f) || Math.abs(f) > MAX_ABS_RATE) return null;
  return f;
}

export function formatPercentDisplay(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}%`;
}

function formatYears(n: number): string {
  return n.toLocaleString('en-US', {
    maximumFractionDigits: 8,
  });
}

/**
 * Pure forward-rate engine. Never returns Infinity/NaN fields.
 * Rounding is applied only in formatted display strings.
 */
export function calculateForwardRate(
  input: ForwardRateInput,
): ForwardRateResult | null {
  const n1Raw = parseNumber(input.n1);
  const n2Raw = parseNumber(input.n2);
  const s1Pct = parseNumber(input.s1Percent);
  const s2Pct = parseNumber(input.s2Percent);
  if (n1Raw == null || n2Raw == null || s1Pct == null || s2Pct == null) {
    return null;
  }
  if (n1Raw < 0 || n2Raw < 0) return null;
  if (Math.abs(s1Pct) > MAX_ABS_RATE || Math.abs(s2Pct) > MAX_ABS_RATE) {
    return null;
  }

  const n1Years = toYears(n1Raw, input.n1Unit);
  const n2Years = toYears(n2Raw, input.n2Unit);
  if (
    !Number.isFinite(n1Years) ||
    !Number.isFinite(n2Years) ||
    n1Years > MAX_YEARS ||
    n2Years > MAX_YEARS
  ) {
    return null;
  }

  const s1Decimal = s1Pct / 100;
  const s2Decimal = s2Pct / 100;
  const f = calculateForwardRateDecimal(n1Years, s1Decimal, n2Years, s2Decimal);
  if (f === null) return null;

  const forwardRatePercent = f * 100;
  const formattedForwardRate = formatPercentDisplay(forwardRatePercent);

  const compoundingNote =
    'Convention: annually compounded spot rates. S₁ and S₂ are converted from percent to decimals before the formula.';

  const formulaBreakdown = [
    'f = [ ((1 + S₂)^n₂ / (1 + S₁)^n₁ ) ^ (1 / (n₂ − n₁)) − 1 ] × 100',
    `n₁ = ${formatYears(n1Years)} years, S₁ = ${s1Pct}%`,
    `n₂ = ${formatYears(n2Years)} years, S₂ = ${s2Pct}%`,
    `f = ${formattedForwardRate}`,
  ].join('\n');

  const steps = [
    `Convert percentages: S₁ = ${s1Pct}/100 = ${s1Decimal}, S₂ = ${s2Pct}/100 = ${s2Decimal}.`,
    `Express times in years: n₁ = ${formatYears(n1Years)}, n₂ = ${formatYears(n2Years)} (require n₂ > n₁).`,
    `Compute (1+S₂)^n₂ / (1+S₁)^n₁, then raise to 1/(n₂−n₁), subtract 1, and ×100 for percent.`,
    `Forward rate f = ${formattedForwardRate} (annual compounding).`,
  ];

  const interpretation =
    forwardRatePercent === 0
      ? 'The implied annually compounded forward rate between the two maturities is zero under these spots.'
      : `The implied annually compounded forward rate from year ${formatYears(n1Years)} to year ${formatYears(n2Years)} is ${formattedForwardRate}.`;

  const explanation =
    'This is the break-even reinvestment rate that equates investing at the longer spot with investing at the shorter spot and rolling at the forward. It assumes annual compounding and does not adjust for credit, liquidity, or day-count conventions.';

  return {
    n1Years,
    n2Years,
    s1Decimal,
    s2Decimal,
    forwardRateDecimal: f,
    forwardRatePercent,
    formattedForwardRate,
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
    compoundingNote,
  };
}
