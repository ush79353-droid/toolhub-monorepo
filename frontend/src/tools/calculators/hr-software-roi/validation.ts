import {
  calculatePaybackYears,
  periodMonthsFromPreset,
  recurringCostsInPeriod,
  sumAdvancedBenefits,
  sumAdvancedCosts,
  toHrSoftwareRoiResult,
} from './calculation';
import type {
  HrSoftwareRoiFieldErrors,
  HrSoftwareRoiInput,
  HrSoftwareRoiResult,
} from './types';

function parseMoney(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function validateHrSoftwareRoiInput(input: HrSoftwareRoiInput): {
  isValid: boolean;
  errors: HrSoftwareRoiFieldErrors;
  result: HrSoftwareRoiResult | null;
} {
  const errors: HrSoftwareRoiFieldErrors = {};

  const customMonths =
    input.periodPreset === 'custom' ? parseMoney(input.customMonths) : null;
  if (input.periodPreset === 'custom') {
    if (customMonths === null) {
      errors.customMonths = 'Enter the number of months in the evaluation period.';
    } else if (!(customMonths > 0)) {
      errors.customMonths = 'Evaluation period must be greater than zero months.';
    }
  }

  const periodMonths = periodMonthsFromPreset(input.periodPreset, customMonths);
  if (periodMonths === null) {
    return { isValid: false, errors, result: null };
  }

  let investmentCost: number | null = null;
  let grossBenefit: number | null = null;
  let paybackYears: number | null = null;
  let paybackMessage: string | null = null;

  if (input.showAdvanced) {
    const costTotal = sumAdvancedCosts(input.costs, periodMonths);
    const benefitTotal = sumAdvancedBenefits(input.benefits, periodMonths);
    if (costTotal === null) {
      errors.form = 'Advanced cost fields must be nonnegative numbers.';
      return { isValid: false, errors, result: null };
    }
    if (benefitTotal === null) {
      errors.form = 'Advanced benefit fields must be nonnegative numbers.';
      return { isValid: false, errors, result: null };
    }
    // Need at least some investment to compute ROI.
    if (!(costTotal > 0)) {
      return {
        isValid: false,
        errors: {
          form: 'Enter investment costs greater than zero in the advanced breakdown.',
        },
        result: null,
      };
    }
    investmentCost = costTotal;
    grossBenefit = benefitTotal;

    const recurring = recurringCostsInPeriod(input.costs, periodMonths);
    const payback = calculatePaybackYears({
      totalInvestment: costTotal,
      totalBenefit: benefitTotal,
      periodMonths,
      recurringCostsInPeriod: recurring,
    });
    paybackYears = payback.years;
    paybackMessage = payback.message;
  } else {
    const cost = parseMoney(input.simpleCost);
    const benefit = parseMoney(input.simpleBenefit);

    if (input.simpleCost.trim() === '' && input.simpleBenefit.trim() === '') {
      return { isValid: false, errors: {}, result: null };
    }
    if (cost === null) {
      errors.simpleCost = 'Enter the total cost of investment.';
    } else if (cost < 0) {
      errors.simpleCost = 'Investment cost cannot be negative.';
    } else if (!(cost > 0)) {
      errors.simpleCost = 'Investment cost must be greater than zero.';
    }

    if (benefit === null) {
      errors.simpleBenefit = 'Enter the total benefit of investment.';
    } else if (benefit < 0) {
      errors.simpleBenefit = 'Gross benefit cannot be negative.';
    }

    if (Object.keys(errors).length > 0 || cost === null || benefit === null) {
      return { isValid: false, errors, result: null };
    }

    investmentCost = cost;
    grossBenefit = benefit;
  }

  if (investmentCost === null || grossBenefit === null) {
    return { isValid: false, errors, result: null };
  }

  const result = toHrSoftwareRoiResult({
    investmentCost,
    grossBenefit,
    periodMonths,
    fromAdvanced: input.showAdvanced,
    currency: input.currency,
    paybackYears,
    paybackMessage,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate a finite ROI result.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
