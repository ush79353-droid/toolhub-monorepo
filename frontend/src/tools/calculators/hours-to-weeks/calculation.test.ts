import assert from 'node:assert/strict';
import {
  calculateHoursToWeeks,
  convertTime,
  gcd,
  hmsToSeconds,
  hoursToWeekFractionLabel,
  hoursToWeeks,
  normalizeHms,
  shareResultText,
  weeksToHours,
} from './calculation';
import { parseOptionalNumber, validateHoursToWeeks } from './validation';

function assertClose(actual: number, expected: number, digits = 9): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(hoursToWeeks(0), 0);
assertClose(hoursToWeeks(1), 1 / 168, 12);
assertClose(hoursToWeeks(8), 1 / 21, 12);
assertClose(hoursToWeeks(24), 1 / 7, 12);
assertClose(hoursToWeeks(40), 5 / 21, 12);
assert.equal(hoursToWeeks(84), 0.5);
assertClose(hoursToWeeks(120), 5 / 7, 12);
assert.equal(hoursToWeeks(168), 1);
assert.equal(hoursToWeeks(336), 2);
assert.equal(hoursToWeeks(504), 3);
assertClose(hoursToWeeks(1000), 1000 / 168, 10);

assert.equal(weeksToHours(1), 168);
assert.equal(weeksToHours(2.5), 420);

assert.equal(convertTime(7, 'DAY', 'WEEK'), 1);
assert.equal(convertTime(604_800, 'SECOND', 'WEEK'), 1);
assert.equal(convertTime(10_080, 'MINUTE', 'WEEK'), 1);

assert.equal(hmsToSeconds(10, 30, 15), 37_815);
assertClose(hoursToWeeks(convertTime(37_815, 'SECOND', 'HOUR')), 37_815 / 604_800, 12);

{
  const n = normalizeHms(1, 60, 0);
  assert.equal(n.hours, 2);
  assert.equal(n.minutes, 0);
  assert.equal(n.seconds, 0);
}

{
  const n = normalizeHms(10, 30, 15);
  assert.equal(n.hours, 10);
  assert.equal(n.minutes, 30);
  assert.equal(n.seconds, 15);
}

assert.equal(gcd(98, 168), 14);
assert.equal(hoursToWeekFractionLabel(1), '1/168');
assert.equal(hoursToWeekFractionLabel(3), '1/56');
assert.equal(hoursToWeekFractionLabel(8), '1/21');
assert.equal(hoursToWeekFractionLabel(24), '1/7');
assert.equal(hoursToWeekFractionLabel(40), '5/21');
assert.equal(hoursToWeekFractionLabel(84), '1/2');
assert.equal(hoursToWeekFractionLabel(98), '7/12');
assert.equal(hoursToWeekFractionLabel(120), '5/7');
assert.equal(hoursToWeekFractionLabel(168), '1');
assert.equal(hoursToWeekFractionLabel(336), '2');

assert.throws(() => hoursToWeeks(-1));
assert.throws(() => weeksToHours(-2));

{
  const result = calculateHoursToWeeks({
    source: 'hours',
    hours: 168,
    weeks: null,
    years: null,
    months: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.weeks, 1);
  assert.equal(result.days, 7);
  assert.equal(result.minutes, 10_080);
  assert.equal(result.seconds, 604_800);
  assert.equal(result.weekFractionLabel, '1');
  assert.match(shareResultText(result), /Hours to Week Conversion/);
}

{
  const result = calculateHoursToWeeks({
    source: 'weeks',
    hours: null,
    weeks: 2.5,
    years: null,
    months: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.hours, 420);
  assert.equal(result.days, 17.5);
  assert.equal(result.minutes, 25_200);
  assert.equal(result.seconds, 1_512_000);
}

{
  const result = calculateHoursToWeeks({
    source: 'seconds',
    hours: null,
    weeks: null,
    years: null,
    months: null,
    days: null,
    minutes: null,
    seconds: 604_800,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  });
  assert.equal(result.hours, 168);
  assert.equal(result.weeks, 1);
  assert.equal(result.days, 7);
}

{
  const result = calculateHoursToWeeks({
    source: 'hms',
    hours: null,
    weeks: null,
    years: null,
    months: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: 10,
    hmsMinutes: 30,
    hmsSeconds: 15,
  });
  assert.equal(result.seconds, 37_815);
  assertClose(result.hours, 10.5041666667, 9);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  validateHoursToWeeks({
    source: 'hours',
    hours: 0,
    weeks: null,
    years: null,
    months: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);
assert.ok(
  !validateHoursToWeeks({
    source: 'weeks',
    hours: null,
    weeks: -1,
    years: null,
    months: null,
    days: null,
    minutes: null,
    seconds: null,
    hmsHours: null,
    hmsMinutes: null,
    hmsSeconds: null,
  }).isValid,
);

console.log('hours-to-weeks calculation.test.ts: ok');
