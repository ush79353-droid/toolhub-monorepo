import { calculatePfRatio, fromMmHg, toFraction, toMmHg } from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validatePfRatioInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const ex = calculatePfRatio(createExampleInput());
assert(Math.abs(ex.ratioMmHg - 200) < 1e-9, `ratio ${ex.ratioMmHg}`);
assert(ex.formattedRatio.includes('200'), ex.formattedRatio);

assert(Math.abs(toFraction(40, '%') - 0.4) < 1e-12, 'fio2 %');
assert(Math.abs(toFraction(0.4, 'fraction') - 0.4) < 1e-12, 'fio2 frac');
assert(Math.abs(toMmHg(10, 'kPa') - 10 / 0.133322387415) < 1e-6, 'kPa→mmHg');
assert(Math.abs(fromMmHg(75, 'kPa') - 75 * 0.133322387415) < 1e-6, 'mmHg→kPa');

assert(validatePfRatioInput(createDefaultInput()).result === null, 'blank');
assert(
  validatePfRatioInput({ ...createExampleInput(), fio2: 0 }).result === null,
  'zero FiO2',
);
assert(
  validatePfRatioInput({
    ...createExampleInput(),
    fio2: 21,
    fio2Unit: '%',
  }).result !== null,
  'ambient air',
);

const ambient = calculatePfRatio({
  pao2: 100,
  pao2Unit: 'mmHg',
  fio2: 21,
  fio2Unit: '%',
  resultUnit: 'mmHg',
});
assert(Math.abs(ambient.ratioMmHg - 100 / 0.21) < 1e-9, 'ambient P/F');

console.log('pf-ratio calculation.test.ts: ok');
