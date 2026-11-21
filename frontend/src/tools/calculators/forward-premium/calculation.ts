/**
 * Forward Premium Calculator — pure engine (ADR-018).
 *
 * Forward premium % = ((F − S) / S) × 100
 * Annualized premium % = premium % × (dayCountBasis / durationDays)
 *
 * Day-count basis defaults to 365 (repository convention when no selector is shown).
 * Negative premiums are forward discounts.
 */

import {
  FORWARD_PREMIUM_DAY_COUNT_BASIS,
  type ForwardPremiumEditedField,
  type ForwardPremiumInput,
  type ForwardPremiumResult,
} from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatRateDisplay(n: number, digits = 6): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

export function formatPercentDisplay(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping: false,
  })}%`;
}

export function forwardPremiumPercentFromRates(
  spotRate: number,
  forwardRate: number,
): number | null {
  if (
    !Number.isFinite(spotRate) ||
    !Number.isFinite(forwardRate) ||
    spotRate <= 0 ||
    forwardRate <= 0
  ) {
    return null;
  }
  const p = ((forwardRate - spotRate) / spotRate) * 100;
  return Number.isFinite(p) ? p : null;
}

export function forwardRateFromPremium(
  spotRate: number,
  forwardPremiumPercent: number,
): number | null {
  if (
    !Number.isFinite(spotRate) ||
    !Number.isFinite(forwardPremiumPercent) ||
    spotRate <= 0
  ) {
    return null;
  }
  const f = spotRate * (1 + forwardPremiumPercent / 100);
  return Number.isFinite(f) && f > 0 ? f : null;
}

export function spotRateFromPremium(
  forwardRate: number,
  forwardPremiumPercent: number,
): number | null {
  if (
    !Number.isFinite(forwardRate) ||
    !Number.isFinite(forwardPremiumPercent) ||
    forwardRate <= 0
  ) {
    return null;
  }
  const denom = 1 + forwardPremiumPercent / 100;
  if (denom === 0) return null;
  const s = forwardRate / denom;
  return Number.isFinite(s) && s > 0 ? s : null;
}

export function annualizeForwardPremium(
  forwardPremiumPercent: number,
  durationDays: number,
  dayCountBasis: number = FORWARD_PREMIUM_DAY_COUNT_BASIS,
): number | null {
  if (
    !Number.isFinite(forwardPremiumPercent) ||
    !Number.isFinite(durationDays) ||
    !Number.isFinite(dayCountBasis) ||
    durationDays <= 0 ||
    dayCountBasis <= 0
  ) {
    return null;
  }
  const a = forwardPremiumPercent * (dayCountBasis / durationDays);
  return Number.isFinite(a) ? a : null;
}

export function deAnnualizeForwardPremium(
  annualizedForwardPremiumPercent: number,
  durationDays: number,
  dayCountBasis: number = FORWARD_PREMIUM_DAY_COUNT_BASIS,
): number | null {
  if (
    !Number.isFinite(annualizedForwardPremiumPercent) ||
    !Number.isFinite(durationDays) ||
    !Number.isFinite(dayCountBasis) ||
    durationDays <= 0 ||
    dayCountBasis <= 0
  ) {
    return null;
  }
  const p = annualizedForwardPremiumPercent * (durationDays / dayCountBasis);
  return Number.isFinite(p) ? p : null;
}

export interface ForwardPremiumMath {
  spotRate: number;
  forwardRate: number;
  forwardPremiumPercent: number;
  durationDays: number;
  annualizedForwardPremiumPercent: number;
  dayCountBasis: number;
}

/**
 * Resolve linked fields from the last-edited authoritative input.
 * Primary path: spot + forward → premium; premium + duration → annualized.
 */
export function resolveForwardPremiumMath(
  input: ForwardPremiumInput,
  dayCountBasis: number = FORWARD_PREMIUM_DAY_COUNT_BASIS,
): ForwardPremiumMath | null {
  const edited: ForwardPremiumEditedField = input.lastEdited;
  const S = num(input.spotRate);
  const F = num(input.forwardRate);
  const P = num(input.forwardPremiumPercent);
  const D = num(input.durationDays);
  const A = num(input.annualizedForwardPremiumPercent);

  let spotRate: number;
  let forwardRate: number;
  let forwardPremiumPercent: number;
  let durationDays: number;
  let annualizedForwardPremiumPercent: number;

  if (edited === 'annualizedForwardPremiumPercent') {
    if (A == null || D == null || D <= 0) return null;
    const premium = deAnnualizeForwardPremium(A, D, dayCountBasis);
    if (premium == null) return null;
    forwardPremiumPercent = premium;
    annualizedForwardPremiumPercent = A;
    durationDays = D;
    if (S != null && S > 0) {
      const f = forwardRateFromPremium(S, premium);
      if (f == null) return null;
      spotRate = S;
      forwardRate = f;
    } else if (F != null && F > 0) {
      const s = spotRateFromPremium(F, premium);
      if (s == null) return null;
      spotRate = s;
      forwardRate = F;
    } else {
      return null;
    }
  } else if (edited === 'forwardPremiumPercent') {
    if (P == null) return null;
    forwardPremiumPercent = P;
    if (S != null && S > 0) {
      const f = forwardRateFromPremium(S, P);
      if (f == null) return null;
      spotRate = S;
      forwardRate = f;
    } else if (F != null && F > 0) {
      const s = spotRateFromPremium(F, P);
      if (s == null) return null;
      spotRate = s;
      forwardRate = F;
    } else {
      return null;
    }
    if (D == null || D <= 0) return null;
    durationDays = D;
    const ann = annualizeForwardPremium(P, D, dayCountBasis);
    if (ann == null) return null;
    annualizedForwardPremiumPercent = ann;
  } else if (edited === 'durationDays') {
    if (D == null || D <= 0) return null;
    durationDays = D;
    let premium: number | null = P;
    if (premium == null && S != null && F != null && S > 0 && F > 0) {
      premium = forwardPremiumPercentFromRates(S, F);
    }
    if (premium == null) return null;
    if (S != null && S > 0 && F != null && F > 0) {
      spotRate = S;
      forwardRate = F;
      forwardPremiumPercent = forwardPremiumPercentFromRates(S, F) ?? premium;
    } else if (S != null && S > 0) {
      const f = forwardRateFromPremium(S, premium);
      if (f == null) return null;
      spotRate = S;
      forwardRate = f;
      forwardPremiumPercent = premium;
    } else if (F != null && F > 0) {
      const s = spotRateFromPremium(F, premium);
      if (s == null) return null;
      spotRate = s;
      forwardRate = F;
      forwardPremiumPercent = premium;
    } else {
      return null;
    }
    const ann = annualizeForwardPremium(forwardPremiumPercent, D, dayCountBasis);
    if (ann == null) return null;
    annualizedForwardPremiumPercent = ann;
  } else {
    // spotRate or forwardRate edited (default path)
    if (S == null || F == null || S <= 0 || F <= 0) return null;
    spotRate = S;
    forwardRate = F;
    const premium = forwardPremiumPercentFromRates(S, F);
    if (premium == null) return null;
    forwardPremiumPercent = premium;
    if (D == null || D <= 0) return null;
    durationDays = D;
    const ann = annualizeForwardPremium(premium, D, dayCountBasis);
    if (ann == null) return null;
    annualizedForwardPremiumPercent = ann;
  }

  if (
    ![
      spotRate,
      forwardRate,
      forwardPremiumPercent,
      durationDays,
      annualizedForwardPremiumPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    spotRate,
    forwardRate,
    forwardPremiumPercent,
    durationDays,
    annualizedForwardPremiumPercent,
    dayCountBasis,
  };
}

export function calculateForwardPremiumFromInput(
  input: ForwardPremiumInput,
): ForwardPremiumResult | null {
  const math = resolveForwardPremiumMath(input);
  if (!math) return null;

  const {
    spotRate,
    forwardRate,
    forwardPremiumPercent,
    durationDays,
    annualizedForwardPremiumPercent,
    dayCountBasis,
  } = math;

  const isDiscount = forwardPremiumPercent < 0;
  const formulaBreakdown = [
    'Forward premium % = ((F − S) / S) × 100',
    `= ((${formatRateDisplay(forwardRate)} − ${formatRateDisplay(spotRate)}) / ${formatRateDisplay(spotRate)}) × 100`,
    `= ${formatPercentDisplay(forwardPremiumPercent)}`,
    '',
    `Annualized premium % = premium % × (${dayCountBasis} / days)`,
    `= ${formatPercentDisplay(forwardPremiumPercent)} × (${dayCountBasis} / ${formatRateDisplay(durationDays, 4)})`,
    `= ${formatPercentDisplay(annualizedForwardPremiumPercent)}`,
  ].join('\n');

  const steps = [
    `Spot rate S = ${formatRateDisplay(spotRate)}`,
    `Forward rate F = ${formatRateDisplay(forwardRate)}`,
    `Period premium = ((F − S) / S) × 100 = ${formatPercentDisplay(forwardPremiumPercent)}`,
    `Contract duration = ${formatRateDisplay(durationDays, 4)} days`,
    `Day-count basis = ${dayCountBasis}`,
    `Annualized premium = ${formatPercentDisplay(forwardPremiumPercent)} × (${dayCountBasis} / ${formatRateDisplay(durationDays, 4)}) = ${formatPercentDisplay(annualizedForwardPremiumPercent)}`,
  ];

  const interpretation = isDiscount
    ? `The forward rate is below the spot rate, so the quote shows a forward discount of ${formatPercentDisplay(Math.abs(forwardPremiumPercent))} over ${formatRateDisplay(durationDays, 4)} days (about ${formatPercentDisplay(Math.abs(annualizedForwardPremiumPercent))} annualized on a ${dayCountBasis}-day basis).`
    : forwardPremiumPercent === 0
      ? `The forward rate equals the spot rate; there is no forward premium or discount over ${formatRateDisplay(durationDays, 4)} days.`
      : `The forward rate is above the spot rate, so the quote shows a forward premium of ${formatPercentDisplay(forwardPremiumPercent)} over ${formatRateDisplay(durationDays, 4)} days (about ${formatPercentDisplay(annualizedForwardPremiumPercent)} annualized on a ${dayCountBasis}-day basis).`;

  const explanation =
    'This is a simple FX-style period and annualized premium from quoted spot and forward rates. It is not covered-interest parity, a swap quote, or a trading recommendation. Quote conventions (base/quote) must be consistent between spot and forward.';

  return {
    spotRate,
    forwardRate,
    forwardPremiumPercent,
    durationDays,
    annualizedForwardPremiumPercent,
    dayCountBasis,
    isDiscount,
    formattedSpot: formatRateDisplay(spotRate),
    formattedForward: formatRateDisplay(forwardRate),
    formattedPremium: formatPercentDisplay(forwardPremiumPercent),
    formattedDuration: `${formatRateDisplay(durationDays, 4)} days`,
    formattedAnnualized: formatPercentDisplay(annualizedForwardPremiumPercent),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
