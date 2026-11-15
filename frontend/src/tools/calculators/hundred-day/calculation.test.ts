import assert from 'node:assert/strict';
import { addCalendarDays, diffCalendarDays, parseIsoDate, weekdayName } from './dates';
import { calculateBetween, calculateOffset, offsetForCount } from './calculation';
import { createDefaultHundredDayInput } from './defaults';
import { validateHundredDay } from './validation';

assert.equal(addCalendarDays('2026-01-01', 100), '2026-04-11');
assert.equal(weekdayName('2026-04-11'), 'Saturday');
assert.equal(addCalendarDays('2026-01-01', -100), '2025-09-23');

assert.equal(offsetForCount(100, 'after', false), 100);
assert.equal(offsetForCount(100, 'after', true), 99);
assert.equal(calculateOffset({ startDate: '2026-01-01', dayCount: 100, direction: 'after', includeStart: true }).resultDate, '2026-04-10');
assert.equal(calculateOffset({ startDate: '2026-01-01', dayCount: 100, direction: 'before', includeStart: true }).resultDate, '2025-09-24');
assert.equal(calculateOffset({ startDate: '2026-01-01', dayCount: 1, direction: 'after', includeStart: true }).resultDate, '2026-01-01');

assert.equal(addCalendarDays('2024-02-28', 1), '2024-02-29');
assert.equal(addCalendarDays('2024-02-28', 2), '2024-03-01');
assert.equal(addCalendarDays('2023-02-28', 1), '2023-03-01');
assert.equal(addCalendarDays('2026-01-31', 1), '2026-02-01');
assert.equal(addCalendarDays('2025-12-31', 1), '2026-01-01');
assert.equal(addCalendarDays('2024-02-01', 100), '2024-05-11');
assert.equal(addCalendarDays('2024-03-01', 100), '2024-06-09');

const between = calculateBetween({ fromDate: '2026-01-01', toDate: '2026-01-10', includeStart: false });
assert.equal(between.signedExclusive, 9);
assert.equal(between.signedCount, 9);
assert.equal(between.weeks, 1);
assert.equal(between.leftoverDays, 2);
const inclusive = calculateBetween({ fromDate: '2026-01-01', toDate: '2026-01-10', includeStart: true });
assert.equal(inclusive.signedCount, 10);
assert.equal(inclusive.absoluteCount, 10);
const same = calculateBetween({ fromDate: '2026-01-01', toDate: '2026-01-01', includeStart: false });
assert.equal(same.signedCount, 0);
const sameIn = calculateBetween({ fromDate: '2026-01-01', toDate: '2026-01-01', includeStart: true });
assert.equal(sameIn.signedCount, 1);
const reversed = calculateBetween({ fromDate: '2026-01-10', toDate: '2026-01-01', includeStart: true });
assert.equal(reversed.signedExclusive, -9);
assert.equal(reversed.signedCount, -10);

assert.equal(parseIsoDate('2026-02-30'), null);
assert.equal(parseIsoDate('2023-02-29'), null);
assert.equal(validateHundredDay({
  mode: 'offset',
  startDate: '2026-01-01',
  dayCount: 1.5,
  direction: 'after',
  includeStart: false,
  fromDate: '2026-01-01',
  toDate: '2026-01-02',
}).errors.dayCount !== undefined, true);
assert.equal(validateHundredDay({
  mode: 'offset',
  startDate: '2026-01-01',
  dayCount: 0,
  direction: 'after',
  includeStart: false,
  fromDate: '2026-01-01',
  toDate: '2026-01-02',
}).isValid, false);
assert.equal(validateHundredDay({
  mode: 'offset',
  startDate: '2026-01-01',
  dayCount: -5,
  direction: 'after',
  includeStart: false,
  fromDate: '2026-01-01',
  toDate: '2026-01-02',
}).isValid, false);
assert.equal(validateHundredDay({
  mode: 'offset',
  startDate: '2026-01-01',
  dayCount: 100_001,
  direction: 'after',
  includeStart: false,
  fromDate: '2026-01-01',
  toDate: '2026-01-02',
}).isValid, false);

assert.equal(calculateOffset({ startDate: '2026-01-01', dayCount: 10000, direction: 'after', includeStart: false }).resultDate, addCalendarDays('2026-01-01', 10000));

// DST cannot move a date-only value: both sides are UTC midnights.
assert.equal(diffCalendarDays('2026-03-07', '2026-03-09'), 2);
assert.equal(diffCalendarDays('2026-11-01', '2026-11-03'), 2);
assert.equal(addCalendarDays('2026-03-08', 1), '2026-03-09');

const defaults = createDefaultHundredDayInput('2026-04-02');
assert.equal(defaults.mode, 'offset');
assert.equal(defaults.dayCount, 100);
assert.equal(defaults.direction, 'after');
assert.equal(defaults.includeStart, false);
assert.equal(defaults.startDate, '2026-04-02');

console.log('100 day calculation.test ok');
