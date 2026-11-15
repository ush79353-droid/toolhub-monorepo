import assert from 'node:assert/strict';
import { calculateJensensAlpha } from './calculation';

{
  const r = calculateJensensAlpha({
    beginningValue: 10_000,
    endingValue: 11_500,
    riskFreeRatePercent: 4,
    beta: 1.2,
    marketReturnPercent: 11,
  });
  assert.ok(r);
  assert.equal(r!.portfolioReturnPercent, 15);
  assert.ok(Math.abs(r!.expectedReturnPercent - 12.4) < 1e-9);
  assert.ok(Math.abs(r!.jensensAlphaPercent - 2.6) < 1e-9);
}

{
  const r = calculateJensensAlpha({
    beginningValue: 10_000,
    endingValue: 9_000,
    riskFreeRatePercent: 4,
    beta: 1.2,
    marketReturnPercent: 11,
  });
  assert.ok(r);
  assert.equal(r!.portfolioReturnPercent, -10);
  assert.ok(r!.jensensAlphaPercent < 0);
}

{
  const r = calculateJensensAlpha({
    beginningValue: 10_000,
    endingValue: 11_000,
    riskFreeRatePercent: 5,
    beta: 0,
    marketReturnPercent: 11,
  });
  assert.ok(r);
  assert.equal(r!.expectedReturnPercent, 5);
  assert.equal(r!.jensensAlphaPercent, 5);
}

{
  assert.equal(
    calculateJensensAlpha({
      beginningValue: 0,
      endingValue: 100,
      riskFreeRatePercent: 4,
      beta: 1,
      marketReturnPercent: 11,
    }),
    null
  );
}

{
  assert.equal(
    calculateJensensAlpha({
      beginningValue: Number.NaN,
      endingValue: 100,
      riskFreeRatePercent: 4,
      beta: 1,
      marketReturnPercent: 11,
    }),
    null
  );
}

console.log('jensens-alpha calculation.test.ts: ok');
