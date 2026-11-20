import {
  calculateAverageBalance,
  calculateCashConversionCycle,
  calculateDaysInventoryOutstanding,
  calculateDaysPayableOutstanding,
  calculateDaysSalesOutstanding,
  calculateOperatingCycle,
  formatCccMoney,
  formatDays,
  interpretCashConversionCycle,
  normalizeReportingPeriod,
} from './calculation';
import type {
  AverageBalanceMode,
  CashConversionCycleFieldErrors,
  CashConversionCycleInput,
  CashConversionCycleResult,
} from './types';

export interface CashConversionCycleValidation {
  isValid: boolean;
  errors: CashConversionCycleFieldErrors;
  result: CashConversionCycleResult | null;
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

function resolveAverage(
  mode: AverageBalanceMode,
  manualRaw: string,
  beginningRaw: string,
  endingRaw: string,
  errors: CashConversionCycleFieldErrors,
  keys: {
    manual: keyof CashConversionCycleFieldErrors;
    beginning: keyof CashConversionCycleFieldErrors;
    ending: keyof CashConversionCycleFieldErrors;
  }
): number | null {
  if (mode === 'manual') {
    const parsed = parseNumber(manualRaw);
    if (parsed.blank) return null;
    if (parsed.invalid || parsed.value === null) {
      errors[keys.manual] = 'Enter a valid nonnegative amount.';
      return null;
    }
    if (parsed.value < 0) {
      errors[keys.manual] = 'Amount cannot be negative.';
      return null;
    }
    return parsed.value;
  }

  const beg = parseNumber(beginningRaw);
  const end = parseNumber(endingRaw);

  if (!beg.blank) {
    if (beg.invalid || beg.value === null) {
      errors[keys.beginning] = 'Enter a valid beginning balance.';
    } else if (beg.value < 0) {
      errors[keys.beginning] = 'Beginning balance cannot be negative.';
    }
  }
  if (!end.blank) {
    if (end.invalid || end.value === null) {
      errors[keys.ending] = 'Enter a valid ending balance.';
    } else if (end.value < 0) {
      errors[keys.ending] = 'Ending balance cannot be negative.';
    }
  }

  if (beg.blank || end.blank) return null;
  if (beg.value === null || end.value === null) return null;
  if (beg.value < 0 || end.value < 0) return null;

  return calculateAverageBalance(beg.value, end.value);
}

export function validateCashConversionCycleInput(
  input: CashConversionCycleInput
): CashConversionCycleValidation {
  const errors: CashConversionCycleFieldErrors = {};
  const currency = input.currency;

  const periodParsed = parseNumber(input.period);
  if (periodParsed.blank) {
    errors.period = 'Enter a reporting period.';
  } else if (periodParsed.invalid || periodParsed.value === null) {
    errors.period = 'Enter a valid reporting period.';
  } else if (periodParsed.value <= 0) {
    errors.period = 'Period must be greater than zero.';
  }

  const revenueParsed = parseNumber(input.totalRevenue);
  if (!revenueParsed.blank) {
    if (revenueParsed.invalid || revenueParsed.value === null) {
      errors.totalRevenue = 'Enter a valid revenue amount.';
    } else if (revenueParsed.value < 0) {
      errors.totalRevenue = 'Revenue cannot be negative.';
    }
  }

  const cogsParsed = parseNumber(input.costOfGoodsSold);
  if (!cogsParsed.blank) {
    if (cogsParsed.invalid || cogsParsed.value === null) {
      errors.costOfGoodsSold = 'Enter a valid cost of goods sold.';
    } else if (cogsParsed.value < 0) {
      errors.costOfGoodsSold = 'Cost of goods sold cannot be negative.';
    }
  }

  const averageInventory = resolveAverage(
    input.inventoryMode,
    input.averageInventory,
    input.beginningInventory,
    input.endingInventory,
    errors,
    {
      manual: 'averageInventory',
      beginning: 'beginningInventory',
      ending: 'endingInventory',
    }
  );

  const averageAR = resolveAverage(
    input.receivablesMode,
    input.averageAccountsReceivable,
    input.beginningAccountsReceivable,
    input.endingAccountsReceivable,
    errors,
    {
      manual: 'averageAccountsReceivable',
      beginning: 'beginningAccountsReceivable',
      ending: 'endingAccountsReceivable',
    }
  );

  const averageAP = resolveAverage(
    input.payablesMode,
    input.averageAccountsPayable,
    input.beginningAccountsPayable,
    input.endingAccountsPayable,
    errors,
    {
      manual: 'averageAccountsPayable',
      beginning: 'beginningAccountsPayable',
      ending: 'endingAccountsPayable',
    }
  );

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    periodParsed.blank ||
    periodParsed.value === null ||
    revenueParsed.blank ||
    revenueParsed.value === null ||
    cogsParsed.blank ||
    cogsParsed.value === null ||
    averageInventory === null ||
    averageAR === null ||
    averageAP === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const periodDays = normalizeReportingPeriod(
    periodParsed.value,
    input.periodUnit
  );
  if (periodDays === null) {
    return {
      isValid: false,
      errors: { period: 'Could not normalize the reporting period.' },
      result: null,
    };
  }

  const revenue = revenueParsed.value;
  const cogs = cogsParsed.value;

  if (revenue === 0) {
    return {
      isValid: false,
      errors: {
        totalRevenue:
          'DSO is undefined when revenue is zero. Enter positive sales for the period (total revenue is a simplified denominator; credit sales are more precise when available).',
      },
      result: null,
    };
  }

  if (cogs === 0) {
    return {
      isValid: false,
      errors: {
        costOfGoodsSold:
          'DIO and DPO are undefined when COGS is zero. Enter positive COGS for the period (this calculator uses COGS as the DPO denominator by default).',
      },
      result: null,
    };
  }

  const dio = calculateDaysInventoryOutstanding(
    averageInventory,
    cogs,
    periodDays
  );
  const dso = calculateDaysSalesOutstanding(averageAR, revenue, periodDays);
  const dpo = calculateDaysPayableOutstanding(averageAP, cogs, periodDays);

  if (dio === null || dso === null || dpo === null) {
    return { isValid: false, errors, result: null };
  }

  const operatingCycle = calculateOperatingCycle(dio, dso);
  const ccc = calculateCashConversionCycle(dio, dso, dpo);
  if (operatingCycle === null || ccc === null) {
    return { isValid: false, errors, result: null };
  }

  const result: CashConversionCycleResult = {
    periodDays,
    averageInventory,
    averageAccountsReceivable: averageAR,
    averageAccountsPayable: averageAP,
    inventoryDays: dio,
    accountsReceivableDays: dso,
    accountsPayableDays: dpo,
    operatingCycle,
    cashConversionCycle: ccc,
    status: 'valid',
    interpretation: interpretCashConversionCycle(ccc),
    currency,
    formattedPeriodDays: formatDays(periodDays),
    formattedAverageInventory: formatCccMoney(averageInventory, currency),
    formattedAverageAccountsReceivable: formatCccMoney(averageAR, currency),
    formattedAverageAccountsPayable: formatCccMoney(averageAP, currency),
    formattedInventoryDays: formatDays(dio),
    formattedAccountsReceivableDays: formatDays(dso),
    formattedAccountsPayableDays: formatDays(dpo),
    formattedOperatingCycle: formatDays(operatingCycle),
    formattedCashConversionCycle: formatDays(ccc),
  };

  return { isValid: true, errors, result };
}
