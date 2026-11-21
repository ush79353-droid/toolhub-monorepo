import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  areaToSquareMetres,
  calculateCommercialLease,
  formatCommercialLeaseMoney,
  rateFromPerSquareMetre,
  rateFromPerYear,
  rateToPerSquareMetre,
  rateToPerYear,
  rentFromAnnual,
} from './calculation';
import type {
  CommercialLeaseFieldErrors,
  CommercialLeaseInput,
  CommercialLeaseResult,
} from './types';

export interface CommercialLeaseValidation {
  isValid: boolean;
  errors: CommercialLeaseFieldErrors;
  result: CommercialLeaseResult | null;
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

/**
 * Validates commercial lease inputs, normalizes area/period/currency into
 * baseCurrency + m² + year, then converts display outputs.
 */
export function validateCommercialLeaseInput(
  input: CommercialLeaseInput,
  rates?: CurrencyRatesSnapshot | null
): CommercialLeaseValidation {
  const errors: CommercialLeaseFieldErrors = {};

  const area = parseNumber(input.area);
  const base = parseNumber(input.baseRate);
  const opex = parseNumber(input.opex);
  const agentPercent = parseNumber(input.agentPercent);
  const agentYears = parseNumber(input.agentYears);

  if (area.blank) {
    errors.area = 'Enter the leasable area.';
  } else if (area.invalid || area.value === null) {
    errors.area = 'Enter a valid area.';
  } else if (area.value <= 0) {
    errors.area = 'Area must be greater than zero.';
  }

  if (base.blank) {
    errors.baseRate = 'Enter the base rental rate.';
  } else if (base.invalid || base.value === null) {
    errors.baseRate = 'Enter a valid base rental rate.';
  } else if (base.value < 0) {
    errors.baseRate = 'Base rental rate cannot be negative.';
  }

  if (opex.blank) {
    // blank opex treated as 0
  } else if (opex.invalid || opex.value === null) {
    errors.opex = 'Enter a valid operating expense rate.';
  } else if (opex.value < 0) {
    errors.opex = 'Operating expenses cannot be negative.';
  }

  if (agentPercent.blank) {
    errors.agentPercent = 'Enter the agent percentage.';
  } else if (agentPercent.invalid || agentPercent.value === null) {
    errors.agentPercent = 'Enter a valid percentage.';
  } else if (agentPercent.value < 0) {
    errors.agentPercent = 'Percentage cannot be negative.';
  }

  if (agentYears.blank) {
    errors.agentYears = 'Enter the equivalent years of rent.';
  } else if (agentYears.invalid || agentYears.value === null) {
    errors.agentYears = 'Enter a valid number of years.';
  } else if (agentYears.value < 0) {
    errors.agentYears = 'Years cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const areaM2 = areaToSquareMetres(area.value!, input.areaUnit);
  const basePerM2PerPeriod = rateToPerSquareMetre(base.value!, input.baseAreaUnit);
  const basePerM2PerYear = rateToPerYear(basePerM2PerPeriod, input.basePeriod);

  const opexValue = opex.blank || opex.value === null ? 0 : opex.value;
  const opexPerM2PerPeriod = rateToPerSquareMetre(opexValue, input.opexAreaUnit);
  const opexPerM2PerYear = rateToPerYear(opexPerM2PerPeriod, input.opexPeriod);

  const opexInBase = convertMoney(
    opexPerM2PerYear,
    input.opexCurrency,
    input.baseCurrency,
    rates
  );
  if (!opexInBase.ok) {
    errors.form = opexInBase.message;
    return { isValid: false, errors, result: null };
  }

  const calc = calculateCommercialLease({
    areaM2,
    baseRatePerM2PerYear: basePerM2PerYear,
    opexPerM2PerYear: opexInBase.amount,
    agentPercent: agentPercent.value!,
    agentYears: agentYears.value!,
  });
  if (!calc) {
    errors.form = 'This combination does not produce a finite estimate.';
    return { isValid: false, errors, result: null };
  }

  const totalRateInDisplayUnit = rateFromPerYear(
    rateFromPerSquareMetre(calc.totalRatePerM2PerYear, input.totalRateAreaUnit),
    input.totalRatePeriod
  );
  const rentInPeriod = rentFromAnnual(calc.annualRent, input.rentPeriod);

  const totalDisplay = convertMoney(
    totalRateInDisplayUnit,
    input.baseCurrency,
    input.totalRateCurrency,
    rates
  );
  const rentDisplay = convertMoney(
    rentInPeriod,
    input.baseCurrency,
    input.rentCurrency,
    rates
  );
  const feeDisplay = convertMoney(calc.fee, input.baseCurrency, input.feeCurrency, rates);

  for (const part of [totalDisplay, rentDisplay, feeDisplay]) {
    if (!part.ok) {
      errors.form = part.message;
      return { isValid: false, errors, result: null };
    }
  }

  const result: CommercialLeaseResult = {
    totalRatePerM2PerYearCanonical: calc.totalRatePerM2PerYear,
    annualRentCanonical: calc.annualRent,
    feeCanonical: calc.fee,
    totalRateDisplay: totalDisplay.amount,
    rentDisplay: rentDisplay.amount,
    feeDisplay: feeDisplay.amount,
    totalRateCurrency: input.totalRateCurrency,
    totalRateAreaUnit: input.totalRateAreaUnit,
    totalRatePeriod: input.totalRatePeriod,
    rentCurrency: input.rentCurrency,
    rentPeriod: input.rentPeriod,
    feeCurrency: input.feeCurrency,
    formattedTotalRate: formatCommercialLeaseMoney(
      totalDisplay.amount,
      input.totalRateCurrency
    ),
    formattedRent: formatCommercialLeaseMoney(rentDisplay.amount, input.rentCurrency),
    formattedFee: formatCommercialLeaseMoney(feeDisplay.amount, input.feeCurrency),
    agentPercent: agentPercent.value!,
    agentYears: agentYears.value!,
    areaM2,
  };

  return { isValid: true, errors: {}, result };
}
