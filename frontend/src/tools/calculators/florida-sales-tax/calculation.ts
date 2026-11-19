import {
  FLORIDA_DISCRETIONARY_SURTAX_BASE_CAP,
  FLORIDA_STATE_SALES_TAX_RATE_PERCENT,
  FLORIDA_SURTAX_SOURCE,
  getFloridaCountySurtaxPercent,
} from './florida-county-surtax';
import { lookupFloridaZipCounties } from './florida-zip-counties';
import type { FloridaSalesTaxResult, FloridaSalesTaxStatus } from './types';

/**
 * Florida sales tax estimate.
 *
 * State rate: 6% (Florida DOR general state sales tax).
 * County discretionary surtax: DR-15DSS calendar year 2026 totals.
 * ZIP→county: U.S. Census Bureau 2020 ZCTA→county relationship (FL only).
 *
 * Assumptions (disclosed in results):
 * - Fully taxable general retail sale of tangible personal property.
 * - Discretionary surtax base capped at $5,000 for a single taxable item
 *   (FL DOR discretionary surtax rule). Aggregate multi-item baskets are not modeled.
 * - ZCTA≈ZIP; multi-county ZCTAs require an explicit county selection.
 */

export const FL_ZIP_MIN = 32003;
export const FL_ZIP_MAX = 34997;

