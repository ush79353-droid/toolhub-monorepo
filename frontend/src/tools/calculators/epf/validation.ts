import { calculateEpfFromInput } from './calculation';
import type { EpfFieldErrors, EpfInput, EpfResult } from './types';

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

export interface EpfValidation {
  isValid: boolean;
  errors: EpfFieldErrors;
  result: EpfResult | null;
}

function hasErrors(errors: EpfFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: EpfInput): EpfFieldErrors {
  const errors: EpfFieldErrors = {};

  const age = parseNumber(input.currentAge);
  if (!age.blank) {
    if (age.invalid || age.value == null) {
      errors.currentAge = 'Please enter a valid age.';
    } else if (!Number.isInteger(age.value) || age.value <= 0) {
      errors.currentAge = 'Age must be a positive whole number.';
    } else if (age.value > 80) {
      errors.currentAge = 'Age must be 80 or below for this projection.';
    }
  }

  const ret = parseNumber(input.retirementAge);
  if (!ret.blank) {
    if (ret.invalid || ret.value == null) {
      errors.retirementAge = 'Please enter a valid retirement age.';
    } else if (!Number.isInteger(ret.value) || ret.value <= 0) {
      errors.retirementAge = 'Retirement age must be a positive whole number.';
    } else if (
      age.value != null &&
      !age.blank &&
      !age.invalid &&
      ret.value <= age.value
    ) {
      errors.retirementAge = 'Retirement age must be greater than current age.';
    } else if (
      age.value != null &&
      !age.blank &&
      ret.value - age.value > 50
    ) {
      errors.retirementAge =
        'Projection horizon cannot exceed 50 years.';
    }
  }

  const basic = parseNumber(input.monthlyBasicSalary);
  if (!basic.blank) {
    if (basic.invalid || basic.value == null) {
      errors.monthlyBasicSalary = 'Please enter a valid basic salary.';
    } else if (basic.value < 0) {
      errors.monthlyBasicSalary = 'Basic salary cannot be negative.';
    }
  }

  const da = parseNumber(input.dearnessAllowance);
  if (!da.blank) {
    if (da.invalid || da.value == null) {
      errors.dearnessAllowance = 'Please enter a valid dearness allowance.';
    } else if (da.value < 0) {
      errors.dearnessAllowance = 'Dearness allowance cannot be negative.';
    }
  }

  const growth = parseNumber(input.annualSalaryGrowthRate);
  if (!growth.blank) {
    if (growth.invalid || growth.value == null) {
      errors.annualSalaryGrowthRate = 'Please enter a valid salary growth rate.';
    } else if (growth.value < 0) {
      errors.annualSalaryGrowthRate = 'Salary growth cannot be negative.';
    } else if (growth.value > 100) {
      errors.annualSalaryGrowthRate = 'Salary growth looks unrealistically high.';
    }
  }

  const emp = parseNumber(input.employeeContributionRate);
  if (!emp.blank) {
    if (emp.invalid || emp.value == null) {
      errors.employeeContributionRate =
        'Please enter a valid employee contribution rate.';
    } else if (emp.value < 0) {
      errors.employeeContributionRate =
        'Employee contribution rate cannot be negative.';
    } else if (emp.value > 100) {
      errors.employeeContributionRate =
        'Employee contribution rate cannot exceed 100%.';
    }
  }

  const er = parseNumber(input.employerContributionRate);
  if (!er.blank) {
    if (er.invalid || er.value == null) {
      errors.employerContributionRate =
        'Please enter a valid employer contribution rate.';
    } else if (er.value < 0) {
      errors.employerContributionRate =
        'Employer contribution rate cannot be negative.';
    } else if (er.value > 100) {
      errors.employerContributionRate =
        'Employer contribution rate cannot exceed 100%.';
    }
  }

  const interest = parseNumber(input.annualInterestRate);
  if (!interest.blank) {
    if (interest.invalid || interest.value == null) {
      errors.annualInterestRate = 'Please enter a valid interest rate.';
    } else if (interest.value < 0) {
      errors.annualInterestRate = 'Interest rate cannot be negative.';
    } else if (interest.value > 50) {
      errors.annualInterestRate = 'Interest rate looks unrealistically high.';
    }
  }

  const bal = parseNumber(input.existingEPFBalance);
  if (!bal.blank) {
    if (bal.invalid || bal.value == null) {
      errors.existingEPFBalance = 'Please enter a valid EPF balance.';
    } else if (bal.value < 0) {
      errors.existingEPFBalance = 'Existing EPF balance cannot be negative.';
    }
  }

  const ceiling = parseNumber(input.epsWageCeiling);
  if (!ceiling.blank) {
    if (ceiling.invalid || ceiling.value == null) {
      errors.epsWageCeiling = 'Please enter a valid EPS wage ceiling.';
    } else if (ceiling.value < 0) {
      errors.epsWageCeiling = 'EPS wage ceiling cannot be negative.';
    }
  }

  if (input.enableVPF) {
    const vpf = parseNumber(input.additionalVPFRate);
    if (vpf.blank) {
      errors.additionalVPFRate = 'Enter a VPF contribution rate.';
    } else if (vpf.invalid || vpf.value == null || vpf.value < 0) {
      errors.additionalVPFRate = 'VPF rate cannot be negative.';
    } else if (vpf.value > 100) {
      errors.additionalVPFRate = 'VPF rate cannot exceed 100%.';
    }
  }

  if (input.enableComparison) {
    const cg = parseNumber(input.compareGrowthRate);
    const ci = parseNumber(input.compareInterestRate);
    const cr = parseNumber(input.compareRetirementAge);
    if (!cg.blank && (cg.invalid || cg.value == null || cg.value < 0)) {
      errors.compareGrowthRate = 'Enter a valid alternate salary growth rate.';
    }
    if (!ci.blank && (ci.invalid || ci.value == null || ci.value < 0)) {
      errors.compareInterestRate = 'Enter a valid alternate interest rate.';
    }
    if (
      !cr.blank &&
      (cr.invalid ||
        cr.value == null ||
        !Number.isInteger(cr.value) ||
        (age.value != null && cr.value <= age.value))
    ) {
      errors.compareRetirementAge =
        'Alternate retirement age must exceed current age.';
    }
  }

  return errors;
}

export function validateEpfInput(input: EpfInput): EpfValidation {
  const errors = collectFieldErrors(input);
  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const required = [
    input.currentAge,
    input.retirementAge,
    input.monthlyBasicSalary,
    input.dearnessAllowance,
    input.annualSalaryGrowthRate,
    input.employeeContributionRate,
    input.employerContributionRate,
    input.annualInterestRate,
    input.existingEPFBalance,
    input.epsWageCeiling,
  ];
  if (required.some((v) => v.trim() === '')) {
    return { isValid: false, errors: {}, result: null };
  }

  const result = calculateEpfFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to project EPF with the selected inputs.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
