/**
 * Skinfold body-fat self-check
 * Run: npx tsx src/tools/calculators/skinfold-body-fat/calculation.test.ts
 */
import {
  calculateSkinfoldBodyFat,
  getCoefficients,
  siriBodyFatPercent,
} from './calculation';
import { createExampleMaleInput, createDefaultInput } from './types';
import { validateSkinfoldBodyFatInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(getCoefficients('male', 'under_17') == null, 'under_17 gated');
assert(getCoefficients('male', '20_29')?.c === 1.1631, 'male 20-29 c');
assert(getCoefficients('female', '17_19')?.m === 0.0678, 'female young m');

const dens = 1.063;
const siri = siriBodyFatPercent(dens);
assert(siri != null && Math.abs(siri - (495 / dens - 450)) < 1e-9, 'siri');

const blocked = calculateSkinfoldBodyFat(createDefaultInput());
assert(blocked == null, 'default under_17 no result');

const male = calculateSkinfoldBodyFat(createExampleMaleInput());
assert(male != null, 'male example');
assert(male!.sumMm === 38, 'sum 38');
const expectedD = 1.1631 - 0.0632 * Math.log10(38);
assert(Math.abs(male!.density - expectedD) < 1e-10, 'density');
assert(
  Math.abs(male!.bodyFatPercent - (495 / expectedD - 450)) < 1e-10,
  'bf%'
);
assert(male!.formattedBodyFatPercent.includes('.'), 'formatted');

const vGate = validateSkinfoldBodyFatInput(createDefaultInput());
assert(vGate.gateMessage != null, 'gate message');
assert(vGate.result == null, 'no result under 17');

const vOk = validateSkinfoldBodyFatInput(createExampleMaleInput());
assert(vOk.isValid && vOk.result != null, 'valid male example');

const female = calculateSkinfoldBodyFat({
  sex: 'female',
  ageBand: '20_29',
  bicep: '8',
  subscapular: '14',
  suprailiac: '12',
  tricep: '16',
  unit: 'mm',
});
assert(female != null && female.sumMm === 50, 'female sum');

const inch = calculateSkinfoldBodyFat({
  sex: 'male',
  ageBand: '20_29',
  bicep: (6 / 25.4).toFixed(4),
  subscapular: (12 / 25.4).toFixed(4),
  suprailiac: (10 / 25.4).toFixed(4),
  tricep: (10 / 25.4).toFixed(4),
  unit: 'in',
});
assert(inch != null, 'inch path');
assert(Math.abs(inch!.sumMm - 38) < 0.05, 'inch≈mm sum');

console.log('skinfold-body-fat calculation.test.ts: ok');
