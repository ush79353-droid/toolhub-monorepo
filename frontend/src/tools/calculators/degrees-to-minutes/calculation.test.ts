import assert from 'node:assert/strict';
import {
  ARCMINUTES_PER_DEGREE,
  arcminutesToDegrees,
  calculateDegreesToMinutes,
  degreesToArcminutes,
  degreesToArcminutesTableRows,
  formatAngleValue,
  shareResultText,
} from './calculation';
import { parseOptionalNumber, validateDegreesToMinutes } from './validation';

assert.equal(ARCMINUTES_PER_DEGREE, 60);

assert.equal(degreesToArcminutes(0), 0);
assert.equal(degreesToArcminutes(1), 60);
assert.equal(degreesToArcminutes(0.5), 30);
assert.equal(degreesToArcminutes(1.5), 90);
assert.equal(degreesToArcminutes(2.5), 150);
assert.equal(degreesToArcminutes(90), 5400);
assert.equal(degreesToArcminutes(180), 10800);
assert.equal(degreesToArcminutes(360), 21600);
assert.equal(degreesToArcminutes(-2), -120);

assert.equal(arcminutesToDegrees(60), 1);
assert.equal(arcminutesToDegrees(120), 2);
assert.equal(arcminutesToDegrees(90), 1.5);
assert.equal(arcminutesToDegrees(5400), 90);
assert.equal(arcminutesToDegrees(240), 4);
assert.equal(arcminutesToDegrees(-120), -2);

{
  const forward = calculateDegreesToMinutes({ source: 'degrees', value: 45 });
  assert.equal(forward.arcminutes, 2700);
  assert.equal(forward.degrees, 45);
}

{
  const reverse = calculateDegreesToMinutes({ source: 'arcminutes', value: 30 });
  assert.equal(reverse.degrees, 0.5);
  assert.equal(reverse.arcminutes, 30);
}

{
  const roundTrip = arcminutesToDegrees(degreesToArcminutes(-7.25));
  assert.equal(roundTrip, -7.25);
}

assert.equal(formatAngleValue(60), '60');
assert.equal(formatAngleValue(0.5), '0.5');
assert.match(shareResultText(calculateDegreesToMinutes({ source: 'degrees', value: 180 })), /10800/);

{
  const rows = degreesToArcminutesTableRows([1, 180]);
  assert.equal(rows[0]?.arcminutes, 60);
  assert.equal(rows[1]?.arcminutes, 10800);
}

assert.throws(() => degreesToArcminutes(Number.NaN));
assert.throws(() => arcminutesToDegrees(Number.POSITIVE_INFINITY));
assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('-'), null);
assert.equal(parseOptionalNumber('1.'), null);
assert.ok(!validateDegreesToMinutes({ source: 'degrees', value: null }).isValid);
assert.ok(!validateDegreesToMinutes({ source: 'degrees', value: Number.NaN }).isValid);
assert.ok(validateDegreesToMinutes({ source: 'arcminutes', value: -30 }).isValid);

console.log('degrees-to-minutes calculation.test.ts: ok');
