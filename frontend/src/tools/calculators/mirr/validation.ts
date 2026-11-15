import { calculateMirr } from './calculation';
import {
  INITIAL_YEARS,
  MAX_YEARS,
  type MirrFieldErrors,
  type MirrInput,
  type MirrResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function isBlank(raw: string): boolean {
  return raw.trim() === '';
}

/** Keep at least INITIAL_YEARS fields; never exceed MAX_YEARS. */
export function normalizeYearCount(input: MirrInput, count: number): MirrInput {
  const target = Math.min(MAX_YEARS, Math.max(INITIAL_YEARS, count));
  const cashFlows = [...input.cashFlows];
  while (cashFlows.length < target) cashFlows.push('0');
  while (cashFlows.length > target) cashFlows.pop();
  return { ...input, cashFlows };
}

/**
 * Contiguous years 1..n where n is the last non-zero cash flow
 * (intermediate zeros kept; trailing default zeros trimmed).
 */
export function collectCashFlows(cashFlows: string[]): {
  values: number[] | null;
  errors: MirrFieldErrors;
  incomplete: boolean;
} {
  const errors: MirrFieldErrors = {};
  const parsed: (number | null)[] = [];

  for (let i = 0; i < cashFlows.length; i += 1) {
    const raw = cashFlows[i]!;
    if (isBlank(raw)) {
      parsed.push(null);
      continue;
    }
    const n = parseField(raw);
    if (n === null || Number.isNaN(n)) {
      errors[`year${i + 1}`] = `Enter a valid Year ${i + 1} cash flow.`;
      parsed.push(Number.NaN);
    } else {
      parsed.push(n);
    }
  }

  if (Object.keys(errors).length > 0) {
    return { values: null, errors, incomplete: false };
  }

  let lastNonZero = -1;
  for (let i = 0; i < parsed.length; i += 1) {
    const v = parsed[i];
    if (v !== null && v !== 0) lastNonZero = i;
  }

  if (lastNonZero < 0) {
    return { values: null, errors, incomplete: true };
  }

  const values: number[] = [];
  for (let i = 0; i <= lastNonZero; i += 1) {
    const v = parsed[i];
    values.push(v === null ? 0 : v!);
  }

  return { values, errors, incomplete: false };
}

export function validateMirrInput(input: MirrInput): {
  isValid: boolean;
  errors: MirrFieldErrors;
  result: MirrResult | null;
} {
  const errors: MirrFieldErrors = {};

  const finance = parseField(input.financingRatePercent);
  const reinvest = parseField(input.reinvestmentRatePercent);
  const initial = parseField(input.initialInvestment);
  const collected = collectCashFlows(input.cashFlows);

  if (finance === null || Number.isNaN(finance)) {
    if (input.financingRatePercent.trim() !== '') {
      errors.financingRatePercent = 'Enter a valid financing rate.';
    }
  } else if (!(1 + finance / 100 > 0)) {
    errors.financingRatePercent = 'Financing rate must be greater than −100%.';
  }

  if (reinvest === null || Number.isNaN(reinvest)) {
    if (input.reinvestmentRatePercent.trim() !== '') {
      errors.reinvestmentRatePercent = 'Enter a valid reinvestment rate.';
    }
  } else if (!(1 + reinvest / 100 > 0)) {
    errors.reinvestmentRatePercent = 'Reinvestment rate must be greater than −100%.';
  }

  if (initial === null) {
    // blank initial — wait for input
  } else if (Number.isNaN(initial) || initial < 0) {
    errors.initialInvestment = 'Enter a valid initial investment.';
  } else if (!(initial > 0)) {
    errors.initialInvestment = 'Initial investment must be greater than zero.';
  }

  Object.assign(errors, collected.errors);

  const incomplete =
    finance === null ||
    reinvest === null ||
    initial === null ||
    collected.incomplete ||
    Number.isNaN(finance as number) ||
    Number.isNaN(reinvest as number);

  if (incomplete || Object.keys(errors).length > 0 || !collected.values) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMirr({
    financingRatePercent: finance!,
    reinvestmentRatePercent: reinvest!,
    initialInvestment: initial!,
    cashFlows: collected.values,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite MIRR.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