export function formatFlUsd(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  const rounded = roundMoney(amount);
  if (Object.is(rounded, -0) || rounded === 0) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function formatFlRatePercent(rate: number): string {
  if (!Number.isFinite(rate)) return '';
  const text = rate.toFixed(4).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

export function roundMoney(amount: number): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/** Five-digit ZIP in the Florida USPS numeric envelope (leading zeros preserved). */
export function isValidFloridaZipFormat(zipCode: string): boolean {
  if (!/^\d{5}$/.test(zipCode)) return false;
  const n = Number(zipCode);
  if (!Number.isInteger(n)) return false;
  return n >= FL_ZIP_MIN && n <= FL_ZIP_MAX;
}

function emptyResult(
  partial: Pick<
    FloridaSalesTaxResult,
    | 'status'
    | 'purchaseAmount'
    | 'zipCode'
    | 'countyName'
    | 'countyFips'
    | 'candidateCounties'
    | 'rateLabel'
    | 'assumptionNote'
    | 'summaryText'
  >
): FloridaSalesTaxResult {
  return {
    ...partial,
    stateRatePercent: FLORIDA_STATE_SALES_TAX_RATE_PERCENT,
    surtaxRatePercent: null,
    combinedRatePercent: null,
    stateTax: null,
    countySurtax: null,
    totalTax: null,
    totalAmount: null,
    surtaxTaxableBase: null,
    formattedPurchaseAmount: formatFlUsd(partial.purchaseAmount),
    formattedStateRatePercent: formatFlRatePercent(
      FLORIDA_STATE_SALES_TAX_RATE_PERCENT
    ),
    formattedSurtaxRatePercent: '',
    formattedCombinedRatePercent: '',
    formattedStateTax: '',
    formattedCountySurtax: '',
    formattedTotalTax: '',
    formattedTotalAmount: '',
  };
}

/**
 * Resolve location + compute tax.
 * Never invents a county for multi-county ZIPs.
 */
export function calculateFloridaSalesTax(
  purchaseAmount: number,
  zipCode: string,
  selectedCountyFips: string
): FloridaSalesTaxResult | null {
  if (!Number.isFinite(purchaseAmount) || purchaseAmount < 0) return null;
  if (!isValidFloridaZipFormat(zipCode)) return null;

  const counties = lookupFloridaZipCounties(zipCode);
  if (!counties || counties.length === 0) {
    return emptyResult({
      status: 'zip_unknown',
      purchaseAmount,
      zipCode,
      countyName: null,
      countyFips: null,
      candidateCounties: [],
      rateLabel:
        'ZIP is in the Florida numeric range but is not present in the Census 2020 ZCTA→county file (PO Box / unique / unmatched ZIP). County surtax cannot be resolved.',
      assumptionNote:
        'No county assigned — state and surtax amounts are not calculated.',
      summaryText: [
        'Florida Sales Tax Calculator — Omega Calculators',
        `Purchase amount: $${formatFlUsd(purchaseAmount)}`,
        `ZIP code: ${zipCode}`,
        'County: unavailable (ZIP not in Census ZCTA map)',
      ].join('\n'),
    });
  }

  if (counties.length > 1 && !selectedCountyFips) {
    return emptyResult({
      status: 'ambiguous',
      purchaseAmount,
      zipCode,
      countyName: null,
      countyFips: null,
      candidateCounties: counties.map((c) => ({ fips: c.fips, name: c.name })),
      rateLabel:
        'This ZIP intersects multiple Florida counties in the Census ZCTA map. Select the purchase county — rates are not guessed.',
      assumptionNote:
        'Waiting for an explicit county selection before applying DR-15DSS surtax.',
      summaryText: [
        'Florida Sales Tax Calculator — Omega Calculators',
        `Purchase amount: $${formatFlUsd(purchaseAmount)}`,
        `ZIP code: ${zipCode}`,
        `Ambiguous counties: ${counties.map((c) => c.name).join(', ')}`,
      ].join('\n'),
    });
  }

  const county =
    counties.length === 1
      ? counties[0]!
      : counties.find((c) => c.fips === selectedCountyFips);

  if (!county) {
    return emptyResult({
      status: 'county_required',
      purchaseAmount,
      zipCode,
      countyName: null,
      countyFips: null,
      candidateCounties: counties.map((c) => ({ fips: c.fips, name: c.name })),
      rateLabel: 'Select a county from the ZIP’s Census intersections.',
      assumptionNote: 'County selection does not match this ZIP’s candidates.',
      summaryText: [
        'Florida Sales Tax Calculator — Omega Calculators',
        `Purchase amount: $${formatFlUsd(purchaseAmount)}`,
        `ZIP code: ${zipCode}`,
        'County: invalid selection for this ZIP',
      ].join('\n'),
    });
  }

  const status: FloridaSalesTaxStatus = 'resolved';
  const surtaxRate = getFloridaCountySurtaxPercent(county.name);
  if (surtaxRate === null) return null;

  const stateRate = FLORIDA_STATE_SALES_TAX_RATE_PERCENT;
  const combinedRate = stateRate + surtaxRate;
  const stateTax = roundMoney((purchaseAmount * stateRate) / 100);
  const surtaxBase = Math.min(purchaseAmount, FLORIDA_DISCRETIONARY_SURTAX_BASE_CAP);
  const countySurtax = roundMoney((surtaxBase * surtaxRate) / 100);
  const totalTax = roundMoney(stateTax + countySurtax);
  const totalAmount = roundMoney(purchaseAmount + totalTax);
  if (
    ![stateTax, countySurtax, totalTax, totalAmount].every((n) =>
      Number.isFinite(n)
    )
  ) {
    return null;
  }

  const assumptionNote = [
    'Assumes a fully taxable general retail sale of tangible personal property.',
    `Discretionary surtax base capped at $${formatFlUsd(FLORIDA_DISCRETIONARY_SURTAX_BASE_CAP)} (single-item FL DOR rule); multi-item baskets are not modeled.`,
    'ZCTA≈ZIP from Census 2020; not street-address PointMatch precision.',
    FLORIDA_SURTAX_SOURCE,
  ].join(' ');

  const rateLabel = `${county.name} County · state ${formatFlRatePercent(stateRate)}% + discretionary surtax ${formatFlRatePercent(surtaxRate)}% = ${formatFlRatePercent(combinedRate)}% combined (CY 2026 DR-15DSS).`;

  return {
    status,
    purchaseAmount,
    zipCode,
    countyName: county.name,
    countyFips: county.fips,
    candidateCounties: counties.map((c) => ({ fips: c.fips, name: c.name })),
    stateRatePercent: stateRate,
    surtaxRatePercent: surtaxRate,
    combinedRatePercent: combinedRate,
    stateTax,
    countySurtax,
    totalTax,
    totalAmount,
    surtaxTaxableBase: surtaxBase,
    formattedPurchaseAmount: formatFlUsd(purchaseAmount),
    formattedStateRatePercent: formatFlRatePercent(stateRate),
    formattedSurtaxRatePercent: formatFlRatePercent(surtaxRate),
    formattedCombinedRatePercent: formatFlRatePercent(combinedRate),
    formattedStateTax: formatFlUsd(stateTax),
    formattedCountySurtax: formatFlUsd(countySurtax),
    formattedTotalTax: formatFlUsd(totalTax),
    formattedTotalAmount: formatFlUsd(totalAmount),
    rateLabel,
    assumptionNote,
    summaryText: [
      'Florida Sales Tax Calculator — Omega Calculators',
      `Purchase amount: $${formatFlUsd(purchaseAmount)}`,
      `ZIP code: ${zipCode}`,
      `County: ${county.name}`,
      `State sales tax (${formatFlRatePercent(stateRate)}%): $${formatFlUsd(stateTax)}`,
      `County discretionary surtax (${formatFlRatePercent(surtaxRate)}% on $${formatFlUsd(surtaxBase)}): $${formatFlUsd(countySurtax)}`,
      `Total tax: $${formatFlUsd(totalTax)}`,
      `Total with tax: $${formatFlUsd(totalAmount)}`,
      rateLabel,
      assumptionNote,
    ].join('\n'),
  };
}
