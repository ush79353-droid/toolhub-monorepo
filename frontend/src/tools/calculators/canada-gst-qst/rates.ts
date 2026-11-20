/**
 * Canadian GST / HST / PST / RST / QST configuration.
 *
 * Sources (verified 2026-11-20):
 * - CRA “GST/HST calculator (and rates)” —
 *   https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html
 * - CRA Notice 342 — Nova Scotia HST decreased to 14% effective 2025-04-01
 * - Revenu Québec QST general rate 9.975% (calculated on consideration excluding GST
 *   for ordinary taxable supplies)
 *
 * Effective for ordinary taxable supplies on/after 2025-04-01 (NS HST change).
 * Educational estimate only — exemptions / place-of-supply / special regimes not modeled.
 */

export type ProvinceCode =
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NL'
  | 'NT'
  | 'NS'
  | 'NU'
  | 'ON'
  | 'PE'
  | 'QC'
  | 'SK'
  | 'YT';

export type TaxRegime = 'gst_only' | 'hst' | 'gst_pst' | 'gst_qst';

export interface TaxLineSpec {
  /** Display label without percent, e.g. "GST" or "PST". */
  key: 'GST' | 'HST' | 'PST' | 'RST' | 'QST';
  label: string;
  /** Decimal rate, e.g. 0.05. */
  rate: number;
}

export interface ProvinceTaxConfig {
  code: ProvinceCode;
  name: string;
  regime: TaxRegime;
  blurb: string;
  lines: readonly TaxLineSpec[];
}

const GST = 0.05;

export const PROVINCE_TAX_CONFIGS: readonly ProvinceTaxConfig[] = [
  {
    code: 'AB',
    name: 'Alberta',
    regime: 'gst_only',
    blurb: 'Alberta applies only the Goods and Services Tax (GST).',
    lines: [{ key: 'GST', label: 'GST', rate: GST }],
  },
  {
    code: 'BC',
    name: 'British Columbia',
    regime: 'gst_pst',
    blurb:
      'British Columbia charges the federal GST plus provincial sales tax (PST) on most taxable purchases.',
    lines: [
      { key: 'GST', label: 'GST', rate: GST },
      { key: 'PST', label: 'PST', rate: 0.07 },
    ],
  },
  {
    code: 'MB',
    name: 'Manitoba',
    regime: 'gst_pst',
    blurb:
      'Manitoba charges the federal GST plus retail sales tax (RST) on most taxable purchases.',
    lines: [
      { key: 'GST', label: 'GST', rate: GST },
      { key: 'RST', label: 'RST', rate: 0.07 },
    ],
  },
  {
    code: 'NB',
    name: 'New Brunswick',
    regime: 'hst',
    blurb:
      'New Brunswick uses the Harmonized Sales Tax (HST), which combines the federal and provincial portions into one rate.',
    lines: [{ key: 'HST', label: 'HST', rate: 0.15 }],
  },
  {
    code: 'NL',
    name: 'Newfoundland and Labrador',
    regime: 'hst',
    blurb:
      'Newfoundland and Labrador uses the Harmonized Sales Tax (HST), which combines the federal and provincial portions into one rate.',
    lines: [{ key: 'HST', label: 'HST', rate: 0.15 }],
  },
  {
    code: 'NT',
    name: 'Northwest Territories',
    regime: 'gst_only',
    blurb: 'Northwest Territories applies only the Goods and Services Tax (GST).',
    lines: [{ key: 'GST', label: 'GST', rate: GST }],
  },
  {
    code: 'NS',
    name: 'Nova Scotia',
    regime: 'hst',
    blurb:
      'Nova Scotia uses the Harmonized Sales Tax (HST). The combined rate is 14% for supplies taxable on or after April 1, 2025.',
    lines: [{ key: 'HST', label: 'HST', rate: 0.14 }],
  },
  {
    code: 'NU',
    name: 'Nunavut',
    regime: 'gst_only',
    blurb: 'Nunavut applies only the Goods and Services Tax (GST).',
    lines: [{ key: 'GST', label: 'GST', rate: GST }],
  },
  {
    code: 'ON',
    name: 'Ontario',
    regime: 'hst',
    blurb:
      'Ontario uses the Harmonized Sales Tax (HST), which combines the federal and provincial portions into one rate.',
    lines: [{ key: 'HST', label: 'HST', rate: 0.13 }],
  },
  {
    code: 'PE',
    name: 'Prince Edward Island',
    regime: 'hst',
    blurb:
      'Prince Edward Island uses the Harmonized Sales Tax (HST), which combines the federal and provincial portions into one rate.',
    lines: [{ key: 'HST', label: 'HST', rate: 0.15 }],
  },
  {
    code: 'QC',
    name: 'Quebec',
    regime: 'gst_qst',
    blurb:
      'Quebec generally applies the federal GST and the Quebec Sales Tax (QST) on taxable supplies. QST is calculated on the amount before tax for ordinary taxable supplies.',
    lines: [
      { key: 'GST', label: 'GST', rate: GST },
      { key: 'QST', label: 'QST', rate: 0.09975 },
    ],
  },
  {
    code: 'SK',
    name: 'Saskatchewan',
    regime: 'gst_pst',
    blurb:
      'Saskatchewan charges the federal GST plus provincial sales tax (PST) on most taxable purchases.',
    lines: [
      { key: 'GST', label: 'GST', rate: GST },
      { key: 'PST', label: 'PST', rate: 0.06 },
    ],
  },
  {
    code: 'YT',
    name: 'Yukon',
    regime: 'gst_only',
    blurb: 'Yukon applies only the Goods and Services Tax (GST).',
    lines: [{ key: 'GST', label: 'GST', rate: GST }],
  },
] as const;

export function getProvinceConfig(code: ProvinceCode): ProvinceTaxConfig {
  const found = PROVINCE_TAX_CONFIGS.find((p) => p.code === code);
  if (!found) {
    throw new Error(`Unknown province code: ${code}`);
  }
  return found;
}

export const RATES_EFFECTIVE_NOTE =
  'Rates follow the CRA GST/HST calculator table in effect on or after April 1, 2025 (including Nova Scotia HST at 14%). Provincial PST/RST/QST follow the CRA-listed companion rates. Estimate for a generally taxable purchase — not tax advice.';
