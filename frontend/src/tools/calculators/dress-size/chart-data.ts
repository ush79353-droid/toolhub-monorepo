/**
 * Illustrative women's dress body-measurement chart (approximate).
 * Contiguous cm ranges for bust / waist / hips.
 * Not a universal brand standard — retail charts vary by brand and cut.
 *
 * Roughly aligned with common US–UK–EU letter equivalences used in
 * many consumer size guides (ASTM-style body chart conventions).
 */

import type { DressSizeChartEntry } from './types';

export const CHART_SOURCE =
  "Illustrative conventional women's dress body chart (approximate). Brand and garment charts vary — not a universal standard.";

export const CHART_VERSION = 'omega-dress-v1-2026-11';

/**
 * Non-overlapping intervals: each max is exclusive of the next min except
 * exact boundary values match the smaller size first.
 */
export const DRESS_SIZE_CHART: readonly DressSizeChartEntry[] = [
  {
    usSize: '0',
    ukSize: '4',
    euSize: '32',
    internationalSize: 'XXS',
    bustMinCm: 76,
    bustMaxCm: 81,
    waistMinCm: 56,
    waistMaxCm: 61,
    hipsMinCm: 81,
    hipsMaxCm: 86,
  },
  {
    usSize: '2',
    ukSize: '6',
    euSize: '34',
    internationalSize: 'XS',
    bustMinCm: 81,
    bustMaxCm: 84,
    waistMinCm: 61,
    waistMaxCm: 64,
    hipsMinCm: 86,
    hipsMaxCm: 89,
  },
  {
    usSize: '4',
    ukSize: '8',
    euSize: '36',
    internationalSize: 'XS',
    bustMinCm: 84,
    bustMaxCm: 87,
    waistMinCm: 64,
    waistMaxCm: 67,
    hipsMinCm: 89,
    hipsMaxCm: 92,
  },
  {
    usSize: '6',
    ukSize: '10',
    euSize: '38',
    internationalSize: 'S',
    bustMinCm: 87,
    bustMaxCm: 90,
    waistMinCm: 67,
    waistMaxCm: 70,
    hipsMinCm: 92,
    hipsMaxCm: 95,
  },
  {
    usSize: '8',
    ukSize: '12',
    euSize: '40',
    internationalSize: 'S',
    bustMinCm: 90,
    bustMaxCm: 93,
    waistMinCm: 70,
    waistMaxCm: 73,
    hipsMinCm: 95,
    hipsMaxCm: 98,
  },
  {
    usSize: '10',
    ukSize: '14',
    euSize: '42',
    internationalSize: 'M',
    bustMinCm: 93,
    bustMaxCm: 97,
    waistMinCm: 73,
    waistMaxCm: 77,
    hipsMinCm: 98,
    hipsMaxCm: 102,
  },
  {
    usSize: '12',
    ukSize: '16',
    euSize: '44',
    internationalSize: 'M',
    bustMinCm: 97,
    bustMaxCm: 102,
    waistMinCm: 77,
    waistMaxCm: 82,
    hipsMinCm: 102,
    hipsMaxCm: 107,
  },
  {
    usSize: '14',
    ukSize: '18',
    euSize: '46',
    internationalSize: 'L',
    bustMinCm: 102,
    bustMaxCm: 107,
    waistMinCm: 82,
    waistMaxCm: 87,
    hipsMinCm: 107,
    hipsMaxCm: 112,
  },
  {
    usSize: '16',
    ukSize: '20',
    euSize: '48',
    internationalSize: 'L',
    bustMinCm: 107,
    bustMaxCm: 113,
    waistMinCm: 87,
    waistMaxCm: 93,
    hipsMinCm: 112,
    hipsMaxCm: 118,
  },
  {
    usSize: '18',
    ukSize: '22',
    euSize: '50',
    internationalSize: 'XL',
    bustMinCm: 113,
    bustMaxCm: 119,
    waistMinCm: 93,
    waistMaxCm: 99,
    hipsMinCm: 118,
    hipsMaxCm: 124,
  },
  {
    usSize: '20',
    ukSize: '24',
    euSize: '52',
    internationalSize: 'XL',
    bustMinCm: 119,
    bustMaxCm: 125,
    waistMinCm: 99,
    waistMaxCm: 105,
    hipsMinCm: 124,
    hipsMaxCm: 130,
  },
  {
    usSize: '22',
    ukSize: '26',
    euSize: '54',
    internationalSize: 'XXL',
    bustMinCm: 125,
    bustMaxCm: 131,
    waistMinCm: 105,
    waistMaxCm: 111,
    hipsMinCm: 130,
    hipsMaxCm: 136,
  },
  {
    usSize: '24',
    ukSize: '28',
    euSize: '56',
    internationalSize: '3XL',
    bustMinCm: 131,
    bustMaxCm: 137,
    waistMinCm: 111,
    waistMaxCm: 117,
    hipsMinCm: 136,
    hipsMaxCm: 142,
  },
];
