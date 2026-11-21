import { createEmptyInput } from './types';
import { validatePositivePregnancyFollowUpInput } from './validation';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

const defaults = createEmptyInput();
assert(defaults.cycleLengthDaysText === '28', 'cycle 28');
assert(defaults.embryoAgeDays === 5, 'blastocyst 5');
assert(defaults.selectTestSensitivity === false, 'sensitivity off');
assert(defaults.lastPeriodIso === '', 'blank LMP');
assert(defaults.ivfTransferIso === '', 'blank transfer');

const v = validatePositivePregnancyFollowUpInput(defaults);
assert(v.result != null, 'empty still yields educational result shell');

console.log('positive-pregnancy-follow-up calculation.test.ts: ok');
