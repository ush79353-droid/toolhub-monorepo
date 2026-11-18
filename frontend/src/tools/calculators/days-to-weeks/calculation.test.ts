import assert from 'node:assert/strict';
import {
  calculateFromInput,
  convertTime,
  daysToWeeks,
  daysToWeeksTableRows,
  shareResultText,
  splitDaysToHms,
  weeksToDays,
  weeksToDaysTableRows,
} from './calculation';
import { parseOptionalNumber, validateDaysToWeeks } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(daysToWeeks(0), 0);
assert.equal(daysToWeeks(7), 1);
assert.equal(daysToWeeks(14), 2);
assert.equal(daysToWeeks(21), 3);
assert.equal(daysToWeeks(28), 4);
close(daysToWeeks(100), 100 / 7, 10);
close(daysToWeeks(5), 5 / 7, 10);
assert.equal(weeksToDays(1), 7);
assert.equal(weeksToDays(2.5), 17.5);
assert.equal(weeksToDays(52), 364);

assert.equal(convertTime(1, 'days', 'hours'), 24);
assert.equal(convertTime(7, 'days', 'weeks'), 1);

{
  const hms = splitDaysToHms(0.1);
  assert.equal(hms.hours, 2);
  assert.equal(hms.minutes, 24);
  assert.equal(hms.seconds, 0);
}

{
  const fromHours = calculateFromInput({ source: 'hours', value: 2000 });
  close(fromHours.days, 2000 / 24, 10);
  close(fromHours.weeks, 2000 / 24 / 7, 8);
  assert.match(shareResultText(fromHours), /Weeks/);
}

{
  const rows = daysToWeeksTableRows(7);
  assert.equal(rows.length, 7);
  assert.equal(rows[6]?.weeks, 1);
}

{
  const rows = weeksToDaysTableRows([1, 2, 52]);
  assert.equal(rows[0]?.days, 7);
  assert.equal(rows[2]?.days, 364);
}

assert.throws(() => daysToWeeks(-1));
assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateDaysToWeeks({ source: 'days', value: null }).isValid);

console.log('days-to-weeks calculation.test.ts: ok');
