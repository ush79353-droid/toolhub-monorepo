/**
 * Illustrative glove body charts by hand circumference (palm, below knuckles).
 * Not a universal brand standard — retail charts vary by product type.
 *
 * Numeric labels follow a common inches-based retail convention where
 * approximate circumference in inches aligns with numeric size labels.
 * Source convention: consumer glove sizing guides (approximate).
 */

import type { GloveSizeRange, GloveSizingChart, GloveStyle } from './types';

export const CHART_SOURCE =
  "Illustrative palm-circumference glove chart (approximate). Brands, materials, and product types vary — always check the manufacturer's size guide.";

export const CHART_VERSION = 'omega-glove-v1-2026-11';

/** Men / unisex — contiguous cm ranges; shared boundary prefers smaller size. */
export const MEN_UNISEX_SIZES: readonly GloveSizeRange[] = [
  {
    label: 'XS',
    numericSize: '7',
    minCircumferenceCm: 17,
    maxCircumferenceCm: 19,
  },
  {
    label: 'S',
    numericSize: '8',
    minCircumferenceCm: 19,
    maxCircumferenceCm: 21,
  },
  {
    label: 'M',
    numericSize: '9',
    minCircumferenceCm: 21,
    maxCircumferenceCm: 23,
  },
  {
    label: 'L',
    numericSize: '10',
    minCircumferenceCm: 23,
    maxCircumferenceCm: 25,
  },
  {
    label: 'XL',
    numericSize: '11',
    minCircumferenceCm: 25,
    maxCircumferenceCm: 27,
  },
  {
    label: 'XXL',
    numericSize: '12',
    minCircumferenceCm: 27,
    maxCircumferenceCm: 29,
  },
];

/** Women's — contiguous cm ranges; shared boundary prefers smaller size. */
export const WOMEN_SIZES: readonly GloveSizeRange[] = [
  {
    label: 'XS',
    numericSize: '6',
    minCircumferenceCm: 15,
    maxCircumferenceCm: 16.5,
  },
  {
    label: 'S',
    numericSize: '6.5',
    minCircumferenceCm: 16.5,
    maxCircumferenceCm: 18,
  },
  {
    label: 'M',
    numericSize: '7',
    minCircumferenceCm: 18,
    maxCircumferenceCm: 19.5,
  },
  {
    label: 'L',
    numericSize: '7.5',
    minCircumferenceCm: 19.5,
    maxCircumferenceCm: 21,
  },
  {
    label: 'XL',
    numericSize: '8',
    minCircumferenceCm: 21,
    maxCircumferenceCm: 22.5,
  },
];

export const GLOVE_CHARTS: Record<GloveStyle, GloveSizingChart> = {
  'men-unisex': { style: 'men-unisex', sizes: MEN_UNISEX_SIZES },
  women: { style: 'women', sizes: WOMEN_SIZES },
};

export function getGloveSizingChart(style: GloveStyle): GloveSizingChart {
  return GLOVE_CHARTS[style];
}
