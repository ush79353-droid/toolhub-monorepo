import {
  calculateEarningsBeforeTax,
  calculateEstimatedIncomeTax,
  calculateGrossProfit,
  calculateNetIncome,
  calculateNetProfitMargin,
  calculateOperatingIncome,
  formatNiMoney,
  formatNiPercent,
  interpretNetIncome,
} from './calculation';
import type {
  NetIncomeFieldErrors,
  NetIncomeInput,
  NetIncomeResult,
} from './types';

export interface NetIncomeValidation {
  isValid: boolean;
  errors: NetIncomeFieldErrors;
  result: NetIncomeResult | null;
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

export function validateNetIncomeInput(
  input: NetIncomeInput
): NetIncomeValidation {
  const errors: NetIncomeFieldErrors = {};
  const currency = input.currency;

  const rev = parseNumber(input.revenue);
  const cogs = parseNumber(input.costOfSales);
  const opex = parseNumber(input.operatingExpenses);
  const interest = parseNumber(input.interest);
  const tax = parseNumber(input.taxRate);

  if (!rev.blank) {
    if (rev.invalid || rev.value === null) {
      errors.revenue = 'Enter a valid revenue amount.';
    } else if (rev.value < 0) {
      errors.revenue = 'Revenue cannot be negative.';
    }
  }
  if (!cogs.blank) {
    if (cogs.invalid || cogs.value === null) {
      errors.costOfSales = 'Enter a valid cost of sales.';
    } else if (cogs.value < 0) {
      errors.costOfSales = 'Cost of sales cannot be negative.';
    }
  }
  if (!opex.blank) {
    if (opex.invalid || opex.value === null) {
      errors.operatingExpenses = 'Enter a valid operating expenses amount.';
    } else if (opex.value < 0) {
      errors.operatingExpenses = 'Operating expenses cannot be negative.';
    }
  }
  if (!interest.blank) {
    if (interest.invalid || interest.value === null) {
      errors.interest = 'Enter a valid interest expense.';
    } else if (interest.value < 0) {
      errors.interest = 'Interest expense cannot be negative.';
    }
  }
  if (!tax.blank) {
    if (tax.invalid || tax.value === null) {
      errors.taxRate = 'Enter a valid tax rate.';
    } else if (tax.value < 0) {
      errors.taxRate = 'Tax rate cannot be negative.';
    } else if (tax.value > 100) {
      errors.taxRate = 'Tax rate cannot exceed 100% in the estimated-tax model.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    rev.blank ||
    cogs.blank ||
    opex.blank ||
    interest.blank ||
    tax.blank ||
    rev.value === null ||
    cogs.value === null ||
    opex.value === null ||
    interest.value === null ||
    tax.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const grossProfit = calculateGrossProfit(rev.value, cogs.value);
  if (grossProfit === null) return { isValid: false, errors, result: null };

  const operatingIncome = calculateOperatingIncome(grossProfit, opex.value);
  if (operatingIncome === null) return { isValid: false, errors, result: null };

  const earningsBeforeTax = calculateEarningsBeforeTax(
    operatingIncome,
    interest.value
  );
  if (earningsBeforeTax === null) {
    return { isValid: false, errors, result: null };
  }

  const totalTaxes = calculateEstimatedIncomeTax(
    earningsBeforeTax,
    tax.value
  );
  if (totalTaxes === null) return { isValid: false, errors, result: null };

  const netIncomeAfterTaxes = calculateNetIncome(
    earningsBeforeTax,
    totalTaxes
  );
  if (netIncomeAfterTaxes === null) {
    return { isValid: false, errors, result: null };
  }

  const netProfitMargin = calculateNetProfitMargin(
    netIncomeAfterTaxes,
    rev.value
  );

  let warningMessage =
    'Simplified income statement: estimated taxes use max(EBT, 0) × tax rate. No automatic tax refund on pretax loss. Currency labels amounts only (no FX).';
  if (earningsBeforeTax < 0) {
    warningMessage =
      'Pretax loss: estimated income taxes are $0 in this simplified model (no automatic refund). Actual tax rules may differ.';
  } else if (rev.value === 0) {
    warningMessage =
      'Net profit margin is undefined when revenue is zero. Estimated taxes still use the pretax income model.';
  }

  const result: NetIncomeResult = {
    revenue: rev.value,
    costOfSales: cogs.value,
    grossProfit,
    operatingExpenses: opex.value,
    operatingIncome,
    interest: interest.value,
    earningsBeforeTax,
    taxRate: tax.value,
    totalTaxes,
    netIncomeAfterTaxes,
    netProfitMargin,
    status: 'valid',
    interpretation: interpretNetIncome(netIncomeAfterTaxes),
    warningMessage,
    currency,
    formattedRevenue: formatNiMoney(rev.value, currency),
    formattedCostOfSales: formatNiMoney(cogs.value, currency),
    formattedGrossProfit: formatNiMoney(grossProfit, currency),
    formattedOperatingExpenses: formatNiMoney(opex.value, currency),
    formattedOperatingIncome: formatNiMoney(operatingIncome, currency),
    formattedInterest: formatNiMoney(interest.value, currency),
    formattedEarningsBeforeTax: formatNiMoney(earningsBeforeTax, currency),
    formattedTaxRate: `${formatNiPercent(tax.value)}%`,
    formattedTotalTaxes: formatNiMoney(totalTaxes, currency),
    formattedNetIncomeAfterTaxes: formatNiMoney(
      netIncomeAfterTaxes,
      currency
    ),
    formattedNetProfitMargin:
      netProfitMargin === null ? null : `${formatNiPercent(netProfitMargin)}%`,
  };

  return { isValid: true, errors, result };
}
