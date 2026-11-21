import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  ASSUMPTION_NOTE,
  calculateLeaseMileage,
  distanceToKm,
  feeToPerKm,
  formatDistanceAmount,
  formatLeaseMileageMoney,
  kmToDistance,
  toMonths,
} from './calculation';
import type {
  LeaseMileageFieldErrors,
  LeaseMileageInput,
  LeaseMileageResult,
} from './types';

export interface LeaseMileageValidation {
  isValid: boolean;
  errors: LeaseMileageFieldErrors;
  result: LeaseMileageResult | null;
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

function parseNonNegInt(
  raw: string,
  allowBlankAsZero: boolean
): { value: number | null; blank: boolean; invalid: boolean } {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    return allowBlankAsZero
      ? { value: 0, blank: true, invalid: false }
      : { value: null, blank: true, invalid: false };
  }
  if (parsed.invalid || parsed.value === null) {
    return { value: null, blank: false, invalid: true };
  }
  if (!Number.isInteger(parsed.value) || parsed.value < 0) {
    return { value: null, blank: false, invalid: true };
  }
  return { value: parsed.value, blank: false, invalid: false };
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

export function validateLeaseMileageInput(
  input: LeaseMileageInput,
  rates?: CurrencyRatesSnapshot | null
): LeaseMileageValidation {
  const errors: LeaseMileageFieldErrors = {};

  const totalY = parseNonNegInt(input.totalYears, true);
  const totalM = parseNonNegInt(input.totalMonths, true);
  const remY = parseNonNegInt(input.remainingYears, true);
  const remM = parseNonNegInt(input.remainingMonths, true);

  const termBlank =
    (input.totalYears.trim() === '' && input.totalMonths.trim() === '') ||
    (input.remainingYears.trim() === '' && input.remainingMonths.trim() === '');

  if (termBlank) {
    return { isValid: false, errors, result: null };
  }

  if (totalY.invalid || totalM.invalid || totalY.value === null || totalM.value === null) {
    errors.totalTerm = 'Enter a valid total lease term in whole years and months.';
  }
  if (remY.invalid || remM.invalid || remY.value === null || remM.value === null) {
    errors.remainingTerm = 'Enter a valid remaining lease time in whole years and months.';
  }

  let totalMonths = 0;
  let remainingMonths = 0;
  if (!errors.totalTerm && !errors.remainingTerm) {
    totalMonths = toMonths(totalY.value!, totalM.value!);
    remainingMonths = toMonths(remY.value!, remM.value!);
    if (totalMonths <= 0) {
      errors.totalTerm = 'Total lease term must be greater than zero.';
    } else if (remainingMonths <= 0) {
      errors.remainingTerm = 'Remaining lease time must be greater than zero.';
    } else if (remainingMonths > totalMonths) {
      errors.remainingTerm =
        'Remaining lease time cannot exceed the total lease term.';
    }
  }

  const current = parseNumber(input.currentDistance);
  const allowance = parseNumber(input.annualAllowance);
  const fee = parseNumber(input.excessFee);

  if (current.blank && allowance.blank && fee.blank) {
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    return { isValid: false, errors, result: null };
  }

  if (current.blank) {
    errors.currentDistance = 'Enter current miles driven.';
  } else if (current.invalid || current.value === null) {
    errors.currentDistance = 'Enter a valid current distance.';
  } else if (current.value < 0) {
    errors.currentDistance = 'Current distance cannot be negative.';
  }

  if (allowance.blank) {
    errors.annualAllowance = 'Enter the annual mileage allowance.';
  } else if (allowance.invalid || allowance.value === null) {
    errors.annualAllowance = 'Enter a valid annual allowance.';
  } else if (allowance.value < 0) {
    errors.annualAllowance = 'Annual allowance cannot be negative.';
  }

  if (fee.blank) {
    errors.excessFee = 'Enter the excess distance fee.';
  } else if (fee.invalid || fee.value === null) {
    errors.excessFee = 'Enter a valid excess fee.';
  } else if (fee.value < 0) {
    errors.excessFee = 'Excess fee cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const currentKm = distanceToKm(current.value!, input.currentDistanceUnit);
  const allowanceKm = distanceToKm(allowance.value!, input.annualAllowanceUnit);
  const feePerKm = feeToPerKm(fee.value!, input.excessFeeDistanceUnit);

  const computed = calculateLeaseMileage({
    totalMonths,
    remainingMonths,
    currentDistanceKm: currentKm,
    annualAllowanceKm: allowanceKm,
    feePerKm,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  if (computed.availability === 'no_elapsed') {
    const result: LeaseMileageResult = {
      availability: 'no_elapsed',
      totalMonths: computed.totalMonths,
      remainingMonths: computed.remainingMonths,
      elapsedMonths: computed.elapsedMonths,
      predictedExcessKm: 0,
      feeCurrency: input.excessFeeCurrency,
      predictedChargeCanonical: 0,
      monthlySavingsCanonical: 0,
      excessDisplay: 0,
      excessDisplayUnit: input.excessResultUnit,
      chargeDisplay: 0,
      chargeCurrency: input.chargeCurrency,
      savingsDisplay: 0,
      savingsCurrency: input.savingsCurrency,
      formattedExcess: '',
      formattedCharge: '',
      formattedSavings: '',
      assumptionNote: ASSUMPTION_NOTE,
    };
    return { isValid: true, errors, result };
  }

  const chargeToDisplay = convertMoney(
    computed.predictedCharge,
    input.excessFeeCurrency,
    input.chargeCurrency,
    rates
  );
  if (!chargeToDisplay.ok) {
    errors.form = chargeToDisplay.message;
    return { isValid: false, errors, result: null };
  }
  const savingsToDisplay = convertMoney(
    computed.monthlySavings,
    input.excessFeeCurrency,
    input.savingsCurrency,
    rates
  );
  if (!savingsToDisplay.ok) {
    errors.form = savingsToDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const excessDisplay = kmToDistance(
    computed.predictedExcessKm,
    input.excessResultUnit
  );

  const result: LeaseMileageResult = {
    availability: 'ok',
    totalMonths: computed.totalMonths,
    remainingMonths: computed.remainingMonths,
    elapsedMonths: computed.elapsedMonths,
    predictedExcessKm: computed.predictedExcessKm,
    feeCurrency: input.excessFeeCurrency,
    predictedChargeCanonical: computed.predictedCharge,
    monthlySavingsCanonical: computed.monthlySavings,
    excessDisplay,
    excessDisplayUnit: input.excessResultUnit,
    chargeDisplay: chargeToDisplay.amount,
    chargeCurrency: input.chargeCurrency,
    savingsDisplay: savingsToDisplay.amount,
    savingsCurrency: input.savingsCurrency,
    formattedExcess: formatDistanceAmount(excessDisplay),
    formattedCharge: formatLeaseMileageMoney(
      chargeToDisplay.amount,
      input.chargeCurrency
    ),
    formattedSavings: formatLeaseMileageMoney(
      savingsToDisplay.amount,
      input.savingsCurrency
    ),
    assumptionNote: ASSUMPTION_NOTE,
  };

  return { isValid: true, errors, result };
}
