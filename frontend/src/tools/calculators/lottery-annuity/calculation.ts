/**
 * Lottery annuity as a growing ordinary annuity.
 *
 * Prize amount is treated as the present value (PV) of the payout stream.
 * First payout P solves PV = growing-annuity factor × P, then:
 *   Payout_year = P × (1+g)^(year−1)
 *
 * Cases:
 * - r ≠ g: factor = (1 − ((1+g)/(1+r))^n) / (r − g)
 * - r = g: factor = n / (1+r)   (requires 1+r ≠ 0)
 * - r = 0, g ≠ 0: factor = ((1+g)^n − 1) / g
 * - r = 0, g = 0: factor = n
 */

export function firstLotteryPayout(input: {
  prizePresentValue: number;
  years: number;
  growthRate: number;
  returnRate: number;
}): number | null {
  const { prizePresentValue: pv, years: n, growthRate: g, returnRate: r } = input;

  if (![pv, n, g, r].every(Number.isFinite)) return null;
  if (!(pv > 0) || !(n > 0) || !Number.isInteger(n)) return null;
  if (g <= -1) return null;
  if (r <= -1) return null;

  let factor: number;
  if (Math.abs(r - g) < 1e-15) {
    const onePlusR = 1 + r;
    if (Math.abs(onePlusR) < 1e-15) return null;
    factor = n / onePlusR;
  } else if (Math.abs(r) < 1e-15) {
    // r = 0, g ≠ 0
    factor = (Math.pow(1 + g, n) - 1) / g;
  } else {
    const ratio = (1 + g) / (1 + r);
    if (!(ratio > 0) || !Number.isFinite(ratio)) return null;
    factor = (1 - Math.pow(ratio, n)) / (r - g);
  }

  if (!Number.isFinite(factor) || !(factor > 0)) return null;
  const first = pv / factor;
  return Number.isFinite(first) && first > 0 ? first : null;
}

export function buildLotteryAnnuitySchedule(input: {
  firstPayout: number;
  years: number;
  growthRate: number;
  /** After-tax multiplier in [0, 1]. 1 = no tax. */
  netMultiplier: number;
}): { year: number; payout: number; totalPayout: number }[] | null {
  const { firstPayout, years, growthRate: g, netMultiplier } = input;
  if (![firstPayout, years, g, netMultiplier].every(Number.isFinite)) return null;
  if (!(firstPayout > 0) || !(years > 0) || !Number.isInteger(years)) return null;
  if (g <= -1) return null;
  if (!(netMultiplier >= 0) || !(netMultiplier <= 1)) return null;

  const rows: { year: number; payout: number; totalPayout: number }[] = [];
  let total = 0;
  for (let year = 1; year <= years; year++) {
    const gross = firstPayout * Math.pow(1 + g, year - 1);
    if (!Number.isFinite(gross)) return null;
    const payout = gross * netMultiplier;
    if (!Number.isFinite(payout)) return null;
    total += payout;
    if (!Number.isFinite(total)) return null;
    rows.push({ year, payout, totalPayout: total });
  }
  return rows;
}

export function formatLotteryMoney(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
