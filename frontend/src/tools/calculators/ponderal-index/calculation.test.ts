/**
 * Run: cd frontend && npx tsx src/tools/calculators/ponderal-index/calculation.test.ts
 */
import {
  adultPonderalIndex,
  calculatePonderal,
  neonatePonderalIndex,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePonderalInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const pi = adultPonderalIndex(80, 2);
  assert(Math.abs(pi - 10) < 1e-12, `adult ${pi}`);

  const r = calculatePonderal({
    mode: 'adult',
    heightText: '200',
    heightUnit: 'cm',
    weightText: '80',
    weightUnit: 'kg',
  });
  assert(r.index != null && Math.abs(r.index - 10) < 1e-12, 'wired adult');
  assert(r.unitLabel === 'kg/m³', 'adult unit');
}

{
  const neo = neonatePonderalIndex(80, 2);
  assert(Math.abs(neo - 1) < 1e-12, `neo ${neo}`);

  const r = calculatePonderal({
    mode: 'neonate',
    heightText: '2',
    heightUnit: 'm',
    weightText: '80',
    weightUnit: 'kg',
  });
  assert(r.index != null && Math.abs(r.index - 1) < 1e-12, 'wired neonate');
  assert(r.unitLabel === '100×g/cm³', 'neo unit');
}

{
  const a = calculatePonderal({
    mode: 'adult',
    heightText: '2',
    heightUnit: 'm',
    weightText: '80',
    weightUnit: 'kg',
  });
  const b = calculatePonderal({
    mode: 'neonate',
    heightText: '2',
    heightUnit: 'm',
    weightText: '80',
    weightUnit: 'kg',
  });
  assert(
    a.index != null &&
      b.index != null &&
      Math.abs(b.index - 0.1 * a.index) < 1e-12,
    'mode scale',
  );
}

{
  const v = validatePonderalInput(createDefaultInput());
  assert(v.result != null && v.result.index == null, 'blank');
}

console.log('ponderal-index calculation.test.ts: ok');
