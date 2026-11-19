/**
 * UI-facing validation stub — full numeric gates land with the engine commit.
 */
import { suggestAmtiFromParts } from './calculation';
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

/** Keep suggested AMTI in sync with AGI + non-deductible taxes for the form shell. */
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

  return {
    isValid: false,
    errors: {},
    result: null,
    syncedInput: synced,
  };
}
