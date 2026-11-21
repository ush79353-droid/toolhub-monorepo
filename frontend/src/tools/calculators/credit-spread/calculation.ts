/**
 * Credit Spread Calculator — pure engine (ADR-018).
 *
 * CS = Y_c − Y_g  (percentage points)
 * CS_bps = CS × 100
 *
 * Reverse:
 *   Y_c = Y_g + CS
 *   Y_g = Y_c − CS
 *
 * Spread is an absolute yield difference (pp / bps), not a relative % change.
 */

import type {
  CreditSpreadInput,
  CreditSpreadResult,
  SpreadInputUnit,
} from './types';

const MAX_ABS = 1e6;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function basisPointsToPercentagePoints(bps: number): number {
  return bps / 100;
}

export function percentagePointsToBasisPoints(pp: number): number {
  return pp * 100;
}

export function spreadToPercentagePoints(
  value: number,
  unit: SpreadInputUnit,
): number {
  return unit === 'basisPoints'
    ? basisPointsToPercentagePoints(value)
    : value;
}

export function calculateCreditSpreadFromYields(
  corporateBondYield: number,
  governmentBondYield: number,
): {
  spreadPercentagePoints: number;
  spreadBasisPoints: number;
} | null {
  if (
    !Number.isFinite(corporateBondYield) ||
    !Number.isFinite(governmentBondYield)
  ) {
    return null;
  }
  const spreadPercentagePoints = corporateBondYield - governmentBondYield;
  const spreadBasisPoints =
    percentagePointsToBasisPoints(spreadPercentagePoints);
  if (
    !Number.isFinite(spreadPercentagePoints) ||
    !Number.isFinite(spreadBasisPoints) ||
    Math.abs(spreadPercentagePoints) > MAX_ABS ||
    Math.abs(spreadBasisPoints) > MAX_ABS * 100
  ) {
    return null;
  }
  return { spreadPercentagePoints, spreadBasisPoints };
}

export function calculateCorporateBondYield(
  governmentYield: number,
  spreadPercentagePoints: number,
): number | null {
  if (
    !Number.isFinite(governmentYield) ||
    !Number.isFinite(spreadPercentagePoints)
  ) {
    return null;
  }
  const result = governmentYield + spreadPercentagePoints;
  if (!Number.isFinite(result) || Math.abs(result) > MAX_ABS) return null;
  return result;
}

export function calculateGovernmentBondYield(
  corporateYield: number,
  spreadPercentagePoints: number,
): number | null {
  if (
    !Number.isFinite(corporateYield) ||
    !Number.isFinite(spreadPercentagePoints)
  ) {
    return null;
  }
  const result = corporateYield - spreadPercentagePoints;
  if (!Number.isFinite(result) || Math.abs(result) > MAX_ABS) return null;
  return result;
}

export function formatPercentDisplay(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}%`;
}

export function formatSpreadPp(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })} percentage points`;
}

export function formatSpreadBps(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const sign = n > 0 ? '+' : '';
  const rounded =
    Math.abs(n) >= 1
      ? Math.round(n * 1e6) / 1e6
      : Math.round(n * 1e8) / 1e8;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toLocaleString('en-US', {
        maximumFractionDigits: 4,
      });
  return `${sign}${text} bps`;
}

function signLabel(pp: number): CreditSpreadResult['signLabel'] {
  if (pp > 0) return 'positive';
  if (pp < 0) return 'negative';
  return 'zero';
}

function buildInterpretation(pp: number, bps: number): string {
  if (pp === 0) {
    return 'The two bonds have identical quoted yields under the selected comparison.';
  }
  if (pp > 0) {
    return `The corporate bond yields ${formatSpreadBps(bps).replace(/^\+/, '')} more than the government benchmark. This difference can reflect compensation for credit risk, liquidity differences, and other bond-specific factors; not default risk alone.`;
  }
  return `The corporate bond yields ${formatSpreadBps(Math.abs(bps)).replace(/^\+/, '')} less than the government benchmark. Negative spreads can reflect liquidity, structure, benchmark choice, or market distortions; they are not automatically invalid.`;
}

function buildExplanation(pp: number, bps: number): string {
  if (pp === 0) {
    return 'Credit spread is zero: corporate and government yields match for this comparison.';
  }
  if (pp > 0) {
    return `The corporate bond offers a yield ${formatSpreadBps(bps).replace(/^\+/, '')} above the government benchmark. Wider spreads are often associated with higher perceived credit risk, weaker liquidity, or greater risk aversion; always relative to rating, sector, maturity, and market conditions.`;
  }
  return `The corporate bond yields below the selected government benchmark by ${formatSpreadBps(Math.abs(bps)).replace(/^\+/, '')}. Interpret relative to maturity match, currency, yield convention, and security features; do not treat negative spreads as calculator errors.`;
}

/**
 * Pure credit-spread engine. Never returns Infinity/NaN fields.
 * Rounding is applied only in formatted display strings.
 */
