import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AreaUnit, RatePeriod, RentPeriod } from './types';

/** Exact SI conversion: 1 ft² = 0.09290304 m². */
export const SQ_FT_TO_M2 = 0.09290304;

export function areaToSquareMetres(area: number, unit: AreaUnit): number {
  return unit === 'm2' ? area : area * SQ_FT_TO_M2;
}

/** Convert a money-per-area rate into money per m². */
export function rateToPerSquareMetre(rate: number, unit: AreaUnit): number {
  return unit === 'm2' ? rate : rate / SQ_FT_TO_M2;
}

/** Convert a money-per-area rate from m² into the display area unit. */
export function rateFromPerSquareMetre(ratePerM2: number, unit: AreaUnit): number {
  return unit === 'm2' ? ratePerM2 : ratePerM2 * SQ_FT_TO_M2;
}

export function rateToPerYear(rate: number, period: RatePeriod): number {
  return period === 'yr' ? rate : rate * 12;
}

export function rateFromPerYear(ratePerYear: number, period: RatePeriod): number {
  return period === 'yr' ? ratePerYear : ratePerYear / 12;
}

export function rentFromAnnual(annualRent: number, period: RentPeriod): number {
  return period === 'yr' ? annualRent : annualRent / 12;
}

export function formatCommercialLeaseMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Core commercial lease math in a single currency (full precision).
 * Rates must already be normalized to money per m² per year.
 */
export function calculateCommercialLease(input: {
  areaM2: number;
  baseRatePerM2PerYear: number;
  opexPerM2PerYear: number;
  agentPercent: number;
  agentYears: number;
}): {
  totalRatePerM2PerYear: number;
  annualRent: number;
  fee: number;
} | null {
  const {
    areaM2,
    baseRatePerM2PerYear,
    opexPerM2PerYear,
    agentPercent,
    agentYears,
  } = input;

  if (
    ![areaM2, baseRatePerM2PerYear, opexPerM2PerYear, agentPercent, agentYears].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (areaM2 <= 0) return null;
  if (baseRatePerM2PerYear < 0 || opexPerM2PerYear < 0) return null;
  if (agentPercent < 0 || agentYears < 0) return null;

  const totalRatePerM2PerYear = baseRatePerM2PerYear + opexPerM2PerYear;
  const annualRent = totalRatePerM2PerYear * areaM2;
  const fee = (annualRent * agentYears * agentPercent) / 100;

  if (![totalRatePerM2PerYear, annualRent, fee].every(Number.isFinite)) {
    return null;
  }

  return { totalRatePerM2PerYear, annualRent, fee };
}
