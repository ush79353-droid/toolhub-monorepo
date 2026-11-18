import assert from 'node:assert/strict';
import {
  formatDollarsCurrency,
  formatDollarsDisplay,
  formatPenniesDisplay,
  shareResultText,
} from './calculation';
import { parseDollarsInput, parsePenniesInput } from './validation';

const cases: Array<[bigint, string]> = [
  [1n, '0.01'],
  [5n, '0.05'],
  [10n, '0.10'],
  [25n, '0.25'],
  [50n, '0.50'],
  [100n, '1.00'],
  [250n, '2.50'],
  [1000n, '10.00'],
  [2000n, '20.00'],
  [10000n, '100.00'],
  [100000n, '1,000.00'],
  [1000000n, '10,000.00'],
];

for (const [pennies, dollars] of cases) {
  assert.equal(formatDollarsDisplay(pennies), dollars);
}

assert.equal(formatPenniesDisplay(1250n), '1,250');
assert.equal(formatDollarsCurrency(250n), '$2.50');
assert.equal(formatDollarsDisplay(0n), '0.00');

assert.equal(parsePenniesInput('250').pennies, 250n);
assert.equal(parsePenniesInput('1,000').pennies, 1000n);
assert.equal(parsePenniesInput('').blank, true);
assert.ok(parsePenniesInput('-1').error);
assert.ok(parsePenniesInput('1.5').error);

assert.equal(parseDollarsInput('12.75').pennies, 1275n);
assert.equal(parseDollarsInput('$100').pennies, 10000n);
assert.equal(parseDollarsInput('1.00').pennies, 100n);
assert.ok(parseDollarsInput('-1').error);
assert.ok(parseDollarsInput('1.234').error);

{
  const share = shareResultText(250n);
  assert.match(share, /Pennies to Dollars Calculator/);
  assert.match(share, /Pennies: 250/);
  assert.match(share, /Dollars: \$2\.50/);
  assert.match(share, /250 ÷ 100 = 2\.50/);
}

console.log('pennies-to-dollars calculation.test.ts: ok');
