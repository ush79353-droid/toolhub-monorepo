import { calculateEpsDcf, calculateFcffDcf } from './calculation';
import type { DcfFieldErrors, DcfInput, DcfResult } from './types';

export interface DcfValidation {
  isValid: boolean;
  errors: DcfFieldErrors;
  result: DcfResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function requireFinite(
  parsed: { value: number | null; blank: boolean; invalid: boolean },
  label: string,
  errors: DcfFieldErrors,
  key: keyof DcfFieldErrors
): number | null {
  if (parsed.blank) return null;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  return parsed.value;
}

export function validateDcfInput(input: DcfInput): DcfValidation {
  const errors: DcfFieldErrors = {};

  const growth = parseNumber(input.perpetualGrowthPercent);
  const shares = parseNumber(input.outstandingShares);

  const growthValue = requireFinite(growth, 'perpetual growth', errors, 'perpetualGrowthPercent');
  const sharesValue = requireFinite(shares, 'outstanding shares', errors, 'outstandingShares');

  if (sharesValue !== null && !(sharesValue > 0)) {
    errors.outstandingShares = 'Outstanding shares must be greater than zero.';
  }

  if (input.method === 'fcff') {
    const first = parseNumber(input.firstFcff);
    const second = parseNumber(input.secondFcff);
    const cash = parseNumber(input.cash);
    const debt = parseNumber(input.outstandingDebt);
    const wacc = parseNumber(input.waccPercent);

    const firstFcff = requireFinite(first, 'first FCFF', errors, 'firstFcff');
    const secondFcff = requireFinite(second, 'second FCFF', errors, 'secondFcff');
    const cashValue = requireFinite(cash, 'cash', errors, 'cash');
    const debtValue = requireFinite(debt, 'outstanding debt', errors, 'outstandingDebt');
    const waccValue = requireFinite(wacc, 'WACC', errors, 'waccPercent');

    if (cashValue !== null && cashValue < 0) errors.cash = 'Cash cannot be negative.';
    if (debtValue !== null && debtValue < 0) {
      errors.outstandingDebt = 'Outstanding debt cannot be negative.';
    }
    if (
      waccValue !== null &&
      growthValue !== null &&
      !errors.waccPercent &&
      !errors.perpetualGrowthPercent &&
      !(waccValue > growthValue)
    ) {
      errors.waccPercent = 'WACC must be greater than perpetual growth.';
    }

    const incomplete =
      first.blank ||
      second.blank ||
      cash.blank ||
      debt.blank ||
      growth.blank ||
      wacc.blank ||
      shares.blank ||
      Object.keys(errors).length > 0;

    if (incomplete) return { isValid: false, errors, result: null };

    const result = calculateFcffDcf({
      firstFcff: firstFcff!,
      secondFcff: secondFcff!,
      cash: cashValue!,
      outstandingDebt: debtValue!,
      growthPercent: growthValue!,
      waccPercent: waccValue!,
      outstandingShares: sharesValue!,
      currency: input.currency,
    });

    if (!result) {
      errors.form = 'This combination does not produce a finite result.';
      return { isValid: false, errors, result: null };
    }
    return { isValid: true, errors: {}, result };
  }

  const first = parseNumber(input.firstEps);
  const second = parseNumber(input.secondEps);
  const equityRate = parseNumber(input.costOfEquityPercent);

  const firstEps = requireFinite(first, 'first EPS', errors, 'firstEps');
  const secondEps = requireFinite(second, 'second EPS', errors, 'secondEps');
  const costOfEquity = requireFinite(
    equityRate,
    'cost of equity',
    errors,
    'costOfEquityPercent'
  );

  if (
    costOfEquity !== null &&
    growthValue !== null &&
    !errors.costOfEquityPercent &&
    !errors.perpetualGrowthPercent &&
    !(costOfEquity > growthValue)
  ) {
    errors.costOfEquityPercent = 'Cost of equity must be greater than perpetual growth.';
  }

  const incomplete =
    first.blank ||
    second.blank ||
    growth.blank ||
    equityRate.blank ||
    shares.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) return { isValid: false, errors, result: null };

  const result = calculateEpsDcf({
    firstEps: firstEps!,
    secondEps: secondEps!,
    growthPercent: growthValue!,
    costOfEquityPercent: costOfEquity!,
    outstandingShares: sharesValue!,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }
  return { isValid: true, errors: {}, result };
}
