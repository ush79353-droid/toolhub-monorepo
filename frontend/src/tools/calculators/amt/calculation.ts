/**
 * Historical US federal AMT engine for tax years 2022 and 2023.
 *
 * Official sources:
 * - Instructions for Form 6251 (2022) and (2023)
 * - Rev. Proc. 2021-45 (TY 2022 §55 amounts)
 * - Rev. Proc. 2022-38 (TY 2023 §55 amounts)
 *
 * Form 6251 money amounts are rounded to the nearest whole dollar.
 */
import {
  AMT_PARAMS,
  DISCLOSURE_AMTI,
  DISCLOSURE_SCOPE,
  DISCLOSURE_TENTATIVE,
} from './amt-parameters';
import type { AmtFilingStatus, AmtInput, AmtResult, AmtTaxYear } from './types';

export interface AmtNumericInput {
  taxYear: AmtTaxYear;
  filingStatus: AmtFilingStatus;
  amti: number;
  taxCredits: number;
}

/** Suggest AMTI from AGI + non-deductible taxes (starting point only). */
export function suggestAmtiFromParts(agi: number, nonDeductibleTaxes: number): number {
  return agi + nonDeductibleTaxes;
}

/** Form 6251-style nearest-dollar rounding. */
export function roundAmtDollar(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * MFS Form 6251 line-4 add-on: when AMTI exceeds phaseoutComplete, add 25% of the
 * excess (or the full exemption once AMTI reaches mfsAddonFullAt).
 */
export function mfsLine4Addon(
  amti: number,
  params: (typeof AMT_PARAMS)[AmtTaxYear]['married-separate'],
): number {
  if (amti <= params.phaseoutComplete) return 0;
  if (amti >= params.mfsAddonFullAt) return params.exemption;
  return roundAmtDollar(0.25 * (amti - params.phaseoutComplete));
}

export function allowedExemption(
  amtiAdjusted: number,
  exemption: number,
  phaseoutStart: number,
): { phasedOut: number; allowed: number } {
  const excess = Math.max(0, amtiAdjusted - phaseoutStart);
  const phasedOut = roundAmtDollar(0.25 * excess);
  const allowed = Math.max(0, exemption - phasedOut);
  return { phasedOut, allowed };
}

/**
 * Tentative minimum tax on taxable excess using the 26%/28% continuity method
 * from Form 6251 instructions (multiply by 28% and subtract the published offset
 * when above the 26% ceiling).
 */
export function tentativeMinimumTax(
  taxableExcess: number,
  rate26Ceiling: number,
  rate28Offset: number,
): number {
  if (taxableExcess <= 0) return 0;
  if (taxableExcess <= rate26Ceiling) {
    return roundAmtDollar(taxableExcess * 0.26);
  }
  return roundAmtDollar(taxableExcess * 0.28 - rate28Offset);
}

export function calculateAmt(input: AmtNumericInput): AmtResult {
  const params = AMT_PARAMS[input.taxYear][input.filingStatus];
  const amtiEntered = roundAmtDollar(input.amti);

  const mfsAddon =
    input.filingStatus === 'married-separate'
      ? mfsLine4Addon(amtiEntered, params)
      : 0;

  const amtiAdjusted = roundAmtDollar(amtiEntered + mfsAddon);
  const { phasedOut, allowed } = allowedExemption(
    amtiAdjusted,
    params.exemption,
    params.phaseoutStart,
  );
  const taxableExcess = Math.max(0, amtiAdjusted - allowed);
  const tmt = tentativeMinimumTax(
    taxableExcess,
    params.rate26Ceiling,
    params.rate28Offset,
  );

  const creditsRaw = roundAmtDollar(Math.max(0, input.taxCredits));
  const creditsApplied = Math.min(creditsRaw, tmt);
  const tentativeAmtAfterCredits = Math.max(0, tmt - creditsApplied);

  // Guard against NaN / Infinity leaking into UI.
  const safe = (n: number) => (Number.isFinite(n) ? n : 0);

  const result: AmtResult = {
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    amtiEntered: safe(amtiEntered),
    mfsAddon: safe(mfsAddon),
    amtiAdjusted: safe(amtiAdjusted),
    exemptionBase: params.exemption,
    exemptionPhasedOut: safe(phasedOut),
    exemptionAllowed: safe(allowed),
    taxableExcess: safe(taxableExcess),
    tentativeMinimumTax: safe(tmt),
    creditsApplied: safe(creditsApplied),
    tentativeAmtAfterCredits: safe(tentativeAmtAfterCredits),
    formattedAmtiAdjusted: formatUsd(safe(amtiAdjusted)),
    formattedExemptionAllowed: formatUsd(safe(allowed)),
    formattedTaxableExcess: formatUsd(safe(taxableExcess)),
    formattedTentativeMinimumTax: formatUsd(safe(tmt)),
    formattedCreditsApplied: formatUsd(safe(creditsApplied)),
    formattedTentativeAmtAfterCredits: formatUsd(safe(tentativeAmtAfterCredits)),
    summaryText: buildSummary({
      taxYear: input.taxYear,
      filingStatus: input.filingStatus,
      taxableExcess: safe(taxableExcess),
      tmt: safe(tmt),
      afterCredits: safe(tentativeAmtAfterCredits),
      mfsAddon: safe(mfsAddon),
    }),
    disclosures: [DISCLOSURE_TENTATIVE, DISCLOSURE_AMTI, DISCLOSURE_SCOPE],
  };

  return result;
}

function filingLabel(status: AmtFilingStatus): string {
  switch (status) {
    case 'married-joint':
      return 'married filing jointly';
    case 'married-separate':
      return 'married filing separately';
    default:
      return 'single';
  }
}

function buildSummary(args: {
  taxYear: AmtTaxYear;
  filingStatus: AmtFilingStatus;
  taxableExcess: number;
  tmt: number;
  afterCredits: number;
  mfsAddon: number;
}): string {
  const parts = [
    `${args.taxYear} ${filingLabel(args.filingStatus)}: taxable excess $${formatUsd(args.taxableExcess)}, tentative minimum tax $${formatUsd(args.tmt)}, tentative AMT after credits $${formatUsd(args.afterCredits)}.`,
  ];
  if (args.mfsAddon > 0) {
    parts.push(`MFS line-4 add-on of $${formatUsd(args.mfsAddon)} was included in adjusted AMTI.`);
  }
  parts.push(
    'This is a tentative AMT estimate; additional AMT versus regular tax is not computed.',
  );
  return parts.join(' ');
}

export function shareResultText(result: AmtResult): string {
  return [
    `AMT Calculator (${result.taxYear})`,
    `Filing status: ${filingLabel(result.filingStatus)}`,
    `Adjusted AMTI: $${result.formattedAmtiAdjusted}`,
    `Exemption allowed: $${result.formattedExemptionAllowed}`,
    `Taxable excess: $${result.formattedTaxableExcess}`,
    `Tentative minimum tax: $${result.formattedTentativeMinimumTax}`,
    `Credits applied: $${result.formattedCreditsApplied}`,
    `Tentative AMT after credits: $${result.formattedTentativeAmtAfterCredits}`,
    DISCLOSURE_TENTATIVE,
  ].join('\n');
}

/** Re-export for callers that sync suggested AMTI from form strings. */
export type { AmtInput };
