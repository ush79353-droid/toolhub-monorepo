import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { parseMoneyInput } from '@/tools/shared/money-value';
import {
  calculateBirthControlCost,
  durationToDays,
  isCycleMethod,
  isLongActingMethod,
  needsCondomFields,
  usageToPerDay,
} from './calculation';
import type {
  BirthControlFieldErrors,
  BirthControlInput,
  BirthControlResult,
} from './types';

function parseNonNeg(raw: string, label: string): number | string {
  const t = raw.trim();
  if (t === '') return `${label} is required.`;
  const n = Number(t);
  if (!Number.isFinite(n)) return `${label} must be a finite number.`;
  if (n < 0) return `${label} cannot be negative.`;
  return n;
}

function parsePositive(raw: string, label: string): number | string {
  const n = parseNonNeg(raw, label);
  if (typeof n === 'string') return n;
  if (n <= 0) return `${label} must be greater than zero.`;
  return n;
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

export function validateBirthControlInput(
  input: BirthControlInput,
  rates: CurrencyRatesSnapshot | null | undefined
):
  | { isValid: true; result: BirthControlResult; errors: BirthControlFieldErrors }
  | {
      isValid: false;
      result: null;
      errors: BirthControlFieldErrors;
    } {
  const errors: BirthControlFieldErrors = {};
  const out = input.resultCurrency;
  const needCondoms = needsCondomFields({
    sex: input.sex,
    femaleMethod: input.femaleMethod,
    maleMethod: input.maleMethod,
    buyCondoms: input.buyCondoms,
  });

  const horizonRaw = parseNonNeg(input.horizon, 'Horizon');
  if (typeof horizonRaw === 'string') errors.horizon = horizonRaw;

  let costPerCycle = 0;
  let longActingPrice = 0;
  let longevityDays = 0;
  let procedureCost = 0;
  let amountInPackage = 0;
  let usagePerDay = 0;
  let pricePerPackage = 0;

  if (input.sex === 'female' && isCycleMethod(input.femaleMethod)) {
    const c = parseNonNeg(input.costPerCycle, 'Cost per cycle');
    if (typeof c === 'string') errors.costPerCycle = c;
    else {
      // Allow money parser for grouped input while still accepting plain Number path.
      const parsed = parseMoneyInput(input.costPerCycle);
      const amount = Number.isFinite(parsed) ? parsed : c;
      const fx = convertMoney(
        amount,
        input.costPerCycleCurrency,
        out,
        rates
      );
      if (!fx.ok) errors.form = fx.message;
      else costPerCycle = fx.amount;
    }
  }

  if (input.sex === 'female' && isLongActingMethod(input.femaleMethod)) {
    const p = parseNonNeg(input.longActingPrice, 'Price');
    if (typeof p === 'string') errors.longActingPrice = p;
    else {
      const fx = convertMoney(p, input.longActingPriceCurrency, out, rates);
      if (!fx.ok) errors.form = fx.message;
      else longActingPrice = fx.amount;
    }
    const lon = parsePositive(input.longevity, 'Longevity');
    if (typeof lon === 'string') errors.longevity = lon;
    else longevityDays = durationToDays(lon, input.longevityUnit);
  }

  const needsProcedure =
    (input.sex === 'female' && input.femaleMethod === 'sterilization') ||
    (input.sex === 'male' && input.maleMethod === 'vasectomy');
  if (needsProcedure) {
    const p = parseNonNeg(input.procedureCost, 'Cost of the procedure');
    if (typeof p === 'string') errors.procedureCost = p;
    else {
      const fx = convertMoney(p, input.procedureCostCurrency, out, rates);
      if (!fx.ok) errors.form = fx.message;
      else procedureCost = fx.amount;
    }
  }

  if (needCondoms) {
    const amt = parsePositive(input.amountInPackage, 'Amount in package');
    if (typeof amt === 'string') errors.amountInPackage = amt;
    else amountInPackage = amt;

    const usage = parseNonNeg(input.condomUsage, 'Condom usage');
    if (typeof usage === 'string') errors.condomUsage = usage;
    else usagePerDay = usageToPerDay(usage, input.condomUsageUnit);

    const pack = parseNonNeg(input.pricePerPackage, 'Price per package');
    if (typeof pack === 'string') errors.pricePerPackage = pack;
    else {
      const fx = convertMoney(pack, input.pricePerPackageCurrency, out, rates);
      if (!fx.ok) errors.form = fx.message;
      else pricePerPackage = fx.amount;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, result: null, errors };
  }

  const horizonDays = durationToDays(
    horizonRaw as number,
    input.horizonUnit
  );

  if (
    input.sex === 'female' &&
    isLongActingMethod(input.femaleMethod) &&
    longevityDays <= 0
  ) {
    return {
      isValid: false,
      result: null,
      errors: { longevity: 'Longevity must be greater than zero.' },
    };
  }

  const result = calculateBirthControlCost({
    sex: input.sex,
    femaleMethod: input.femaleMethod,
    maleMethod: input.maleMethod,
    costPerCycle,
    longActingPrice,
    longevityDays,
    procedureCost,
    buyCondoms: input.buyCondoms,
    amountInPackage,
    usagePerDay,
    pricePerPackage,
    horizonDays,
    currency: out,
  });

  if (!Number.isFinite(result.total)) {
    return {
      isValid: false,
      result: null,
      errors: { form: 'Could not compute a finite total.' },
    };
  }

  return { isValid: true, result, errors: {} };
}
