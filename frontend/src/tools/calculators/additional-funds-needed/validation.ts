import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateAfn } from './calculation';
import { MAX_MONEY, type AfnFieldErrors, type AfnInput } from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function moneyMessage(value: number | null, label: string, reportBlanks: boolean): string | undefined {
  if (value === null) {
    return reportBlanks ? `Enter ${label}.` : undefined;
  }
  if (!Number.isFinite(value)) return `Enter a number for ${label}.`;
  if (Math.abs(value) > MAX_MONEY) return `${label} is too large.`;
  return undefined;
}

export function validateAfn(
  input: AfnInput,
  options?: { reportBlanks?: boolean },
): { isValid: boolean; incomplete: boolean; errors: AfnFieldErrors } {
  const errors: AfnFieldErrors = {};
  const reportBlanks = options?.reportBlanks === true;
  let incomplete = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  const fields: Array<[keyof AfnInput, string]> = [
    ['changeInAssets', 'change in assets'],
    ['changeInLiabilities', 'change in liabilities'],
    ['changeInRetainedEarnings', 'change in retained earnings'],
  ];

  for (const [key, label] of fields) {
    const value = input[key] as number | null;
    if (value === null) {
      if (reportBlanks) {
        errors[key as keyof AfnFieldErrors] = moneyMessage(value, label, true);
      } else {
        incomplete = true;
      }
      continue;
    }
    const message = moneyMessage(value, label, reportBlanks);
    if (message) errors[key as keyof AfnFieldErrors] = message;
  }

  const isValid =
    Object.keys(errors).length === 0 && !incomplete && calculateAfn(input) !== null;

  return { isValid, incomplete: incomplete && Object.keys(errors).length === 0, errors };
}
