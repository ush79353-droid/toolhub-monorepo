import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateBlackScholes,
  formatBlackScholesMoney,
  timeToYears,
} from './calculation';
import type {
  BlackScholesFieldErrors,
  BlackScholesInput,
  BlackScholesResult,
} from './types';
import { TIME_UNIT_LABELS } from './types';

export interface BlackScholesValidation {
  isValid: boolean;
  errors: BlackScholesFieldErrors;
  result: BlackScholesResult | null;
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

function fmtPct(n: number): string {
  return `${(n * 100).toLocaleString('en-US', {
    maximumFractionDigits: 6,
  })}%`;
}

/**
 * Validates inputs, FX-normalizes strike into the stock currency, prices the
 * European call/put, then FX-converts results into independent display currencies.
 * Yields, volatility, rates, and time units never convert.
 */
export function validateBlackScholesInput(
  input: BlackScholesInput,
  rates?: CurrencyRatesSnapshot | null
): BlackScholesValidation {
  const errors: BlackScholesFieldErrors = {};

  const stock = parseNumber(input.stockPrice);
  const strike = parseNumber(input.strikePrice);
  const time = parseNumber(input.timeToMaturity);
  const qPct = parseNumber(input.dividendYieldPercent);
  const volPct = parseNumber(input.volatilityPercent);
  const rPct = parseNumber(input.riskFreeRatePercent);

  if (!stock.blank && (stock.invalid || stock.value === null)) {
    errors.stockPrice = 'Enter a valid current stock price.';
  } else if (stock.value !== null && stock.value <= 0) {
    errors.stockPrice = 'Current stock price must be greater than zero.';
  }

  if (!strike.blank && (strike.invalid || strike.value === null)) {
    errors.strikePrice = 'Enter a valid strike price.';
  } else if (strike.value !== null && strike.value <= 0) {
    errors.strikePrice = 'Strike price must be greater than zero.';
  }

  if (!time.blank && (time.invalid || time.value === null)) {
    errors.timeToMaturity = 'Enter a valid time to maturity.';
  } else if (time.value !== null && time.value < 0) {
    errors.timeToMaturity = 'Time to maturity cannot be negative.';
  }

  if (!qPct.blank && (qPct.invalid || qPct.value === null)) {
    errors.dividendYieldPercent = 'Enter a valid dividend yield.';
  }

  if (!volPct.blank && (volPct.invalid || volPct.value === null)) {
    errors.volatilityPercent = 'Enter a valid volatility.';
  } else if (volPct.value !== null && volPct.value < 0) {
    errors.volatilityPercent = 'Volatility cannot be negative.';
  }

  if (!rPct.blank && (rPct.invalid || rPct.value === null)) {
    errors.riskFreeRatePercent = 'Enter a valid risk-free interest rate.';
  }

  const incomplete =
    stock.blank ||
    strike.blank ||
    time.blank ||
    qPct.blank ||
    volPct.blank ||
    rPct.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const stockCanonical = stock.value!;
  const strikeFx = convertMoney(
    strike.value!,
    input.strikeCurrency,
    input.stockCurrency,
    rates
  );
  if (!strikeFx.ok) {
    errors.form = strikeFx.message;
    return { isValid: false, errors, result: null };
  }

  const timeYears = timeToYears(time.value!, input.timeUnit);
  if (!Number.isFinite(timeYears) || timeYears < 0) {
    errors.timeToMaturity = 'Time to maturity must convert to a valid year value.';
    return { isValid: false, errors, result: null };
  }

  const dividendYield = qPct.value! / 100;
  const volatility = volPct.value! / 100;
  const riskFreeRate = rPct.value! / 100;

  const priced = calculateBlackScholes({
    stock: stockCanonical,
    strike: strikeFx.amount,
    timeYears,
    dividendYield,
    volatility,
    riskFreeRate,
  });

  if (priced === null) {
    errors.form = 'This combination does not produce a finite option price.';
    return { isValid: false, errors, result: null };
  }

  const callFx = convertMoney(
    priced.call,
    input.stockCurrency,
    input.callCurrency,
    rates
  );
  if (!callFx.ok) {
    errors.form = callFx.message;
    return { isValid: false, errors, result: null };
  }

  const putFx = convertMoney(
    priced.put,
    input.stockCurrency,
    input.putCurrency,
    rates
  );
  if (!putFx.ok) {
    errors.form = putFx.message;
    return { isValid: false, errors, result: null };
  }

  const steps: string[] = [];
  steps.push(
    `Normalize strike into ${input.stockCurrency}: K = ${formatBlackScholesMoney(strikeFx.amount, input.stockCurrency)}.`
  );
  steps.push(
    `T = ${time.value} ${TIME_UNIT_LABELS[input.timeUnit]} → ${timeYears.toLocaleString('en-US', { maximumFractionDigits: 8 })} years.`
  );
  steps.push(
    `q = ${fmtPct(dividendYield)}, σ = ${fmtPct(volatility)}, r = ${fmtPct(riskFreeRate)}.`
  );
  if (priced.d1 != null && priced.d2 != null) {
    steps.push(
      `d₁ = ${priced.d1.toLocaleString('en-US', { maximumFractionDigits: 6 })}, d₂ = ${priced.d2.toLocaleString('en-US', { maximumFractionDigits: 6 })}.`
    );
    steps.push(
      'Call = S e^(−qT) N(d₁) − K e^(−rT) N(d₂); Put = K e^(−rT) N(−d₂) − S e^(−qT) N(−d₁).'
    );
  } else if (priced.boundaryNote) {
    steps.push(priced.boundaryNote);
  }

  const formulaBreakdown =
    priced.d1 != null
      ? 'Black–Scholes–Merton with continuous dividend yield q.'
      : priced.boundaryNote ?? 'Boundary Black–Scholes price.';

  const result: BlackScholesResult = {
    stockCanonical,
    strikeCanonical: strikeFx.amount,
    timeYears,
    dividendYield,
    volatility,
    riskFreeRate,
    d1: priced.d1,
    d2: priced.d2,
    callCanonical: priced.call,
    putCanonical: priced.put,
    call: callFx.amount,
    put: putFx.amount,
    stockCurrency: input.stockCurrency,
    strikeCurrency: input.strikeCurrency,
    callCurrency: input.callCurrency,
    putCurrency: input.putCurrency,
    formattedCall: formatBlackScholesMoney(callFx.amount, input.callCurrency),
    formattedPut: formatBlackScholesMoney(putFx.amount, input.putCurrency),
    formulaBreakdown,
    steps,
    interpretation:
      priced.call >= priced.put
        ? 'Call is at least as valuable as the put under these inputs (common for ATM/ITM calls when carry is favorable).'
        : 'Put is more valuable than the call under these inputs (common when the strike sits above the forward).',
    explanation:
      'European call and put prices under Black–Scholes–Merton with continuous compounding and continuous dividend yield. Independent FX selectors convert monetary inputs/outputs; percentages and time units never convert.',
    boundaryNote: priced.boundaryNote,
  };

  return { isValid: true, errors, result };
}
