import {
  calculateAnnualRentalIncome,
  calculateEffectiveGrossIncome,
  calculateNetOperatingIncome,
  calculateNoiMargin,
  calculateOperatingExpenseRatio,
  calculatePotentialGrossIncome,
  calculateTotalOperatingExpenses,
  calculateVacancyLoss,
  calculateVacancyRatePercent,
  formatNoiMoney,
  formatNoiPercent,
} from './calculation';
import type { NoiFieldErrors, NoiInput, NoiResult } from './types';

export interface NoiValidation {
  isValid: boolean;
  errors: NoiFieldErrors;
  result: NoiResult | null;
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

function parseNonNeg(
  raw: string,
  label: string,
  errors: NoiFieldErrors,
  key: keyof NoiFieldErrors,
  options?: { allowBlank?: boolean; blankAsZero?: boolean }
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    if (options?.allowBlank) {
      return options.blankAsZero ? 0 : null;
    }
    errors[key] = `Enter ${label}.`;
    return null;
  }
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0) {
    errors[key] = `${label} cannot be negative.`;
    return null;
  }
  return parsed.value;
}

/**
 * Validates NOI inputs and derives annual PGI → vacancy → EGI → OpEx → NOI.
 * Vacancy applies to rental income only. Expense modes are mutually exclusive.
 * Intermediate PGI/EGI may appear before operating expenses are entered;
 * full NOI (isValid) requires expenses.
 */
