/**
 * Run: npx tsx calculation.test.ts
 */
import { maxDoseMgPlain, percentToMgPerMl } from './calculation';
import { validateLocalAnestheticInput } from './validation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(percentToMgPerMl(0.25) === 2.5, '0.25% = 2.5 mg/mL');
assert(maxDoseMgPlain('bupivacaine', 100) === 175, 'bup capped 175');
assert(maxDoseMgPlain('bupivacaine', 40) === 100, 'bup 2.5×40');
assert(maxDoseMgPlain('lidocaine', 100) === 300, 'lido capped 300');
assert(maxDoseMgPlain('mepivacaine', 80) === 400, 'mepi absolute 400');

{
  const v = validateLocalAnestheticInput({
    ...createDefaultInput(),
    weightText: '70',
    concentrationPercentText: '0.25',
  });
  assert(v.result?.maxDoseMg === 175, '70kg bup → 175');
  assert(v.result?.maxDoseMl === 70, '175/2.5 = 70 mL');
}

console.log('local-anesthetic calculation.test.ts: ok');
