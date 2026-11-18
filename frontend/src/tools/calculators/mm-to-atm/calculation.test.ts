import assert from 'node:assert/strict';
import {
  MMHG_PER_ATM,
  atmToMmHg,
  calculateMmToAtm,
  mmHgToAtm,
  shareResultText,
} from './calculation';

function assertClose(actual: number, expected: number, digits = 12): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(MMHG_PER_ATM, 760);

assert.equal(mmHgToAtm(760), 1);
assert.equal(mmHgToAtm(380), 0.5);
assert.equal(mmHgToAtm(1520), 2);
assertClose(mmHgToAtm(150), 150 / 760);
assert.equal(mmHgToAtm(475), 0.625);
assertClose(mmHgToAtm(1), 1 / 760);
assertClose(mmHgToAtm(1000), 1000 / 760);

assert.equal(atmToMmHg(1), 760);
assert.equal(atmToMmHg(0.5), 380);
assert.equal(atmToMmHg(2), 1520);
assert.equal(atmToMmHg(3), 2280);

{
  const forward = calculateMmToAtm({ source: 'mmHg', mmHg: 150, atm: null });
  assertClose(forward.atm, 150 / 760);
  const reverse = calculateMmToAtm({ source: 'atm', mmHg: null, atm: 3 });
  assert.equal(reverse.mmHg, 2280);
}

assert.match(shareResultText(calculateMmToAtm({ source: 'mmHg', mmHg: 760, atm: null })), /mm to ATM Converter/);
assert.match(
  shareResultText(calculateMmToAtm({ source: 'mmHg', mmHg: 760, atm: null })),
  /760 mmHg ≈ 1 atm/,
);
assert.match(
  shareResultText(calculateMmToAtm({ source: 'mmHg', mmHg: 760, atm: null })),
  /\/tools\/mm-to-atm-converter/,
);

console.log('mm-to-atm calculation.test.ts: ok');
