import { calculateRsbi } from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateRsbiInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const ex = calculateRsbi(createExampleInput());
assert(Math.abs(ex.rsbi - 50) < 1e-9, `RSBI ${ex.rsbi}`);

assert(validateRsbiInput(createDefaultInput()).result === null, 'blank');
assert(
  validateRsbiInput({ ...createExampleInput(), tidalVolumeMl: 0 }).result ===
    null,
  'zero VT',
);
assert(
  validateRsbiInput({ ...createExampleInput(), respiratoryRate: null })
    .result === null,
  'missing RR',
);

const half = calculateRsbi({ respiratoryRate: 10, tidalVolumeMl: 500 });
assert(Math.abs(half.rsbi - 20) < 1e-9, `half ${half.rsbi}`);

console.log('rsbi calculation.test.ts: ok');
