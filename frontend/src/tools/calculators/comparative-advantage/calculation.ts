/**
 * Opportunity costs (same-country productivity ratios):
 * OC_A = B/A, OC_B = A/B
 * Comparative advantage = lower opportunity cost.
 * Absolute advantage = higher productivity.
 */
import type { Advantage, Producer, SpecializeGood } from './types';

export const OC_EQUALITY_TOLERANCE = 1e-9;

export function opportunityCostOfA(outputA: number, outputB: number): number | null {
  if (![outputA, outputB].every(Number.isFinite) || outputA <= 0 || outputB <= 0) {
    return null;
  }
  const oc = outputB / outputA;
  return Number.isFinite(oc) ? oc : null;
}

export function opportunityCostOfB(outputA: number, outputB: number): number | null {
  if (![outputA, outputB].every(Number.isFinite) || outputA <= 0 || outputB <= 0) {
    return null;
  }
  const oc = outputA / outputB;
  return Number.isFinite(oc) ? oc : null;
}

export function compareOpportunityCosts(
  ocX: number,
  ocY: number,
  tolerance = OC_EQUALITY_TOLERANCE
): Advantage {
  const scale = Math.max(1, Math.abs(ocX), Math.abs(ocY));
  if (Math.abs(ocX - ocY) <= tolerance * scale) return 'tie';
  return ocX < ocY ? 'countryX' : 'countryY';
}

export function compareProductivity(
  x: number,
  y: number,
  tolerance = OC_EQUALITY_TOLERANCE
): Advantage {
  const scale = Math.max(1, Math.abs(x), Math.abs(y));
  if (Math.abs(x - y) <= tolerance * scale) return 'tie';
  return x > y ? 'countryX' : 'countryY';
}

export function specializationFor(
  comparativeA: Advantage,
  comparativeB: Advantage,
  producer: Producer
): SpecializeGood {
  if (comparativeA === producer && comparativeB !== producer) return 'goodA';
  if (comparativeB === producer && comparativeA !== producer) return 'goodB';
  return 'none';
}

/** Mutually beneficial terms-of-trade interval for Good A in units of Good B. */
export function termsOfTradeIntervalForA(
  ocXA: number,
  ocYA: number
): { low: number; high: number } | null {
  if (![ocXA, ocYA].every(Number.isFinite)) return null;
  if (Math.abs(ocXA - ocYA) <= OC_EQUALITY_TOLERANCE) return null;
  const low = Math.min(ocXA, ocYA);
  const high = Math.max(ocXA, ocYA);
  return { low, high };
}

export function formatOc(value: number, sacrificedLabel: string): string {
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
  return `${n} ${sacrificedLabel}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
}

export function producerLabel(p: Advantage): string {
  if (p === 'tie') return 'Equal / neither unique';
  if (p === 'countryX') return 'Country X';
  return 'Country Y';
}

export function advantageStatus(
  owner: Producer,
  winner: Advantage
): 'Comparative Advantage' | 'No Comparative Advantage' | 'Equal Opportunity Cost' {
  if (winner === 'tie') return 'Equal Opportunity Cost';
  if (winner === owner) return 'Comparative Advantage';
  return 'No Comparative Advantage';
}

export interface ComparativeAdvantageMathResult {
  ocXA: number;
  ocXB: number;
  ocYA: number;
  ocYB: number;
  comparativeA: Advantage;
  comparativeB: Advantage;
  absoluteA: Advantage;
  absoluteB: Advantage;
  specializeX: SpecializeGood;
  specializeY: SpecializeGood;
  termsOfTrade: { low: number; high: number } | null;
}

export function calculateComparativeAdvantage(
  xa: number,
  xb: number,
  ya: number,
  yb: number
): ComparativeAdvantageMathResult | null {
  const ocXA = opportunityCostOfA(xa, xb);
  const ocXB = opportunityCostOfB(xa, xb);
  const ocYA = opportunityCostOfA(ya, yb);
  const ocYB = opportunityCostOfB(ya, yb);
  if (ocXA == null || ocXB == null || ocYA == null || ocYB == null) return null;

  // Reciprocal consistency check (same-country)
  if (
    Math.abs(ocXA * ocXB - 1) > 1e-8 ||
    Math.abs(ocYA * ocYB - 1) > 1e-8
  ) {
    return null;
  }

  const comparativeA = compareOpportunityCosts(ocXA, ocYA);
  const comparativeB = compareOpportunityCosts(ocXB, ocYB);
  const absoluteA = compareProductivity(xa, ya);
  const absoluteB = compareProductivity(xb, yb);

  return {
    ocXA,
    ocXB,
    ocYA,
    ocYB,
    comparativeA,
    comparativeB,
    absoluteA,
    absoluteB,
    specializeX: specializationFor(comparativeA, comparativeB, 'countryX'),
    specializeY: specializationFor(comparativeA, comparativeB, 'countryY'),
    termsOfTrade: termsOfTradeIntervalForA(ocXA, ocYA),
  };
}
