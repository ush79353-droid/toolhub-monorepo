import assert from 'node:assert/strict';
import {
  breakdownFromCents,
  formatCount,
  formatDollarsCurrency,
  formatDollarsDisplay,
  quartersToCents,
  shareResultText,
} from './calculation';
import { parseDollarsInput, parseQuartersInput } from './validation';

const cases: Array<[bigint, string]> = [
  [0n, '0.00'],
  [1n, '0.25'],
  [2n, '0.50'],
  [3n, '0.75'],
  [4n, '1.00'],
  [8n, '2.00'],
  [10n, '2.50'],
  [20n, '5.00'],
  [25n, '6.25'],
  [40n, '10.00'],
  [100n, '25.00'],
  [200n, '50.00'],
  [400n, '100.00'],
  [1000n, '250.00'],
  [2000n, '500.00'],
  [4000n, '1,000.00'],
  [1000000n, '250,000.00'],
];

for (const [quarters, dollars] of cases) {
  const cents = quartersToCents(quarters);
  assert.equal(formatDollarsDisplay(cents), dollars);
  const back = breakdownFromCents(cents);
  assert.equal(back.exact, true);
  assert.equal(back.wholeQuarters, quarters);
}

assert.equal(formatDollarsCurrency(quartersToCents(25n)), '$6.25');
assert.equal(formatCount(1000000n), '1,000,000');

assert.equal(breakdownFromCents(100n).wholeQuarters, 4n);
assert.equal(breakdownFromCents(500n).wholeQuarters, 20n);
assert.equal(breakdownFromCents(750n).wholeQuarters, 30n);
assert.equal(breakdownFromCents(1000n).wholeQuarters, 40n);
assert.equal(breakdownFromCents(10000n).wholeQuarters, 400n);

// Fractional quarter-equivalents ($1.10 → 4.4)
{
  const b = breakdownFromCents(110n);
  assert.equal(b.exact, false);
  assert.equal(b.wholeQuarters, 4n);
  assert.equal(b.remainderCents, 10n);
  assert.equal(b.quartersDisplay, '4.4');
}

assert.equal(parseQuartersInput('40').quarters, 40n);
assert.equal(parseQuartersInput('1,000').quarters, 1000n);
assert.equal(parseQuartersInput('').blank, true);
assert.ok(parseQuartersInput('1.5').error);
assert.ok(parseQuartersInput('-5').error);

assert.equal(parseDollarsInput('7.50').cents, 750n);
assert.equal(parseDollarsInput('$10').cents, 1000n);
assert.equal(parseDollarsInput('1.10').cents, 110n);
assert.ok(parseDollarsInput('-1').error);

{
  const share = shareResultText(breakdownFromCents(quartersToCents(40n)));
  assert.match(share, /Quarters to Dollars Calculator/);
  assert.match(share, /Quarters: 40/);
  assert.match(share, /Dollars: \$10\.00/);
}

{
  const share = shareResultText(breakdownFromCents(110n));
  assert.match(share, /4\.4 quarters/);
  assert.match(share, /Whole quarters: 4/);
}

console.log('quarters-to-dollars calculation.test.ts: ok');
