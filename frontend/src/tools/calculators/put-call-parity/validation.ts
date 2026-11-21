import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePresentValueOfStrike,
  detectSolveTarget,
  formatParityMoney,
  helperTimeToYears,
  parseNumber,
  solvePutCallParity,
  type ParityAmounts,
} from './calculation';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import type {
  PutCallParityFieldErrors,
  PutCallParityInput,
  PutCallParityResult,
  PutCallParitySolveTarget,
} from './types';

export interface PutCallParityValidation {
  isValid: boolean;
  errors: PutCallParityFieldErrors;
  result: PutCallParityResult | null;
}

function parseMoneyField(raw: string): {
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

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined,
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

const TARGET_LABEL: Record<PutCallParitySolveTarget, string> = {
  call: 'European call option price',
  put: 'European put option price',
  pvStrike: 'Present value of strike price',
  spot: 'Spot price of the underlying asset',
};

/**
 * Validates 3-of-4 parity inputs, FX-normalizes into the spot currency
 * (or call currency when spot is the unknown), solves the missing field,
 * and converts the solved amount into that field's display currency.
 */
export function validatePutCallParityInput(
  input: PutCallParityInput,
  rates?: CurrencyRatesSnapshot | null,
): PutCallParityValidation {
  const errors: PutCallParityFieldErrors = {};

  const call = parseMoneyField(input.callPrice);
  const put = parseMoneyField(input.putPrice);
  const pv = parseMoneyField(input.pvStrike);
  const spot = parseMoneyField(input.spotPrice);

  const checkField = (
    parsed: ReturnType<typeof parseMoneyField>,
    key: keyof PutCallParityFieldErrors,
    label: string,
  ) => {
    if (parsed.blank) return;
    if (parsed.invalid || parsed.value === null) {
      errors[key] = `Enter a valid ${label}.`;
    } else if (parsed.value < 0) {
      errors[key] = `${label} cannot be negative.`;
    }
  };

  checkField(call, 'callPrice', 'call price');
  checkField(put, 'putPrice', 'put price');
  checkField(pv, 'pvStrike', 'present value of strike');
  checkField(spot, 'spotPrice', 'spot price');

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const filledCount =
    Number(!call.blank) +
    Number(!put.blank) +
    Number(!pv.blank) +
    Number(!spot.blank);

  if (filledCount < 3) {
    return {
      isValid: false,
      errors: {
        form: 'Enter any three of the four values to solve for the fourth.',
      },
      result: null,
    };
  }
  if (filledCount === 4) {
    return {
      isValid: false,
      errors: {
        form: 'Clear one field — enter exactly three values to solve for the fourth.',
      },
      result: null,
    };
  }

  const target = detectSolveTarget({
    call: call.blank ? null : call.value,
    put: put.blank ? null : put.value,
    pvStrike: pv.blank ? null : pv.value,
    spot: spot.blank ? null : spot.value,
  });
  if (!target) {
    return {
      isValid: false,
      errors: { form: 'Enter exactly three of the four values.' },
      result: null,
    };
  }

  /** Canonical currency: spot when known, else call (or put / pv). */
  const canonicalCurrency: SupportedCurrency =
    target === 'spot'
      ? input.callCurrency
      : input.spotCurrency;

  const toCanonical = (
    amount: number,
    from: SupportedCurrency,
  ): { ok: true; amount: number } | { ok: false; message: string } =>
    convertMoney(amount, from, canonicalCurrency, rates);

  let callC: number | null = null;
  let putC: number | null = null;
  let pvC: number | null = null;
  let spotC: number | null = null;

  if (!call.blank) {
    const fx = toCanonical(call.value!, input.callCurrency);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    callC = fx.amount;
  }
  if (!put.blank) {
    const fx = toCanonical(put.value!, input.putCurrency);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    putC = fx.amount;
  }
  if (!pv.blank) {
    const fx = toCanonical(pv.value!, input.pvStrikeCurrency);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    pvC = fx.amount;
  }
  if (!spot.blank) {
    const fx = toCanonical(spot.value!, input.spotCurrency);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    spotC = fx.amount;
  }

  const amounts: ParityAmounts = {
    call: callC,
    put: putC,
    pvStrike: pvC,
    spot: spotC,
  };

  const solvedCanonical = solvePutCallParity(amounts, target);
  if (solvedCanonical === null) {
    return {
      isValid: false,
      errors: { form: 'Unable to solve put–call parity with these inputs.' },
      result: null,
    };
  }
  if (solvedCanonical < 0) {
    return {
      isValid: false,
      errors: {
        form: `Solved ${TARGET_LABEL[target]} is negative (${formatParityMoney(solvedCanonical, canonicalCurrency)}). Check inputs or currencies.`,
      },
      result: null,
    };
  }

  const displayCurrency: SupportedCurrency =
    target === 'call'
      ? input.callCurrency
      : target === 'put'
        ? input.putCurrency
        : target === 'pvStrike'
          ? input.pvStrikeCurrency
          : input.spotCurrency;

  const solvedFx = convertMoney(
    solvedCanonical,
    canonicalCurrency,
    displayCurrency,
    rates,
  );
  if (!solvedFx.ok) {
    errors.form = solvedFx.message;
    return { isValid: false, errors, result: null };
  }

  const finalCall = callC ?? (target === 'call' ? solvedCanonical : null);
  const finalPut = putC ?? (target === 'put' ? solvedCanonical : null);
  const finalPv = pvC ?? (target === 'pvStrike' ? solvedCanonical : null);
  const finalSpot = spotC ?? (target === 'spot' ? solvedCanonical : null);
  if (
    finalCall === null ||
    finalPut === null ||
    finalPv === null ||
    finalSpot === null
  ) {
    return {
      isValid: false,
      errors: { form: 'Unable to assemble a complete parity set.' },
      result: null,
    };
  }

  const formula =
    target === 'call'
      ? 'C = P + S − PV(K)'
      : target === 'put'
        ? 'P = C + PV(K) − S'
        : target === 'pvStrike'
          ? 'PV(K) = P + S − C'
          : 'S = C + PV(K) − P';

  const formattedSolved = formatParityMoney(solvedFx.amount, displayCurrency);
  const formattedCall = formatParityMoney(
    target === 'call' ? solvedFx.amount : finalCall,
    target === 'call' ? displayCurrency : canonicalCurrency,
  );
  const formattedPut = formatParityMoney(
    target === 'put' ? solvedFx.amount : finalPut,
    target === 'put' ? displayCurrency : canonicalCurrency,
  );
  const formattedPvStrike = formatParityMoney(
    target === 'pvStrike' ? solvedFx.amount : finalPv,
    target === 'pvStrike' ? displayCurrency : canonicalCurrency,
  );
  const formattedSpot = formatParityMoney(
    target === 'spot' ? solvedFx.amount : finalSpot,
    target === 'spot' ? displayCurrency : canonicalCurrency,
  );

  const steps = [
    'Put–call parity (European): C + PV(K) = P + S.',
    `Solving for ${TARGET_LABEL[target]} using ${formula}.`,
    `Canonical currency for the equation: ${canonicalCurrency}.`,
    `Result: ${formattedSolved}.`,
  ];

  const result: PutCallParityResult = {
    solveTarget: target,
    callCanonical: finalCall,
    putCanonical: finalPut,
    pvStrikeCanonical: finalPv,
    spotCanonical: finalSpot,
    solvedAmount: solvedFx.amount,
    solvedCurrency: displayCurrency,
    formattedSolved,
    formattedCall,
    formattedPut,
    formattedPvStrike,
    formattedSpot,
    formulaBreakdown: [
      'C + PV(K) = P + S',
      formula,
      `Solved ${TARGET_LABEL[target]} = ${formattedSolved}`,
    ].join('\n'),
    steps,
    interpretation: `Implied ${TARGET_LABEL[target]} is ${formattedSolved} under put–call parity.`,
    explanation:
      'European put–call parity links call and put prices to the spot and the present value of the strike. Independent field currencies are converted before solving; rates and times in the PV helper never convert.',
    parityCheck: `Check: C + PV(K) = ${formatParityMoney(finalCall + finalPv, canonicalCurrency)}; P + S = ${formatParityMoney(finalPut + finalSpot, canonicalCurrency)}.`,
  };

  return { isValid: true, errors: {}, result };
}

export function applyPvHelperToInput(
  input: PutCallParityInput,
  rates?: CurrencyRatesSnapshot | null,
): {
  ok: true;
  input: PutCallParityInput;
} | {
  ok: false;
  errors: PutCallParityFieldErrors;
} {
  const errors: PutCallParityFieldErrors = {};
  const strike = parseMoneyField(input.helperStrike);
  const rate = parseNumber(input.helperRatePercent);
  const time = parseNumber(input.helperTime);

  if (strike.blank || strike.invalid || strike.value === null) {
    errors.helperStrike = 'Enter a strike price for the PV helper.';
  } else if (strike.value < 0) {
    errors.helperStrike = 'Strike cannot be negative.';
  }
  if (rate === null) {
    errors.helperRatePercent = 'Enter a risk-free rate (%).';
  }
  if (time === null) {
    errors.helperTime = 'Enter time to expiration.';
  } else if (time < 0) {
    errors.helperTime = 'Time cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const years = helperTimeToYears(time!, input.helperTimeUnit);
  const pv = calculatePresentValueOfStrike(
    strike.value!,
    rate! / 100,
    years,
  );
  if (pv === null) {
    return {
      ok: false,
      errors: { helperStrike: 'Unable to compute PV(K) with these inputs.' },
    };
  }

  const fx = convertMoney(
    pv,
    input.helperStrikeCurrency,
    input.pvStrikeCurrency,
    rates,
  );
  if (!fx.ok) {
    return { ok: false, errors: { form: fx.message } };
  }

  return {
    ok: true,
    input: {
      ...input,
      pvStrike: moneyAmountToInputString(fx.amount),
    },
  };
}
