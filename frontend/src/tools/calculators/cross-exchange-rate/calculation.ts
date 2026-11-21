/**
 * Cross Exchange Rate Calculator — pure engine (ADR-018).
 *
 * Given bridge currency C:
 *   A/B = (A/C) ÷ (B/C)
 *   B/A = 1 ÷ (A/B)
 *
 * Reciprocals:
 *   C/A = 1 ÷ (A/C),  A/C = 1 ÷ (C/A)
 *   C/B = 1 ÷ (B/C),  B/C = 1 ÷ (C/B)
 *
 * Rates must be finite and strictly positive. No live FX — entered rates only.
 */

import type {
  CrossExchangeRateInput,
  CrossExchangeRateResult,
} from './types';

const MAX_RATE = 1e12;
const RECIPROCAL_EPS = 1e-9;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function reciprocal(rate: number): number | null {
  if (!Number.isFinite(rate) || rate <= 0) return null;
  const inv = 1 / rate;
  if (!Number.isFinite(inv) || inv <= 0) return null;
  return inv;
}

export function areReciprocals(a: number, b: number): boolean {
  if (!(a > 0) || !(b > 0)) return false;
  const product = a * b;
  return Math.abs(product - 1) <= Math.max(RECIPROCAL_EPS, 1e-12 * product);
}

export function formatRate(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  let maxFrac = 8;
  if (abs >= 1000) maxFrac = 4;
  else if (abs >= 1) maxFrac = 6;
  const rounded = Number(n.toFixed(maxFrac));
  return rounded.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: maxFrac,
  });
}

function resolvePair(
  forwardRaw: string,
  reverseRaw: string,
  forwardLabel: string,
  reverseLabel: string,
):
  | {
      ok: true;
      forward: number;
      reverse: number;
      source: 'forward' | 'reverse';
    }
  | { ok: false; error: string; field: 'forward' | 'reverse' | 'both' } {
  const forward = num(forwardRaw);
  const reverse = num(reverseRaw);
  const hasF = forward != null;
  const hasR = reverse != null;

  if (!hasF && !hasR) {
    return {
      ok: false,
      error: `Enter ${forwardLabel} or ${reverseLabel}.`,
      field: 'both',
    };
  }

  if (hasF && (forward! <= 0 || forward! > MAX_RATE)) {
    return {
      ok: false,
      error: `${forwardLabel} must be a positive number.`,
      field: 'forward',
    };
  }
  if (hasR && (reverse! <= 0 || reverse! > MAX_RATE)) {
    return {
      ok: false,
      error: `${reverseLabel} must be a positive number.`,
      field: 'reverse',
    };
  }

  if (hasF && hasR) {
    if (!areReciprocals(forward!, reverse!)) {
      return {
        ok: false,
        error: `${forwardLabel} and ${reverseLabel} conflict. Enter only one direction, or matching reciprocals.`,
        field: 'both',
      };
    }
    return {
      ok: true,
      forward: forward!,
      reverse: reverse!,
      source: 'forward',
    };
  }

  if (hasF) {
    const inv = reciprocal(forward!);
    if (inv == null) {
      return {
        ok: false,
        error: `Unable to derive ${reverseLabel} from ${forwardLabel}.`,
        field: 'forward',
      };
    }
    return { ok: true, forward: forward!, reverse: inv, source: 'forward' };
  }

  const inv = reciprocal(reverse!);
  if (inv == null) {
    return {
      ok: false,
      error: `Unable to derive ${forwardLabel} from ${reverseLabel}.`,
      field: 'reverse',
    };
  }
  return { ok: true, forward: inv, reverse: reverse!, source: 'reverse' };
}

