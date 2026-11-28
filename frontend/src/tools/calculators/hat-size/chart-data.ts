/**
 * Illustrative hat size charts by head circumference.
 * Not a universal brand standard — always check the manufacturer chart.
 */

import type { AdultHatChartRow, ChildHatChartRow } from './types';

export const CHART_SOURCE =
  "Illustrative head-circumference hat chart (approximate). Brands, styles, and materials vary — always check the manufacturer's size guide.";

export const CHART_VERSION = 'omega-hat-v1-2026-11';

/** Adult retail-style mappings; EU ≈ circumference in cm. */
export const ADULT_HAT_CHART: readonly AdultHatChartRow[] = [
  {
    circumferenceCm: 52,
    international: 'XS',
    us: '6½',
    uk: '6⅜',
    eu: 52,
  },
  {
    circumferenceCm: 53,
    international: 'XS',
    us: '6⅝',
    uk: '6½',
    eu: 53,
  },
  {
    circumferenceCm: 54,
    international: 'S',
    us: '6¾',
    uk: '6⅝',
    eu: 54,
  },
  {
    circumferenceCm: 55,
    international: 'S',
    us: '6⅞',
    uk: '6¾',
    eu: 55,
  },
  {
    circumferenceCm: 56,
    international: 'M',
    us: '7',
    uk: '6⅞',
    eu: 56,
  },
  {
    circumferenceCm: 57,
    international: 'M',
    us: '7⅛',
    uk: '7',
    eu: 57,
  },
  {
    circumferenceCm: 58,
    international: 'L',
    us: '7¼',
    uk: '7⅛',
    eu: 58,
  },
  {
    circumferenceCm: 59,
    international: 'L',
    us: '7⅜',
    uk: '7¼',
    eu: 59,
  },
  {
    circumferenceCm: 60,
    international: 'XL',
    us: '7½',
    uk: '7⅜',
    eu: 60,
  },
  {
    circumferenceCm: 61,
    international: 'XL',
    us: '7⅝',
    uk: '7½',
    eu: 61,
  },
  {
    circumferenceCm: 62,
    international: 'XXL',
    us: '7¾',
    uk: '7⅝',
    eu: 62,
  },
  {
    circumferenceCm: 63,
    international: 'XXL',
    us: '7⅞',
    uk: '7¾',
    eu: 63,
  },
  {
    circumferenceCm: 64,
    international: 'XXXL',
    us: '8',
    uk: '7⅞',
    eu: 64,
  },
];

/** Child ranges — age is approximate; circumference is authoritative. */
export const CHILD_HAT_CHART: readonly ChildHatChartRow[] = [
  {
    approximateAge: '0–3 months',
    minCircumferenceCm: 35,
    maxCircumferenceCm: 40,
    sizeLabel: 'Newborn / 0–3M',
  },
  {
    approximateAge: '3–6 months',
    minCircumferenceCm: 40,
    maxCircumferenceCm: 43,
    sizeLabel: '3–6 months',
  },
  {
    approximateAge: '6–12 months',
    minCircumferenceCm: 43,
    maxCircumferenceCm: 47,
    sizeLabel: '6–12 months',
  },
  {
    approximateAge: '1–2 years',
    minCircumferenceCm: 47,
    maxCircumferenceCm: 49,
    sizeLabel: '1–2 years',
  },
  {
    approximateAge: '2–4 years',
    minCircumferenceCm: 49,
    maxCircumferenceCm: 51,
    sizeLabel: '2–4 years',
  },
  {
    approximateAge: '4–6 years',
    minCircumferenceCm: 51,
    maxCircumferenceCm: 53,
    sizeLabel: '4–6 years',
  },
  {
    approximateAge: '6–8 years',
    minCircumferenceCm: 53,
    maxCircumferenceCm: 56,
    sizeLabel: '6–8 years',
  },
];

export function getAdultHatChart(): readonly AdultHatChartRow[] {
  return ADULT_HAT_CHART;
}

export function getChildHatChart(): readonly ChildHatChartRow[] {
  return CHILD_HAT_CHART;
}
