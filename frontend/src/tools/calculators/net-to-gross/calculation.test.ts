import assert from 'node:assert/strict';
import {
  fromGrossAndRateFromGross,
  fromNetAndRateFromNet,
  fromNetAndGross,
} from './calculation';

{
  const r = fromNetAndRateFromNet(100, 20);
  assert.ok(r);
  assert.equal(r.tax, 20);
  assert.equal(r.gross, 120);
  assert.ok(Math.abs(r.rateFromGross - 100 / 6) < 1e-9);
}

{
  const r = fromGrossAndRateFromGross(120, 100 / 6);
  assert.ok(r);
  assert.ok(Math.abs(r.net - 100) < 1e-9);
  assert.ok(Math.abs(r.tax - 20) < 1e-9);
  assert.ok(Math.abs(r.rateFromNet - 20) < 1e-9);
}

{
  const r = fromNetAndGross(100, 120);
  assert.ok(r);
  assert.equal(r.tax, 20);
}

assert.equal(fromGrossAndRateFromGross(100, 100), null);

console.log('net-to-gross calculation.test.ts: ok');
