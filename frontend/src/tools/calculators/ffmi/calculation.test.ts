/**
 * Run: cd frontend && npx tsx src/tools/calculators/ffmi/calculation.test.ts
 */
import {
  calculateFfmi,
  fatFreeMassKg,
  ffmiFrom,
  normalizedFfmi,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFfmiInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const ffm = fatFreeMassKg(80, 25);
  assert(Math.abs(ffm - 60) < 1e-9, `ffm ${ffm}`);
  const ffmi = ffmiFrom(60, 2);
  assert(Math.abs(ffmi - 15) < 1e-9, `ffmi ${ffmi}`);
  const norm = normalizedFfmi(15, 2);
  assert(Math.abs(norm - (15 + 6.1 * (1.8 - 2))) < 1e-9, `norm ${norm}`);
}

{
  const r = calculateFfmi({
    ...createDefaultInput(),
    heightText: '200',
    heightUnit: 'cm',
    weightText: '80',
    bodyFatText: '25',
  });
  assert(r.ffmi != null && Math.abs(r.ffmi - 15) < 1e-9, 'wired');
  assert(r.fatFreeMassKg != null && Math.abs(r.fatFreeMassKg - 60) < 1e-9, 'ffm');
  assert(r.fatMassKg != null && Math.abs(r.fatMassKg - 20) < 1e-9, 'fat');
  assert(
    r.normalizedFfmi != null && Math.abs(r.normalizedFfmi - 13.78) < 1e-9,
    `norm ${r.normalizedFfmi}`,
  );
}

{
  const r = calculateFfmi({
    ...createDefaultInput(),
    heightText: '2',
    heightUnit: 'm',
    weightText: '176.37',
    weightUnit: 'lb',
    bodyFatText: '25',
  });
  assert(r.ffmi != null && Math.abs(r.ffmi - 15) < 0.02, 'lb parity');
}

{
  const r = calculateFfmi({
    ...createDefaultInput(),
    heightText: '180',
    weightText: '80',
    bodyFatText: '100',
  });
  assert(r.ffmi == null, 'reject 100% fat');
}

{
  const v = validateFfmiInput(createDefaultInput());
  assert(v.result != null && v.result.ffmi == null, 'blank');
}

console.log('ffmi calculation.test.ts: ok');
