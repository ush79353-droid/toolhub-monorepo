import {
  calculateAverageAccountsPayable,
  calculateDaysPayableOutstanding,
  calculatePayablesTurnover,
  calculatePurchases,
  formatDays,
  formatDpoMoney,
  formatTurnover,
  interpretDpo,
} from './calculation';
import type { DpoFieldErrors, DpoInput, DpoResult } from './types';

export interface DpoValidation {
  isValid: boolean;
  errors: DpoFieldErrors;
  result: DpoResult | null;
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

export function validateDpoInput(input: DpoInput): DpoValidation {
  const errors: DpoFieldErrors = {};
  const currency = input.currency;

  let averageAp: number | null = null;
  let purchases: number | null = null;
  let estimatedPurchasesSigned: number | null = null;

  if (input.averageApSource === 'calculated') {
    const beg = parseNumber(input.beginningAccountsPayable);
    const end = parseNumber(input.endingAccountsPayable);

    if (!beg.blank) {
      if (beg.invalid || beg.value === null) {
        errors.beginningAccountsPayable =
          'Enter a valid beginning accounts payable.';
      } else if (beg.value < 0) {
        errors.beginningAccountsPayable =
          'Beginning accounts payable cannot be negative.';
      }
    }
    if (!end.blank) {
      if (end.invalid || end.value === null) {
        errors.endingAccountsPayable = 'Enter a valid ending accounts payable.';
      } else if (end.value < 0) {
        errors.endingAccountsPayable =
          'Ending accounts payable cannot be negative.';
      }
    }

    if (
      !beg.blank &&
      !end.blank &&
      beg.value !== null &&
      end.value !== null &&
      beg.value >= 0 &&
      end.value >= 0 &&
      !beg.invalid &&
      !end.invalid
    ) {
      averageAp = calculateAverageAccountsPayable(beg.value, end.value);
    }
  } else {
    const manual = parseNumber(input.manualAverageAp);
    if (!manual.blank) {
      if (manual.invalid || manual.value === null) {
        errors.manualAverageAp = 'Enter a valid average accounts payable.';
      } else if (manual.value < 0) {
        errors.manualAverageAp = 'Average accounts payable cannot be negative.';
      } else {
        averageAp = manual.value;
      }
    }
  }

  if (input.purchasesSource === 'calculated') {
    const begInv = parseNumber(input.beginningInventory);
    const endInv = parseNumber(input.endingInventory);
    const cogs = parseNumber(input.costOfGoodsSold);

    if (!begInv.blank) {
      if (begInv.invalid || begInv.value === null) {
        errors.beginningInventory = 'Enter a valid beginning inventory.';
      } else if (begInv.value < 0) {
        errors.beginningInventory = 'Beginning inventory cannot be negative.';
      }
    }
    if (!endInv.blank) {
      if (endInv.invalid || endInv.value === null) {
        errors.endingInventory = 'Enter a valid ending inventory.';
      } else if (endInv.value < 0) {
        errors.endingInventory = 'Ending inventory cannot be negative.';
      }
    }
    if (!cogs.blank) {
      if (cogs.invalid || cogs.value === null) {
        errors.costOfGoodsSold = 'Enter a valid cost of goods sold.';
      } else if (cogs.value < 0) {
        errors.costOfGoodsSold = 'Cost of goods sold cannot be negative.';
      }
    }

    if (
      !begInv.blank &&
      !endInv.blank &&
      !cogs.blank &&
      begInv.value !== null &&
      endInv.value !== null &&
      cogs.value !== null &&
      begInv.value >= 0 &&
      endInv.value >= 0 &&
      cogs.value >= 0 &&
      !begInv.invalid &&
      !endInv.invalid &&
      !cogs.invalid
    ) {
      estimatedPurchasesSigned = calculatePurchases(
        cogs.value,
        endInv.value,
        begInv.value
      );
      if (estimatedPurchasesSigned !== null && estimatedPurchasesSigned > 0) {
        purchases = estimatedPurchasesSigned;
      }
    }
  } else {
    const manual = parseNumber(input.manualPurchases);
    if (!manual.blank) {
      if (manual.invalid || manual.value === null) {
        errors.manualPurchases = 'Enter a valid purchases amount.';
      } else if (manual.value < 0) {
        errors.manualPurchases = 'Purchases cannot be negative.';
      } else {
        purchases = manual.value;
      }
    }
  }

  const periodParsed = parseNumber(input.accountingPeriodDays);
  if (periodParsed.blank) {
    errors.accountingPeriodDays = 'Enter days in the accounting period.';
  } else if (periodParsed.invalid || periodParsed.value === null) {
    errors.accountingPeriodDays = 'Enter a valid period in days.';
  } else if (periodParsed.value <= 0) {
    errors.accountingPeriodDays = 'Period must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    input.purchasesSource === 'calculated' &&
    estimatedPurchasesSigned !== null &&
    estimatedPurchasesSigned < 0
  ) {
    return {
      isValid: false,
      errors: {
        form: `Estimated purchases are ${formatDpoMoney(estimatedPurchasesSigned, currency)} (negative). Review inventory and COGS, or enter valid purchases directly. Standard DPO requires positive purchases.`,
      },
      result: null,
    };
  }

  if (
    averageAp === null ||
    purchases === null ||
    periodParsed.blank ||
    periodParsed.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const periodDays = periodParsed.value;

  if (purchases === 0) {
    return {
      isValid: false,
      errors: {
        form: 'DPO is undefined when purchases are zero. Enter positive purchases (or inventory and COGS that imply positive purchases). Credit purchases are preferred when available.',
      },
      result: null,
    };
  }

  const dpo = calculateDaysPayableOutstanding(averageAp, purchases, periodDays);
  if (dpo === null) {
    return { isValid: false, errors, result: null };
  }

  const turnover = calculatePayablesTurnover(purchases, averageAp);
  const warningMessage =
    averageAp === 0 && purchases > 0
      ? 'Zero average accounts payable with positive purchases yields DPO of 0 days. Payables turnover is unavailable (division by zero).'
      : input.purchasesSource === 'calculated'
        ? 'Purchases are estimated as COGS + ending inventory − beginning inventory. Actual credit purchases are often preferable for AP arising from supplier credit.'
        : 'Direct purchases are used as the DPO denominator. Prefer relevant credit purchases when that information is available.';

  const result: DpoResult = {
    averageAccountsPayable: averageAp,
    purchases,
    accountingPeriodDays: periodDays,
    daysPayableOutstanding: dpo,
    accountsPayableTurnover: turnover,
    status: 'valid',
    interpretation: interpretDpo(dpo, averageAp, purchases),
    warningMessage,
    currency,
    formattedAverageAccountsPayable: formatDpoMoney(averageAp, currency),
    formattedPurchases: formatDpoMoney(purchases, currency),
    formattedAccountingPeriodDays: formatDays(periodDays),
    formattedDaysPayableOutstanding: formatDays(dpo),
    formattedAccountsPayableTurnover:
      turnover === null ? null : formatTurnover(turnover),
  };

  return { isValid: true, errors, result };
}
