import {
  calculatePeakFlow,
  diurnalVariabilityPercent,
  flowToLs,
  predictedPefLs,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validatePeakFlowInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const female40 = predictedPefLs('female', 40, 165, 'caucasian');
assert(female40.ls > 5 && female40.ls < 10, `predicted ${female40.ls}`);

const withMeasured = calculatePeakFlow({
  ...createExampleInput(),
  measuredPef: flowToLs(female40.ls, 'L/s') * 60,
  measuredUnit: 'L/min',
});
assert(
  Math.abs((withMeasured.percentOfEstimated as number) - 100) < 0.2,
  `measured=predicted → ${withMeasured.percentOfEstimated}`,
);

const best100 = calculatePeakFlow({
  ...createExampleInput(),
  measuredPef: 7,
  measuredUnit: 'L/s',
  personalBest: 7,
  personalBestUnit: 'L/s',
});
assert(
  Math.abs((best100.percentOfPersonalBest as number) - 100) < 1e-9,
  'measured=best → 100%',
);

assert(Math.abs(diurnalVariabilityPercent(8, 8)) < 1e-12, 'max=min → 0%');
assert(
  Math.abs(diurnalVariabilityPercent(10, 5) - ((10 - 5) / 7.5) * 100) < 1e-9,
  'amplitude % mean',
);

const ls = predictedPefLs('male', 40, 175, 'caucasian').ls;
assert(
  Math.abs(flowToLs(ls * 60, 'L/min') - ls) < 1e-12,
  'L/min ↔ L/s',
);

assert(validatePeakFlowInput(createDefaultInput()).result === null, 'blank');
assert(
  validatePeakFlowInput({ ...createExampleInput(), ageYears: 5 }).result ===
    null,
  'age too young',
);

console.log('peak-flow calculation.test.ts: ok');
