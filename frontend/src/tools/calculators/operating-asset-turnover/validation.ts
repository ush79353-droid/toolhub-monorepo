import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateOperatingAssetTurnover } from './calculation';
import {
  MAX_MONEY,
  type OperatingAssetTurnoverFieldErrors,
  type OperatingAssetTurnoverInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  if (/infinity|nan/i.test(cleaned)) return Number.NaN;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function moneyMessage(
  value: number | null,
  label: string,
  reportBlanks: boolean,
): string | undefined {
  if (value === null) {
    return reportBlanks ? `Enter ${label}.` : undefined;
  }
  if (!Number.isFinite(value)) return `Enter a number for ${label}.`;
  if (value < 0) return `${label} cannot be negative.`;
  if (value > MAX_MONEY) return `${label} is too large.`;
  return undefined;
}

export function validateOperatingAssetTurnover(
  input: OperatingAssetTurnoverInput,
  options?: { reportBlanks?: boolean },
): { isValid: boolean; incomplete: boolean; errors: OperatingAssetTurnoverFieldErrors } {
  const errors: OperatingAssetTurnoverFieldErrors = {};
  const reportBlanks = options?.reportBlanks === true;
  let incomplete = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  const assetFields: Array<
    [
      keyof Pick<
        OperatingAssetTurnoverInput,
        | 'cash'
        | 'accountsReceivable'
        | 'inventory'
        | 'prepaidExpenses'
        | 'fixedAssets'
      >,
      string,
    ]
  > = [
    ['cash', 'cash'],
    ['accountsReceivable', 'accounts receivable'],
    ['inventory', 'inventory'],
    ['prepaidExpenses', 'prepaid expenses'],
    ['fixedAssets', 'fixed assets'],
  ];

  for (const [key, label] of assetFields) {
    const value = input[key];
    if (value === null) {
      if (reportBlanks) errors[key] = moneyMessage(value, label, true);
      else incomplete = true;
      continue;
    }
    const message = moneyMessage(value, label, reportBlanks);
    if (message) errors[key] = message;
  }

  if (input.sales === null) {
    if (reportBlanks) errors.sales = moneyMessage(null, 'sales', true);
    // Sales blank is OK for asset total; turnover stays empty.
  } else {
    const salesMessage = moneyMessage(input.sales, 'sales', reportBlanks);
    if (salesMessage) errors.sales = salesMessage;
  }

  const isValid =
    Object.keys(errors).length === 0 &&
    !incomplete &&
    calculateOperatingAssetTurnover(input) !== null;

  return { isValid, incomplete: incomplete && Object.keys(errors).length === 0, errors };
}
