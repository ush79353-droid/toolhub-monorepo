import assert from 'node:assert/strict';
import {
  formatCentsDisplay,
  formatDollarsCurrency,
  formatDollarsDisplay,
  shareResultText,
} from './calculation';
import { parseCentsInput, parseDollarsInput } from './validation';

assert.equal(formatDollarsDisplay(0n), '0.00');
assert.equal(formatDollarsDisplay(1n), '0.01');
assert.equal(formatDollarsDisplay(5n), '0.05');
assert.equal(formatDollarsDisplay(10n), '0.10');
assert.equal(formatDollarsDisplay(25n), '0.25');
assert.equal(formatDollarsDisplay(50n), '0.50');
assert.equal(formatDollarsDisplay(99n), '0.99');
assert.equal(formatDollarsDisplay(100n), '1.00');
assert.equal(formatDollarsDisplay(250n), '2.50');
assert.equal(formatDollarsDisplay(500n), '5.00');
assert.equal(formatDollarsDisplay(1000n), '10.00');
assert.equal(formatDollarsDisplay(123456n), '1,234.56');
assert.equal(formatDollarsCurrency(250n), '$2.50');

assert.equal(formatCentsDisplay(0n), '0');
assert.equal(formatCentsDisplay(1n), '1');
assert.equal(formatCentsDisplay(100n), '100');
assert.equal(formatCentsDisplay(1000n), '1,000');
assert.equal(formatCentsDisplay(123456n), '123,456');
assert.equal(formatCentsDisplay(-250n), '-250');
assert.equal(formatDollarsDisplay(-1275n), '-12.75');

assert.equal(parseCentsInput('250').cents, 250n);
assert.equal(parseCentsInput('1,000').cents, 1000n);
assert.equal(parseCentsInput('').blank, true);
assert.equal(parseCentsInput('12.').incomplete, true);
assert.ok(parseCentsInput('1.5').error);
assert.ok(parseCentsInput('abc').error);

assert.equal(parseDollarsInput('2.50').cents, 250n);
assert.equal(parseDollarsInput('$12.75').cents, 1275n);
assert.equal(parseDollarsInput('1,234.56').cents, 123456n);
assert.equal(parseDollarsInput('0.01').cents, 1n);
assert.equal(parseDollarsInput('10').cents, 1000n);
assert.equal(parseDollarsInput('').blank, true);
assert.equal(parseDollarsInput('0.').incomplete, true);
assert.ok(parseDollarsInput('1.234').error);
assert.ok(parseDollarsInput('abc').error);
assert.equal(parseDollarsInput('-4.75').cents, -475n);

{
  const share = shareResultText(250n);
  assert.match(share, /Cents to Dollars Calculator/);
  assert.match(share, /Cents: 250/);
  assert.match(share, /Dollars: \$2\.50/);
  assert.match(share, /Dollars = Cents ÷ 100/);
}

console.log('cents-to-dollars calculation.test.ts: ok');
