/**
 * Illustrative jacket body charts by chest/bust circumference.
 * Not a universal brand standard — always check the manufacturer chart.
 *
 * Men's US/UK numerical sizes align with common suit-jacket chest bands.
 * Women's sizes follow conventional bust-based jacket/dress equivalences.
 */

import type { JacketSizeChartRow, JacketSizingCategory } from './types';

export const CHART_SOURCE =
  "Illustrative jacket body chart by chest/bust circumference (approximate). Brands, styles, and fits vary — always check the manufacturer's size guide.";

export const CHART_VERSION = 'omega-jacket-v1-2026-11';

/** Contiguous cm ranges; shared boundary prefers the smaller size. */
export const MENS_JACKET_CHART: readonly JacketSizeChartRow[] = [
  {
    label: '34',
    international: 'XS',
    us: '34',
    uk: '34',
    eu: '44',
    minChestCm: 86,
    maxChestCm: 89,
  },
  {
    label: '36',
    international: 'S',
    us: '36',
    uk: '36',
    eu: '46',
    minChestCm: 89,
    maxChestCm: 94,
  },
  {
    label: '38',
    international: 'S',
    us: '38',
    uk: '38',
    eu: '48',
    minChestCm: 94,
    maxChestCm: 99,
  },
  {
    label: '40',
    international: 'M',
    us: '40',
    uk: '40',
    eu: '50',
    minChestCm: 99,
    maxChestCm: 104,
  },
  {
    label: '42',
    international: 'M',
    us: '42',
    uk: '42',
    eu: '52',
    minChestCm: 104,
    maxChestCm: 109,
  },
  {
    label: '44',
    international: 'L',
    us: '44',
    uk: '44',
    eu: '54',
    minChestCm: 109,
    maxChestCm: 114,
  },
  {
    label: '46',
    international: 'L',
    us: '46',
    uk: '46',
    eu: '56',
    minChestCm: 114,
    maxChestCm: 119,
  },
  {
    label: '48',
    international: 'XL',
    us: '48',
    uk: '48',
    eu: '58',
    minChestCm: 119,
    maxChestCm: 124,
  },
  {
    label: '50',
    international: 'XL',
    us: '50',
    uk: '50',
    eu: '60',
    minChestCm: 124,
    maxChestCm: 129,
  },
  {
    label: '52',
    international: 'XXL',
    us: '52',
    uk: '52',
    eu: '62',
    minChestCm: 129,
    maxChestCm: 135,
  },
];

export const WOMENS_JACKET_CHART: readonly JacketSizeChartRow[] = [
  {
    label: 'XS',
    international: 'XS',
    us: '2',
    uk: '6',
    eu: '34',
    minChestCm: 80,
    maxChestCm: 84,
  },
  {
    label: 'S',
    international: 'S',
    us: '4',
    uk: '8',
    eu: '36',
    minChestCm: 84,
    maxChestCm: 88,
  },
  {
    label: 'S',
    international: 'S',
    us: '6',
    uk: '10',
    eu: '38',
    minChestCm: 88,
    maxChestCm: 92,
  },
  {
    label: 'M',
    international: 'M',
    us: '8',
    uk: '12',
    eu: '40',
    minChestCm: 92,
    maxChestCm: 96,
  },
  {
    label: 'M',
    international: 'M',
    us: '10',
    uk: '14',
    eu: '42',
    minChestCm: 96,
    maxChestCm: 100,
  },
  {
    label: 'L',
    international: 'L',
    us: '12',
    uk: '16',
    eu: '44',
    minChestCm: 100,
    maxChestCm: 104,
  },
  {
    label: 'L',
    international: 'L',
    us: '14',
    uk: '18',
    eu: '46',
    minChestCm: 104,
    maxChestCm: 110,
  },
  {
    label: 'XL',
    international: 'XL',
    us: '16',
    uk: '20',
    eu: '48',
    minChestCm: 110,
    maxChestCm: 116,
  },
  {
    label: 'XL',
    international: 'XL',
    us: '18',
    uk: '22',
    eu: '50',
    minChestCm: 116,
    maxChestCm: 122,
  },
  {
    label: 'XXL',
    international: 'XXL',
    us: '20',
    uk: '24',
    eu: '52',
    minChestCm: 122,
    maxChestCm: 130,
  },
];

export function getMensJacketSizeChart(): readonly JacketSizeChartRow[] {
  return MENS_JACKET_CHART;
}

export function getWomensJacketSizeChart(): readonly JacketSizeChartRow[] {
  return WOMENS_JACKET_CHART;
}

export function getJacketSizeChart(
  category: JacketSizingCategory,
): readonly JacketSizeChartRow[] {
  return category === 'men' ? MENS_JACKET_CHART : WOMENS_JACKET_CHART;
}
