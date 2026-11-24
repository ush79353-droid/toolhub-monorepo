import { calculateDeadSpace } from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateDeadSpaceInput } from './validation';
function assert(cond: boolean, msg: string): void { if (!cond) throw new Error(msg); }
const ex = calculateDeadSpace(createExampleInput());
assert(Math.abs(ex.deadSpaceMl - 150) < 1e-9, `VD ${ex.deadSpaceMl}`);
assert(Math.abs(ex.vdVtRatio - 0.3) < 1e-9, 'VD/VT');
assert(validateDeadSpaceInput(createDefaultInput()).result === null, 'blank');
assert(validateDeadSpaceInput({ ...createExampleInput(), alveolarCo2: 0 }).result === null, 'zero PACO2');
assert(validateDeadSpaceInput({ ...createExampleInput(), exhaledCo2: null }).result === null, 'missing PECO2');
console.log('dead-space calculation.test.ts: ok');
