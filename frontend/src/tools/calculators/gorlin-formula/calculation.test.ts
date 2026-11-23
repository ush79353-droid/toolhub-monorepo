import assert from 'node:assert/strict';
import { computeGorlinAreaCm2, AORTIC_K, MITRAL_K } from './calculation';
import { createExampleInput } from './types';
import { validateGorlinInput } from './validation';

{
  const ava = computeGorlinAreaCm2(5000, 75, 0.3, 40, AORTIC_K);
  assert.ok(ava != null);
  assert.ok(Math.abs(ava - 0.793) < 0.01);
  assert.equal(Number(ava.toFixed(2)), 0.79);
}

{
  assert.equal(computeGorlinAreaCm2(5000, 75, 0, 40, AORTIC_K), null);
  assert.equal(computeGorlinAreaCm2(5000, 0, 0.3, 40, AORTIC_K), null);
  assert.equal(computeGorlinAreaCm2(5000, 75, 0.3, 0, AORTIC_K), null);
}

{
  const mva = computeGorlinAreaCm2(5000, 75, 0.4, 10, MITRAL_K);
  assert.ok(mva != null && mva > 0);
}

{
  const v = validateGorlinInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result?.aortic);
  assert.equal(Number(v.result.aortic.areaCm2.toFixed(2)), 0.79);
  assert.equal(v.result.mitral, null);
}

console.log('gorlin-formula calculation.test.ts: ok');
