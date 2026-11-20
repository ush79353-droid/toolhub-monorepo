import {
  BACK_END_LIMIT,
  FRONT_END_LIMIT,
  calculateBackEndRatio,
  calculateFrontEndRatio,
  calculateGuidelineLimits,
  calculateItemizedHousingCosts,
  calculateTotalMonthlyDebt,
  formatRuleMoney,
  formatRulePercent,
  interpretRule2836,
  meetsGuideline,
} from './calculation';
import type {
  Rule2836FieldErrors,
  Rule2836Input,
  Rule2836Result,
  Rule2836Status,
} from './types';

export interface Rule2836Validation {
  isValid: boolean;
  errors: Rule2836FieldErrors;
  result: Rule2836Result | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

type FieldKey = keyof Rule2836FieldErrors;

function checkNonneg(
  parsed: ReturnType<typeof parseNumber>,
  key: FieldKey,
  label: string,
  errors: Rule2836FieldErrors
): void {
  if (parsed.blank) return;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
  } else if (parsed.value < 0) {
    errors[key] = `${label.charAt(0).toUpperCase()}${label.slice(1)} cannot be negative.`;
  }
}

/** Optional itemized line: blank → 0. */
function optionalNonneg(
  parsed: ReturnType<typeof parseNumber>
): number | null {
  if (parsed.blank) return 0;
  if (parsed.invalid || parsed.value === null || parsed.value < 0) return null;
  return parsed.value;
}

