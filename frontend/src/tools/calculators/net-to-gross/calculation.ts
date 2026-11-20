/**
 * Net↔gross with tax T = G − N.
 * rN = (T/N)×100; rG = (T/G)×100 (two views of the same tax).
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatNetToGrossMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatNetToGrossPercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rate);
}

export interface NetToGrossComputation {
  net: number;
  gross: number;
  tax: number;
  rateFromNet: number;
  rateFromGross: number;
}

function pack(net: number, gross: number): NetToGrossComputation | null {
  if (![net, gross].every(Number.isFinite)) return null;
  if (net < 0 || gross < 0) return null;
  if (gross < net) return null;
  const tax = gross - net;
  if (!(tax >= 0) || !Number.isFinite(tax)) return null;
  const rateFromNet = net === 0 ? (tax === 0 ? 0 : Number.NaN) : (tax / net) * 100;
  const rateFromGross =
    gross === 0 ? (tax === 0 ? 0 : Number.NaN) : (tax / gross) * 100;
  if (![rateFromNet, rateFromGross].every(Number.isFinite)) return null;
  return { net, gross, tax, rateFromNet, rateFromGross };
}

/** Authoritative: net + % of net. */
export function fromNetAndRateFromNet(
  net: number,
  rateFromNet: number
): NetToGrossComputation | null {
  if (![net, rateFromNet].every(Number.isFinite) || net < 0 || rateFromNet < 0) {
    return null;
  }
  const tax = net * (rateFromNet / 100);
  return pack(net, net + tax);
}

/** Authoritative: gross + % of gross. */
export function fromGrossAndRateFromGross(
  gross: number,
  rateFromGross: number
): NetToGrossComputation | null {
  if (
    ![gross, rateFromGross].every(Number.isFinite) ||
    gross < 0 ||
    rateFromGross < 0 ||
    rateFromGross >= 100
  ) {
    return null;
  }
  const net = gross * (1 - rateFromGross / 100);
  return pack(net, gross);
}

/** Authoritative: net + gross. */
export function fromNetAndGross(
  net: number,
  gross: number
): NetToGrossComputation | null {
  return pack(net, gross);
}

/** Authoritative: net + tax. */
export function fromNetAndTax(
  net: number,
  tax: number
): NetToGrossComputation | null {
  if (![net, tax].every(Number.isFinite) || net < 0 || tax < 0) return null;
  return pack(net, net + tax);
}

/** Authoritative: gross + tax. */
export function fromGrossAndTax(
  gross: number,
  tax: number
): NetToGrossComputation | null {
  if (![gross, tax].every(Number.isFinite) || gross < 0 || tax < 0) return null;
  return pack(gross - tax, gross);
}

/** Net + % of gross → Gross = Net / (1 − rG/100). */
export function fromNetAndRateFromGross(
  net: number,
  rateFromGross: number
): NetToGrossComputation | null {
  if (
    ![net, rateFromGross].every(Number.isFinite) ||
    net < 0 ||
    rateFromGross < 0 ||
    rateFromGross >= 100
  ) {
    return null;
  }
  const denom = 1 - rateFromGross / 100;
  if (!(denom > 0)) return null;
  return pack(net, net / denom);
}

/** Gross + % of net → Net = Gross / (1 + rN/100). */
export function fromGrossAndRateFromNet(
  gross: number,
  rateFromNet: number
): NetToGrossComputation | null {
  if (![gross, rateFromNet].every(Number.isFinite) || gross < 0 || rateFromNet < 0) {
    return null;
  }
  const denom = 1 + rateFromNet / 100;
  if (!(denom > 0)) return null;
  return pack(gross / denom, gross);
}
