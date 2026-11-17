import {
  PROGRAM_CLOSED_NOTICE,
  type CaliforniaStimulusCheckIiInput,
  type CaliforniaStimulusCheckIiResult,
  type EligibilityStatus,
  type PaymentMethod,
  type TaxFileId,
} from './types';

/** CA AGI band for GSS II (non–married-filing-separately). Cal. Welf. & Inst. Code §8150.2(b)(1)(D). */
export const CA_AGI_MIN_USD = 1;
export const CA_AGI_MAX_USD = 75_000;

/** Standard 2020 return filing deadline for GSS II. §8150.2(b)(1)(A). */
export const STANDARD_FILING_DEADLINE = '2021-10-15';

/**
 * Extended deadline for certain ITIN applicants who applied for but had not
 * received an ITIN by Oct 15, 2021. §8150.2(b)(2).
 */
export const ITIN_EXTENDED_FILING_DEADLINE = '2022-02-15';

/** Controller issuance end date under §8150.2(g)(3)(A); FTB: no new payments after this date. */
export const PROGRAM_PAYMENT_END = '2022-07-15';

export const PAYMENT_START_HISTORICAL = '2021-08-27';

export function formatUsdWholeDollars(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * GSS II payment amount from FTB PSB 2021-18 / Cal. Welf. & Inst. Code §8150.2(c)
 * for non–married-filing-separately returns (screenshot has no MFS field).
 *
 * Returns null when the combination is not a GSS II payment category.
 */
export function resolveGssIiPaymentAmountUsd(input: {
  taxFileId: TaxFileId;
  qualifiedGssI: boolean;
  claimedChildDependent: boolean;
}): { amountUsd: number; categoryLabel: string } | null {
  const { taxFileId, qualifiedGssI, claimedChildDependent } = input;

  // FTB: If you qualified for GSS I and did not claim a dependent credit, you do not qualify for GSS II.
  if (qualifiedGssI && !claimedChildDependent) {
    return null;
  }

  if (qualifiedGssI && claimedChildDependent && taxFileId === 'ssn') {
    return {
      amountUsd: 500,
      categoryLabel:
        'SSN filer who qualified for Golden State Stimulus I and claimed one or more dependent exemption credits (§8150.2(c)(1))',
    };
  }

  if (qualifiedGssI && claimedChildDependent && taxFileId === 'itin') {
    return {
      amountUsd: 1000,
      categoryLabel:
        'ITIN filer who qualified for Golden State Stimulus I and claimed one or more dependent exemption credits (§8150.2(c)(3))',
    };
  }

  if (!qualifiedGssI && !claimedChildDependent) {
    return {
      amountUsd: 600,
      categoryLabel:
        'Did not qualify for Golden State Stimulus I and did not claim a dependent exemption credit (§8150.2(c)(2))',
    };
  }

  if (!qualifiedGssI && claimedChildDependent) {
    return {
      amountUsd: 1100,
      categoryLabel:
        'Did not qualify for Golden State Stimulus I and claimed one or more dependent exemption credits (§8150.2(c)(4))',
    };
  }

  return null;
}

function parseIsoDate(raw: string): { y: number; m: number; d: number } | null {
  const trimmed = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const [ys, ms, ds] = trimmed.split('-');
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

function compareIso(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function assessFilingDeadline(input: {
  taxFileId: TaxFileId;
  taxFilingDate: string;
}): {
  status: 'ok' | 'missing' | 'late-standard' | 'late-extended' | 'invalid';
  note: string;
} {
  const raw = input.taxFilingDate.trim();
  if (!raw) {
    return {
      status: 'missing',
      note: 'No tax filing date entered. Historically, 2020 California returns generally had to be filed by October 15, 2021 for GSS II (with a limited ITIN extension to February 15, 2022 under §8150.2(b)(2)).',
    };
  }

  const parsed = parseIsoDate(raw);
  if (!parsed) {
    return {
      status: 'invalid',
      note: 'Enter a valid tax filing date.',
    };
  }

  const iso = raw;
  if (compareIso(iso, STANDARD_FILING_DEADLINE) <= 0) {
    return {
      status: 'ok',
      note: `Filed on or before the standard GSS II deadline (${STANDARD_FILING_DEADLINE}).`,
    };
  }

  if (input.taxFileId === 'itin' && compareIso(iso, ITIN_EXTENDED_FILING_DEADLINE) <= 0) {
    return {
      status: 'ok',
      note: `Filed after October 15, 2021 but on or before February 15, 2022. The ITIN extension in §8150.2(b)(2) applied only when the filer (or spouse) had applied for but not received an ITIN by October 15, 2021 — this calculator cannot verify that condition.`,
    };
  }

  if (input.taxFileId === 'itin') {
    return {
      status: 'late-extended',
      note: `Filing date is after the ITIN-related extended deadline (${ITIN_EXTENDED_FILING_DEADLINE}). Under published GSS II rules, that return would not meet the statutory filing-date requirement.`,
    };
  }

  return {
    status: 'late-standard',
    note: `Filing date is after the standard GSS II deadline (${STANDARD_FILING_DEADLINE}). Under published GSS II rules for SSN returns, that filing would not meet the statutory deadline.`,
  };
}

export function buildHistoricalTimingGuidance(input: {
  paymentMethod: PaymentMethod;
  taxFilingDate: string;
  eligibilityStatus: EligibilityStatus;
}): string {
  const base = [
    `Historical distribution window: payments began around ${PAYMENT_START_HISTORICAL} and the Controller was directed to issue required GSS II payments no later than ${PROGRAM_PAYMENT_END}.`,
    'FTB reports the Golden State Stimulus I & II programs are complete and no new GSS payments have been issued since July 15, 2022.',
  ];

  if (input.eligibilityStatus === 'ineligible' || input.eligibilityStatus === 'filing-deadline-issue') {
    return [
      ...base,
      'Because this estimate does not show a qualifying GSS II payment, no historical personal payment date is estimated.',
    ].join(' ');
  }

  const methodNote =
    input.paymentMethod === 'direct-deposit'
      ? 'Historical FTB guidance: direct deposits typically appeared within a few business days after issuance.'
      : 'Historical FTB guidance: paper checks could take up to about three weeks to arrive, and mailed batches were organized by the last three digits of the ZIP code on the 2020 return (this calculator does not collect ZIP and will not invent a mail date).';

  const filing = input.taxFilingDate.trim();
  const lateProcessNote =
    filing && compareIso(filing, '2021-09-01') > 0
      ? 'FTB also stated that returns filed after September 1, 2021 could take up to about 45 days after processing before a payment was scheduled.'
      : 'Payments were not scheduled until the 2020 return was processed; processing times varied.';

  return [
    ...base,
    methodNote,
    lateProcessNote,
    'A reliable personal payment calendar date cannot be determined from payment method and filing date alone, so this tool provides labeled historical guidance rather than a fabricated receipt date.',
  ].join(' ');
}

export interface CalculateGssIiArgs {
  californiaAgi: number | null;
  californiaResident2020: boolean;
  taxFileId: TaxFileId;
  qualifiedGssI: boolean;
  claimedChildDependent: boolean;
  paymentMethod: PaymentMethod;
  taxFilingDate: string;
}

/**
 * Pure GSS II eligibility + payment estimate using verified historical statute/FTB rules.
 * Does not invent MFS half-amounts (no filing-status field in the reference).
 * Does not invent wage or “claimed as dependent” checks (fields absent from screenshot).
 */
export function calculateGssIi(args: CalculateGssIiArgs): CaliforniaStimulusCheckIiResult {
  const assumptionsNote =
    'Assumptions from screenshot-limited inputs: amounts are the non–married-filing-separately figures in §8150.2(c). This form does not collect wages subject to California withholding, whether another taxpayer could claim you as a dependent, California residency on the payment-issue date, or married-filing-separately status — all of which affected real GSS II qualification.';

  const filing = assessFilingDeadline({
    taxFileId: args.taxFileId,
    taxFilingDate: args.taxFilingDate,
  });

  if (!args.californiaResident2020) {
    const eligibilityStatus: EligibilityStatus = 'ineligible';
    return {
      eligibilityStatus,
      paymentAmountUsd: null,
      formattedPaymentAmount: null,
      paymentCategoryLabel: null,
      eligibilitySummary:
        'Not eligible under published GSS II residency rules: recipients had to be California residents for more than half of tax year 2020 (and on the payment issue date).',
      historicalTimingGuidance: buildHistoricalTimingGuidance({
        paymentMethod: args.paymentMethod,
        taxFilingDate: args.taxFilingDate,
        eligibilityStatus,
      }),
      programClosedNotice: PROGRAM_CLOSED_NOTICE,
      assumptionsNote,
    };
  }

  if (args.californiaAgi === null) {
    const eligibilityStatus: EligibilityStatus = 'needs-income';
    return {
      eligibilityStatus,
      paymentAmountUsd: null,
      formattedPaymentAmount: null,
      paymentCategoryLabel: null,
      eligibilitySummary:
        'Enter California Adjusted Gross Income (2020) to estimate GSS II. Published CA AGI band was $1–$75,000 (or $37,500 for married filing separately, which this form does not model).',
      historicalTimingGuidance: buildHistoricalTimingGuidance({
        paymentMethod: args.paymentMethod,
        taxFilingDate: args.taxFilingDate,
        eligibilityStatus,
      }),
      programClosedNotice: PROGRAM_CLOSED_NOTICE,
      assumptionsNote,
    };
  }

  if (args.californiaAgi < CA_AGI_MIN_USD || args.californiaAgi > CA_AGI_MAX_USD) {
    const eligibilityStatus: EligibilityStatus = 'ineligible';
    return {
      eligibilityStatus,
      paymentAmountUsd: null,
      formattedPaymentAmount: null,
      paymentCategoryLabel: null,
      eligibilitySummary: `Not eligible under the published CA AGI band for GSS II ($${CA_AGI_MIN_USD}–$${CA_AGI_MAX_USD.toLocaleString('en-US')} for statuses other than married filing separately). Entered CA AGI: ${formatUsdWholeDollars(args.californiaAgi)}.`,
      historicalTimingGuidance: buildHistoricalTimingGuidance({
        paymentMethod: args.paymentMethod,
        taxFilingDate: args.taxFilingDate,
        eligibilityStatus,
      }),
      programClosedNotice: PROGRAM_CLOSED_NOTICE,
      assumptionsNote,
    };
  }

  if (filing.status === 'late-standard' || filing.status === 'late-extended') {
    const eligibilityStatus: EligibilityStatus = 'filing-deadline-issue';
    return {
      eligibilityStatus,
      paymentAmountUsd: null,
      formattedPaymentAmount: null,
      paymentCategoryLabel: null,
      eligibilitySummary: filing.note,
      historicalTimingGuidance: buildHistoricalTimingGuidance({
        paymentMethod: args.paymentMethod,
        taxFilingDate: args.taxFilingDate,
        eligibilityStatus,
      }),
      programClosedNotice: PROGRAM_CLOSED_NOTICE,
      assumptionsNote,
    };
  }

  const payment = resolveGssIiPaymentAmountUsd({
    taxFileId: args.taxFileId,
    qualifiedGssI: args.qualifiedGssI,
    claimedChildDependent: args.claimedChildDependent,
  });

  if (!payment) {
    const eligibilityStatus: EligibilityStatus = 'ineligible';
    return {
      eligibilityStatus,
      paymentAmountUsd: null,
      formattedPaymentAmount: null,
      paymentCategoryLabel: null,
      eligibilitySummary:
        'Not eligible for a GSS II payment under FTB guidance: filers who qualified for Golden State Stimulus I and did not claim a credit for one or more dependents did not receive GSS II.',
      historicalTimingGuidance: buildHistoricalTimingGuidance({
        paymentMethod: args.paymentMethod,
        taxFilingDate: args.taxFilingDate,
        eligibilityStatus,
      }),
      programClosedNotice: PROGRAM_CLOSED_NOTICE,
      assumptionsNote,
    };
  }

  const eligibilityStatus: EligibilityStatus = 'eligible';
  const filingNote =
    filing.status === 'missing'
      ? ` ${filing.note}`
      : filing.status === 'ok'
        ? ` ${filing.note}`
        : '';

  return {
    eligibilityStatus,
    paymentAmountUsd: payment.amountUsd,
    formattedPaymentAmount: formatUsdWholeDollars(payment.amountUsd),
    paymentCategoryLabel: payment.categoryLabel,
    eligibilitySummary: `Historical GSS II estimate: ${formatUsdWholeDollars(payment.amountUsd)}. Category: ${payment.categoryLabel}. CA AGI ${formatUsdWholeDollars(args.californiaAgi)} is within the published $1–$75,000 band (non-MFS).${filingNote}`,
    historicalTimingGuidance: buildHistoricalTimingGuidance({
      paymentMethod: args.paymentMethod,
      taxFilingDate: args.taxFilingDate,
      eligibilityStatus,
    }),
    programClosedNotice: PROGRAM_CLOSED_NOTICE,
    assumptionsNote,
  };
}

/** Convenience wrapper accepting the form input shape (after numeric AGI parse). */
export function calculateGssIiFromParsed(
  input: CaliforniaStimulusCheckIiInput,
  californiaAgi: number | null
): CaliforniaStimulusCheckIiResult {
  return calculateGssIi({
    californiaAgi,
    californiaResident2020: input.californiaResident2020 === 'yes',
    taxFileId: input.taxFileId,
    qualifiedGssI: input.qualifiedGssI === 'yes',
    claimedChildDependent: input.claimedChildDependent === 'yes',
    paymentMethod: input.paymentMethod,
    taxFilingDate: input.taxFilingDate,
  });
}
