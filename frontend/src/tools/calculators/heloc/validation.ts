import {
  calculateHeloc,
  formatHelocMoney,
  yearsToMonths,
} from './calculation';
import type {
  HelocFieldErrors,
  HelocInput,
  HelocResult,
} from './types';

export interface HelocValidation {
  isValid: boolean;
  errors: HelocFieldErrors;
  result: HelocResult | null;
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

export function validateHelocInput(input: HelocInput): HelocValidation {
  const errors: HelocFieldErrors = {};
  const currency = input.currency;

  const balance = parseNumber(input.currentBalance);
  const drawY = parseNumber(input.drawPeriodYears);
  const repayY = parseNumber(input.repaymentTermYears);
  const rate = parseNumber(input.initialInterestRate);
  const feePct = parseNumber(input.upfrontFeePercent);
  const feeFixed = parseNumber(input.upfrontFeeFixed);
  const annual = parseNumber(input.annualFee);
  const adj = parseNumber(input.expectedRateAdjustment);
  const firstAdj = parseNumber(input.firstAdjustmentAfterYears);
  const interval = parseNumber(input.adjustmentIntervalMonths);
  const cap = parseNumber(input.maximumInterestRate);

  if (!balance.blank) {
    if (balance.invalid || balance.value === null) {
      errors.currentBalance = 'Enter a valid HELOC balance.';
    } else if (balance.value < 0) {
      errors.currentBalance = 'HELOC balance cannot be negative.';
    }
  }
  if (!drawY.blank) {
    if (drawY.invalid || drawY.value === null) {
      errors.drawPeriodYears = 'Enter a valid draw period.';
    } else if (drawY.value < 0) {
      errors.drawPeriodYears = 'Draw period cannot be negative.';
    } else if (drawY.value > 50) {
      errors.drawPeriodYears = 'Draw period is too long.';
    }
  }
  if (!repayY.blank) {
    if (repayY.invalid || repayY.value === null) {
      errors.repaymentTermYears = 'Enter a valid repayment term.';
    } else if (repayY.value <= 0) {
      errors.repaymentTermYears = 'Repayment term must be greater than zero.';
    } else if (repayY.value > 50) {
      errors.repaymentTermYears = 'Repayment term is too long.';
    }
  }
  if (!rate.blank) {
    if (rate.invalid || rate.value === null) {
      errors.initialInterestRate = 'Enter a valid interest rate.';
    } else if (rate.value < 0) {
      errors.initialInterestRate = 'Interest rate cannot be negative.';
    } else if (rate.value > 100) {
      errors.initialInterestRate = 'Interest rate looks too high.';
    }
  }
  if (!feePct.blank) {
    if (feePct.invalid || feePct.value === null) {
      errors.upfrontFeePercent = 'Enter a valid upfront fee percentage.';
    } else if (feePct.value < 0) {
      errors.upfrontFeePercent = 'Upfront fee percentage cannot be negative.';
    }
  }
  if (!feeFixed.blank) {
    if (feeFixed.invalid || feeFixed.value === null) {
      errors.upfrontFeeFixed = 'Enter a valid upfront fee.';
    } else if (feeFixed.value < 0) {
      errors.upfrontFeeFixed = 'Upfront fees cannot be negative.';
    }
  }
  if (!annual.blank) {
    if (annual.invalid || annual.value === null) {
      errors.annualFee = 'Enter a valid annual fee.';
    } else if (annual.value < 0) {
      errors.annualFee = 'Annual fee cannot be negative.';
    }
  }

  if (input.adjustmentType === 'scheduled') {
    if (!adj.blank) {
      if (adj.invalid || adj.value === null) {
        errors.expectedRateAdjustment = 'Enter a valid rate adjustment.';
      }
    } else {
      errors.expectedRateAdjustment = 'Enter the expected rate adjustment.';
    }
    if (!firstAdj.blank) {
      if (firstAdj.invalid || firstAdj.value === null) {
        errors.firstAdjustmentAfterYears =
          'Enter when the first adjustment occurs.';
      } else if (firstAdj.value < 0) {
        errors.firstAdjustmentAfterYears =
          'First adjustment timing cannot be negative.';
      }
    } else {
      errors.firstAdjustmentAfterYears =
        'Enter when the first adjustment occurs.';
    }
    if (!interval.blank) {
      if (interval.invalid || interval.value === null) {
        errors.adjustmentIntervalMonths =
          'Enter a valid adjustment interval.';
      } else if (interval.value <= 0 || !Number.isInteger(interval.value)) {
        errors.adjustmentIntervalMonths =
          'Adjustment interval must be a positive whole number of months.';
      }
    } else {
      errors.adjustmentIntervalMonths = 'Enter the period between adjustments.';
    }
    if (!cap.blank) {
      if (cap.invalid || cap.value === null) {
        errors.maximumInterestRate = 'Enter a valid rate cap.';
      } else if (cap.value < 0) {
        errors.maximumInterestRate = 'Rate cap cannot be negative.';
      }
    } else {
      errors.maximumInterestRate = 'Enter the maximum interest rate.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const required = [
    balance,
    drawY,
    repayY,
    rate,
    feePct,
    feeFixed,
    annual,
  ];
  if (
    required.some((p) => p.blank || p.value === null) ||
    balance.value === null ||
    drawY.value === null ||
    repayY.value === null ||
    rate.value === null ||
    feePct.value === null ||
    feeFixed.value === null ||
    annual.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const drawMonths = yearsToMonths(drawY.value);
  const repaymentMonths = yearsToMonths(repayY.value);
  if (drawMonths === null || repaymentMonths === null || repaymentMonths <= 0) {
    return {
      isValid: false,
      errors: { form: 'Unable to convert periods into monthly schedule.' },
      result: null,
    };
  }

  let expectedRateAdjustment = 0;
  let firstAdjustmentAfterYears = 0;
  let adjustmentIntervalMonths = 12;
  let maximumInterestRate = rate.value;

  if (input.adjustmentType === 'scheduled') {
    if (
      adj.value === null ||
      firstAdj.value === null ||
      interval.value === null ||
      cap.value === null
    ) {
      return { isValid: false, errors, result: null };
    }
    if (cap.value < rate.value && adj.value > 0) {
      return {
        isValid: false,
        errors: {
          maximumInterestRate:
            'Rate cap cannot be below the initial rate for upward adjustments.',
        },
        result: null,
      };
    }
    expectedRateAdjustment = adj.value;
    firstAdjustmentAfterYears = firstAdj.value;
    adjustmentIntervalMonths = interval.value;
    maximumInterestRate = cap.value;
  }

  const computed = calculateHeloc({
    currentBalance: balance.value,
    drawMonths,
    repaymentMonths,
    initialInterestRate: rate.value,
    upfrontFeePercent: feePct.value,
    upfrontFeeFixed: feeFixed.value,
    annualFee: annual.value,
    adjustmentType: input.adjustmentType,
    expectedRateAdjustment,
    firstAdjustmentAfterYears,
    adjustmentIntervalMonths,
    maximumInterestRate,
  });

  if (computed === null) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate HELOC schedule for these inputs.' },
      result: null,
    };
  }

  const result: HelocResult = {
    ...computed,
    currency,
    formattedInitialPrincipal: formatHelocMoney(
      computed.initialPrincipal,
      currency
    ),
    formattedInitialDrawPayment: formatHelocMoney(
      computed.initialDrawPayment,
      currency
    ),
    formattedInitialRepaymentPayment: formatHelocMoney(
      computed.initialRepaymentPayment,
      currency
    ),
    formattedDrawPeriodInterest: formatHelocMoney(
      computed.drawPeriodInterest,
      currency
    ),
    formattedRepaymentPeriodInterest: formatHelocMoney(
      computed.repaymentPeriodInterest,
      currency
    ),
    formattedTotalInterest: formatHelocMoney(computed.totalInterest, currency),
    formattedUpfrontFees: formatHelocMoney(computed.upfrontFees, currency),
    formattedRecurringFees: formatHelocMoney(computed.recurringFees, currency),
    formattedTotalFees: formatHelocMoney(computed.totalFees, currency),
    formattedFinancingCost: formatHelocMoney(computed.financingCost, currency),
    formattedTotalCashOutflow: formatHelocMoney(
      computed.totalCashOutflow,
      currency
    ),
  };

  return { isValid: true, errors, result };
}
