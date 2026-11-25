import { calculateMeanAirwayPressure } from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateMeanAirwayPressureInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const ex = calculateMeanAirwayPressure(createExampleInput());
assert(Math.abs(ex.meanAirwayPressure - 10) < 1e-9, `Pmean ${ex.meanAirwayPressure}`);
assert(Math.abs(ex.dutyFraction - 0.25) < 1e-9, 'duty');

assert(validateMeanAirwayPressureInput(createDefaultInput()).result === null, 'blank');

const tiOver = validateMeanAirwayPressureInput({
  ...createExampleInput(),
  inspiratoryTime: 5,
  totalCycleTime: 4,
});
assert(tiOver.result === null, 'Ti>Ttot');

const freq = calculateMeanAirwayPressure({
  ...createExampleInput(),
  mode: 'frequency',
  frequency: 15,
  totalCycleTime: null,
  inspiratoryTime: 1,
});
// Ttot = 60/15 = 4; duty = 1/4 = 0.25 → same 10
assert(Math.abs(freq.meanAirwayPressure - 10) < 1e-9, `freq ${freq.meanAirwayPressure}`);

console.log('mean-airway-pressure calculation.test.ts: ok');
