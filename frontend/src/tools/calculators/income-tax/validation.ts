import {
  calculateFederalIncomeTax,
  formatFilingStatusLabel,
  formatUsd,
} from './calculation';
import type {
  IncomeTaxFieldErrors,
  IncomeTaxInput,
  IncomeTaxResult,
} from './types';

export interface IncomeTaxValidation {
  isValid: boolean;
  errors: IncomeTaxFieldErrors;
  result: IncomeTaxResult | null;
}

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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function requireNonNeg(
  raw: string,
  label: string
): { value: number | null; error?: string } {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { value: null, error: `Enter ${label}.` };
  if (parsed.invalid || parsed.value === null) {
    return { value: null, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) return { value: null, error: `${label} cannot be negative.` };
  return { value: parsed.value };
}

const MONEY_FIELDS: ReadonlyArray<{
  key: keyof IncomeTaxInput;
  label: string;
}> = [
  { key: 'wages', label: 'wages' },
  { key: 'federalWithheld', label: 'federal income tax withheld' },
  { key: 'stateWithheld', label: 'state income tax withheld' },
  { key: 'localWithheld', label: 'local income tax withheld' },
  { key: 'socialSecurity', label: 'Social Security income' },
  { key: 'interestIncome', label: 'interest income' },
  { key: 'ordinaryDividends', label: 'ordinary dividends' },
  { key: 'qualifiedDividends', label: 'qualified dividends' },
  { key: 'passiveIncome', label: 'passive income' },
  { key: 'shortTermGains', label: 'short-term capital gains' },
  { key: 'longTermGains', label: 'long-term capital gains' },
  { key: 'otherIncome', label: 'other income' },
  { key: 'tipsIncome', label: 'tips income' },
  { key: 'overtimeIncome', label: 'overtime income' },
  { key: 'carLoanInterest', label: 'car loan interest' },
  { key: 'iraContributions', label: 'IRA contributions' },
  { key: 'realEstateTax', label: 'real estate tax' },
  { key: 'mortgageInterest', label: 'mortgage interest' },
  { key: 'charitableDonations', label: 'charitable donations' },
  { key: 'studentLoanInterest', label: 'student loan interest' },
  { key: 'childCareExpense', label: 'child & dependent care expense' },
  { key: 'collegeStudent1', label: 'college education expense (student 1)' },
  { key: 'collegeStudent2', label: 'college education expense (student 2)' },
  { key: 'collegeStudent3', label: 'college education expense (student 3)' },
  { key: 'collegeStudent4', label: 'college education expense (student 4)' },
  { key: 'otherDeductibles', label: 'other deductibles' },
];

export function validateIncomeTaxInput(input: IncomeTaxInput): IncomeTaxValidation {
  const errors: IncomeTaxFieldErrors = {};
  const nums: Record<string, number> = {};

  const age = requireNonNeg(input.age, 'age');
  if (age.error) errors.age = age.error;
  else if (age.value !== null && (age.value < 0 || age.value > 120)) {
    errors.age = 'Enter an age between 0 and 120.';
  } else if (age.value !== null) {
    nums.age = age.value;
  }

  const young = requireNonNeg(input.youngDependents, 'number of young dependents');
  if (young.error) errors.youngDependents = young.error;
  else if (young.value !== null && !Number.isInteger(young.value)) {
    errors.youngDependents = 'Young dependents must be a whole number.';
  } else if (young.value !== null) {
    nums.youngDependents = young.value;
  }

  const other = requireNonNeg(input.otherDependents, 'number of other dependents');
  if (other.error) errors.otherDependents = other.error;
  else if (other.value !== null && !Number.isInteger(other.value)) {
    errors.otherDependents = 'Other dependents must be a whole number.';
  } else if (other.value !== null) {
    nums.otherDependents = other.value;
  }

  const rate = requireNonNeg(input.stateLocalTaxRatePercent, 'state+local tax rate');
  if (rate.error) errors.stateLocalTaxRatePercent = rate.error;
  else if (rate.value !== null && rate.value > 100) {
    errors.stateLocalTaxRatePercent = 'State+local tax rate cannot exceed 100%.';
  } else if (rate.value !== null) {
    nums.stateLocalTaxRatePercent = rate.value;
  }

  for (const field of MONEY_FIELDS) {
    const parsed = requireNonNeg(String(input[field.key]), field.label);
    if (parsed.error) {
      (errors as Record<string, string>)[field.key] = parsed.error;
    } else if (parsed.value !== null) {
      nums[field.key] = parsed.value;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateFederalIncomeTax({
    filingStatus: input.filingStatus,
    taxYear: input.taxYear,
    age: nums.age!,
    youngDependents: nums.youngDependents!,
    otherDependents: nums.otherDependents!,
    wages: nums.wages!,
    federalWithheld: nums.federalWithheld!,
    stateWithheld: nums.stateWithheld!,
    localWithheld: nums.localWithheld!,
    hasSelfEmployment: input.hasSelfEmployment === 'yes',
    socialSecurity: nums.socialSecurity!,
    interestIncome: nums.interestIncome!,
    ordinaryDividends: nums.ordinaryDividends!,
    qualifiedDividends: nums.qualifiedDividends!,
    passiveIncome: nums.passiveIncome!,
    shortTermGains: nums.shortTermGains!,
    longTermGains: nums.longTermGains!,
    otherIncome: nums.otherIncome!,
    stateLocalTaxRatePercent: nums.stateLocalTaxRatePercent!,
    tipsIncome: nums.tipsIncome!,
    overtimeIncome: nums.overtimeIncome!,
    carLoanInterest: nums.carLoanInterest!,
    iraContributions: nums.iraContributions!,
    realEstateTax: nums.realEstateTax!,
    mortgageInterest: nums.mortgageInterest!,
    charitableDonations: nums.charitableDonations!,
    studentLoanInterest: nums.studentLoanInterest!,
    childCareExpense: nums.childCareExpense!,
    collegeExpenses: [
      nums.collegeStudent1!,
      nums.collegeStudent2!,
      nums.collegeStudent3!,
      nums.collegeStudent4!,
    ],
    otherDeductibles: nums.otherDeductibles!,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite federal tax estimate.';
    return { isValid: false, errors, result: null };
  }

  const refundLabel = computed.isRefund ? 'Estimated refund' : 'Estimated tax owed';
  const result: IncomeTaxResult = {
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    totalReportedIncome: computed.totalReportedIncome,
    adjustedGrossIncome: computed.adjustedGrossIncome,
    totalDeductions: computed.totalDeductions,
    deductionType: computed.deductionType,
    taxableIncome: computed.taxableIncome,
    taxBeforeCredits: computed.taxBeforeCredits,
    totalCredits: computed.totalCredits,
    refundableCredits: computed.refundableCredits,
    nonrefundableCredits: computed.nonrefundableCredits,
    taxAfterCredits: computed.taxAfterCredits,
    federalWithholding: computed.federalWithholding,
    refundOrOwed: computed.refundOrOwed,
    isRefund: computed.isRefund,
    effectiveRatePercent: computed.effectiveRatePercent,
    formattedTotalReportedIncome: formatUsd(computed.totalReportedIncome),
    formattedAdjustedGrossIncome: formatUsd(computed.adjustedGrossIncome),
    formattedTotalDeductions: formatUsd(computed.totalDeductions),
    formattedTaxableIncome: formatUsd(computed.taxableIncome),
    formattedTaxBeforeCredits: formatUsd(computed.taxBeforeCredits),
    formattedTotalCredits: formatUsd(computed.totalCredits),
    formattedTaxAfterCredits: formatUsd(computed.taxAfterCredits),
    formattedFederalWithholding: formatUsd(computed.federalWithholding),
    formattedRefundOrOwed: formatUsd(computed.refundOrOwed),
    formattedEffectiveRate: `${formatUsd(computed.effectiveRatePercent)}%`,
    summaryText: `${refundLabel} $${formatUsd(computed.refundOrOwed)} for tax year ${input.taxYear} (${formatFilingStatusLabel(input.filingStatus)}). AGI $${formatUsd(computed.adjustedGrossIncome)}; taxable income $${formatUsd(computed.taxableIncome)}.`,
    disclosures: computed.disclosures,
  };

  return { isValid: true, errors: {}, result };
}
