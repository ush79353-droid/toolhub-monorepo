import { isValidIsoDate } from '../due-date/calculation';
import { calculateImplantation, parseCycleLength } from './calculation';
import type {
  ImplantationFieldErrors,
  ImplantationInput,
  ImplantationResult,
} from './types';

export interface ImplantationValidation {
  isValid: boolean;
  errors: ImplantationFieldErrors;
  result: ImplantationResult | null;
}

export function validateImplantationInput(
  input: ImplantationInput,
): ImplantationValidation {
  const errors: ImplantationFieldErrors = {};
  const { natural, ivf } = input;

  if (natural.knowsOvulation === 'yes') {
    if (natural.ovulationIso && !isValidIsoDate(natural.ovulationIso)) {
      errors.naturalOvulation = 'Enter a valid ovulation date.';
    }
  } else {
    const cycle = parseCycleLength(natural.cycleLengthDaysText);
    if (natural.cycleLengthDaysText && cycle === 'invalid') {
      errors.naturalCycle = 'Cycle length must be 21–45 whole days.';
    }
    if (natural.lastPeriodIso && !isValidIsoDate(natural.lastPeriodIso)) {
      errors.naturalLmp = 'Enter a valid last period date.';
    }
  }

  if (ivf.transferIso && !isValidIsoDate(ivf.transferIso)) {
    errors.ivfTransfer = 'Enter a valid IVF transfer date.';
  }

  const hasNaturalPartial =
    natural.knowsOvulation === 'yes'
      ? Boolean(natural.ovulationIso)
      : Boolean(natural.lastPeriodIso) || Boolean(natural.cycleLengthDaysText);
  const hasIvfPartial = Boolean(ivf.transferIso);

  if (!hasNaturalPartial && !hasIvfPartial) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateImplantation(input);
  const hasOutput = result.natural.ready || result.ivf.ready;
  if (!hasOutput) {
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}