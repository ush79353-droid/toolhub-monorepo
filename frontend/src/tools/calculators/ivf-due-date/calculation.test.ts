import assert from 'node:assert/strict';
import {
  DAY3_TRANSFER_TO_DUE_DAYS,
  DAY5_TRANSFER_TO_DUE_DAYS,
  RETRIEVAL_TO_DUE_DAYS,
  calculateIvfDueDate,
  daysAddedForTransferType,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateIvfDueDateInput } from './validation';

{
  assert.equal(daysAddedForTransferType('day3_transfer'), 263);
  assert.equal(daysAddedForTransferType('day5_transfer'), 261);
  assert.equal(daysAddedForTransferType('own_eggs'), 266);
  assert.equal(daysAddedForTransferType('donor_eggs'), 266);
  assert.equal(DAY3_TRANSFER_TO_DUE_DAYS, RETRIEVAL_TO_DUE_DAYS - 3);
  assert.equal(DAY5_TRANSFER_TO_DUE_DAYS, RETRIEVAL_TO_DUE_DAYS - 5);
}

// Day-3: 2026-01-01 + 263 = 2026-09-21
{
  const result = calculateIvfDueDate(createExampleInput());
  assert.ok(result);
  assert.equal(result!.dueDateIso, '2026-09-21');
  assert.equal(result!.daysAdded, 263);
}

// Day-5: 2026-01-01 + 261 = 2026-09-19
{
  const result = calculateIvfDueDate({
    ...createExampleInput(),
    transferType: 'day5_transfer',
  });
  assert.ok(result);
  assert.equal(result!.dueDateIso, '2026-09-19');
  assert.equal(result!.daysAdded, 261);
}

// Own eggs +266; twins do not change EDD
{
  const one = calculateIvfDueDate({
    ...createExampleInput(),
    transferType: 'own_eggs',
    plurality: 'one',
  });
  const twins = calculateIvfDueDate({
    ...createExampleInput(),
    transferType: 'own_eggs',
    plurality: 'twins',
  });
  assert.ok(one && twins);
  assert.equal(one!.dueDateIso, '2026-09-24');
  assert.equal(twins!.dueDateIso, one!.dueDateIso);
  assert.equal(one!.daysAdded, 266);
}

// Empty state
{
  const v = validateIvfDueDateInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result, null);
  assert.deepEqual(createEmptyInput(), createDefaultInput());
}

// Invalid date
{
  const v = validateIvfDueDateInput({
    ...createDefaultInput(),
    eventDate: '2026-13-40',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.eventDate);
}

console.log('ivf-due-date calculation.test.ts: ok');