export function calculateCreditSpread(
  input: CreditSpreadInput,
): CreditSpreadResult | null {
  const { solveTarget, spreadInputUnit } = input;

  let corporateBondYield: number;
  let governmentBondYield: number;
  let spreadPercentagePoints: number;

  if (solveTarget === 'spread') {
    const yc = num(input.corporateBondYield);
    const yg = num(input.governmentBondYield);
    if (yc == null || yg == null) return null;
    if (Math.abs(yc) > MAX_ABS || Math.abs(yg) > MAX_ABS) return null;
    const calc = calculateCreditSpreadFromYields(yc, yg);
    if (!calc) return null;
    corporateBondYield = yc;
    governmentBondYield = yg;
    spreadPercentagePoints = calc.spreadPercentagePoints;
  } else if (solveTarget === 'corporateYield') {
    const yg = num(input.governmentBondYield);
    const spreadRaw = num(input.creditSpread);
    if (yg == null || spreadRaw == null) return null;
    if (Math.abs(yg) > MAX_ABS || Math.abs(spreadRaw) > MAX_ABS * 100) {
      return null;
    }
    const spreadPp = spreadToPercentagePoints(spreadRaw, spreadInputUnit);
    const yc = calculateCorporateBondYield(yg, spreadPp);
    if (yc === null) return null;
    corporateBondYield = yc;
    governmentBondYield = yg;
    spreadPercentagePoints = spreadPp;
  } else {
    const yc = num(input.corporateBondYield);
    const spreadRaw = num(input.creditSpread);
    if (yc == null || spreadRaw == null) return null;
    if (Math.abs(yc) > MAX_ABS || Math.abs(spreadRaw) > MAX_ABS * 100) {
      return null;
    }
    const spreadPp = spreadToPercentagePoints(spreadRaw, spreadInputUnit);
    const yg = calculateGovernmentBondYield(yc, spreadPp);
    if (yg === null) return null;
    corporateBondYield = yc;
    governmentBondYield = yg;
    spreadPercentagePoints = spreadPp;
  }

  const spreadBasisPoints =
    percentagePointsToBasisPoints(spreadPercentagePoints);
  if (
    !Number.isFinite(spreadBasisPoints) ||
    Math.abs(spreadBasisPoints) > MAX_ABS * 100
  ) {
    return null;
  }

  const yc = formatPercentDisplay(corporateBondYield);
  const yg = formatPercentDisplay(governmentBondYield);
  const ppLabel = formatSpreadPp(spreadPercentagePoints);
  const bpsLabel = formatSpreadBps(spreadBasisPoints);

  const formulaBreakdown = [
    'Credit Spread = Corporate Bond Yield − Government Bond Yield',
    `Credit Spread = ${yc} − ${yg}`,
    `Credit Spread = ${ppLabel.replace(/^\+/, '')}`,
    `Credit Spread (bps) = ${spreadPercentagePoints.toLocaleString('en-US', { maximumFractionDigits: 6 })} × 100`,
    `Credit Spread = ${bpsLabel.replace(/^\+/, '')}`,
  ].join('\n');

  const steps: string[] = [];
  if (solveTarget === 'spread') {
    steps.push(`Corporate bond yield Y_c = ${yc}`);
    steps.push(`Government bond yield Y_g = ${yg}`);
    steps.push('Apply CS = Y_c − Y_g (percentage points, not a relative %).');
    steps.push(
      `CS = ${corporateBondYield} − ${governmentBondYield} = ${spreadPercentagePoints} percentage points`,
    );
    steps.push(
      `Convert: CS_bps = ${spreadPercentagePoints} × 100 = ${spreadBasisPoints} bps`,
    );
  } else if (solveTarget === 'corporateYield') {
    steps.push(`Government yield Y_g = ${yg}`);
    steps.push(
      `Credit spread CS = ${spreadPercentagePoints} percentage points (${spreadBasisPoints} bps)`,
    );
    steps.push('Solve Y_c = Y_g + CS');
    steps.push(
      `Y_c = ${governmentBondYield} + ${spreadPercentagePoints} = ${yc}`,
    );
  } else {
    steps.push(`Corporate yield Y_c = ${yc}`);
    steps.push(
      `Credit spread CS = ${spreadPercentagePoints} percentage points (${spreadBasisPoints} bps)`,
    );
    steps.push('Solve Y_g = Y_c − CS');
    steps.push(
      `Y_g = ${corporateBondYield} − ${spreadPercentagePoints} = ${yg}`,
    );
  }

  return {
    solveTarget,
    corporateBondYield,
    governmentBondYield,
    spreadPercentagePoints,
    spreadBasisPoints,
    formattedCorporateYield: yc,
    formattedGovernmentYield: yg,
    formattedSpreadPp: ppLabel,
    formattedSpreadBps: bpsLabel,
    signLabel: signLabel(spreadPercentagePoints),
    formulaBreakdown,
    steps,
    interpretation: buildInterpretation(
      spreadPercentagePoints,
      spreadBasisPoints,
    ),
    explanation: buildExplanation(
      spreadPercentagePoints,
      spreadBasisPoints,
    ),
  };
}
