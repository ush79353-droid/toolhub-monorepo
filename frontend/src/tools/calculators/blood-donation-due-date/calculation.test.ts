import assert from 'node:assert/strict';
import {
  addDonationInterval,
  calculateBloodDonationDueDate,
  convertPeriodValue,
  formatBloodDonationDate,
  periodToDays,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBloodDonationDueDateInput } from './validation';

// Screenshot fixture: male · 12 weeks · 2026-11-21 → 2027-02-13
assert.equal(periodToDays(12, 'weeks'), 84);
assert.equal(addDonationInterval('2026-11-21', 12, 'weeks'), '2027-02-13');
assert.equal(formatBloodDonationDate('2027-02-13'), '02/13/2027');

const defaults = createDefaultInput();
const defResult = calculateBloodDonationDueDate(defaults);
assert.ok(defResult);
assert.equal(defResult!.nextDonationIso, '2027-02-13');
assert.equal(defResult!.formattedNextDonation, '02/13/2027');

// Omni / NHS female: 2022-03-01 + 16 weeks = 2022-06-21
assert.equal(addDonationInterval('2022-03-01', 16, 'weeks'), '2022-06-21');
// Omni male: 2022-03-01 + 12 weeks = 2022-05-24
assert.equal(addDonationInterval('2022-03-01', 12, 'weeks'), '2022-05-24');

// Exact 84 days
assert.equal(addDonationInterval('2026-11-21', 84, 'days'), '2027-02-13');

// Leap day
assert.equal(addDonationInterval('2024-02-29', 7, 'weeks'), '2024-04-18');
assert.equal(addDonationInterval('2024-01-31', 1, 'months'), '2024-02-29');

// Unit conversion days ↔ weeks
assert.equal(convertPeriodValue(12, 'weeks', 'days'), 84);
assert.equal(convertPeriodValue(84, 'days', 'weeks'), 12);
assert.equal(convertPeriodValue(12, 'weeks', 'months'), null);

// Validation
const ok = validateBloodDonationDueDateInput(defaults);
assert.equal(ok.isValid, true);
assert.equal(ok.result?.nextDonationIso, '2027-02-13');

const blank = validateBloodDonationDueDateInput({
  ...defaults,
  lastDonationDate: '',
});
assert.equal(blank.isValid, false);
assert.ok(blank.errors.lastDonationDate);

const badDate = validateBloodDonationDueDateInput({
  ...defaults,
  lastDonationDate: '2026-02-31',
});
assert.equal(badDate.isValid, false);

console.log('blood-donation-due-date calculation.test.ts: ok');
