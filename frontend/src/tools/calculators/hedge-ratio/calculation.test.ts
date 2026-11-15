import assert from 'node:assert/strict';
import { calculateHedgeRatio } from './calculation';

{
  const r = calculateHedgeRatio(500_000, 400_000);
  assert.ok(r);
  assert.equal(r!.hedgeRatioPercent, 80);
  assert.equal(r!.formattedHedgeRatio, '80');
}

{
  const r = calculateHedgeRatio(100, 0);
  assert.ok(r);
  assert.equal(r!.hedgeRatioPercent, 0);
}

{
  const r = calculateHedgeRatio(100, 150);
  assert.ok(r);
  assert.equal(r!.hedgeRatioPercent, 150);
}

{
  assert.equal(calculateHedgeRatio(0, 50), null);
  assert.equal(calculateHedgeRatio(100, -1), null);
}

console.log('hedge-ratio calculation.test.ts: ok');
