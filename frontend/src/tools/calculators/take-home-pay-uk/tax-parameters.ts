/**
 * UK Income Tax parameters (non-savings earned/property income).
 * Sources: GOV.UK Income Tax rates and allowances; Scottish Income Tax bands;
 * HMRC rates and thresholds for employers 2024/25–2026/27.
 */
import type { NiTaxYearId } from '../national-insurance/ni-parameters';
import {
  DEFAULT_NI_TAX_YEAR,
  NI_TAX_YEAR_OPTIONS,
} from '../national-insurance/ni-parameters';

export type UkLocation = 'england' | 'scotland' | 'wales' | 'northern_ireland';
export type UkTaxYearId = NiTaxYearId;

export const UK_TAX_YEAR_OPTIONS = NI_TAX_YEAR_OPTIONS;
export const DEFAULT_UK_TAX_YEAR = DEFAULT_NI_TAX_YEAR;

export const UK_LOCATION_OPTIONS: readonly {
  value: UkLocation;
  label: string;
}[] = [
  { value: 'england', label: 'England' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'wales', label: 'Wales' },
  { value: 'northern_ireland', label: 'Northern Ireland' },
] as const;

export const PERSONAL_ALLOWANCE = 12_570;
export const PA_TAPER_THRESHOLD = 100_000;

export interface TaxBand {
  /** Upper bound of taxable income in this band (exclusive of next); Infinity for top */
  upTo: number;
  rate: number;
  label: string;
}

/** England / Wales / NI bands of taxable income after personal allowance. */
export const RUK_BANDS: readonly TaxBand[] = [
  { upTo: 37_700, rate: 0.2, label: 'Basic' },
  { upTo: 125_140, rate: 0.4, label: 'Higher' },
  { upTo: Infinity, rate: 0.45, label: 'Additional' },
];

/** Scottish bands after PA — year-specific starter/basic widths. */
export const SCOTTISH_BANDS: Record<UkTaxYearId, readonly TaxBand[]> = {
  '2024-25': [
    { upTo: 2_306, rate: 0.19, label: 'Starter' },
    { upTo: 13_991, rate: 0.2, label: 'Basic' },
    { upTo: 31_092, rate: 0.21, label: 'Intermediate' },
    { upTo: 62_430, rate: 0.42, label: 'Higher' },
    { upTo: 125_140, rate: 0.45, label: 'Advanced' },
    { upTo: Infinity, rate: 0.48, label: 'Top' },
  ],
  '2025-26': [
    { upTo: 2_827, rate: 0.19, label: 'Starter' },
    { upTo: 14_921, rate: 0.2, label: 'Basic' },
    { upTo: 31_092, rate: 0.21, label: 'Intermediate' },
    { upTo: 62_430, rate: 0.42, label: 'Higher' },
    { upTo: 125_140, rate: 0.45, label: 'Advanced' },
    { upTo: Infinity, rate: 0.48, label: 'Top' },
  ],
  '2026-27': [
    { upTo: 3_967, rate: 0.19, label: 'Starter' },
    { upTo: 16_956, rate: 0.2, label: 'Basic' },
    { upTo: 31_092, rate: 0.21, label: 'Intermediate' },
    { upTo: 62_430, rate: 0.42, label: 'Higher' },
    { upTo: 125_140, rate: 0.45, label: 'Advanced' },
    { upTo: Infinity, rate: 0.48, label: 'Top' },
  ],
};

export function bandsForLocation(
  location: UkLocation,
  taxYear: UkTaxYearId
): readonly TaxBand[] {
  if (location === 'scotland') return SCOTTISH_BANDS[taxYear];
  return RUK_BANDS;
}

/** Personal allowance after £100k taper (£1 per £2). */
export function personalAllowanceForIncome(adjustedNetIncome: number): number {
  if (!(adjustedNetIncome > PA_TAPER_THRESHOLD)) return PERSONAL_ALLOWANCE;
  const reduction = Math.floor((adjustedNetIncome - PA_TAPER_THRESHOLD) / 2);
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}
