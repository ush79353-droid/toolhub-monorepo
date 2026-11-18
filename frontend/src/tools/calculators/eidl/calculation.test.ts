import assert from 'node:assert/strict';
import { getEidlProgramStatus } from './calculation';
import { validateEidlInput } from './validation';

{
  const status = getEidlProgramStatus();
  assert.equal(status.isExpired, true);
  assert.equal(status.maxAdvanceHistoricalAmount, 10000);
  assert.equal(status.currency, 'USD');
  assert.ok(status.programName.includes('EIDL'));
}

{
  const validation = validateEidlInput();
  assert.equal(validation.isValid, true);
  assert.deepEqual(validation.errors, {});
}

console.log('EIDL historical tool tests passed.');
