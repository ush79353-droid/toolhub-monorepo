/**
 * UK Capital Gains Tax estimator — pure engine (ADR-018).
 *
 * Individuals (HMRC method):
 *   chargeable = max(0, gains − AEA)
 *   basicRoom = max(0, basicRateBand − taxableIncome)
 *   tax = basicRoom portion × basicRate + remainder × higherRate
 *
 * Trustees (standard settlement):
 *   chargeable = max(0, gains − trusteeAEA)
 *   tax = chargeable × trusteeRate (flat)
 *
 * Taxable income = annual income + other income (user enters HMRC taxable
 * income after Personal Allowance — see form tips). Fixed GBP; no FX.
 */

import {
  getUkCgtYearRules,
  isResidentialPropertyAsset,
  type UkCgtAssetType,
  type UkCgtTaxYearId,
} from './rates';
import type { CapitalGainsTaxUkInput, CapitalGainsTaxUkResult } from './types';

function parseMoney(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Round GBP to nearest penny for display / tax payable estimate. */
export function roundGbp(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatGbp(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatRatePercent(rate: number): string {
  return `${(rate * 100).toLocaleString('en-GB', {
    maximumFractionDigits: 2,
  })}%`;
}

export interface UkCgtNumericInputs {
  taxYear: UkCgtTaxYearId;
  capitalGains: number;
  assetType: UkCgtAssetType;
  assetsInTrust: boolean;
  annualIncome: number;
  otherIncome: number;
}

export function calculateUkCapitalGainsTax(
  inputs: UkCgtNumericInputs,
): CapitalGainsTaxUkResult | null {
  const {
    taxYear,
    capitalGains,
    assetType,
    assetsInTrust,
    annualIncome,
    otherIncome,
  } = inputs;

  if (
    !Number.isFinite(capitalGains) ||
    !Number.isFinite(annualIncome) ||
    !Number.isFinite(otherIncome) ||
    capitalGains < 0 ||
    annualIncome < 0 ||
    otherIncome < 0
  ) {
    return null;
  }

  const rules = getUkCgtYearRules(taxYear);
  const totalAnnualIncome = annualIncome + otherIncome;
  const aea = assetsInTrust
    ? rules.trusteeAnnualExemptAmount
    : rules.annualExemptAmount;
  const chargeableGains = Math.max(0, capitalGains - aea);

  let basicRateRoom = 0;
  let taxedAtBasic = 0;
  let taxedAtHigher = 0;
  let capitalGainsTax = 0;
  const steps: string[] = [];

  steps.push(
    `Tax year ${rules.label}: AEA £${formatGbp(aea)} · basic band £${formatGbp(rules.basicRateBand)} · rates ${formatRatePercent(rules.basicRate)} / ${formatRatePercent(rules.higherRate)}${assetsInTrust ? ` · trustee rate ${formatRatePercent(rules.trusteeRate)}` : ''}.`,
  );
  steps.push(
    `Chargeable gains = max(0, £${formatGbp(capitalGains)} − £${formatGbp(aea)}) = £${formatGbp(chargeableGains)}.`,
  );

  if (assetsInTrust) {
    taxedAtHigher = chargeableGains;
    capitalGainsTax = chargeableGains * rules.trusteeRate;
    steps.push(
      `Trust assets: flat trustee rate ${formatRatePercent(rules.trusteeRate)} on chargeable gains.`,
    );
    steps.push(
      `CGT = £${formatGbp(chargeableGains)} × ${formatRatePercent(rules.trusteeRate)} = £${formatGbp(roundGbp(capitalGainsTax))}.`,
    );
  } else {
    basicRateRoom = Math.max(0, rules.basicRateBand - totalAnnualIncome);
    taxedAtBasic = Math.min(chargeableGains, basicRateRoom);
    taxedAtHigher = Math.max(0, chargeableGains - taxedAtBasic);
    capitalGainsTax =
      taxedAtBasic * rules.basicRate + taxedAtHigher * rules.higherRate;
    steps.push(
      `Taxable income (annual + other) = £${formatGbp(annualIncome)} + £${formatGbp(otherIncome)} = £${formatGbp(totalAnnualIncome)}.`,
    );
    steps.push(
      `Basic-rate room = max(0, £${formatGbp(rules.basicRateBand)} − £${formatGbp(totalAnnualIncome)}) = £${formatGbp(basicRateRoom)}.`,
    );
    steps.push(
      `At ${formatRatePercent(rules.basicRate)}: £${formatGbp(taxedAtBasic)}; at ${formatRatePercent(rules.higherRate)}: £${formatGbp(taxedAtHigher)}.`,
    );
    steps.push(
      `CGT = £${formatGbp(taxedAtBasic)} × ${formatRatePercent(rules.basicRate)} + £${formatGbp(taxedAtHigher)} × ${formatRatePercent(rules.higherRate)} = £${formatGbp(roundGbp(capitalGainsTax))}.`,
    );
  }

  const taxRounded = roundGbp(capitalGainsTax);
  if (!Number.isFinite(taxRounded)) return null;

  const propertyNote = isResidentialPropertyAsset(assetType)
    ? ' Property gains assume no Private Residence Relief; reliefs and losses are not modelled.'
    : '';

  const interpretation = assetsInTrust
    ? `Estimated trust Capital Gains Tax is £${formatGbp(taxRounded)} on chargeable gains of £${formatGbp(chargeableGains)} at ${formatRatePercent(rules.trusteeRate)} (${rules.label}).`
    : chargeableGains === 0
      ? `No Capital Gains Tax is due: gains of £${formatGbp(capitalGains)} do not exceed the £${formatGbp(aea)} annual exempt amount for ${rules.label}.`
      : `Estimated Capital Gains Tax is £${formatGbp(taxRounded)} for ${rules.label} (${assetType} · not in trust).`;

  const explanation = assetsInTrust
    ? `Most trustees use a half-size annual exempt amount (£${formatGbp(aea)}) and a flat ${formatRatePercent(rules.trusteeRate)} rate. Vulnerable-beneficiary and multi-settlement AEA reductions are not modelled.`
    : `HMRC bands chargeable gains against any unused basic-rate Income Tax band after taxable income. Enter income as taxable income after Personal Allowance (GOV.UK CGT method).${propertyNote}`;

  return {
    taxYear,
    assetType,
    assetsInTrust,
    capitalGains,
    annualIncome,
    otherIncome,
    totalAnnualIncome,
    annualExemptAmount: aea,
    chargeableGains,
    basicRateBand: rules.basicRateBand,
    basicRateRoom,
    taxedAtBasic,
    taxedAtHigher,
    basicRate: rules.basicRate,
    higherRate: assetsInTrust ? rules.trusteeRate : rules.higherRate,
    capitalGainsTax: taxRounded,
    formattedTotalAnnualIncome: formatGbp(totalAnnualIncome),
    formattedCapitalGainsTax: formatGbp(taxRounded),
    formattedChargeableGains: formatGbp(chargeableGains),
    steps,
    interpretation,
    explanation,
    disclaimer:
      'Educational estimate only — not tax advice. Excludes losses, reliefs (including PRR/BADR), carried interest, FIG/OWR AEA loss, and multi-settlement trust AEA splits. Verify with HMRC or a qualified adviser.',
  };
}

export function calculateUkCapitalGainsTaxFromInput(
  input: CapitalGainsTaxUkInput,
): CapitalGainsTaxUkResult | null {
  const capitalGains = parseMoney(input.capitalGains);
  const annualIncome = parseMoney(input.annualIncome);
  const otherIncome = parseMoney(input.otherIncome);
  if (capitalGains == null || annualIncome == null || otherIncome == null) {
    return null;
  }
  return calculateUkCapitalGainsTax({
    taxYear: input.taxYear,
    capitalGains,
    assetType: input.assetType,
    assetsInTrust: input.assetsInTrust,
    annualIncome,
    otherIncome,
  });
}
