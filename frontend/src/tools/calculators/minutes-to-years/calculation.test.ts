import assert from 'node:assert/strict';
import {
  calculateMinutesToYears,
  daysToMinutes,
  hoursToMinutes,
  minutesToDays,
  minutesToHours,
  minutesToMonths,
  minutesToSeconds,
  minutesToWeeks,
  minutesToYears,
  MINUTES_PER_AVERAGE_YEAR,
  shareResultText,
  weeksToMinutes,
  yearsToMinutes,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(minutesToYears(0), 0);
assert.equal(minutesToYears(525_960), 1);
assert.equal(minutesToYears(1_051_920), 2);
assert.equal(minutesToYears(262_980), 0.5);

assert.equal(yearsToMinutes(1), 525_960);
assert.equal(yearsToMinutes(2), 1_051_920);
assert.equal(yearsToMinutes(10), 5_259_600);
assert.equal(yearsToMinutes(50), 26_298_000);

assert.equal(minutesToDays(525_960), 365.25);
assert.equal(minutesToHours(525_960), 8766);
assert.equal(minutesToSeconds(525_960), 31_557_600);
assert.equal(minutesToMonths(525_960), 12);

assert.equal(minutesToHours(60), 1);
assert.equal(minutesToDays(1440), 1);
assert.equal(minutesToWeeks(10_080), 1);
assert.equal(hoursToMinutes(1), 60);
assert.equal(daysToMinutes(1), 1440);
assert.equal(weeksToMinutes(1), 10_080);

assertClose(minutesToYears(1_000_000), 1_000_000 / MINUTES_PER_AVERAGE_YEAR);

const oneYear = calculateMinutesToYears({
  source: 'minutes',
  minutes: 525_960,
  years: null,
  months: null,
  weeks: null,
  days: null,
  hours: null,
  seconds: null,
  hmsHours: null,
  hmsMinutes: null,
  hmsSeconds: null,
});
assert.equal(oneYear.years, 1);
assert.equal(oneYear.days, 365.25);
assert.equal(oneYear.hours, 8766);
assert.equal(oneYear.seconds, 31_557_600);
assert.equal(oneYear.months, 12);
assert.equal(oneYear.combined.hours, 8766);
assert.equal(oneYear.combined.minutes, 0);
assert.equal(oneYear.combined.seconds, 0);

const hms = calculateMinutesToYears({
  source: 'hms',
  minutes: null,
  years: null,
  months: null,
  weeks: null,
  days: null,
  hours: null,
  seconds: null,
  hmsHours: 2,
  hmsMinutes: 30,
  hmsSeconds: 15,
});
assertClose(hms.minutes, 150.25);
assert.equal(hms.seconds, 9015);

assertClose(minutesToYears(-525_960), -1);

assert.match(shareResultText(oneYear), /Minutes to Years/);
assert.match(shareResultText(oneYear), /525960 minutes = 1 average/);

console.log('minutes-to-years calculation.test.ts: ok');
