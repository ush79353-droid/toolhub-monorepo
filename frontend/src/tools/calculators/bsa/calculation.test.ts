/**
 * Run: cd frontend && npx tsx src/tools/calculators/bsa/calculation.test.ts
 */
import {
  calculateBsa,
  mostellerBsaM2,
  duBoisBsaM2,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBsaInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // Prompt fixture: 180 cm · 80 kg → Mosteller 2.00
  assert(Math.abs(mostellerBsaM2(80, 180) - 2) < 1e-12, 'mosteller 2');
  const r = calculateBsa({
    weightText: '80',
    weightUnit: 'kg',
    heightText: '180',
    heightUnit: 'cm',
    resultUnit: 'm2',
    showAdditional: true,
  });
  assert(r.methods != null, 'methods');
  assert(Math.abs(r.methods!.mosteller - 2) < 1e-12, 'mosteller methods');
  assert(r.formattedAdditional?.mosteller === '2.00', r.formattedAdditional?.mosteller);
  assert(r.primaryDisplay != null && r.primaryDisplay > 0, 'duBois primary');
  const expectedDu = duBoisBsaM2(80, 180);
  assert(
    Math.abs((r.methods!.duBois) - expectedDu) < 1e-12,
    'duBois match',
  );
}

{
  const v = validateBsaInput(createDefaultInput());
  assert(v.result != null && v.result.primaryDisplay == null, 'blank');
}

{
  const v = validateBsaInput({
    weightText: '0',
    weightUnit: 'kg',
    heightText: '180',
    heightUnit: 'cm',
    resultUnit: 'm2',
    showAdditional: false,
  });
  assert(v.errors.weightText != null, 'zero weight');
}

console.log('bsa calculation.test.ts: ok');
