import { calculateAltmanZScore } from './calculation';
import type {
  AltmanZScoreFieldErrors,
  AltmanZScoreInput,
  AltmanZScoreResult,
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

export interface AltmanZScoreValidation {
  isValid: boolean;
  errors: AltmanZScoreFieldErrors;
  result: AltmanZScoreResult | null;
}

function requireFinite(
  p: ReturnType<typeof parseNumber>,
  blank: string,
  allowNeg = true
): string | undefined {
  if (p.blank) return blank;
  if (p.invalid || p.value == null) return 'Enter a valid finite number.';
  if (!allowNeg && p.value < 0) return 'Value cannot be negative.';
  return undefined;
}

export function collectFieldErrors(
  input: AltmanZScoreInput
): AltmanZScoreFieldErrors {
  const errors: AltmanZScoreFieldErrors = {};

  if (input.workingCapitalSource === 'balance-sheet') {
    const ca = parseNumber(input.currentAssets);
    const cl = parseNumber(input.currentLiabilities);
    const e1 = requireFinite(ca, 'Enter current assets.');
    const e2 = requireFinite(cl, 'Enter current liabilities.');
    if (e1) errors.currentAssets = e1;
    if (e2) errors.currentLiabilities = e2;
  } else if (input.workingCapitalSource === 'simplified') {
    const ar = parseNumber(input.accountsReceivable);
    const inv = parseNumber(input.inventory);
    const ap = parseNumber(input.accountsPayable);
    const e1 = requireFinite(ar, 'Enter accounts receivable.');
    const e2 = requireFinite(inv, 'Enter inventory.');
    const e3 = requireFinite(ap, 'Enter accounts payable.');
    if (e1) errors.accountsReceivable = e1;
    if (e2) errors.inventory = e2;
    if (e3) errors.accountsPayable = e3;
  } else {
    const wc = parseNumber(input.workingCapital);
    const e = requireFinite(wc, 'Enter net working capital.');
    if (e) errors.workingCapital = e;
  }

  if (input.marketEquitySource === 'shares') {
    const sh = parseNumber(input.sharesOutstanding);
    const px = parseNumber(input.sharePrice);
    if (sh.blank) errors.sharesOutstanding = 'Enter shares outstanding.';
    else if (sh.invalid || sh.value == null)
      errors.sharesOutstanding = 'Enter a valid share count.';
    else if (sh.value < 0)
      errors.sharesOutstanding = 'Shares outstanding cannot be negative.';

    if (px.blank) errors.sharePrice = 'Enter the share price.';
    else if (px.invalid || px.value == null)
      errors.sharePrice = 'Enter a valid share price.';
    else if (px.value < 0)
      errors.sharePrice = 'Share price cannot be negative.';
  } else {
    const mve = parseNumber(input.marketValueOfEquity);
    const e = requireFinite(mve, 'Enter market value of equity.');
    if (e) errors.marketValueOfEquity = e;
  }

  if (input.retainedEarningsSource === 'rollforward') {
    const begin = parseNumber(input.beginningRetainedEarnings);
    const ni = parseNumber(input.netIncome);
    const dps = parseNumber(input.dividendPerShare);
    const other = parseNumber(input.otherDividends);
    const sh = parseNumber(input.sharesOutstanding);

    const e1 = requireFinite(begin, 'Enter beginning retained earnings.');
    const e2 = requireFinite(ni, 'Enter net income.');
    if (e1) errors.beginningRetainedEarnings = e1;
    if (e2) errors.netIncome = e2;

    if (!dps.blank) {
      if (dps.invalid || dps.value == null)
        errors.dividendPerShare = 'Enter a valid dividend per share.';
      else if (dps.value < 0)
        errors.dividendPerShare = 'Dividend per share cannot be negative.';
      if (sh.blank)
        errors.sharesOutstanding =
          'Enter shares outstanding to compute total dividends from DPS.';
      else if (sh.invalid || sh.value == null)
        errors.sharesOutstanding = 'Enter a valid share count.';
      else if (sh.value < 0)
        errors.sharesOutstanding = 'Shares outstanding cannot be negative.';
    }

    if (!other.blank) {
      if (other.invalid || other.value == null)
        errors.otherDividends = 'Enter a valid other-dividends amount.';
      else if (other.value < 0)
        errors.otherDividends = 'Other dividends cannot be negative.';
    }
  } else {
    const re = parseNumber(input.retainedEarnings);
    const e = requireFinite(re, 'Enter retained earnings.');
    if (e) errors.retainedEarnings = e;
  }

  const ebit = parseNumber(input.ebit);
  const ta = parseNumber(input.totalAssets);
  const tl = parseNumber(input.totalLiabilities);
  const sales = parseNumber(input.sales);

  const eEbit = requireFinite(ebit, 'Enter EBIT.');
  if (eEbit) errors.ebit = eEbit;

  if (ta.blank) errors.totalAssets = 'Enter total assets.';
  else if (ta.invalid || ta.value == null)
    errors.totalAssets = 'Enter a valid total assets amount.';
  else if (ta.value <= 0)
    errors.totalAssets =
      'Total assets must be greater than zero to calculate the Altman Z-Score.';

  if (tl.blank) errors.totalLiabilities = 'Enter total liabilities.';
  else if (tl.invalid || tl.value == null)
    errors.totalLiabilities = 'Enter a valid total liabilities amount.';
  else if (tl.value <= 0)
    errors.totalLiabilities =
      'Total liabilities must be greater than zero; X4 (MVE / TL) is undefined at zero and Infinity/NaN are not shown.';

  if (sales.blank) errors.sales = 'Enter sales (net revenue).';
  else if (sales.invalid || sales.value == null)
    errors.sales = 'Enter a valid sales amount.';
  else if (sales.value < 0) errors.sales = 'Sales cannot be negative.';

  return errors;
}

export function hasFieldErrors(errors: AltmanZScoreFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateAltmanZScoreInput(
  input: AltmanZScoreInput
): AltmanZScoreValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateAltmanZScore(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate the Altman Z-Score with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
