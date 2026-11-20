import {
  calculateCurrentOperatingAssets,
  calculateCurrentOperatingLiabilities,
  calculateNetOperatingWorkingCapital,
  formatNowcMoney,
  interpretNowc,
} from './calculation';
import type {
  NetOperatingWorkingCapitalFieldErrors,
  NetOperatingWorkingCapitalInput,
  NetOperatingWorkingCapitalResult,
  NowcStatus,
} from './types';

export interface NetOperatingWorkingCapitalValidation {
  isValid: boolean;
  errors: NetOperatingWorkingCapitalFieldErrors;
  result: NetOperatingWorkingCapitalResult | null;
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

type FieldKey = keyof NetOperatingWorkingCapitalFieldErrors;

function checkNonneg(
  parsed: ReturnType<typeof parseMoney>,
  key: FieldKey,
  label: string,
  errors: NetOperatingWorkingCapitalFieldErrors
): void {
  if (parsed.blank) return;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
  } else if (parsed.value < 0) {
    errors[key] = `${label.charAt(0).toUpperCase()}${label.slice(1)} cannot be negative.`;
  }
}

export function validateNetOperatingWorkingCapitalInput(
  input: NetOperatingWorkingCapitalInput
): NetOperatingWorkingCapitalValidation {
  const errors: NetOperatingWorkingCapitalFieldErrors = {};
  const currency = input.currency;

  const cash = parseMoney(input.cash);
  const ar = parseMoney(input.accountsReceivable);
  const inv = parseMoney(input.inventories);
  const ap = parseMoney(input.accountsPayable);
  const ae = parseMoney(input.accruedExpenses);

  checkNonneg(cash, 'cash', 'cash amount', errors);
  checkNonneg(ar, 'accountsReceivable', 'accounts receivable amount', errors);
  checkNonneg(inv, 'inventories', 'inventories amount', errors);
  checkNonneg(ap, 'accountsPayable', 'accounts payable amount', errors);
  checkNonneg(ae, 'accruedExpenses', 'accrued expenses amount', errors);

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    cash.blank ||
    ar.blank ||
    inv.blank ||
    ap.blank ||
    ae.blank ||
    cash.value === null ||
    ar.value === null ||
    inv.value === null ||
    ap.value === null ||
    ae.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const currentOperatingAssets = calculateCurrentOperatingAssets(
    cash.value,
    ar.value,
    inv.value
  );
  const currentOperatingLiabilities = calculateCurrentOperatingLiabilities(
    ap.value,
    ae.value
  );
  if (
    currentOperatingAssets === null ||
    currentOperatingLiabilities === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const netOperatingWorkingCapital = calculateNetOperatingWorkingCapital(
    currentOperatingAssets,
    currentOperatingLiabilities
  );
  if (netOperatingWorkingCapital === null) {
    return { isValid: false, errors, result: null };
  }

  let status: NowcStatus = 'valid';
  let warningMessage: string | null =
    'Simplified screenshot model includes cash + AR + inventories − AP − accrued expenses. Prefer operating cash (not excess investment cash). Bank loans are excluded. Amounts share one currency label (no FX).';

  if (Math.abs(netOperatingWorkingCapital) < 5e-12) {
    status = 'zeroNowc';
  } else if (netOperatingWorkingCapital < 0) {
    status = 'negativeNowc';
    warningMessage =
      'Negative NOWC — operating liabilities exceed current operating assets. Not automatically insolvency; interpret with industry, supplier terms, and cash conversion.';
  }

  const result: NetOperatingWorkingCapitalResult = {
    cash: cash.value,
    accountsReceivable: ar.value,
    inventories: inv.value,
    accountsPayable: ap.value,
    accruedExpenses: ae.value,
    currentOperatingAssets,
    currentOperatingLiabilities,
    netOperatingWorkingCapital,
    status,
    interpretation: interpretNowc(
      netOperatingWorkingCapital,
      currentOperatingAssets,
      currentOperatingLiabilities
    ),
    warningMessage,
    currency,
    formattedCash: formatNowcMoney(cash.value, currency),
    formattedAccountsReceivable: formatNowcMoney(ar.value, currency),
    formattedInventories: formatNowcMoney(inv.value, currency),
    formattedAccountsPayable: formatNowcMoney(ap.value, currency),
    formattedAccruedExpenses: formatNowcMoney(ae.value, currency),
    formattedCurrentOperatingAssets: formatNowcMoney(
      currentOperatingAssets,
      currency
    ),
    formattedCurrentOperatingLiabilities: formatNowcMoney(
      currentOperatingLiabilities,
      currency
    ),
    formattedNetOperatingWorkingCapital: formatNowcMoney(
      netOperatingWorkingCapital,
      currency
    ),
  };

  return { isValid: true, errors, result };
}
