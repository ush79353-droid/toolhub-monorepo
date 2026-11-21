import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePointValue,
  calculatePointsDifference,
  calculatePositionProfitLoss,
  formatFuturesMoney,
  formatFuturesPoints,
} from './calculation';
import {
  FUTURES_CONTRACT_OPTIONS,
  type FuturesContractsFieldErrors,
  type FuturesContractsInput,
  type FuturesContractsResult,
} from './types';

export interface FuturesContractsValidation {
  isValid: boolean;
  errors: FuturesContractsFieldErrors;
  result: FuturesContractsResult | null;
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
 * Point value = tick × ticks/point (tick currency).
 * Points = sell − buy (quote points).
 * Long P/L = points × point value × contracts; Short = −Long.
 * Independent FX on tick / point-value display / P/L display.
 */
export function validateFuturesContractsInput(
  input: FuturesContractsInput,
  rates?: CurrencyRatesSnapshot | null
): FuturesContractsValidation {
  const errors: FuturesContractsFieldErrors = {};

  const tick = parseNumber(input.tickValue);
  const ticksPerPoint = parseNumber(input.ticksPerPoint);
  const buy = parseNumber(input.buyingPrice);
  const sell = parseNumber(input.sellingPrice);
  const contracts = parseNumber(input.numberOfContracts);

  if (!tick.blank && (tick.invalid || tick.value === null)) {
    errors.tickValue = 'Enter a valid tick value.';
  } else if (tick.value !== null && tick.value < 0) {
    errors.tickValue = 'Tick value cannot be negative.';
  }

  if (!ticksPerPoint.blank && (ticksPerPoint.invalid || ticksPerPoint.value === null)) {
    errors.ticksPerPoint = 'Enter a valid ticks-per-point value.';
  } else if (ticksPerPoint.value !== null && ticksPerPoint.value <= 0) {
    errors.ticksPerPoint = 'Ticks per point must be greater than zero.';
  }

  if (!buy.blank && (buy.invalid || buy.value === null)) {
    errors.buyingPrice = 'Enter a valid buying contract price.';
  }

  if (!sell.blank && (sell.invalid || sell.value === null)) {
    errors.sellingPrice = 'Enter a valid selling contract price.';
  }

  if (!contracts.blank && (contracts.invalid || contracts.value === null)) {
    errors.numberOfContracts = 'Enter a valid number of contracts.';
  } else if (contracts.value !== null && contracts.value < 0) {
    errors.numberOfContracts = 'Number of contracts cannot be negative.';
  } else if (
    contracts.value !== null &&
    !Number.isInteger(contracts.value)
  ) {
    errors.numberOfContracts = 'Number of contracts must be a whole number.';
  }

  const incomplete =
    tick.blank ||
    ticksPerPoint.blank ||
    buy.blank ||
    sell.blank ||
    contracts.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const pointValue = calculatePointValue({
    tickValue: tick.value!,
    ticksPerPoint: ticksPerPoint.value!,
  });
  if (pointValue === null) {
    errors.form = 'Tick value and ticks per point do not produce a finite point value.';
    return { isValid: false, errors, result: null };
  }

  const numberOfPoints = calculatePointsDifference({
    buyingPrice: buy.value!,
    sellingPrice: sell.value!,
  });
  if (numberOfPoints === null) {
    errors.form = 'Buying and selling prices do not produce a finite point difference.';
    return { isValid: false, errors, result: null };
  }

  const pl = calculatePositionProfitLoss({
    numberOfPoints,
    pointValue,
    numberOfContracts: contracts.value!,
  });
  if (pl === null) {
    errors.form = 'This combination does not produce a finite profit or loss.';
    return { isValid: false, errors, result: null };
  }

  const profitLossCanonical =
    input.tradingDirection === 'long' ? pl.longProfitLoss : pl.shortProfitLoss;

  const pointFx = convertMoney(
    pointValue,
    input.tickValueCurrency,
    input.pointValueCurrency,
    rates
  );
  if (!pointFx.ok) {
    errors.form = pointFx.message;
    return { isValid: false, errors, result: null };
  }

  const plFx = convertMoney(
    profitLossCanonical,
    input.tickValueCurrency,
    input.profitLossCurrency,
    rates
  );
  if (!plFx.ok) {
    errors.form = plFx.message;
    return { isValid: false, errors, result: null };
  }

  const contractLabel =
    FUTURES_CONTRACT_OPTIONS.find((o) => o.id === input.futuresContract)
      ?.label ?? input.futuresContract;

  const steps = [
    `Point value = ${formatFuturesMoney(tick.value!, input.tickValueCurrency)} × ${ticksPerPoint.value} = ${formatFuturesMoney(pointValue, input.tickValueCurrency)} (${input.tickValueCurrency}).`,
    `Number of points = ${sell.value} − ${buy.value} = ${formatFuturesPoints(numberOfPoints)}.`,
    input.tradingDirection === 'long'
      ? `Long P/L = ${formatFuturesPoints(numberOfPoints)} × ${formatFuturesMoney(pointValue, input.tickValueCurrency)} × ${contracts.value} = ${formatFuturesMoney(profitLossCanonical, input.tickValueCurrency)}.`
      : `Short P/L = −(points × point value × contracts) = ${formatFuturesMoney(profitLossCanonical, input.tickValueCurrency)}.`,
  ];

  const result: FuturesContractsResult = {
    tradingDirection: input.tradingDirection,
    contractLabel,
    tickValueCanonical: tick.value!,
    ticksPerPoint: ticksPerPoint.value!,
    pointValueCanonical: pointValue,
    pointValueDisplayed: pointFx.amount,
    numberOfPoints,
    profitLossCanonical,
    profitLossDisplayed: plFx.amount,
    numberOfContracts: contracts.value!,
    tickValueCurrency: input.tickValueCurrency,
    pointValueCurrency: input.pointValueCurrency,
    profitLossCurrency: input.profitLossCurrency,
    formattedTickValue: formatFuturesMoney(tick.value!, input.tickValueCurrency),
    formattedPointValue: formatFuturesMoney(
      pointFx.amount,
      input.pointValueCurrency
    ),
    formattedNumberOfPoints: formatFuturesPoints(numberOfPoints),
    formattedProfitLoss: formatFuturesMoney(
      plFx.amount,
      input.profitLossCurrency
    ),
    formulaBreakdown:
      'Point value = tick × ticks/point. Points = sell − buy. Long P/L = points × point value × contracts; short reverses the sign.',
    steps,
    interpretation:
      profitLossCanonical > 0
        ? 'Position is in profit under these prices.'
        : profitLossCanonical < 0
          ? 'Position is in loss under these prices.'
          : 'Position breaks even under these prices.',
    explanation:
      'Contract ticks/point presets come from the shared futures catalog (ES/MES/NQ/YM/CL/GC). Tick money amounts use independent Phase 2 FX for point-value and P/L display currencies.',
  };

  return { isValid: true, errors, result };
}
