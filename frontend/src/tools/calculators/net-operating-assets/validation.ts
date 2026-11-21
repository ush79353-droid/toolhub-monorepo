import {
  calculateNetOperatingAssets,
  calculateOperatingAssets,
  calculateOperatingLiabilities,
  formatNoaMoney,
  interpretNoa,
} from './calculation';
import type {
  NetOperatingAssetsFieldErrors,
  NetOperatingAssetsInput,
  NetOperatingAssetsResult,
  NetOperatingAssetsStatus,
} from './types';

export interface NetOperatingAssetsValidation {
  isValid: boolean;
  errors: NetOperatingAssetsFieldErrors;
  result: NetOperatingAssetsResult | null;
}

function parseMoney(raw: string): {
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

type FieldKey = keyof NetOperatingAssetsFieldErrors;

function checkNonneg(
  parsed: ReturnType<typeof parseMoney>,
  key: FieldKey,
  label: string,
  errors: NetOperatingAssetsFieldErrors
): void {
  if (parsed.blank) return;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
  } else if (parsed.value < 0) {
    errors[key] = `${label.charAt(0).toUpperCase()}${label.slice(1)} cannot be negative.`;
  }
}

export function validateNetOperatingAssetsInput(
  input: NetOperatingAssetsInput
): NetOperatingAssetsValidation {
  const errors: NetOperatingAssetsFieldErrors = {};
  const currency = input.currency;

  const cash = parseMoney(input.cash);
  const ar = parseMoney(input.accountsReceivable);
  const inv = parseMoney(input.inventory);
  const pe = parseMoney(input.prepaidExpenses);
  const fa = parseMoney(input.fixedAssets);
  const ap = parseMoney(input.accountsPayable);
  const aoe = parseMoney(input.accruedOperatingExpenses);

  checkNonneg(cash, 'cash', 'cash amount', errors);
  checkNonneg(ar, 'accountsReceivable', 'accounts receivable amount', errors);
  checkNonneg(inv, 'inventory', 'inventory amount', errors);
  checkNonneg(pe, 'prepaidExpenses', 'prepaid expenses amount', errors);
  checkNonneg(fa, 'fixedAssets', 'fixed assets amount', errors);
  checkNonneg(ap, 'accountsPayable', 'accounts payable amount', errors);
  checkNonneg(
    aoe,
    'accruedOperatingExpenses',
    'accrued operating expenses amount',
    errors
  );

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const fields = [cash, ar, inv, pe, fa, ap, aoe];
  if (
    fields.some((f) => f.blank || f.value === null) ||
    cash.value === null ||
    ar.value === null ||
    inv.value === null ||
    pe.value === null ||
    fa.value === null ||
    ap.value === null ||
    aoe.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const operatingAssets = calculateOperatingAssets(
    cash.value,
    ar.value,
    inv.value,
    pe.value,
    fa.value
  );
  const operatingLiabilities = calculateOperatingLiabilities(
    ap.value,
    aoe.value
  );
  if (operatingAssets === null || operatingLiabilities === null) {
    return { isValid: false, errors, result: null };
  }

  const netOperatingAssets = calculateNetOperatingAssets(
    operatingAssets,
    operatingLiabilities
  );
  if (netOperatingAssets === null) {
    return { isValid: false, errors, result: null };
  }

  let status: NetOperatingAssetsStatus = 'valid';
  let warningMessage: string | null =
    'Simplified model: include operating cash only. Excess cash and financing debt are typically excluded from a strict NOA classification. Amounts share one currency label (no FX conversion).';

  if (Math.abs(netOperatingAssets) < 5e-12) {
    status = 'zeroNoa';
  } else if (netOperatingAssets < 0) {
    status = 'negativeNoa';
    warningMessage =
      'Negative NOA; operating liabilities exceed operating assets. This is not automatically insolvency; interpret with industry and financing structure.';
  }

  const result: NetOperatingAssetsResult = {
    cash: cash.value,
    accountsReceivable: ar.value,
    inventory: inv.value,
    prepaidExpenses: pe.value,
    fixedAssets: fa.value,
    accountsPayable: ap.value,
    accruedOperatingExpenses: aoe.value,
    operatingAssets,
    operatingLiabilities,
    netOperatingAssets,
    status,
    interpretation: interpretNoa(
      netOperatingAssets,
      operatingAssets,
      operatingLiabilities
    ),
    warningMessage,
    currency,
    formattedCash: formatNoaMoney(cash.value, currency),
    formattedAccountsReceivable: formatNoaMoney(ar.value, currency),
    formattedInventory: formatNoaMoney(inv.value, currency),
    formattedPrepaidExpenses: formatNoaMoney(pe.value, currency),
    formattedFixedAssets: formatNoaMoney(fa.value, currency),
    formattedAccountsPayable: formatNoaMoney(ap.value, currency),
    formattedAccruedOperatingExpenses: formatNoaMoney(aoe.value, currency),
    formattedOperatingAssets: formatNoaMoney(operatingAssets, currency),
    formattedOperatingLiabilities: formatNoaMoney(
      operatingLiabilities,
      currency
    ),
    formattedNetOperatingAssets: formatNoaMoney(netOperatingAssets, currency),
  };

  return { isValid: true, errors, result };
}
