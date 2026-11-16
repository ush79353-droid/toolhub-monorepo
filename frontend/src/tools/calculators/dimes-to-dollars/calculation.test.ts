import assert from 'node:assert/strict';
import {
  breakdownFromCents,
  formatCount,
  formatDollarsCurrency,
  formatDollarsDisplay,
  dimesToCents,
  shareResultText,
} from './calculation';
import { parseDollarsInput, parseDimesInput } from './validation';

const cases: Array<[bigint, string]> = [
  [0n, '0.00'],
  [1n, '0.10'],
  [2n, '0.20'],
  [5n, '0.50'],
  [10n, '1.00'],
  [20n, '2.00'],
  [50n, '5.00'],
  [100n, '10.00'],
  [200n, '20.00'],
  [500n, '50.00'],
  [1000n, '100.00'],
  [10000n, '1,000.00'],
  [1000000n, '100,000.00'],
  [1000000000n, '100,000,000.00'],
];

for (const [dimes, dollars] of cases) {
  const cents = dimesToCents(dimes);
  assert.equal(formatDollarsDisplay(cents), dollars);
  const back = breakdownFromCents(cents);
  assert.equal(back.exact, true);
  assert.equal(back.wholeDimes, dimes);
}

assert.equal(dimesToCents(0n), 0n);
assert.equal(formatDollarsCurrency(dimesToCents(1n)), '$0.10');
assert.equal(formatDollarsCurrency(dimesToCents(2000n)), '$200.00');
assert.equal(formatCount(1000000000n), '1,000,000,000');

// Reverse: dollars → dimes
assert.equal(breakdownFromCents(100n).wholeDimes, 10n);
assert.equal(breakdownFromCents(1000n).wholeDimes, 100n);
assert.equal(breakdownFromCents(2500n).wholeDimes, 250n);
assert.equal(breakdownFromCents(20000n).wholeDimes, 2000n);

// Fractional dime-equivalents ($1.25 → 12.5)
{
  const b = breakdownFromCents(125n);
  assert.equal(b.exact, false);
  assert.equal(b.wholeDimes, 12n);
  assert.equal(b.remainderCents, 5n);
  assert.equal(b.dimesDisplay, '12.5');
}

assert.equal(parseDimesInput('2000').dimes, 2000n);
assert.equal(parseDimesInput('1,000').dimes, 1000n);
assert.equal(parseDimesInput('').blank, true);
assert.equal(parseDimesInput('12.').incomplete, true);
assert.ok(parseDimesInput('1.5').error);
assert.ok(parseDimesInput('-5').error);
assert.ok(parseDimesInput('abc').error);

assert.equal(parseDollarsInput('25').cents, 2500n);
assert.equal(parseDollarsInput('$200').cents, 20000n);
assert.equal(parseDollarsInput('1.25').cents, 125n);
assert.equal(parseDollarsInput('').blank, true);
assert.ok(parseDollarsInput('-1').error);
assert.ok(parseDollarsInput('1.234').error);

{
  const share = shareResultText(breakdownFromCents(dimesToCents(2000n)));
  assert.match(share, /Dimes to Dollars Calculator/);
  assert.match(share, /Dimes: 2,000/);
  assert.match(share, /Dollars: \$200\.00/);
  assert.match(share, /2,000 × \$0\.10 = \$200\.00/);
}

{
  const share = shareResultText(breakdownFromCents(125n));
  assert.match(share, /Dime-equivalents: 12\.5/);
  assert.match(share, /Whole dimes: 12/);
  assert.match(share, /Remaining amount: \$0\.05/);
}

console.log('dimes-to-dollars calculation.test.ts: ok');
