import assert from 'node:assert/strict';
import {
  calculateDaysToYears,
  daysToYears,
  DAYS_PER_GREGORIAN_YEAR,
  shareResultText,
  yearsToDays,
} from './calculation';
import { parseOptionalNumber, validateDaysToYears } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(DAYS_PER_GREGORIAN_YEAR, 365.2425);
assert.equal(daysToYears(0), 0);
close(daysToYears(365.2425), 1, 12);
close(daysToYears(730.485), 2, 12);
close(daysToYears(1000), 1000 / 365.2425, 10);
close(daysToYears(10000), 10000 / 365.2425, 10);
assert.equal(yearsToDays(1), 365.2425);
assert.equal(yearsToDays(2), 730.485);
close(yearsToDays(2.5), 913.10625, 10);

{
  const result = calculateDaysToYears({ source: 'days', value: 1000 });
  close(result.years, 1000 / 365.2425, 10);
  assert.match(shareResultText(result), /365\.2425/);
}

assert.throws(() => daysToYears(-1));
assert.equal(parseOptionalNumber(''), null);
assert.ok(!validateDaysToYears({ source: 'days', value: null }).isValid);

console.log('days-to-years calculation.test.ts: ok');
