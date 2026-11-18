import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateLtvCanonical,
  formatLtvMoney,
  formatLtvPercent,
} from './calculation';
import type { LtvFieldErrors, LtvInput, LtvResult } from './types';

export interface LtvValidation {
  isValid: boolean;
  errors: LtvFieldErrors;
  result: LtvResult | null;
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

export function validateLtvInput(
  input: LtvInput,
  rates?: CurrencyRatesSnapshot | null
): LtvValidation {
  const errors: LtvFieldErrors = {};

  const purchase = parseNumber(input.purchasePrice);
  const down = parseNumber(input.downPayment);
  const loan = parseNumber(input.loanAmount);
  const ltv = parseNumber(input.ltvPercent);

  if (purchase.blank) {
    return { isValid: false, errors: {}, result: null };
  }
  if (purchase.invalid || purchase.value === null) {
    errors.purchasePrice = 'Enter a valid purchase price.';
  } else if (purchase.value <= 0) {
    errors.purchasePrice = 'Purchase price must be greater than zero.';
  }

  if (input.driver === 'downPayment') {
    if (down.blank) {
      return { isValid: false, errors, result: null };
    }
    if (down.invalid || down.value === null) {
      errors.downPayment = 'Enter a valid down payment.';
    } else if (down.value < 0) {
      errors.downPayment = 'Down payment cannot be negative.';
    }
  } else if (input.driver === 'loanAmount') {
    if (loan.blank) {
      return { isValid: false, errors, result: null };
    }
    if (loan.invalid || loan.value === null) {
      errors.loanAmount = 'Enter a valid loan amount.';
    } else if (loan.value < 0) {
      errors.loanAmount = 'Loan amount cannot be negative.';
    }
  } else {
    if (ltv.blank) {
      return { isValid: false, errors, result: null };
    }
    if (ltv.invalid || ltv.value === null) {
      errors.ltvPercent = 'Enter a valid LTV percentage.';
    } else if (ltv.value < 0 || ltv.value > 100) {
      errors.ltvPercent = 'LTV must be between 0% and 100%.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const home = input.purchaseCurrency;
  let downInHome: number | null = null;
  let loanInHome: number | null = null;
  let ltvValue: number | null = null;

  if (input.driver === 'downPayment') {
    const converted = convertMoney(
      down.value!,
      input.downPaymentCurrency,
      home,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    downInHome = converted.amount;
    if (downInHome > purchase.value!) {
      errors.downPayment = 'Down payment cannot exceed purchase price.';
      return { isValid: false, errors, result: null };
    }
  } else if (input.driver === 'loanAmount') {
    const converted = convertMoney(
      loan.value!,
      input.loanAmountCurrency,
      home,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    loanInHome = converted.amount;
    if (loanInHome > purchase.value!) {
      errors.loanAmount = 'Loan amount cannot exceed purchase price.';
      return { isValid: false, errors, result: null };
    }
  } else {
    ltvValue = ltv.value!;
  }

  const canonical = calculateLtvCanonical({
    purchasePrice: purchase.value!,
    downPayment: downInHome,
    loanAmount: loanInHome,
    ltvPercent: ltvValue,
    driver: input.driver,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a valid LTV result.';
    return { isValid: false, errors, result: null };
  }

  const downDisplay = convertMoney(
    canonical.downPayment,
    home,
    input.downPaymentCurrency,
    rates
  );
  if (!downDisplay.ok) {
    errors.form = downDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const loanDisplay = convertMoney(
    canonical.loanAmount,
    home,
    input.loanAmountCurrency,
    rates
  );
  if (!loanDisplay.ok) {
    errors.form = loanDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: LtvResult = {
    purchasePrice: canonical.purchasePrice,
    purchaseCurrency: home,
    downPaymentInPurchase: canonical.downPayment,
    loanAmountInPurchase: canonical.loanAmount,
    downPayment: downDisplay.amount,
    loanAmount: loanDisplay.amount,
    downPaymentCurrency: input.downPaymentCurrency,
    loanAmountCurrency: input.loanAmountCurrency,
    formattedDownPayment: formatLtvMoney(
      downDisplay.amount,
      input.downPaymentCurrency
    ),
    formattedLoanAmount: formatLtvMoney(
      loanDisplay.amount,
      input.loanAmountCurrency
    ),
    formattedPurchasePrice: formatLtvMoney(canonical.purchasePrice, home),
    ltvPercent: canonical.ltvPercent,
    formattedLtvPercent: formatLtvPercent(canonical.ltvPercent),
  };

  return { isValid: true, errors: {}, result };
}