export function validateRule2836Input(input: Rule2836Input): Rule2836Validation {
  const errors: Rule2836FieldErrors = {};
  const currency = input.currency;

  const income = parseNumber(input.grossMonthlyIncome);
  const combined = parseNumber(input.combinedHousingCosts);
  const mortgage = parseNumber(input.mortgagePrincipalAndInterest);
  const taxes = parseNumber(input.propertyTaxes);
  const insurance = parseNumber(input.homeownersInsurance);
  const hoa = parseNumber(input.hoaFees);
  const otherHousing = parseNumber(input.otherHousingExpenses);
  const otherDebts = parseNumber(input.otherMonthlyDebts);

  checkNonneg(income, 'grossMonthlyIncome', 'gross monthly income', errors);
  if (!income.blank && income.value === 0) {
    // zero allowed for validation message path; handled below
  }

  if (input.housingExpenseMode === 'combined') {
    checkNonneg(combined, 'combinedHousingCosts', 'housing costs amount', errors);
  } else {
    checkNonneg(
      mortgage,
      'mortgagePrincipalAndInterest',
      'mortgage principal and interest amount',
      errors
    );
    checkNonneg(taxes, 'propertyTaxes', 'property taxes amount', errors);
    checkNonneg(
      insurance,
      'homeownersInsurance',
      'homeowners insurance amount',
      errors
    );
    checkNonneg(hoa, 'hoaFees', 'HOA fees amount', errors);
    checkNonneg(
      otherHousing,
      'otherHousingExpenses',
      'other housing expenses amount',
      errors
    );
  }
  checkNonneg(otherDebts, 'otherMonthlyDebts', 'other monthly debts amount', errors);

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let monthlyHousingCosts: number | null = null;
  if (input.housingExpenseMode === 'combined') {
    if (!combined.blank && combined.value !== null) {
      monthlyHousingCosts = combined.value;
    }
  } else {
    const m = optionalNonneg(mortgage);
    const t = optionalNonneg(taxes);
    const i = optionalNonneg(insurance);
    const h = optionalNonneg(hoa);
    const o = optionalNonneg(otherHousing);
    if (m !== null && t !== null && i !== null && h !== null && o !== null) {
      // Only compute when at least one field was entered (not all blank)
      const anyEntered =
        !mortgage.blank ||
        !taxes.blank ||
        !insurance.blank ||
        !hoa.blank ||
        !otherHousing.blank;
      if (anyEntered) {
        monthlyHousingCosts = calculateItemizedHousingCosts(m, t, i, h, o);
      }
    }
  }

  const incomeReady = !income.blank && income.value !== null;
  const debtsReady = !otherDebts.blank && otherDebts.value !== null;

  if (!incomeReady && monthlyHousingCosts === null && !debtsReady) {
    return { isValid: false, errors, result: null };
  }

  let status: Rule2836Status = 'partial';
  let warningMessage: string | null =
    'Use gross monthly income (before taxes). The 28/36 rule is a general guideline, not a lender approval decision. Amounts share one currency label (no FX).';

  if (incomeReady && income.value === 0) {
    status = 'zeroIncome';
    warningMessage =
      'Ratios are unavailable because gross monthly income must be greater than zero.';
    errors.form = warningMessage;
  }

  let frontEndRatio: number | null = null;
  let totalMonthlyDebt: number | null = null;
  let backEndRatio: number | null = null;
  let maximumHousingCosts: number | null = null;
  let maximumTotalDebt: number | null = null;
  let housingCapacity: number | null = null;
  let meetsFrontEndGuideline: boolean | null = null;
  let meetsBackEndGuideline: boolean | null = null;
  let meetsBothGuidelines: boolean | null = null;

  if (incomeReady && income.value! > 0 && monthlyHousingCosts !== null) {
    frontEndRatio = calculateFrontEndRatio(
      monthlyHousingCosts,
      income.value!
    );
    if (frontEndRatio !== null) {
      meetsFrontEndGuideline = meetsGuideline(frontEndRatio, FRONT_END_LIMIT);
    }
  }

  if (monthlyHousingCosts !== null && debtsReady) {
    totalMonthlyDebt = calculateTotalMonthlyDebt(
      monthlyHousingCosts,
      otherDebts.value!
    );
  }

  if (
    incomeReady &&
    income.value! > 0 &&
    totalMonthlyDebt !== null
  ) {
    backEndRatio = calculateBackEndRatio(totalMonthlyDebt, income.value!);
    if (backEndRatio !== null) {
      meetsBackEndGuideline = meetsGuideline(backEndRatio, BACK_END_LIMIT);
    }
  }

  if (incomeReady && income.value! > 0 && debtsReady) {
    const limits = calculateGuidelineLimits(income.value!, otherDebts.value!);
    if (limits) {
      maximumHousingCosts = limits.maximumHousingCosts;
      maximumTotalDebt = limits.maximumTotalDebt;
      housingCapacity = limits.housingCapacity;
    }
  }

  if (meetsFrontEndGuideline !== null && meetsBackEndGuideline !== null) {
    meetsBothGuidelines =
      meetsFrontEndGuideline && meetsBackEndGuideline;
    if (status !== 'zeroIncome') status = 'valid';
  } else if (
    frontEndRatio !== null ||
    backEndRatio !== null ||
    monthlyHousingCosts !== null
  ) {
    if (status !== 'zeroIncome') status = 'partial';
  } else if (status !== 'zeroIncome') {
    return { isValid: false, errors, result: null };
  }

  const result: Rule2836Result = {
    monthlyHousingCosts,
    frontEndRatio,
    totalMonthlyDebt,
    backEndRatio,
    maximumHousingCosts,
    maximumTotalDebt,
    housingCapacity,
    meetsFrontEndGuideline,
    meetsBackEndGuideline,
    meetsBothGuidelines,
    status,
    interpretation: interpretRule2836(
      frontEndRatio,
      backEndRatio,
      meetsFrontEndGuideline,
      meetsBackEndGuideline,
      status
    ),
    warningMessage,
    currency,
    formattedMonthlyHousingCosts:
      monthlyHousingCosts === null
        ? null
        : formatRuleMoney(monthlyHousingCosts, currency),
    formattedFrontEndRatio:
      frontEndRatio === null ? null : formatRulePercent(frontEndRatio),
    formattedTotalMonthlyDebt:
      totalMonthlyDebt === null
        ? null
        : formatRuleMoney(totalMonthlyDebt, currency),
    formattedBackEndRatio:
      backEndRatio === null ? null : formatRulePercent(backEndRatio),
    formattedMaximumHousingCosts:
      maximumHousingCosts === null
        ? null
        : formatRuleMoney(maximumHousingCosts, currency),
    formattedMaximumTotalDebt:
      maximumTotalDebt === null
        ? null
        : formatRuleMoney(maximumTotalDebt, currency),
    formattedHousingCapacity:
      housingCapacity === null
        ? null
        : formatRuleMoney(housingCapacity, currency),
  };

  return { isValid: status !== 'zeroIncome', errors, result };
}
