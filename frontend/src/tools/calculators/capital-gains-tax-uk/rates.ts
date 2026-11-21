/**
 * UK Capital Gains Tax thresholds and rates (HMRC / GOV.UK).
 *
 * Sources (retrieved 2026-11-21):
 * - https://www.gov.uk/capital-gains-tax/rates
 * - https://www.gov.uk/guidance/capital-gains-tax-rates-and-allowances
 * - Autumn Budget 2024 OOTLAR Annex A (rate alignment from 30 Oct 2024)
 *
 * Product policy (prompt): offer current supported years — not obsolete
 * screenshot-only years (2022/23, 2023/24). For 2025/26 and 2026/27,
 * individual basic/higher rates are 18%/24% for Shares, Property, Crypto,
 * and Other (residential and non-residential aligned). Trustees: 24%.
 */

export type UkCgtTaxYearId = '2025/26' | '2026/27';

export type UkCgtAssetType = 'shares' | 'property' | 'crypto' | 'other';

export interface UkCgtYearRules {
  id: UkCgtTaxYearId;
  label: string;
  /** Individual / disabled-trust AEA (GBP). */
  annualExemptAmount: number;
  /** Most other trustees AEA (GBP) — half individual. */
  trusteeAnnualExemptAmount: number;
  /** Basic-rate Income Tax band width used in HMRC CGT examples (GBP). */
  basicRateBand: number;
  /** Individual rate within remaining basic-rate band. */
  basicRate: number;
  /** Individual rate above basic-rate band (and trustee flat rate). */
  higherRate: number;
  /** Trustee flat rate on chargeable gains. */
  trusteeRate: number;
  sourceNote: string;
}

/** Supported tax years — newest first; default 2026/27. */
export const UK_CGT_YEAR_RULES: readonly UkCgtYearRules[] = [
  {
    id: '2026/27',
    label: '2026/27',
    annualExemptAmount: 3000,
    trusteeAnnualExemptAmount: 1500,
    basicRateBand: 37_700,
    basicRate: 0.18,
    higherRate: 0.24,
    trusteeRate: 0.24,
    sourceNote:
      'HMRC CGT rates from 6 April 2026: individuals 18%/24%; trustees 24%; AEA £3,000 / trustees £1,500; basic band £37,700 (GOV.UK examples).',
  },
  {
    id: '2025/26',
    label: '2025/26',
    annualExemptAmount: 3000,
    trusteeAnnualExemptAmount: 1500,
    basicRateBand: 37_700,
    basicRate: 0.18,
    higherRate: 0.24,
    trusteeRate: 0.24,
    sourceNote:
      'HMRC CGT rates 6 April 2025–5 April 2026: individuals 18%/24% (all standard assets including residential property); trustees 24%; AEA £3,000 / trustees £1,500.',
  },
] as const;

export const DEFAULT_UK_CGT_TAX_YEAR: UkCgtTaxYearId = '2026/27';

export function getUkCgtYearRules(id: UkCgtTaxYearId): UkCgtYearRules {
  const found = UK_CGT_YEAR_RULES.find((y) => y.id === id);
  if (!found) {
    throw new Error(`Unsupported UK CGT tax year: ${id}`);
  }
  return found;
}

/** Residential property vs other assets: same rates in supported years. */
export function isResidentialPropertyAsset(assetType: UkCgtAssetType): boolean {
  return assetType === 'property';
}
