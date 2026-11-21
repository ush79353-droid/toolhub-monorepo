import {
  buildMpcPresentation,
  calculateMPC,
} from './calculation';
import type { MpcFieldErrors, MpcInput, MpcResult } from './types';

export interface MpcValidation {
  isValid: boolean;
  errors: MpcFieldErrors;
  result: MpcResult | null;
}

function parseNumber(
  raw: string,
  opts: { allowNegative: boolean }
): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  negative: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, negative: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  if (!opts.allowNegative && value < 0) {
    return { value: null, blank: false, invalid: false, negative: true };
  }
  return { value, blank: false, invalid: false, negative: false };
}

export function validateMpcInput(input: MpcInput): MpcValidation {
  const errors: MpcFieldErrors = {};

  const deltaY = parseNumber(input.changeInDisposableIncome, {
    allowNegative: true,
  });
  const deltaC = parseNumber(input.changeInConsumption, {
    allowNegative: true,
  });
  const mpcDirect = parseNumber(input.mpcDirect, { allowNegative: true });
  const auto = parseNumber(input.autonomousConsumption, {
    allowNegative: false,
  });
  const yd = parseNumber(input.disposableIncome, { allowNegative: false });

  if (auto.blank) errors.autonomousConsumption = 'Enter autonomous consumption.';
  else if (auto.invalid || auto.value === null)
    errors.autonomousConsumption = 'Enter a valid autonomous consumption.';
  else if (auto.negative)
    errors.autonomousConsumption = 'Autonomous consumption cannot be negative.';

  if (yd.blank) errors.disposableIncome = 'Enter disposable income.';
  else if (yd.invalid || yd.value === null)
    errors.disposableIncome = 'Enter a valid disposable income.';
  else if (yd.negative)
    errors.disposableIncome = 'Disposable income cannot be negative.';

  let mpc: number | null = null;
  let mpcUndefinedReason: string | null = null;
  let changeInDisposableIncome: number | null = null;
  let changeInConsumption: number | null = null;

  if (input.mode === 'from-changes') {
    if (deltaY.blank)
      errors.changeInDisposableIncome = 'Enter the change in disposable income.';
    else if (deltaY.invalid || deltaY.value === null)
      errors.changeInDisposableIncome =
        'Enter a valid change in disposable income.';

    if (deltaC.blank)
      errors.changeInConsumption = 'Enter the change in consumer spending.';
    else if (deltaC.invalid || deltaC.value === null)
      errors.changeInConsumption = 'Enter a valid change in consumer spending.';

    if (
      !errors.changeInDisposableIncome &&
      !errors.changeInConsumption &&
      deltaY.value != null &&
      deltaC.value != null
    ) {
      changeInDisposableIncome = deltaY.value;
      changeInConsumption = deltaC.value;
      if (deltaY.value === 0) {
        mpcUndefinedReason =
          'MPC is undefined when the change in disposable income is zero.';
        errors.changeInDisposableIncome = mpcUndefinedReason;
      } else {
        mpc = calculateMPC(deltaC.value, deltaY.value);
      }
    }
  } else {
    if (mpcDirect.blank) errors.mpcDirect = 'Enter MPC.';
    else if (mpcDirect.invalid || mpcDirect.value === null)
      errors.mpcDirect = 'Enter a valid MPC.';
    else mpc = mpcDirect.value;
  }

  if (Object.keys(errors).length > 0 || mpc == null) {
    return {
      isValid: false,
      errors: {
        ...errors,
        ...(mpcUndefinedReason && !errors.changeInDisposableIncome
          ? { changeInDisposableIncome: mpcUndefinedReason }
          : {}),
      },
      result: null,
    };
  }

  if (auto.value == null || yd.value == null) {
    return { isValid: false, errors, result: null };
  }

  const presentation = buildMpcPresentation({
    currency: input.currency,
    changeInDisposableIncome,
    changeInConsumption,
    mpc,
    autonomousConsumption: auto.value,
    disposableIncome: yd.value,
    mpcFromChanges: input.mode === 'from-changes',
  });

  const result: MpcResult = {
    mode: input.mode,
    currency: input.currency,
    changeInDisposableIncome,
    changeInConsumption,
    mpcUndefinedReason: null,
    autonomousConsumption: auto.value,
    disposableIncome: yd.value,
    ...presentation,
  };

  return { isValid: true, errors: {}, result };
}
