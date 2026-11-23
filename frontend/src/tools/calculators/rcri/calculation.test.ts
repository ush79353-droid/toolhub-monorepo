import {
  calculateRcri,
  classFromPoints,
  totalRcriPoints,
} from './calculation';
import { createDefaultInput, type RcriInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const allNo = createDefaultInput();
assert(totalRcriPoints(allNo) === 0, 'defaults 0');
const r0 = calculateRcri(allNo);
assert(r0.rcriClass === 'I' && r0.riskPercent === 3.9, 'class I 3.9%');

const one: RcriInput = { ...allNo, ischemicHeartDisease: 'yes' };
assert(totalRcriPoints(one) === 1, 'one factor');
assert(calculateRcri(one).riskPercent === 6.0, 'class II 6.0%');

const two: RcriInput = {
  ...one,
  congestiveHeartFailure: 'yes',
};
assert(calculateRcri(two).rcriClass === 'III', 'class III');
assert(calculateRcri(two).riskPercent === 10.1, '10.1%');

const three: RcriInput = { ...two, highRiskSurgery: 'yes' };
assert(calculateRcri(three).rcriClass === 'IV', 'class IV');
assert(calculateRcri(three).riskPercent === 15.0, '15%');

assert(classFromPoints(6) === 'IV', 'max still IV');
assert(classFromPoints(0) === 'I', '0 → I');

console.log('rcri calculation.test.ts: ok');
