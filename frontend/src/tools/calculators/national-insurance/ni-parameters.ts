/**
 * UK National Insurance parameters from HMRC published rates.
 *
 * Sources:
 * - https://www.gov.uk/government/publications/rates-and-allowances-national-insurance-contributions
 * - https://www.gov.uk/self-employed-national-insurance-rates
 * - https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2024-to-2025
 * - https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026
 * - https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
 *
 * Class 2 is not charged for 2024/25 onward when profits are at/above the small
 * profits threshold (treated as paid). This tool estimates employee Class 1
 * (category A) and Class 4 only.
 */

/** UK tax year ending April label, e.g. 2026 means 2025/26 (6 Apr 2025 – 5 Apr 2026). */
export type NiTaxYearId = '2024-25' | '2025-26' | '2026-27';

export interface NiYearParams {
  readonly id: NiTaxYearId;
  readonly label: string;
  /** Primary Threshold / Lower Profits Limit (annual £). */
  readonly primaryThreshold: number;
  /** Upper Earnings Limit / Upper Profits Limit (annual £). */
  readonly upperLimit: number;
  /** Employee Class 1 rate between PT and UEL. */
  readonly class1MainRate: number;
  /** Employee Class 1 rate above UEL. */
  readonly class1UpperRate: number;
  /** Class 4 rate between LPL and UPL. */
  readonly class4MainRate: number;
  /** Class 4 rate above UPL. */
  readonly class4UpperRate: number;
  readonly class2Due: false;
  readonly sourceNote: string;
}

export const NI_YEAR_PARAMS: Record<NiTaxYearId, NiYearParams> = {
  '2024-25': {
    id: '2024-25',
    label: '2024 / 2025',
    primaryThreshold: 12_570,
    upperLimit: 50_270,
    class1MainRate: 0.08,
    class1UpperRate: 0.02,
    class4MainRate: 0.06,
    class4UpperRate: 0.02,
    class2Due: false,
    sourceNote:
      'HMRC Class 1 employee category A and Class 4 rates for 6 Apr 2024 – 5 Apr 2025. Class 2 not due (treated as paid when profits at/above SPT).',
  },
  '2025-26': {
    id: '2025-26',
    label: '2025 / 2026',
    primaryThreshold: 12_570,
    upperLimit: 50_270,
    class1MainRate: 0.08,
    class1UpperRate: 0.02,
    class4MainRate: 0.06,
    class4UpperRate: 0.02,
    class2Due: false,
    sourceNote:
      'HMRC Class 1 employee category A and Class 4 rates for 6 Apr 2025 – 5 Apr 2026. Class 2 not due (treated as paid when profits at/above SPT).',
  },
  '2026-27': {
    id: '2026-27',
    label: '2026 / 2027',
    primaryThreshold: 12_570,
    upperLimit: 50_270,
    class1MainRate: 0.08,
    class1UpperRate: 0.02,
    class4MainRate: 0.06,
    class4UpperRate: 0.02,
    class2Due: false,
    sourceNote:
      'HMRC Class 1 employee category A and Class 4 rates for 6 Apr 2026 – 5 Apr 2027. Class 2 not due (treated as paid when profits at/above SPT).',
  },
};

export const NI_TAX_YEAR_OPTIONS: readonly {
  id: NiTaxYearId;
  label: string;
}[] = [
  { id: '2026-27', label: '2026 / 2027' },
  { id: '2025-26', label: '2025 / 2026' },
  { id: '2024-25', label: '2024 / 2025' },
];

/** Default to current UK tax year relative to project date (Nov 2026 → 2026/27). */
export const DEFAULT_NI_TAX_YEAR: NiTaxYearId = '2026-27';