export function validateNoiInput(input: NoiInput): NoiValidation {
  const errors: NoiFieldErrors = {};

  const area = parseNonNeg(input.area, 'area', errors, 'area', {
    allowBlank: true,
  });
  const rate = parseNonNeg(
    input.rentalRatePerArea,
    'rental rate per area',
    errors,
    'rentalRatePerArea',
    { allowBlank: true }
  );
  const otherIncome = parseNonNeg(
    input.otherIncome,
    'other income',
    errors,
    'otherIncome',
    { allowBlank: true, blankAsZero: true }
  );

  const occupancyParsed = parseNumber(input.occupancyRate);
  let occupancy: number | null = null;
  if (occupancyParsed.blank) {
    errors.occupancyRate = 'Enter an occupancy rate.';
  } else if (occupancyParsed.invalid || occupancyParsed.value === null) {
    errors.occupancyRate = 'Enter a valid occupancy rate.';
  } else if (occupancyParsed.value < 0 || occupancyParsed.value > 100) {
    errors.occupancyRate = 'Occupancy rate must be between 0% and 100%.';
  } else {
    occupancy = occupancyParsed.value;
  }

  let operatingExpenses: number | null = null;
  let expensesReady = false;
  if (input.expenseMode === 'manual') {
    const manualParsed = parseNumber(input.manualOperatingExpenses);
    if (manualParsed.blank) {
      operatingExpenses = null;
    } else {
      operatingExpenses = parseNonNeg(
        input.manualOperatingExpenses,
        'operating expenses',
        errors,
        'manualOperatingExpenses'
      );
      expensesReady = operatingExpenses !== null;
    }
  } else {
    const taxes = parseNonNeg(
      input.propertyTaxes,
      'property taxes',
      errors,
      'propertyTaxes',
      { allowBlank: true, blankAsZero: true }
    );
    const insurance = parseNonNeg(
      input.insurance,
      'insurance',
      errors,
      'insurance',
      { allowBlank: true, blankAsZero: true }
    );
    const management = parseNonNeg(
      input.managementFees,
      'property management fees',
      errors,
      'managementFees',
      { allowBlank: true, blankAsZero: true }
    );
    const maintenance = parseNonNeg(
      input.maintenance,
      'repairs and maintenance',
      errors,
      'maintenance',
      { allowBlank: true, blankAsZero: true }
    );
    const utilities = parseNonNeg(
      input.utilities,
      'utilities',
      errors,
      'utilities',
      { allowBlank: true, blankAsZero: true }
    );
    const cleaning = parseNonNeg(
      input.cleaningAndLandscaping,
      'cleaning and landscaping',
      errors,
      'cleaningAndLandscaping',
      { allowBlank: true, blankAsZero: true }
    );
    const admin = parseNonNeg(
      input.administrativeExpenses,
      'administrative expenses',
      errors,
      'administrativeExpenses',
      { allowBlank: true, blankAsZero: true }
    );
    const otherOpEx = parseNonNeg(
      input.otherOperatingExpenses,
      'other operating expenses',
      errors,
      'otherOperatingExpenses',
      { allowBlank: true, blankAsZero: true }
    );

    if (
      taxes !== null &&
      insurance !== null &&
      management !== null &&
      maintenance !== null &&
      utilities !== null &&
      cleaning !== null &&
      admin !== null &&
      otherOpEx !== null
    ) {
      operatingExpenses = calculateTotalOperatingExpenses([
        taxes,
        insurance,
        management,
        maintenance,
        utilities,
        cleaning,
        admin,
        otherOpEx,
      ]);
      expensesReady = operatingExpenses !== null;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const areaBlank = parseNumber(input.area).blank;
  const rateBlank = parseNumber(input.rentalRatePerArea).blank;
  if (areaBlank || rateBlank || area === null || rate === null) {
    return { isValid: false, errors, result: null };
  }
  if (otherIncome === null || occupancy === null) {
    return { isValid: false, errors, result: null };
  }

  const annualRental = calculateAnnualRentalIncome(
    area,
    rate,
    input.rentalPeriod
  );
  if (annualRental === null) {
    errors.form = 'Unable to calculate annual rental income.';
    return { isValid: false, errors, result: null };
  }

  const pgi = calculatePotentialGrossIncome(annualRental, otherIncome);
  const vacancyRate = calculateVacancyRatePercent(occupancy);
  const vacancyLoss = calculateVacancyLoss(annualRental, occupancy);
  if (pgi === null || vacancyRate === null || vacancyLoss === null) {
    errors.form = 'Unable to calculate gross income or vacancy.';
    return { isValid: false, errors, result: null };
  }

  const egi = calculateEffectiveGrossIncome(pgi, vacancyLoss);
  if (egi === null) {
    errors.form = 'Unable to calculate effective gross income.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.currency;
  const partialBase = {
    annualRentalIncome: annualRental,
    otherAnnualIncome: otherIncome,
    potentialGrossIncome: pgi,
    vacancyRatePercent: vacancyRate,
    vacancyLoss,
    effectiveGrossIncome: egi,
    expenseMode: input.expenseMode,
    currency,
    formattedAnnualRentalIncome: formatNoiMoney(annualRental, currency),
    formattedOtherIncome: formatNoiMoney(otherIncome, currency),
    formattedPotentialGrossIncome: formatNoiMoney(pgi, currency),
    formattedVacancyLoss: formatNoiMoney(vacancyLoss, currency),
    formattedEffectiveGrossIncome: formatNoiMoney(egi, currency),
  };

  if (!expensesReady || operatingExpenses === null) {
    // Intermediate income path only — no NOI yet.
    return {
      isValid: false,
      errors,
      result: {
        ...partialBase,
        operatingExpenses: 0,
        noi: 0,
        operatingExpenseRatio: null,
        noiMargin: null,
        formattedOperatingExpenses: '',
        formattedNoi: '',
        formattedExpenseRatio: null,
        formattedNoiMargin: null,
      },
    };
  }

  const noi = calculateNetOperatingIncome(egi, operatingExpenses);
  if (noi === null) {
    errors.form = 'Unable to calculate net operating income.';
    return { isValid: false, errors, result: null };
  }

  const expenseRatio = calculateOperatingExpenseRatio(operatingExpenses, egi);
  const noiMargin = calculateNoiMargin(noi, egi);

  const result: NoiResult = {
    ...partialBase,
    operatingExpenses,
    noi,
    operatingExpenseRatio: expenseRatio,
    noiMargin,
    formattedOperatingExpenses: formatNoiMoney(operatingExpenses, currency),
    formattedNoi: formatNoiMoney(noi, currency),
    formattedExpenseRatio:
      expenseRatio === null ? null : formatNoiPercent(expenseRatio),
    formattedNoiMargin: noiMargin === null ? null : formatNoiPercent(noiMargin),
  };

  return { isValid: true, errors, result };
}
