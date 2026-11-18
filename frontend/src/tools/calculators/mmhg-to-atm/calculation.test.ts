import assert from 'node:assert/strict';
import {
  MMHG_PER_ATM,
  atmToMmHg,
  calculateMmhgToAtm,
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

assert.equal(mmHgToAtm(0), 0);
assert.equal(mmHgToAtm(76), 0.1);
assert.equal(mmHgToAtm(152), 0.2);
assert.equal(mmHgToAtm(380), 0.5);
assert.equal(mmHgToAtm(475), 0.625);
assertClose(mmHgToAtm(610), 610 / 760);
assert.equal(mmHgToAtm(760), 1);
assert.equal(mmHgToAtm(1140), 1.5);
assert.equal(mmHgToAtm(1520), 2);
assert.equal(mmHgToAtm(2280), 3);
assert.equal(mmHgToAtm(3800), 5);
assert.equal(mmHgToAtm(7600), 10);

assert.equal(atmToMmHg(0.1), 76);
assert.equal(atmToMmHg(0.5), 380);
assert.equal(atmToMmHg(1), 760);
assert.equal(atmToMmHg(1.5), 1140);
assert.equal(atmToMmHg(2), 1520);
assert.equal(atmToMmHg(3), 2280);
assert.equal(atmToMmHg(5), 3800);
assert.equal(atmToMmHg(10), 7600);

const oneAtm = calculateMmhgToAtm({ source: 'mmHg', mmHg: 760, atm: null });
assert.equal(oneAtm.atm, 1);
assert.equal(oneAtm.pascals, 101325);
assert.ok(oneAtm.otherUnits.some((u) => u.id === 'Torr'));

const reverse = calculateMmhgToAtm({ source: 'atm', mmHg: null, atm: 2 });
assert.equal(reverse.mmHg, 1520);

assert.match(shareResultText(oneAtm), /mmHg to atm Conversion/);
assert.match(shareResultText(oneAtm), /760/);

console.log('mmhg-to-atm calculation.test.ts: ok');