export function calculateCrossRate(
  rateAC: number,
  rateBC: number,
): { crossAB: number; crossBA: number } | null {
  if (!(rateAC > 0) || !(rateBC > 0)) return null;
  if (!Number.isFinite(rateAC) || !Number.isFinite(rateBC)) return null;
  if (rateAC > MAX_RATE || rateBC > MAX_RATE) return null;
  const crossAB = rateAC / rateBC;
  const crossBA = reciprocal(crossAB);
  if (
    crossBA == null ||
    !Number.isFinite(crossAB) ||
    crossAB <= 0 ||
    crossAB > MAX_RATE
  ) {
    return null;
  }
  return { crossAB, crossBA };
}

/**
 * Pure cross-rate engine. Never returns Infinity/NaN fields.
 */
export function calculateCrossExchangeRate(
  input: CrossExchangeRateInput,
): CrossExchangeRateResult | null {
  const pairA = resolvePair(
    input.rateAC,
    input.rateCA,
    'exchange rate A/C',
    'exchange rate C/A',
  );
  const pairB = resolvePair(
    input.rateBC,
    input.rateCB,
    'exchange rate B/C',
    'exchange rate C/B',
  );

  if (!pairA.ok || !pairB.ok) return null;

  const cross = calculateCrossRate(pairA.forward, pairB.forward);
  if (!cross) return null;

  const { crossAB, crossBA } = cross;
  const formattedAC = formatRate(pairA.forward);
  const formattedCA = formatRate(pairA.reverse);
  const formattedBC = formatRate(pairB.forward);
  const formattedCB = formatRate(pairB.reverse);
  const formattedAB = formatRate(crossAB);
  const formattedBA = formatRate(crossBA);

  const formulaBreakdown = [
    'A/B = (A/C) ÷ (B/C)',
    `A/B = ${formattedAC} ÷ ${formattedBC}`,
    `A/B = ${formattedAB}`,
    'B/A = 1 ÷ (A/B)',
    `B/A = 1 ÷ ${formattedAB} = ${formattedBA}`,
  ].join('\n');

  const steps: string[] = [];
  if (pairA.source === 'forward') {
    steps.push(`Entered A/C = ${formattedAC}`);
    steps.push(`Derived C/A = 1 ÷ ${formattedAC} = ${formattedCA}`);
  } else {
    steps.push(`Entered C/A = ${formattedCA}`);
    steps.push(`Derived A/C = 1 ÷ ${formattedCA} = ${formattedAC}`);
  }
  if (pairB.source === 'forward') {
    steps.push(`Entered B/C = ${formattedBC}`);
    steps.push(`Derived C/B = 1 ÷ ${formattedBC} = ${formattedCB}`);
  } else {
    steps.push(`Entered C/B = ${formattedCB}`);
    steps.push(`Derived B/C = 1 ÷ ${formattedCB} = ${formattedBC}`);
  }
  steps.push(
    `Cross A/B = (A/C) ÷ (B/C) = ${formattedAC} ÷ ${formattedBC} = ${formattedAB}`,
  );
  steps.push(
    `Cross B/A = 1 ÷ (A/B) = 1 ÷ ${formattedAB} = ${formattedBA}`,
  );

  return {
    rateAC: pairA.forward,
    rateCA: pairA.reverse,
    rateBC: pairB.forward,
    rateCB: pairB.reverse,
    crossAB,
    crossBA,
    formattedAC,
    formattedCA,
    formattedBC,
    formattedCB,
    formattedAB,
    formattedBA,
    pairASource: pairA.source === 'forward' ? 'AC' : 'CA',
    pairBSource: pairB.source === 'forward' ? 'BC' : 'CB',
    formulaBreakdown,
    steps,
    interpretation: `One unit of currency A equals ${formattedAB} units of currency B (and one B equals ${formattedBA} units of A), using C as the bridge.`,
    explanation:
      "Capital letters A, B, and C are arbitrary currency labels. Quote each source pair in one direction only; the calculator derives the reciprocal and the A/B ↔ B/A cross rates. Entered rates are used as-is — this tool does not fetch live FX.",
  };
}
