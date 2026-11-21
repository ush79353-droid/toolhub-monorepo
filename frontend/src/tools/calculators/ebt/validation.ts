import {
  calculateEbitFromGross,
  calculateEbt,
  calculateEbtMargin,
  calculateGrossProfit,
  calculateOperatingExpenses,
  formatEbtMargin,
  formatEbtMoney,
  interpretEbt,
} from './calculation';
import type { EbtFieldErrors, EbtInput, EbtResult } from './types';

export interface EbtValidation {
  isValid: boolean;
  errors: EbtFieldErrors;
  result: EbtResult | null;
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

export function validateEbtInput(input: EbtInput): EbtValidation {
  const errors: EbtFieldErrors = {};
  const currency = input.currency;

  const rev = parseNumber(input.revenue);
  const cogs = parseNumber(input.costOfGoodsSold);
  const sga = parseNumber(input.sellingGeneralAdministrative);
  const da = parseNumber(input.depreciationAmortization);
  const interest = parseNumber(input.interestExpenses);
  const other = parseNumber(input.otherIncome);

  if (!rev.blank) {
    if (rev.invalid || rev.value === null) {
      errors.revenue = 'Enter a valid revenue amount.';
    } else if (rev.value < 0) {
      errors.revenue = 'Revenue cannot be negative.';
    }
  }
  if (!cogs.blank) {
    if (cogs.invalid || cogs.value === null) {
      errors.costOfGoodsSold = 'Enter a valid cost of goods sold.';
    } else if (cogs.value < 0) {
      errors.costOfGoodsSold = 'Cost of goods sold cannot be negative.';
    }
  }
  if (!sga.blank) {
    if (sga.invalid || sga.value === null) {
      errors.sellingGeneralAdministrative = 'Enter a valid SG&A amount.';
    } else if (sga.value < 0) {
      errors.sellingGeneralAdministrative = 'SG&A cannot be negative.';
    }
  }
  if (!da.blank) {
    if (da.invalid || da.value === null) {
      errors.depreciationAmortization =
        'Enter a valid depreciation and amortization amount.';
    } else if (da.value < 0) {
      errors.depreciationAmortization =
        'Depreciation and amortization cannot be negative.';
    }
  }
  if (!interest.blank) {
    if (interest.invalid || interest.value === null) {
      errors.interestExpenses = 'Enter a valid interest expense.';
    } else if (interest.value < 0) {
      errors.interestExpenses = 'Interest expenses cannot be negative.';
    }
  }
  if (!other.blank) {
    if (other.invalid || other.value === null) {
      errors.otherIncome = 'Enter a valid other income amount.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    rev.blank ||
    cogs.blank ||
    sga.blank ||
    da.blank ||
    interest.blank ||
    other.blank ||
    rev.value === null ||
    cogs.value === null ||
    sga.value === null ||
    da.value === null ||
    interest.value === null ||
    other.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const grossProfit = calculateGrossProfit(rev.value, cogs.value);
  const operatingExpenses = calculateOperatingExpenses(sga.value, da.value);
  if (grossProfit === null || operatingExpenses === null) {
    return { isValid: false, errors, result: null };
  }

  const ebit = calculateEbitFromGross(grossProfit, operatingExpenses);
  const ebt = calculateEbt(
    grossProfit,
    operatingExpenses,
    interest.value,
    other.value
  );
  if (ebit === null || ebt === null) {
    return { isValid: false, errors, result: null };
  }

  const margin = calculateEbtMargin(ebt, rev.value);
  const warningMessage =
    rev.value === 0
      ? 'EBT margin is unavailable when revenue is zero. Enter D&A only if it is not already included in COGS or SG&A.'
      : 'Enter D&A only for amounts not already included in COGS or SG&A; do not subtract depreciation twice. EBT excludes income tax expense.';

  const result: EbtResult = {
    revenue: rev.value,
    costOfGoodsSold: cogs.value,
    grossProfit,
    sellingGeneralAdministrative: sga.value,
    depreciationAmortization: da.value,
    operatingExpenses,
    ebit,
    interestExpenses: interest.value,
    otherIncome: other.value,
    earningsBeforeTax: ebt,
    ebtMargin: margin,
    status: 'valid',
    interpretation: interpretEbt(ebt),
    warningMessage,
    currency,
    formattedRevenue: formatEbtMoney(rev.value, currency),
    formattedCostOfGoodsSold: formatEbtMoney(cogs.value, currency),
    formattedGrossProfit: formatEbtMoney(grossProfit, currency),
    formattedSellingGeneralAdministrative: formatEbtMoney(sga.value, currency),
    formattedDepreciationAmortization: formatEbtMoney(da.value, currency),
    formattedOperatingExpenses: formatEbtMoney(operatingExpenses, currency),
    formattedEbit: formatEbtMoney(ebit, currency),
    formattedInterestExpenses: formatEbtMoney(interest.value, currency),
    formattedOtherIncome: formatEbtMoney(other.value, currency),
    formattedEarningsBeforeTax: formatEbtMoney(ebt, currency),
    formattedEbtMargin: margin === null ? null : formatEbtMargin(margin),
  };

  return { isValid: true, errors, result };
}
