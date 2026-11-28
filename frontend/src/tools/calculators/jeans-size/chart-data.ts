/**
 * Illustrative jeans body charts by waist circumference.
 * Not a universal brand standard — vanity sizing and stretch vary.
 */

import type {
  InseamOption,
  MensJeansChartRow,
  WomensJeansChartRow,
} from './types';

export const CHART_SOURCE =
  "Illustrative jeans body chart by waist circumference (approximate). Brands, rise, stretch, and vanity sizing vary — always check the manufacturer's size guide.";

export const CHART_VERSION = 'omega-jeans-v1-2026-11';

/** Men's nominal W sizes — contiguous cm ranges; shared max prefers smaller. */
export const MENS_JEANS_CHART: readonly MensJeansChartRow[] = [
  { waistLabel: 'W28', minWaistCm: 71, maxWaistCm: 74, international: 'XS' },
  { waistLabel: 'W29', minWaistCm: 74, maxWaistCm: 76, international: 'XS' },
  { waistLabel: 'W30', minWaistCm: 76, maxWaistCm: 79, international: 'S' },
  { waistLabel: 'W31', minWaistCm: 79, maxWaistCm: 81, international: 'S' },
  { waistLabel: 'W32', minWaistCm: 81, maxWaistCm: 84, international: 'M' },
  { waistLabel: 'W33', minWaistCm: 84, maxWaistCm: 86, international: 'M' },
  { waistLabel: 'W34', minWaistCm: 86, maxWaistCm: 89, international: 'L' },
  { waistLabel: 'W36', minWaistCm: 89, maxWaistCm: 94, international: 'L' },
  { waistLabel: 'W38', minWaistCm: 94, maxWaistCm: 99, international: 'XL' },
  { waistLabel: 'W40', minWaistCm: 99, maxWaistCm: 104, international: 'XL' },
  { waistLabel: 'W42', minWaistCm: 104, maxWaistCm: 109, international: 'XXL' },
];

/** Women's waist bands with US/UK/EU letter/number ladders. */
export const WOMENS_JEANS_CHART: readonly WomensJeansChartRow[] = [
  {
    waistLabel: 'W24',
    minWaistCm: 58,
    maxWaistCm: 61,
    us: '0',
    uk: '4',
    eu: '32',
    international: 'XXS',
  },
  {
    waistLabel: 'W25',
    minWaistCm: 61,
    maxWaistCm: 64,
    us: '2',
    uk: '6',
    eu: '34',
    international: 'XS',
  },
  {
    waistLabel: 'W26',
    minWaistCm: 64,
    maxWaistCm: 66,
    us: '4',
    uk: '8',
    eu: '36',
    international: 'XS',
  },
  {
    waistLabel: 'W27',
    minWaistCm: 66,
    maxWaistCm: 69,
    us: '6',
    uk: '10',
    eu: '38',
    international: 'S',
  },
  {
    waistLabel: 'W28',
    minWaistCm: 69,
    maxWaistCm: 71,
    us: '8',
    uk: '12',
    eu: '40',
    international: 'S',
  },
  {
    waistLabel: 'W29',
    minWaistCm: 71,
    maxWaistCm: 74,
    us: '10',
    uk: '14',
    eu: '42',
    international: 'M',
  },
  {
    waistLabel: 'W30',
    minWaistCm: 74,
    maxWaistCm: 76,
    us: '12',
    uk: '16',
    eu: '44',
    international: 'M',
  },
  {
    waistLabel: 'W31',
    minWaistCm: 76,
    maxWaistCm: 79,
    us: '14',
    uk: '18',
    eu: '46',
    international: 'L',
  },
  {
    waistLabel: 'W32',
    minWaistCm: 79,
    maxWaistCm: 84,
    us: '16',
    uk: '20',
    eu: '48',
    international: 'L',
  },
  {
    waistLabel: 'W34',
    minWaistCm: 84,
    maxWaistCm: 89,
    us: '18',
    uk: '22',
    eu: '50',
    international: 'XL',
  },
  {
    waistLabel: 'W36',
    minWaistCm: 89,
    maxWaistCm: 94,
    us: '20',
    uk: '24',
    eu: '52',
    international: 'XL',
  },
];

export const INSEAM_OPTIONS: readonly InseamOption[] = [
  { label: 'L28', inches: 28 },
  { label: 'L30', inches: 30 },
  { label: 'L32', inches: 32 },
  { label: 'L34', inches: 34 },
  { label: 'L36', inches: 36 },
  { label: 'L38', inches: 38 },
];

export function getMensJeansSizeChart(): readonly MensJeansChartRow[] {
  return MENS_JEANS_CHART;
}

export function getWomensJeansSizeChart(): readonly WomensJeansChartRow[] {
  return WOMENS_JEANS_CHART;
}

export function getInseamOptions(): readonly InseamOption[] {
  return INSEAM_OPTIONS;
}
