/**
 * Run: npm exec tsx -- src/tools/calculators/map-mean-arterial-pressure/calculation.test.ts
 */
import {
  calculateMeanArterialPressure,
  calculatePulsePressure,
  formatPressureMmHg,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateMapInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const v = validateMapInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.formattedMap === '93.33', `map display ${v.result!.formattedMap}`);
  assert(Math.abs(v.result!.mapMmHg - 280 / 3) < 1e-9, 'map numeric');
  assert(v.result!.pulsePressureMmHg === 40, 'pp 40');
}

{
  const v = validateMapInput(createEmptyInput());
  assert(!v.isValid && v.result == null, 'empty inactive');
}

{
  const v = validateMapInput({
    sbpMmHg: '80',
    dbpMmHg: '120',
    displayPulsePressure: false,
  });
  assert(!v.isValid && v.errors.form, 'SBP < DBP');
}

{
  const base = validateMapInput({
    sbpMmHg: '120',
    dbpMmHg: '80',
    displayPulsePressure: false,
  });
  const withPp = validateMapInput({
    sbpMmHg: '120',
    dbpMmHg: '80',
    displayPulsePressure: true,
  });
  assert(base.result!.mapMmHg === withPp.result!.mapMmHg, 'toggle preserves MAP');
  assert(withPp.result!.pulsePressureMmHg === 40, 'PP when checked');
}

assert(formatPressureMmHg(280 / 3) === '93.33', 'format');
assert(calculatePulsePressure(120, 80) === 40, 'PP formula');
assert(calculateMeanArterialPressure(80, 120) == null, 'reversed null');

console.log('map-mean-arterial-pressure calculation.test.ts ok');