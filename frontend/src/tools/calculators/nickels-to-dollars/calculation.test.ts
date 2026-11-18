import assert from 'node:assert/strict';
import {
  breakdownFromCents,
  formatCount,
  formatDollarsCurrency,
  formatDollarsDisplay,
  nickelsToCents,
  shareResultText,
} from './calculation';
import { parseDollarsInput, parseNickelsInput } from './validation';

const cases: Array<[bigint, string]> = [
  [1n, '0.05'],
  [2n, '0.10'],
  [5n, '0.25'],
  [10n, '0.50'],
  [20n, '1.00'],
  [50n, '2.50'],
  [100n, '5.00'],
  [200n, '10.00'],
  [500n, '25.00'],
  [1000n, '50.00'],
  [2000n, '100.00'],
  [10000n, '500.00'],
  [20000n, '1,000.00'],
  [100000n, '5,000.00'],
  [1000000n, '50,000.00'],
  [1000000000n, '50,000,000.00'],
];

for (const [nickels, dollars] of cases) {
  const cents = nickelsToCents(nickels);
  assert.equal(formatDollarsDisplay(cents), dollars);
  const back = breakdownFromCents(cents);
  assert.equal(back.exact, true);
  assert.equal(back.wholeNickels, nickels);
}

assert.equal(nickelsToCents(0n), 0n);
assert.equal(formatDollarsCurrency(nickelsToCents(2000n)), '$100.00');
assert.equal(formatCount(1000000000n), '1,000,000,000');

// Reverse: dollars → nickels
assert.equal(breakdownFromCents(100n).wholeNickels, 20n);
assert.equal(breakdownFromCents(500n).wholeNickels, 100n);
assert.equal(breakdownFromCents(1000n).wholeNickels, 200n);
assert.equal(breakdownFromCents(2500n).wholeNickels, 500n);
assert.equal(breakdownFromCents(5000n).wholeNickels, 1000n);
assert.equal(breakdownFromCents(10000n).wholeNickels, 2000n);

// Fractional nickel units ($1.02 → 20.4)
{
  const b = breakdownFromCents(102n);
  assert.equal(b.exact, false);
  assert.equal(b.wholeNickels, 20n);
  assert.equal(b.remainderCents, 2n);
  assert.equal(b.nickelsDisplay, '20.4');
}

assert.equal(parseNickelsInput('2000').nickels, 2000n);
assert.equal(parseNickelsInput('1,000').nickels, 1000n);
assert.equal(parseNickelsInput('').blank, true);
assert.equal(parseNickelsInput('12.').incomplete, true);
assert.ok(parseNickelsInput('1.5').error);
assert.ok(parseNickelsInput('-5').error);
assert.ok(parseNickelsInput('abc').error);

assert.equal(parseDollarsInput('100').cents, 10000n);
assert.equal(parseDollarsInput('$250').cents, 25000n);
assert.equal(parseDollarsInput('1.02').cents, 102n);
assert.equal(parseDollarsInput('').blank, true);
assert.ok(parseDollarsInput('-1').error);
assert.ok(parseDollarsInput('1.234').error);

{
  const share = shareResultText(breakdownFromCents(nickelsToCents(2000n)));
  assert.match(share, /Nickels to Dollars Calculator/);
  assert.match(share, /Nickels: 2,000/);
  assert.match(share, /Dollars: \$100\.00/);
  assert.match(share, /2,000 × \$0\.05 = \$100\.00/);
}

{
  const share = shareResultText(breakdownFromCents(102n));
  assert.match(share, /Mathematical nickel units: 20\.4/);
  assert.match(share, /Whole nickels: 20/);
  assert.match(share, /Remaining amount: \$0\.02/);
}

console.log('nickels-to-dollars calculation.test.ts: ok');
