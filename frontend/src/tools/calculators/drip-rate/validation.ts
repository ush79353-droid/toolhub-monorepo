import { calculateDripRate, parseNumber } from './calculation';
import type {
  DripRateFieldErrors,
  DripRateInput,
  DripRateResult,
} from './types';

export interface DripRateValidation {
  errors: DripRateFieldErrors;
  result: DripRateResult | null;
  writeBack: ReturnType<typeof calculateDripRate>['writeBack'];
}

function checkNonNegativeOptional(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be positive.`;
  return undefined;
}

export function validateDripRateInput(
  input: DripRateInput,
): DripRateValidation {
  const errors: DripRateFieldErrors = {};

  const doseErr = checkNonNegativeOptional(input.doseText, 'desired dose');
  if (doseErr) errors.doseText = doseErr;

  const weightErr = checkNonNegativeOptional(input.weightText, 'body weight');
  if (weightErr) errors.weightText = weightErr;

  const concErr = checkNonNegativeOptional(
    input.concentrationText,
    'concentration',
  );
  if (concErr) errors.concentrationText = concErr;

  const bagErr = checkNonNegativeOptional(input.bagVolumeText, 'bag volume');
  if (bagErr) errors.bagVolumeText = bagErr;

  const drugErr = checkNonNegativeOptional(input.drugInBagText, 'drug in bag');
  if (drugErr) errors.drugInBagText = drugErr;

  const dripErr = checkNonNegativeOptional(input.dripRateText, 'drip rate');
  if (dripErr) errors.dripRateText = dripErr;

  const dropErr = checkNonNegativeOptional(input.dropFactorText, 'drop factor');
  if (dropErr) errors.dropFactorText = dropErr;

  const flowErr = checkNonNegativeOptional(input.flowRateText, 'flow rate');
  if (flowErr) errors.flowRateText = flowErr;

  const durErr = checkNonNegativeOptional(
    input.bagDurationText,
    'time to end bag',
  );
  if (durErr) errors.bagDurationText = durErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null, writeBack: {} };
  }

  const { result, writeBack } = calculateDripRate(input);
  return { errors: {}, result, writeBack };
}
