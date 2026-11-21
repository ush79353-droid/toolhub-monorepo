import {
  calculatePpfFromInput,
  generateCustomDepositSchedule,
  generateFixedDepositSchedule,
  getPPFMaturityDate,
  getPPFExtendedMaturityDate,
  validatePPFAnnualInvestment,
} from './calculation';
import {
  DEFAULT_PPF_SCHEME,
  type PpfFieldErrors,
  type PpfInput,
  type PpfResult,
  type PpfSchemeConfig,
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

function validIso(raw: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d
  );
}

export interface PpfValidation {
  isValid: boolean;
  errors: PpfFieldErrors;
  result: PpfResult | null;
}

function hasErrors(errors: PpfFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: PpfInput,
  scheme: PpfSchemeConfig = DEFAULT_PPF_SCHEME,
): PpfFieldErrors {
  const errors: PpfFieldErrors = {};

  if (!input.startDate.trim()) {
    errors.startDate = 'Please select a valid investment start date.';
  } else if (!validIso(input.startDate)) {
    errors.startDate = 'Please select a valid investment start date.';
  }

  const rate = parseNumber(input.annualInterestRate);
  if (rate.blank) {
    errors.annualInterestRate = 'Please enter a valid annual interest rate.';
  } else if (rate.invalid || rate.value == null) {
    errors.annualInterestRate = 'Please enter a valid annual interest rate.';
  } else if (rate.value < 0) {
    errors.annualInterestRate = 'Interest rate cannot be negative.';
  } else if (rate.value > 50) {
    errors.annualInterestRate =
      'Interest rate above 50% is outside the supported range.';
  }

  const inflation = parseNumber(input.inflationRate);
  if (!inflation.blank) {
    if (inflation.invalid || inflation.value == null) {
      errors.inflationRate = 'Please enter a valid inflation rate.';
    } else if (inflation.value < 0) {
      errors.inflationRate = 'Inflation rate cannot be negative.';
    } else if (inflation.value > 50) {
      errors.inflationRate =
        'Inflation rate above 50% is outside the supported range.';
    }
  }

  const standardMaturity = input.startDate.trim()
    ? getPPFMaturityDate(input.startDate, scheme)
    : null;
  const endIso =
    input.extensionMode === 'standard' || !standardMaturity
      ? standardMaturity
      : getPPFExtendedMaturityDate(standardMaturity, 1, scheme);

  if (input.investmentMode === 'fixed') {
    const amt = parseNumber(input.depositAmount);
    if (amt.blank) {
      errors.depositAmount = 'Please enter a valid PPF deposit amount.';
    } else if (amt.invalid || amt.value == null) {
      errors.depositAmount = 'Please enter a valid PPF deposit amount.';
    } else if (amt.value <= 0) {
      errors.depositAmount = 'Please enter a valid PPF deposit amount.';
    } else if (amt.value % scheme.depositIncrement !== 0) {
      errors.depositAmount = `Deposit amount must be in multiples of ₹${scheme.depositIncrement}.`;
    } else if (standardMaturity && endIso) {
      const scheduleEnd =
        input.extensionMode === 'extension-without-contributions'
          ? standardMaturity
          : endIso;
      const deps = generateFixedDepositSchedule(
        input.startDate,
        scheduleEnd,
        amt.value,
        input.depositFrequency,
      );
      const annual = validatePPFAnnualInvestment(deps, scheme);
      if (!annual.ok) {
        errors.depositAmount = `Total deposits cannot exceed ₹${scheme.maximumAnnualDeposit.toLocaleString('en-IN')} in a financial year (FY ${annual.financialYear}).`;
      } else {
        const byFy = new Map<string, number>();
        for (const d of deps) {
          const key = d.date;
          // group via validate already; check min using same schedule
          const y = Number(d.date.slice(0, 4));
          const m = Number(d.date.slice(5, 7));
          const label =
            m >= 4
              ? `${y}-${String(y + 1).slice(-2)}`
              : `${y - 1}-${String(y).slice(-2)}`;
          byFy.set(label, (byFy.get(label) ?? 0) + d.amount);
        }
        for (const [label, total] of byFy) {
          if (total > 0 && total < scheme.minimumAnnualDeposit) {
            errors.depositAmount = `The annual PPF contribution must meet the scheme's minimum requirement of ₹${scheme.minimumAnnualDeposit.toLocaleString('en-IN')} (FY ${label}).`;
            break;
          }
        }
      }
    }
  } else {
    if (input.customDeposits.length === 0) {
      errors.customDeposits = 'Add at least one custom deposit.';
    } else if (endIso && input.startDate.trim()) {
      const parsed: { date: string; amount: number }[] = [];
      for (const row of input.customDeposits) {
        const a = parseNumber(row.amount);
        if (!row.date.trim() || !validIso(row.date)) {
          errors.customDeposits = 'Each custom deposit needs a valid date.';
          break;
        }
        if (a.blank || a.invalid || a.value == null || a.value <= 0) {
          errors.customDeposits = 'Each custom deposit needs a positive amount.';
          break;
        }
        if (a.value % scheme.depositIncrement !== 0) {
          errors.customDeposits = `Deposit amounts must be in multiples of ₹${scheme.depositIncrement}.`;
          break;
        }
        parsed.push({ date: row.date, amount: a.value });
      }
      if (!errors.customDeposits) {
        const deps = generateCustomDepositSchedule(
          parsed,
          input.startDate,
          endIso,
        );
        if (deps.length === 0) {
          errors.customDeposits =
            'Custom deposits must fall within the account term.';
        } else {
          const annual = validatePPFAnnualInvestment(deps, scheme);
          if (!annual.ok) {
            errors.customDeposits = `Total deposits cannot exceed ₹${scheme.maximumAnnualDeposit.toLocaleString('en-IN')} in a financial year (FY ${annual.financialYear}).`;
          }
        }
      }
    }
  }

  return errors;
}

export function validatePpfInput(
  input: PpfInput,
  scheme: PpfSchemeConfig = DEFAULT_PPF_SCHEME,
): PpfValidation {
  const errors = collectFieldErrors(input, scheme);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculatePpfFromInput(input, scheme);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to calculate PPF maturity with the current inputs.',
      },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
