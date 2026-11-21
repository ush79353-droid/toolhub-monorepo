/**
 * US federal estate tax estimate for decedents dying in calendar year 2026.
 * Sources: IRC §§2001, 2010, 2051–2058; Instructions for Form 706 (Rev. July 2026);
 * IRS “What’s new — Estate and gift tax” BEA table; Rev. Proc. 2025-32 / OBBBA §70106.
 *
 * Assumptions (disclosed in UI): all entered assets includible; life insurance treated as
 * includible under §2042; no marital deduction / DSUE / portability; tax-free lifetime gifts
 * are NOT adjusted taxable gifts and do not reduce the BEA in this estimate.
 */

import type { EstateTaxInput, EstateTaxResult } from './types';

/** Form 706 (07/2026) — decedents dying in 2026. */
export const ESTATE_TAX_YEAR = 2026 as const;
export const BASIC_EXCLUSION_AMOUNT_2026 = 15_000_000;
/** Tentative tax on the 2026 BEA under §2001(c) (= applicable credit amount). */
export const APPLICABLE_CREDIT_AMOUNT_2026 = 5_945_800;

/** IRC §2001(c) unified rate schedule (unchanged brackets). */
const RATE_BRACKETS: readonly {
  upTo: number;
  baseTax: number;
  rate: number;
  excessOver: number;
}[] = [
  { upTo: 10_000, baseTax: 0, rate: 0.18, excessOver: 0 },
  { upTo: 20_000, baseTax: 1_800, rate: 0.2, excessOver: 10_000 },
  { upTo: 40_000, baseTax: 3_800, rate: 0.22, excessOver: 20_000 },
  { upTo: 60_000, baseTax: 8_200, rate: 0.24, excessOver: 40_000 },
  { upTo: 80_000, baseTax: 13_000, rate: 0.26, excessOver: 60_000 },
  { upTo: 100_000, baseTax: 18_200, rate: 0.28, excessOver: 80_000 },
  { upTo: 150_000, baseTax: 23_800, rate: 0.3, excessOver: 100_000 },
  { upTo: 250_000, baseTax: 38_800, rate: 0.32, excessOver: 150_000 },
  { upTo: 500_000, baseTax: 70_800, rate: 0.34, excessOver: 250_000 },
  { upTo: 750_000, baseTax: 155_800, rate: 0.37, excessOver: 500_000 },
  { upTo: 1_000_000, baseTax: 248_300, rate: 0.39, excessOver: 750_000 },
  { upTo: Number.POSITIVE_INFINITY, baseTax: 345_800, rate: 0.4, excessOver: 1_000_000 },
];

export function formatEstateUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Tentative tax under IRC §2001(c). Round to nearest cent for display math. */
export function computeTentativeTax(taxableAmount: number): number {
  if (!(taxableAmount > 0) || !Number.isFinite(taxableAmount)) return 0;
  for (const bracket of RATE_BRACKETS) {
    if (taxableAmount <= bracket.upTo) {
      const tax =
        bracket.baseTax + bracket.rate * (taxableAmount - bracket.excessOver);
      return Math.round(tax * 100) / 100;
    }
  }
  return 0;
}

export interface EstateTaxNumericInput {
  residence: number;
  investments: number;
  savings: number;
  vehicles: number;
  retirement: number;
  lifeInsurance: number;
  otherAssets: number;
  debts: number;
  funeralAdmin: number;
  charitable: number;
  stateDeathTaxes: number;
  taxFreeLifetimeGifts: number;
}

export function calculateEstateTax(
  input: EstateTaxNumericInput
): EstateTaxResult | null {
  const values = Object.values(input);
  if (values.some((v) => !Number.isFinite(v) || v < 0)) return null;

  const grossEstate =
    input.residence +
    input.investments +
    input.savings +
    input.vehicles +
    input.retirement +
    input.lifeInsurance +
    input.otherAssets;

  const allowableDeductions =
    input.debts +
    input.funeralAdmin +
    input.charitable +
    input.stateDeathTaxes;

  const taxableEstate = Math.max(0, grossEstate - allowableDeductions);
  const tentativeTax = computeTentativeTax(taxableEstate);
  const estimatedFederalEstateTax = Math.max(
    0,
    Math.round((tentativeTax - APPLICABLE_CREDIT_AMOUNT_2026) * 100) / 100
  );

  return {
    grossEstate,
    allowableDeductions,
    taxableEstate,
    basicExclusionAmount: BASIC_EXCLUSION_AMOUNT_2026,
    applicableCreditAmount: APPLICABLE_CREDIT_AMOUNT_2026,
    tentativeTax,
    estimatedFederalEstateTax,
    taxFreeLifetimeGifts: input.taxFreeLifetimeGifts,
    taxYear: ESTATE_TAX_YEAR,
    formattedGrossEstate: formatEstateUsd(grossEstate),
    formattedAllowableDeductions: formatEstateUsd(allowableDeductions),
    formattedTaxableEstate: formatEstateUsd(taxableEstate),
    formattedBasicExclusion: formatEstateUsd(BASIC_EXCLUSION_AMOUNT_2026),
    formattedFederalEstateTax: formatEstateUsd(estimatedFederalEstateTax),
    summaryText: `2026 federal estate tax estimate: taxable $${formatEstateUsd(taxableEstate)}; BEA $${formatEstateUsd(BASIC_EXCLUSION_AMOUNT_2026)}; estimated tax $${formatEstateUsd(estimatedFederalEstateTax)}. Tax-free lifetime gifts ($${formatEstateUsd(input.taxFreeLifetimeGifts)}) are informational only.`,
  };
}

export function shareEstateTaxResult(result: EstateTaxResult): string {
  return [
    'Estate Tax Calculator | Omega Calculators',
    `Tax year (year of death): ${result.taxYear}`,
    `Gross estate: $${result.formattedGrossEstate}`,
    `Allowable deductions: $${result.formattedAllowableDeductions}`,
    `Taxable estate: $${result.formattedTaxableEstate}`,
    `Basic exclusion amount: $${result.formattedBasicExclusion}`,
    `Estimated federal estate tax: $${result.formattedFederalEstateTax}`,
    `Tax-free lifetime gifts (informational): $${formatEstateUsd(result.taxFreeLifetimeGifts)}`,
    result.summaryText,
    'Educational estimate; not a Form 706 filing. Fixed USD.',
  ].join('\n');
}

export type { EstateTaxInput };
