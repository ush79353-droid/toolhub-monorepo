import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateRentVsBuy,
  durationToMonths,
  formatRentVsBuyMoney,
  fromMonthlyCost,
  toMonthlyRent,
} from './calculation';
import type {
  RentVsBuyFieldErrors,
  RentVsBuyInput,
  RentVsBuyResult,
} from './types';

export interface RentVsBuyValidation {
  isValid: boolean;
  errors: RentVsBuyFieldErrors;
  result: RentVsBuyResult | null;
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
 * Normalize all money into moneyCurrency (calc currency), compute totals at full
 * precision, then FX each money result into its display currency. Percentages
 * and durations are never currency-converted.
 */
export function validateRentVsBuyInput(
  input: RentVsBuyInput,
  rates?: CurrencyRatesSnapshot | null
): RentVsBuyValidation {
  const errors: RentVsBuyFieldErrors = {};

  const staying = parseNumber(input.stayingPeriod);
  const money = parseNumber(input.moneyYouHave);
  const rent = parseNumber(input.rentPrice);
  const agent = parseNumber(input.agentCommission);
  const otherRent = parseNumber(input.otherRentCosts);
  const depositRate = parseNumber(input.depositInterestPercent);
  const property = parseNumber(input.propertyCost);
  const mortRate = parseNumber(input.mortgageRatePercent);
  const loanTerm = parseNumber(input.loanTerm);
  const buyComm = parseNumber(input.buyingCommissionPercent);
  const sellComm = parseNumber(input.sellingCommissionPercent);
  const otherFees = parseNumber(input.otherFeesPercent);
  const appreciation = parseNumber(input.appreciationPercent);

  const requireNonNeg = (
    parsed: ReturnType<typeof parseNumber>,
    key: keyof RentVsBuyFieldErrors,
    label: string,
    allowBlank = false
  ) => {
    if (parsed.blank) {
      if (!allowBlank) errors[key] = `Enter ${label}.`;
      return;
    }
    if (parsed.invalid || parsed.value === null) {
      errors[key] = `Enter a valid ${label}.`;
      return;
    }
    if (parsed.value < 0) errors[key] = `${label} cannot be negative.`;
  };

  if (staying.blank) errors.stayingPeriod = 'Enter a staying period.';
  else if (staying.invalid || staying.value === null) {
    errors.stayingPeriod = 'Enter a valid staying period.';
  } else if (!(staying.value > 0)) {
    errors.stayingPeriod = 'Staying period must be greater than zero.';
  }

  requireNonNeg(money, 'moneyYouHave', 'money you have');
  requireNonNeg(rent, 'rentPrice', 'rent price');
  requireNonNeg(agent, 'agentCommission', 'agent commission');
  requireNonNeg(otherRent, 'otherRentCosts', 'other costs');
  requireNonNeg(depositRate, 'depositInterestPercent', 'deposit interest rate');
  requireNonNeg(property, 'propertyCost', 'property cost');
  requireNonNeg(mortRate, 'mortgageRatePercent', 'mortgage interest rate');
  if (loanTerm.blank) errors.loanTerm = 'Enter a loan term.';
  else if (loanTerm.invalid || loanTerm.value === null) {
    errors.loanTerm = 'Enter a valid loan term.';
  } else if (!(loanTerm.value > 0)) {
    errors.loanTerm = 'Loan term must be greater than zero.';
  }
  requireNonNeg(buyComm, 'buyingCommissionPercent', 'buying commission');
  requireNonNeg(sellComm, 'sellingCommissionPercent', 'realtor commission');
  requireNonNeg(otherFees, 'otherFeesPercent', 'other fees');
  requireNonNeg(appreciation, 'appreciationPercent', 'appreciation');

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const stayingMonths = durationToMonths(staying.value!, input.stayingUnit);
  if (stayingMonths === null || !(stayingMonths > 0)) {
    errors.stayingPeriod = 'Enter a valid staying period.';
    return { isValid: false, errors, result: null };
  }

  const loanTermMonths = durationToMonths(loanTerm.value!, input.loanTermUnit);
  if (loanTermMonths === null || !(loanTermMonths > 0)) {
    errors.loanTerm = 'Enter a valid loan term.';
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.moneyCurrency;

  const moneyNorm = money.value!;
  const rentConverted = convertMoney(
    rent.value!,
    input.rentCurrency,
    calcCurrency,
    rates
  );
  if (!rentConverted.ok) {
    errors.form = rentConverted.message;
    return { isValid: false, errors, result: null };
  }
  const monthlyRent = toMonthlyRent(rentConverted.amount, input.rentFrequency);
  if (monthlyRent === null) {
    errors.rentPrice = 'Enter a valid rent price.';
    return { isValid: false, errors, result: null };
  }

  const agentConverted = convertMoney(
    agent.value!,
    input.agentCommissionCurrency,
    calcCurrency,
    rates
  );
  if (!agentConverted.ok) {
    errors.form = agentConverted.message;
    return { isValid: false, errors, result: null };
  }

  const otherRentConverted = convertMoney(
    otherRent.value!,
    input.otherRentCostsCurrency,
    calcCurrency,
    rates
  );
  if (!otherRentConverted.ok) {
    errors.form = otherRentConverted.message;
    return { isValid: false, errors, result: null };
  }

  const propertyConverted = convertMoney(
    property.value!,
    input.propertyCurrency,
    calcCurrency,
    rates
  );
  if (!propertyConverted.ok) {
    errors.form = propertyConverted.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateRentVsBuy({
    stayingMonths,
    moneyYouHave: moneyNorm,
    monthlyRent,
    agentCommission: agentConverted.amount,
    otherRentCosts: otherRentConverted.amount,
    depositInterestPercent: depositRate.value!,
    propertyCost: propertyConverted.amount,
    mortgageRatePercent: mortRate.value!,
    loanTermMonths,
    buyingCommissionPercent: buyComm.value!,
    sellingCommissionPercent: sellComm.value!,
    otherFeesPercent: otherFees.value!,
    appreciationPercent: appreciation.value!,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite rent-vs-buy result.';
    return { isValid: false, errors, result: null };
  }

  const rentPeriodic = fromMonthlyCost(
    computed.rentCostMonthly,
    input.rentCostFrequency
  );
  const buyPeriodic = fromMonthlyCost(
    computed.buyCostMonthly,
    input.buyCostFrequency
  );
  if (rentPeriodic === null || buyPeriodic === null) {
    errors.form = 'This combination does not produce a finite periodic cost.';
    return { isValid: false, errors, result: null };
  }

  const rentCostDisplay = convertMoney(
    rentPeriodic,
    calcCurrency,
    input.rentCostCurrency,
    rates
  );
  if (!rentCostDisplay.ok) {
    errors.form = rentCostDisplay.message;
    return { isValid: false, errors, result: null };
  }
  const totalRentDisplay = convertMoney(
    computed.totalRentCost,
    calcCurrency,
    input.totalRentCostCurrency,
    rates
  );
  if (!totalRentDisplay.ok) {
    errors.form = totalRentDisplay.message;
    return { isValid: false, errors, result: null };
  }
  const mortLeftDisplay = convertMoney(
    computed.mortgageLeft,
    calcCurrency,
    input.mortgageLeftCurrency,
    rates
  );
  if (!mortLeftDisplay.ok) {
    errors.form = mortLeftDisplay.message;
    return { isValid: false, errors, result: null };
  }
  const buyCostDisplay = convertMoney(
    buyPeriodic,
    calcCurrency,
    input.buyCostCurrency,
    rates
  );
  if (!buyCostDisplay.ok) {
    errors.form = buyCostDisplay.message;
    return { isValid: false, errors, result: null };
  }
  const totalBuyDisplay = convertMoney(
    computed.totalBuyCost,
    calcCurrency,
    input.totalBuyCostCurrency,
    rates
  );
  if (!totalBuyDisplay.ok) {
    errors.form = totalBuyDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: RentVsBuyResult = {
    stayingMonths,
    monthlyRent,
    depositInterestEarned: computed.depositInterestEarned,
    totalRentCost: computed.totalRentCost,
    rentCostPeriodic: rentPeriodic,
    loanAmount: computed.loanAmount,
    monthlyMortgagePayment: computed.monthlyMortgagePayment,
    mortgageLeft: computed.mortgageLeft,
    futurePropertyValue: computed.futurePropertyValue,
    buyingCommissionAmount: computed.buyingCommissionAmount,
    sellingCommissionAmount: computed.sellingCommissionAmount,
    otherFeesTotal: computed.otherFeesTotal,
    totalMortgagePayments: computed.totalMortgagePayments,
    totalBuyCost: computed.totalBuyCost,
    buyCostPeriodic: buyPeriodic,
    calcCurrency,
    rentCostDisplay: rentCostDisplay.amount,
    totalRentCostDisplay: totalRentDisplay.amount,
    mortgageLeftDisplay: mortLeftDisplay.amount,
    buyCostDisplay: buyCostDisplay.amount,
    totalBuyCostDisplay: totalBuyDisplay.amount,
    formattedRentCost: formatRentVsBuyMoney(
      rentCostDisplay.amount,
      input.rentCostCurrency
    ),
    formattedTotalRentCost: formatRentVsBuyMoney(
      totalRentDisplay.amount,
      input.totalRentCostCurrency
    ),
    formattedMortgageLeft: formatRentVsBuyMoney(
      mortLeftDisplay.amount,
      input.mortgageLeftCurrency
    ),
    formattedBuyCost: formatRentVsBuyMoney(
      buyCostDisplay.amount,
      input.buyCostCurrency
    ),
    formattedTotalBuyCost: formatRentVsBuyMoney(
      totalBuyDisplay.amount,
      input.totalBuyCostCurrency
    ),
    preferBuy: computed.totalBuyCost < computed.totalRentCost,
  };

  return { isValid: true, errors: {}, result };
}
