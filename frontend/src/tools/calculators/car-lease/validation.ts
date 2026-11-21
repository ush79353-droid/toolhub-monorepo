import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateCarLease, formatCarLeaseMoney } from './calculation';
import type {
  CarLeaseFieldErrors,
  CarLeaseInput,
  CarLeaseResult,
} from './types';

export interface CarLeaseValidation {
  isValid: boolean;
  errors: CarLeaseFieldErrors;
  result: CarLeaseResult | null;
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
 * Validates car-lease inputs, normalizes all money fields into the negotiated-price
 * currency, runs money-factor lease math at full precision, then FX-converts each
 * result into its independent display currency. Percents, money factor, and term
 * never convert.
 */
export function validateCarLeaseInput(
  input: CarLeaseInput,
  rates?: CurrencyRatesSnapshot | null
): CarLeaseValidation {
  const errors: CarLeaseFieldErrors = {};

  const msrp = parseNumber(input.msrp);
  const negotiated = parseNumber(input.negotiatedPrice);
  const term = parseNumber(input.leaseTermMonths);
  const tax = parseNumber(input.salesTaxPercent);
  const residualFactor = parseNumber(input.residualFactorPercent);
  const moneyFactor = parseNumber(input.moneyFactor);
  const dealerFee = parseNumber(input.dealerFee);
  const registrationFee = parseNumber(input.registrationFee);
  const downPayment = parseNumber(input.downPayment);
  const tradeIn = parseNumber(input.tradeInValue);
  const other = parseNumber(input.otherReductions);

  if (!msrp.blank && (msrp.invalid || msrp.value === null)) {
    errors.msrp = 'Enter a valid MSRP.';
  } else if (msrp.value !== null && msrp.value < 0) {
    errors.msrp = 'MSRP must be zero or greater.';
  }

  if (!negotiated.blank && (negotiated.invalid || negotiated.value === null)) {
    errors.negotiatedPrice = 'Enter a valid negotiated selling price.';
  } else if (negotiated.value !== null && negotiated.value < 0) {
    errors.negotiatedPrice = 'Negotiated selling price must be zero or greater.';
  }

  if (!term.blank && (term.invalid || term.value === null)) {
    errors.leaseTermMonths = 'Enter a valid lease term in months.';
  } else if (term.value !== null) {
    if (!Number.isInteger(term.value) || term.value <= 0) {
      errors.leaseTermMonths = 'Lease term must be a whole number of months greater than zero.';
    }
  }

  if (!tax.blank && (tax.invalid || tax.value === null)) {
    errors.salesTaxPercent = 'Enter a valid sales tax percent.';
  } else if (tax.value !== null && tax.value < 0) {
    errors.salesTaxPercent = 'Sales tax must be zero or greater.';
  }

  if (
    !residualFactor.blank &&
    (residualFactor.invalid || residualFactor.value === null)
  ) {
    errors.residualFactorPercent = 'Enter a valid residual factor.';
  } else if (residualFactor.value !== null && residualFactor.value < 0) {
    errors.residualFactorPercent = 'Residual factor must be zero or greater.';
  }

  if (!moneyFactor.blank && (moneyFactor.invalid || moneyFactor.value === null)) {
    errors.moneyFactor = 'Enter a valid money factor.';
  } else if (moneyFactor.value !== null && moneyFactor.value < 0) {
    errors.moneyFactor = 'Money factor must be zero or greater.';
  }

  if (!dealerFee.blank && (dealerFee.invalid || dealerFee.value === null)) {
    errors.dealerFee = 'Enter a valid dealer fee.';
  } else if (dealerFee.value !== null && dealerFee.value < 0) {
    errors.dealerFee = 'Dealer fee must be zero or greater.';
  }

  if (
    !registrationFee.blank &&
    (registrationFee.invalid || registrationFee.value === null)
  ) {
    errors.registrationFee = 'Enter a valid registration fee.';
  } else if (registrationFee.value !== null && registrationFee.value < 0) {
    errors.registrationFee = 'Registration fee must be zero or greater.';
  }

  if (!downPayment.blank && (downPayment.invalid || downPayment.value === null)) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (downPayment.value !== null && downPayment.value < 0) {
    errors.downPayment = 'Down payment must be zero or greater.';
  }

  if (!tradeIn.blank && (tradeIn.invalid || tradeIn.value === null)) {
    errors.tradeInValue = 'Enter a valid trade-in value.';
  } else if (tradeIn.value !== null && tradeIn.value < 0) {
    errors.tradeInValue = 'Trade-in value must be zero or greater.';
  }

  if (!other.blank && (other.invalid || other.value === null)) {
    errors.otherReductions = 'Enter a valid other-reductions amount.';
  } else if (other.value !== null && other.value < 0) {
    errors.otherReductions = 'Other reductions must be zero or greater.';
  }

  const incomplete =
    msrp.blank ||
    negotiated.blank ||
    term.blank ||
    tax.blank ||
    residualFactor.blank ||
    moneyFactor.blank ||
    dealerFee.blank ||
    registrationFee.blank ||
    downPayment.blank ||
    tradeIn.blank ||
    other.blank ||
    Boolean(errors.msrp) ||
    Boolean(errors.negotiatedPrice) ||
    Boolean(errors.leaseTermMonths) ||
    Boolean(errors.salesTaxPercent) ||
    Boolean(errors.residualFactorPercent) ||
    Boolean(errors.moneyFactor) ||
    Boolean(errors.dealerFee) ||
    Boolean(errors.registrationFee) ||
    Boolean(errors.downPayment) ||
    Boolean(errors.tradeInValue) ||
    Boolean(errors.otherReductions);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.negotiatedPriceCurrency;

  const msrpFx = convertMoney(msrp.value!, input.msrpCurrency, calcCurrency, rates);
  if (!msrpFx.ok) {
    errors.form = msrpFx.message;
    return { isValid: false, errors, result: null };
  }
  const dealerFx = convertMoney(
    dealerFee.value!,
    input.dealerFeeCurrency,
    calcCurrency,
    rates
  );
  if (!dealerFx.ok) {
    errors.form = dealerFx.message;
    return { isValid: false, errors, result: null };
  }
  const registrationFx = convertMoney(
    registrationFee.value!,
    input.registrationFeeCurrency,
    calcCurrency,
    rates
  );
  if (!registrationFx.ok) {
    errors.form = registrationFx.message;
    return { isValid: false, errors, result: null };
  }
  const downFx = convertMoney(
    downPayment.value!,
    input.downPaymentCurrency,
    calcCurrency,
    rates
  );
  if (!downFx.ok) {
    errors.form = downFx.message;
    return { isValid: false, errors, result: null };
  }
  const tradeFx = convertMoney(
    tradeIn.value!,
    input.tradeInValueCurrency,
    calcCurrency,
    rates
  );
  if (!tradeFx.ok) {
    errors.form = tradeFx.message;
    return { isValid: false, errors, result: null };
  }
  const otherFx = convertMoney(
    other.value!,
    input.otherReductionsCurrency,
    calcCurrency,
    rates
  );
  if (!otherFx.ok) {
    errors.form = otherFx.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCarLease({
    msrp: msrpFx.amount,
    negotiatedPrice: negotiated.value!,
    leaseTermMonths: term.value!,
    salesTaxPercent: tax.value!,
    residualFactorPercent: residualFactor.value!,
    moneyFactor: moneyFactor.value!,
    dealerFee: dealerFx.amount,
    registrationFee: registrationFx.amount,
    downPayment: downFx.amount,
    tradeInValue: tradeFx.amount,
    otherReductions: otherFx.amount,
  });

  if (computed === null) {
    errors.form =
      'This lease combination is unsupported (negative or non-finite payment). Check residual, fees, and reductions.';
    return { isValid: false, errors, result: null };
  }

  const netFx = convertMoney(
    computed.netCapitalizedCost,
    calcCurrency,
    input.netCapCostCurrency,
    rates
  );
  if (!netFx.ok) {
    errors.form = netFx.message;
    return { isValid: false, errors, result: null };
  }
  const residualFx = convertMoney(
    computed.residualValue,
    calcCurrency,
    input.residualValueCurrency,
    rates
  );
  if (!residualFx.ok) {
    errors.form = residualFx.message;
    return { isValid: false, errors, result: null };
  }
  const depFx = convertMoney(
    computed.monthlyDepreciation,
    calcCurrency,
    input.monthlyDepreciationCurrency,
    rates
  );
  if (!depFx.ok) {
    errors.form = depFx.message;
    return { isValid: false, errors, result: null };
  }
  const feeFx = convertMoney(
    computed.monthlyLeaseFee,
    calcCurrency,
    input.monthlyLeaseFeeCurrency,
    rates
  );
  if (!feeFx.ok) {
    errors.form = feeFx.message;
    return { isValid: false, errors, result: null };
  }
  const baseFx = convertMoney(
    computed.monthlyBasePayment,
    calcCurrency,
    input.monthlyBasePaymentCurrency,
    rates
  );
  if (!baseFx.ok) {
    errors.form = baseFx.message;
    return { isValid: false, errors, result: null };
  }
  const taxFx = convertMoney(
    computed.monthlySalesTax,
    calcCurrency,
    input.monthlySalesTaxCurrency,
    rates
  );
  if (!taxFx.ok) {
    errors.form = taxFx.message;
    return { isValid: false, errors, result: null };
  }
  const paymentFx = convertMoney(
    computed.monthlyLeasePayment,
    calcCurrency,
    input.monthlyLeasePaymentCurrency,
    rates
  );
  if (!paymentFx.ok) {
    errors.form = paymentFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: CarLeaseResult = {
    netCapitalizedCostCanonical: computed.netCapitalizedCost,
    residualValueCanonical: computed.residualValue,
    monthlyDepreciationCanonical: computed.monthlyDepreciation,
    monthlyLeaseFeeCanonical: computed.monthlyLeaseFee,
    monthlyBasePaymentCanonical: computed.monthlyBasePayment,
    monthlySalesTaxCanonical: computed.monthlySalesTax,
    monthlyLeasePaymentCanonical: computed.monthlyLeasePayment,
    netCapitalizedCost: netFx.amount,
    residualValue: residualFx.amount,
    monthlyDepreciation: depFx.amount,
    monthlyLeaseFee: feeFx.amount,
    monthlyBasePayment: baseFx.amount,
    monthlySalesTax: taxFx.amount,
    monthlyLeasePayment: paymentFx.amount,
    calculationCurrency: calcCurrency,
    netCapCostCurrency: input.netCapCostCurrency,
    residualValueCurrency: input.residualValueCurrency,
    monthlyDepreciationCurrency: input.monthlyDepreciationCurrency,
    monthlyLeaseFeeCurrency: input.monthlyLeaseFeeCurrency,
    monthlyBasePaymentCurrency: input.monthlyBasePaymentCurrency,
    monthlySalesTaxCurrency: input.monthlySalesTaxCurrency,
    monthlyLeasePaymentCurrency: input.monthlyLeasePaymentCurrency,
    formattedNetCapitalizedCost: formatCarLeaseMoney(
      netFx.amount,
      input.netCapCostCurrency
    ),
    formattedResidualValue: formatCarLeaseMoney(
      residualFx.amount,
      input.residualValueCurrency
    ),
    formattedMonthlyDepreciation: formatCarLeaseMoney(
      depFx.amount,
      input.monthlyDepreciationCurrency
    ),
    formattedMonthlyLeaseFee: formatCarLeaseMoney(
      feeFx.amount,
      input.monthlyLeaseFeeCurrency
    ),
    formattedMonthlyBasePayment: formatCarLeaseMoney(
      baseFx.amount,
      input.monthlyBasePaymentCurrency
    ),
    formattedMonthlySalesTax: formatCarLeaseMoney(
      taxFx.amount,
      input.monthlySalesTaxCurrency
    ),
    formattedMonthlyLeasePayment: formatCarLeaseMoney(
      paymentFx.amount,
      input.monthlyLeasePaymentCurrency
    ),
  };

  return { isValid: true, errors, result };
}
