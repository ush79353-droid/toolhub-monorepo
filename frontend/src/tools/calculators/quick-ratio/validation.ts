import { calculateQuickRatioFromInput } from './calculation';
import type {
  QuickRatioFieldErrors,
  QuickRatioInput,
  QuickRatioResult,
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

function nonNeg(
  parsed: ReturnType<typeof parseNumber>,
  blankMsg: string,
): string | undefined {
  if (parsed.blank) return blankMsg;
  if (parsed.invalid || parsed.value == null) return 'Enter a valid amount.';
  if (parsed.value < 0) return 'Value cannot be negative.';
  return undefined;
}

export interface QuickRatioValidation {
  isValid: boolean;
  errors: QuickRatioFieldErrors;
  result: QuickRatioResult | null;
}

export function collectFieldErrors(
  input: QuickRatioInput,
): QuickRatioFieldErrors {
  const errors: QuickRatioFieldErrors = {};
  const { solveTarget, method } = input;

  if (
    solveTarget === 'requiredQuickAssets' ||
    solveTarget === 'currentLiabilities' ||
    solveTarget === 'requiredCash'
  ) {
    const t = parseNumber(input.targetQuickRatio);
    if (t.blank) errors.targetQuickRatio = 'Enter a target quick ratio.';
    else if (t.invalid || t.value == null)
      errors.targetQuickRatio = 'Enter a valid target quick ratio.';
    else if (t.value < 0)
      errors.targetQuickRatio = 'Target quick ratio cannot be negative.';
    else if (
      (solveTarget === 'currentLiabilities' || solveTarget === 'requiredCash') &&
      t.value <= 0
    ) {
      errors.targetQuickRatio =
        'Target quick ratio must be greater than zero for this reverse solve.';
    }
  }

  if (solveTarget === 'requiredQuickAssets' || solveTarget === 'requiredCash') {
    const cl = parseNumber(input.currentLiabilities);
    if (cl.blank)
      errors.currentLiabilities = 'Enter current liabilities greater than zero.';
    else if (cl.invalid || cl.value == null)
      errors.currentLiabilities = 'Enter a valid current liabilities amount.';
    else if (cl.value <= 0) {
      errors.currentLiabilities =
        'Quick ratio is undefined when current liabilities are zero. Enter a positive current liabilities value.';
    }
  }

  if (solveTarget === 'requiredCash') {
    const eMs = nonNeg(
      parseNumber(input.marketableSecurities),
      'Enter marketable securities (use 0 if none).',
    );
    if (eMs) errors.marketableSecurities = eMs;
    const eAr = nonNeg(
      parseNumber(input.accountsReceivable),
      'Enter accounts receivable (use 0 if none).',
    );
    if (eAr) errors.accountsReceivable = eAr;
  }

  if (solveTarget === 'currentLiabilities') {
    if (method === 'direct') {
      const eC = nonNeg(
        parseNumber(input.cashAndCashEquivalents),
        'Enter cash and cash equivalents (use 0 if none).',
      );
      if (eC) errors.cashAndCashEquivalents = eC;
      const eMs = nonNeg(
        parseNumber(input.marketableSecurities),
        'Enter marketable securities (use 0 if none).',
      );
      if (eMs) errors.marketableSecurities = eMs;
      const eAr = nonNeg(
        parseNumber(input.accountsReceivable),
        'Enter accounts receivable (use 0 if none).',
      );
      if (eAr) errors.accountsReceivable = eAr;
    } else {
      collectAdjusted(input, errors);
    }
  }

  if (solveTarget === 'quickRatio') {
    if (method === 'direct') {
      const eC = nonNeg(
        parseNumber(input.cashAndCashEquivalents),
        'Enter cash and cash equivalents (use 0 if none).',
      );
      if (eC) errors.cashAndCashEquivalents = eC;
      const eMs = nonNeg(
        parseNumber(input.marketableSecurities),
        'Enter marketable securities (use 0 if none).',
      );
      if (eMs) errors.marketableSecurities = eMs;
      const eAr = nonNeg(
        parseNumber(input.accountsReceivable),
        'Enter accounts receivable (use 0 if none).',
      );
      if (eAr) errors.accountsReceivable = eAr;
    } else {
      collectAdjusted(input, errors);
    }

    const cl = parseNumber(input.currentLiabilities);
    if (cl.blank)
      errors.currentLiabilities = 'Enter current liabilities greater than zero.';
    else if (cl.invalid || cl.value == null)
      errors.currentLiabilities = 'Enter a valid current liabilities amount.';
    else if (cl.value <= 0) {
      errors.currentLiabilities =
        'Quick ratio is undefined when current liabilities are zero. Enter a positive current liabilities value.';
    }
  }

  return errors;
}

function collectAdjusted(
  input: QuickRatioInput,
  errors: QuickRatioFieldErrors,
): void {
  const eCa = nonNeg(
    parseNumber(input.currentAssets),
    'Enter total current assets.',
  );
  if (eCa) errors.currentAssets = eCa;
  const eI = nonNeg(parseNumber(input.inventory), 'Enter inventory (use 0 if none).');
  if (eI) errors.inventory = eI;
  const eP = nonNeg(
    parseNumber(input.prepaidExpenses),
    'Enter prepaid expenses (use 0 if none).',
  );
  if (eP) errors.prepaidExpenses = eP;
  const eO = nonNeg(
    parseNumber(input.otherNonQuickAssets),
    'Enter other non-quick current assets (use 0 if none).',
  );
  if (eO) errors.otherNonQuickAssets = eO;

  const ca = parseNumber(input.currentAssets);
  const inv = parseNumber(input.inventory);
  const pe = parseNumber(input.prepaidExpenses);
  const oth = parseNumber(input.otherNonQuickAssets);
  if (
    ca.value != null &&
    inv.value != null &&
    pe.value != null &&
    oth.value != null &&
    !ca.blank &&
    inv.value + pe.value + oth.value > ca.value
  ) {
    errors.inventory =
      'Excluded current assets (inventory + prepaid + other) cannot exceed total current assets.';
  }
}

export function hasFieldErrors(errors: QuickRatioFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateQuickRatioInput(
  input: QuickRatioInput,
): QuickRatioValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateQuickRatioFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
