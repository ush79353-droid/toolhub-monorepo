import { calculateAmt, suggestAmtiFromParts } from './calculation';
import type { AmtFieldErrors, AmtInput, AmtResult } from './types';

export interface AmtValidation {
  isValid: boolean;
  errors: AmtFieldErrors;
  result: AmtResult | null;
  syncedInput: AmtInput;
}

function parseOptionalMoney(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function moneyError(label: string, raw: string, opts?: { allowEmpty?: boolean }): string | undefined {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return opts?.allowEmpty ? undefined : `${label} is required.`;
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return `${label} must be a valid number.`;
  }
  if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
    return `${label} must be a finite number.`;
  }
  return undefined;
}

/** Sync suggested AMTI and validate monetary fields for the AMT engine. */
export function validateAmtInput(input: AmtInput): AmtValidation {
  let synced = input;

  if (input.amtiSource === 'suggested') {
    const agi = parseOptionalMoney(input.adjustedGrossIncome) ?? 0;
    const nonDed = parseOptionalMoney(input.nonDeductibleTaxes) ?? 0;
    const hasParts =
      input.adjustedGrossIncome.trim() !== '' || input.nonDeductibleTaxes.trim() !== '';
    const suggested = hasParts ? suggestAmtiFromParts(agi, nonDed) : null;
    synced = {
      ...input,
      amti: suggested === null ? '' : String(suggested),
    };
  }

  const errors: AmtFieldErrors = {};

  const agiErr = moneyError('Adjusted Gross Income', synced.adjustedGrossIncome, {
    allowEmpty: true,
  });
  if (agiErr) errors.adjustedGrossIncome = agiErr;

  const nonDedErr = moneyError('Non-deductible taxes', synced.nonDeductibleTaxes, {
    allowEmpty: true,
  });
  if (nonDedErr) errors.nonDeductibleTaxes = nonDedErr;

  const amtiErr = moneyError('AMTI', synced.amti);
  if (amtiErr) errors.amti = amtiErr;

  const creditsRaw = synced.taxCredits.trim() === '' ? '0' : synced.taxCredits;
  const creditsErr = moneyError('Tax credits', creditsRaw);
  if (creditsErr) {
    errors.taxCredits = creditsErr;
  } else {
    const credits = parseOptionalMoney(creditsRaw);
    if (credits !== null && credits < 0) {
      errors.taxCredits = 'Tax credits cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, syncedInput: synced };
  }

  const amti = parseOptionalMoney(synced.amti);
  const taxCredits = parseOptionalMoney(creditsRaw) ?? 0;

  if (amti === null) {
    return {
      isValid: false,
      errors: { amti: 'AMTI is required.' },
      result: null,
      syncedInput: synced,
    };
  }

  const result = calculateAmt({
    taxYear: synced.taxYear,
    filingStatus: synced.filingStatus,
    amti,
    taxCredits,
  });

  return {
    isValid: true,
    errors: {},
    result,
    syncedInput: synced,
  };
}
