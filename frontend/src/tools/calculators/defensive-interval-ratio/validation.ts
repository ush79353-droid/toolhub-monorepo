import { calculateDefensiveIntervalRatio } from './calculation';
import type {
  DefensiveIntervalRatioFieldErrors,
  DefensiveIntervalRatioInput,
  DefensiveIntervalRatioResult,
} from './types';

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface DefensiveIntervalRatioValidation {
  isValid: boolean;
  errors: DefensiveIntervalRatioFieldErrors;
  result: DefensiveIntervalRatioResult | null;
}

function requireNonNeg(
  parsed: ReturnType<typeof parseNumber>,
  blankMsg: string,
  invalidMsg: string,
  negativeMsg: string,
): string | undefined {
  if (parsed.blank) return blankMsg;
  if (parsed.invalid || parsed.value == null) return invalidMsg;
  if (parsed.value < 0) return negativeMsg;
  return undefined;
}

export function collectFieldErrors(
  input: DefensiveIntervalRatioInput,
): DefensiveIntervalRatioFieldErrors {
  const errors: DefensiveIntervalRatioFieldErrors = {};
  const { solveTarget } = input;

  if (solveTarget === 'requiredAssets') {
    const days = parseNumber(input.targetDays);
    const dce = parseNumber(input.dailyCashExpenditure);
    const eDays = requireNonNeg(
      days,
      'Enter the target defensive interval in days.',
      'Enter a valid number of days.',
      'Target days cannot be negative.',
    );
    if (eDays) errors.targetDays = eDays;
    else if (days.value === 0) {
      // zero days → zero required assets is allowed mathematically via engine
    }

    if (dce.blank) {
      errors.dailyCashExpenditure =
        'Enter average daily cash expenditure.';
    } else if (dce.invalid || dce.value == null) {
      errors.dailyCashExpenditure = 'Enter a valid daily expenditure.';
    } else if (dce.value <= 0) {
      errors.dailyCashExpenditure =
        'Daily cash expenditure must be greater than zero.';
    }
    return errors;
  }

  if (solveTarget === 'maxDailyExpenditure') {
    const da = parseNumber(input.defensiveAssetsDirect);
    const days = parseNumber(input.targetDays);
    const eDa = requireNonNeg(
      da,
      'Enter available defensive assets.',
      'Enter a valid defensive assets amount.',
      'Defensive assets cannot be negative.',
    );
    if (eDa) errors.defensiveAssetsDirect = eDa;

    if (days.blank) {
      errors.targetDays = 'Enter the target defensive interval in days.';
    } else if (days.invalid || days.value == null) {
      errors.targetDays = 'Enter a valid number of days.';
    } else if (days.value <= 0) {
      errors.targetDays = 'Target days must be greater than zero.';
    }
    return errors;
  }

  // Mode A — DIR
  const cash = parseNumber(input.cashAndCashEquivalents);
  const ms = parseNumber(input.marketableSecurities);
  const ar = parseNumber(input.accountsReceivable);
  const oe = parseNumber(input.annualOperatingExpenses);
  const nce = parseNumber(input.annualNonCashCharges);

  const eCash = requireNonNeg(
    cash,
    'Enter cash and cash equivalents.',
    'Enter a valid cash amount.',
    'Cash and cash equivalents cannot be negative.',
  );
  if (eCash) errors.cashAndCashEquivalents = eCash;

  const eMs = requireNonNeg(
    ms,
    'Enter marketable securities (use 0 if none).',
    'Enter a valid marketable securities amount.',
    'Marketable securities cannot be negative.',
  );
  if (eMs) errors.marketableSecurities = eMs;

  const eAr = requireNonNeg(
    ar,
    'Enter accounts receivable (use 0 if none).',
    'Enter a valid accounts receivable amount.',
    'Accounts receivable cannot be negative.',
  );
  if (eAr) errors.accountsReceivable = eAr;

  const eOe = requireNonNeg(
    oe,
    'Enter annual operating expenses.',
    'Enter a valid annual operating expenses amount.',
    'Annual operating expenses cannot be negative.',
  );
  if (eOe) errors.annualOperatingExpenses = eOe;

  const eNce = requireNonNeg(
    nce,
    'Enter annual non-cash charges (use 0 if none).',
    'Enter a valid non-cash charges amount.',
    'Annual non-cash charges cannot be negative.',
  );
  if (eNce) errors.annualNonCashCharges = eNce;
  else if (
    oe.value != null &&
    nce.value != null &&
    !oe.blank &&
    !nce.blank &&
    nce.value > oe.value
  ) {
    errors.annualNonCashCharges =
      'Annual non-cash charges cannot exceed annual operating expenses for this calculation. Please review the input values.';
  } else if (
    oe.value != null &&
    nce.value != null &&
    !oe.blank &&
    !nce.blank &&
    oe.value - nce.value === 0
  ) {
    errors.form =
      'Defensive interval cannot be calculated because average daily cash expenditure is zero.';
  }

  return errors;
}

export function hasFieldErrors(
  errors: DefensiveIntervalRatioFieldErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

export function validateDefensiveIntervalRatioInput(
  input: DefensiveIntervalRatioInput,
): DefensiveIntervalRatioValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateDefensiveIntervalRatio(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to calculate with these inputs.',
      },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
