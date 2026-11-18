import assert from 'node:assert/strict';
import {
  convertTime,
  daysToMonths,
  monthsToDays,
  shareResultText,
  splitDaysToHms,
  calculateFromInput,
} from './calculation';
import { DAYS_PER_MONTH, DAYS_PER_YEAR } from './types';
import { parseOptionalNumber, validateDaysToMonths } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(DAYS_PER_YEAR, 365.2425);
assert.equal(DAYS_PER_MONTH, 30.436875);

assert.equal(daysToMonths(0), 0);
close(daysToMonths(365.2425), 12, 10);
close(daysToMonths(180), 180 / 30.436875, 10);
close(daysToMonths(1), 1 / 30.436875, 8);
close(daysToMonths(7), 7 / 30.436875, 8);
close(daysToMonths(15), 15 / 30.436875, 8);
close(daysToMonths(30), 30 / 30.436875, 8);
close(daysToMonths(60), 60 / 30.436875, 8);
close(daysToMonths(90), 90 / 30.436875, 8);
close(daysToMonths(730.485), 24, 10);

close(monthsToDays(6), 182.62125, 10);
close(monthsToDays(12), 365.2425, 10);
close(monthsToDays(24), 730.485, 10);

assert.equal(convertTime(1, 'days', 'hours'), 24);
assert.equal(convertTime(1, 'days', 'minutes'), 1440);
assert.equal(convertTime(1, 'days', 'seconds'), 86400);
assert.equal(convertTime(7, 'days', 'weeks'), 1);

{
  const hms = splitDaysToHms(0.4);
  assert.equal(hms.hours, 9);
  assert.equal(hms.minutes, 36);
  assert.equal(hms.seconds, 0);
}

{
  const fromHours = calculateFromInput({ source: 'hours', value: 2000 });
  close(fromHours.days, 2000 / 24, 10);
  close(fromHours.months, 2000 / 24 / DAYS_PER_MONTH, 8);
  assert.match(shareResultText(fromHours), /Months/);
}

assert.throws(() => daysToMonths(-1));
assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateDaysToMonths({ source: 'days', value: null }).isValid);

console.log('days-to-months calculation.test.ts: ok');
