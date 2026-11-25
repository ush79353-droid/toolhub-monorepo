import {
  calculateFalaschettiPredictedPercent,
  calculateHankinsonPredictedPercent,
  calculateRealRatio,
} from './calculation';
import {
  createDefaultInput,
  createExampleAmericanPredictionInput,
  createExampleRealInput,
} from './types';
import { validateFev1FvcInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(Math.abs(calculateRealRatio(3, 4, 'L') - 75) < 1e-9, '3/4 L → 75%');
assert(
  Math.abs(calculateRealRatio(3000, 4000, 'mL') - 75) < 1e-9,
  'mL units → 75%',
);

const hank = calculateHankinsonPredictedPercent('male', 'caucasian', 40);
assert(Math.abs(hank - (88.066 - 0.2066 * 40)) < 1e-9, 'Hankinson male 40');

const fal = calculateFalaschettiPredictedPercent('female', 40, 165);
const expectedFal =
  100 *
  Math.exp(
    1.15822 - 0.00415 * 40 + 0.00002 * 40 * 40 - 0.23815 * Math.log(165),
  );
assert(Math.abs(fal - expectedFal) < 1e-9, 'Falaschetti female 40/165');

assert(validateFev1FvcInput(createDefaultInput()).result === null, 'blank');
assert(
  validateFev1FvcInput(createExampleRealInput()).result?.ratioPercent === 75,
  'example real',
);
assert(
  validateFev1FvcInput({
    ...createExampleRealInput(),
    fvc: 0,
  }).result === null,
  'FVC zero',
);
assert(
  validateFev1FvcInput({
    ...createExampleAmericanPredictionInput(),
    ageYears: null,
  }).result === null,
  'missing age',
);

console.log('fev1-fvc-ratio calculation.test.ts: ok');
