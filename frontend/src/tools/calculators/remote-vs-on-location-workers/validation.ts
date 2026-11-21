import {
  calculateRemoteVsOnLocation,
  toMonths,
  toResult,
  type ExpenseLine,
} from './calculation';
import type {
  ExpenseFrequency,
  ExtraExpenseRow,
  RemoteVsOnLocationFieldErrors,
  RemoteVsOnLocationInput,
  RemoteVsOnLocationResult,
  SideExpenses,
} from './types';

function parseMoney(raw: string): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: 0 };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid amount.' };
  }
  if (value < 0) {
    return { ok: false, error: 'Amount cannot be negative.' };
  }
  return { ok: true, value };
}

function parseEmployees(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { ok: true, value: 0 };
  if (!/^-?\d+$/.test(cleaned)) {
    if (/[.]/.test(cleaned)) {
      return { ok: false, error: 'Employee count must be a whole number.' };
    }
    return { ok: false, error: 'Enter a whole number of employees.' };
  }
  const value = Number(cleaned);
  if (!Number.isSafeInteger(value)) {
    return { ok: false, error: 'Employee count is too large.' };
  }
  if (value < 0) {
    return { ok: false, error: 'Employee count cannot be negative.' };
  }
  return { ok: true, value };
}

function parsePeriod(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return { ok: false, error: 'Enter a comparison period.' };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid comparison period.' };
  }
  if (!(value > 0)) {
    return { ok: false, error: 'Comparison period must be greater than zero.' };
  }
  return { ok: true, value };
}

function sideLines(
  side: SideExpenses,
  errors: RemoteVsOnLocationFieldErrors,
  prefix: string,
): ExpenseLine[] | null {
  const lines: ExpenseLine[] = [];
  const fields: {
    amount: string;
    frequency: ExpenseFrequency;
    key: string;
  }[] = [
    {
      amount: side.stationery,
      frequency: side.stationeryFrequency,
      key: `${prefix}Stationery`,
    },
    {
      amount: side.internet,
      frequency: side.internetFrequency,
      key: `${prefix}Internet`,
    },
    {
      amount: side.miscellaneous,
      frequency: side.miscellaneousFrequency,
      key: `${prefix}Miscellaneous`,
    },
    {
      amount: side.recurring,
      frequency: side.recurringFrequency,
      key: `${prefix}Recurring`,
    },
  ];

  for (const field of fields) {
    const parsed = parseMoney(field.amount);
    if (!parsed.ok) {
      errors[field.key] = parsed.error;
      continue;
    }
    lines.push({ amount: parsed.value, frequency: field.frequency });
  }

  if (side.showAdditional) {
    side.additional.forEach((row: ExtraExpenseRow, index: number) => {
      const parsed = parseMoney(row.amount);
      if (!parsed.ok) {
        errors[`${prefix}Extra${index}`] = parsed.error;
        return;
      }
      lines.push({ amount: parsed.value, frequency: row.frequency });
    });
  }

  return Object.keys(errors).some((k) => k.startsWith(prefix)) ? null : lines;
}

export function validateRemoteVsOnLocationInput(input: RemoteVsOnLocationInput): {
  isValid: boolean;
  errors: RemoteVsOnLocationFieldErrors;
  result: RemoteVsOnLocationResult | null;
} {
  const errors: RemoteVsOnLocationFieldErrors = {};

  const period = parsePeriod(input.periodValue);
  if (!period.ok) errors.periodValue = period.error;

  const remoteEmployees = parseEmployees(input.remoteEmployees);
  if (!remoteEmployees.ok) errors.remoteEmployees = remoteEmployees.error;

  const remoteOneTime = parseMoney(input.remoteOneTimeAllowance);
  if (!remoteOneTime.ok) errors.remoteOneTimeAllowance = remoteOneTime.error;

  const onLocEmployees = parseEmployees(input.onLocationEmployees);
  if (!onLocEmployees.ok) errors.onLocationEmployees = onLocEmployees.error;

  const onLocOneTime = parseMoney(input.onLocationOneTime);
  if (!onLocOneTime.ok) errors.onLocationOneTime = onLocOneTime.error;

  const lease = parseMoney(input.officeLease);
  if (!lease.ok) errors.officeLease = lease.error;

  const remoteLines = sideLines(input.remote, errors, 'remote');
  const onLocLines = sideLines(input.onLocation, errors, 'onLoc');

  if (Object.keys(errors).length > 0 || !period.ok) {
    return { isValid: false, errors, result: null };
  }

  if (
    !remoteEmployees.ok ||
    !remoteOneTime.ok ||
    !onLocEmployees.ok ||
    !onLocOneTime.ok ||
    !lease.ok ||
    !remoteLines ||
    !onLocLines
  ) {
    return { isValid: false, errors, result: null };
  }

  const months = toMonths(period.value, input.periodUnit);
  if (!Number.isFinite(months) || !(months > 0)) {
    return {
      isValid: false,
      errors: { periodValue: 'Unable to normalize the comparison period.' },
      result: null,
    };
  }

  const breakdown = calculateRemoteVsOnLocation(
    months,
    period.value,
    input.periodUnit,
    {
      employeeCount: remoteEmployees.value,
      oneTimeAllowancePerEmployee: remoteOneTime.value,
      recurringLines: remoteLines,
    },
    {
      employeeCount: onLocEmployees.value,
      officeSpaceType: input.officeSpaceType,
      oneTimeOfficeCost: onLocOneTime.value,
      officeLease: {
        amount: lease.value,
        frequency: input.officeLeaseFrequency,
      },
      recurringLines: onLocLines,
    },
  );

  if (!breakdown) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: toResult(breakdown, input.currency),
  };
}
