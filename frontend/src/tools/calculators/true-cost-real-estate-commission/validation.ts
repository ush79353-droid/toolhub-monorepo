import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateTrueCostOfRealEstateCommission,
  formatCommissionMoney,
} from './calculation';
import type {
  TrueCostRealEstateCommissionFieldErrors,
  TrueCostRealEstateCommissionInput,
  TrueCostRealEstateCommissionResult,
} from './types';

export interface TrueCostRealEstateCommissionValidation {
  isValid: boolean;
  errors: TrueCostRealEstateCommissionFieldErrors;
  result: TrueCostRealEstateCommissionResult | null;
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
 * Validates inputs, normalizes down payment into property-price currency,
 * computes loan/commission results at full precision, then converts money
 * outputs into independent display currencies. Percents and term are never FX.
 */
export function validateTrueCostRealEstateCommissionInput(
  input: TrueCostRealEstateCommissionInput,
  rates?: CurrencyRatesSnapshot | null
): TrueCostRealEstateCommissionValidation {
  const errors: TrueCostRealEstateCommissionFieldErrors = {};

  const price = parseNumber(input.propertyPrice);
  const down = parseNumber(input.downPayment);
  const seller = parseNumber(input.sellerCommissionPercent);
  const buyer = parseNumber(input.buyerCommissionPercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);
  const rate = parseNumber(input.interestRatePercent);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.propertyPrice = 'Enter a valid property price.';
  } else if (!price.blank && price.value !== null && !(price.value > 0)) {
    errors.propertyPrice = 'Property price must be greater than zero.';
  }

  if (!down.blank && (down.invalid || down.value === null)) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (!down.blank && down.value !== null && down.value < 0) {
    errors.downPayment = 'Down payment cannot be negative.';
  }

  if (!seller.blank && (seller.invalid || seller.value === null)) {
    errors.sellerCommissionPercent = 'Enter a valid seller’s commission.';
  } else if (!seller.blank && seller.value !== null && seller.value < 0) {
    errors.sellerCommissionPercent = 'Seller’s commission cannot be negative.';
  }

  if (!buyer.blank && (buyer.invalid || buyer.value === null)) {
    errors.buyerCommissionPercent = 'Enter a valid buyer’s commission.';
  } else if (!buyer.blank && buyer.value !== null && buyer.value < 0) {
    errors.buyerCommissionPercent = 'Buyer’s commission cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (
    !years.blank &&
    years.value !== null &&
    (years.value < 0 || !Number.isInteger(years.value))
  ) {
    errors.termYears = 'Years must be a whole number of 0 or more.';
  }

  if (!months.blank && (months.invalid || months.value === null)) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (
    !months.blank &&
    months.value !== null &&
    (!Number.isInteger(months.value) || months.value < 0 || months.value > 11)
  ) {
    errors.termMonths = 'Months must be a whole number from 0 to 11.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  const incomplete =
    price.blank ||
    down.blank ||
    seller.blank ||
    buyer.blank ||
    years.blank ||
    months.blank ||
    rate.blank ||
    Boolean(errors.propertyPrice) ||
    Boolean(errors.downPayment) ||
    Boolean(errors.sellerCommissionPercent) ||
    Boolean(errors.buyerCommissionPercent) ||
    Boolean(errors.termYears) ||
    Boolean(errors.termMonths) ||
    Boolean(errors.interestRatePercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const downInProperty = convertMoney(
    down.value!,
    input.downPaymentCurrency,
    input.propertyPriceCurrency,
    rates
  );
  if (!downInProperty.ok) {
    errors.form = downInProperty.message;
    return { isValid: false, errors, result: null };
  }

  if (!(downInProperty.amount < price.value!)) {
    errors.downPayment =
      'Down payment must be less than the property price (after currency conversion).';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateTrueCostOfRealEstateCommission({
    propertyPrice: price.value!,
    downPayment: downInProperty.amount,
    sellerCommissionPercent: seller.value!,
    buyerCommissionPercent: buyer.value!,
    termYears: years.value!,
    termMonths: months.value!,
    interestRatePercent: rate.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const calc = input.propertyPriceCurrency;
  const pairs: Array<{
    amount: number;
    to: SupportedCurrency;
    key: keyof TrueCostRealEstateCommissionResult;
    formatKey: keyof TrueCostRealEstateCommissionResult;
  }> = [
    {
      amount: computed.loanAmount,
      to: input.loanAmountCurrency,
      key: 'loanAmount',
      formatKey: 'formattedLoanAmount',
    },
    {
      amount: computed.loanCommission,
      to: input.loanCommissionCurrency,
      key: 'loanCommission',
      formatKey: 'formattedLoanCommission',
    },
    {
      amount: computed.monthlyPayment,
      to: input.monthlyPaymentCurrency,
      key: 'monthlyPayment',
      formatKey: 'formattedMonthlyPayment',
    },
    {
      amount: computed.monthlyCommission,
      to: input.monthlyCommissionCurrency,
      key: 'monthlyCommission',
      formatKey: 'formattedMonthlyCommission',
    },
    {
      amount: computed.totalPayments,
      to: input.totalPaymentsCurrency,
      key: 'totalPayments',
      formatKey: 'formattedTotalPayments',
    },
    {
      amount: computed.apparentCommission,
      to: input.apparentCommissionCurrency,
      key: 'apparentCommission',
      formatKey: 'formattedApparentCommission',
    },
    {
      amount: computed.commissionAmount,
      to: input.commissionAmountCurrency,
      key: 'commissionAmount',
      formatKey: 'formattedCommissionAmount',
    },
    {
      amount: computed.realCommissionCost,
      to: input.realCommissionCostCurrency,
      key: 'realCommissionCost',
      formatKey: 'formattedRealCommissionCost',
    },
  ];

  const converted: Partial<TrueCostRealEstateCommissionResult> = {
    numberOfPayments: computed.numberOfPayments,
    calcCurrency: calc,
  };

  for (const pair of pairs) {
    const out = convertMoney(pair.amount, calc, pair.to, rates);
    if (!out.ok) {
      errors.form = out.message;
      return { isValid: false, errors, result: null };
    }
    (converted as Record<string, unknown>)[pair.key] = out.amount;
    (converted as Record<string, unknown>)[pair.formatKey] = formatCommissionMoney(
      out.amount,
      pair.to
    );
  }

  return {
    isValid: true,
    errors,
    result: converted as TrueCostRealEstateCommissionResult,
  };
}
