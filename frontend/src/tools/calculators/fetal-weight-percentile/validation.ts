import {
  calculateFetalWeightPercentile,
  parseOptionalNumber,
  toCm,
} from './calculation';
import type {
  FetalWeightPercentileFieldErrors,
  FetalWeightPercentileInput,
  FetalWeightPercentileResult,
} from './types';

export interface FetalWeightPercentileValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: FetalWeightPercentileFieldErrors;
  result: FetalWeightPercentileResult | null;
}

export function validateFetalWeightPercentileInput(
  input: FetalWeightPercentileInput,
): FetalWeightPercentileValidation {
  const errors: FetalWeightPercentileFieldErrors = {};
  const weeksRaw = input.weeks.trim();
  const acRaw = input.ac.trim();
  const hcRaw = input.hc.trim();
  const bpdRaw = input.bpd.trim();
  const flRaw = input.fl.trim();

  const incomplete =
    weeksRaw === '' ||
    acRaw === '' ||
    hcRaw === '' ||
    bpdRaw === '' ||
    flRaw === '';
  if (incomplete) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const weeks = parseOptionalNumber(weeksRaw);
  const ac = parseOptionalNumber(acRaw);
  const hc = parseOptionalNumber(hcRaw);
  const bpd = parseOptionalNumber(bpdRaw);
  const fl = parseOptionalNumber(flRaw);

  if (weeks === null || !Number.isInteger(weeks) || weeks < 1 || weeks > 45) {
    errors.weeks = 'Enter whole weeks from 1 to 45.';
  }
  if (ac === null || !(ac > 0)) errors.ac = 'Enter abdominal circumference > 0.';
  if (hc === null || !(hc > 0)) errors.hc = 'Enter head circumference > 0.';
  if (bpd === null || !(bpd > 0)) errors.bpd = 'Enter biparietal diameter > 0.';
  if (fl === null || !(fl > 0)) errors.fl = 'Enter femur length > 0.';

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateFetalWeightPercentile({
    sex: input.sex,
    weeks: weeks!,
    acCm: toCm(ac!, input.lengthUnit),
    hcCm: toCm(hc!, input.lengthUnit),
    bpdCm: toCm(bpd!, input.lengthUnit),
    flCm: toCm(fl!, input.lengthUnit),
    resultWeightUnit: input.resultWeightUnit,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Could not estimate fetal weight.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
