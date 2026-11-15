import assert from 'node:assert/strict';
import { calculateInformationRatio } from './calculation';

{
  const r = calculateInformationRatio({
    beginningValue: 100_000,
    endingValue: 112_000,
    benchmarkReturnPercent: 8,
    trackingErrorPercent: 5,
  });
  assert.ok(r);
  assert.equal(r!.portfolioReturnPercent, 12);
  assert.ok(Math.abs(r!.informationRatio - 0.8) < 1e-9);
}

{
  assert.equal(
    calculateInformationRatio({
      beginningValue: 0,
      endingValue: 100,
      benchmarkReturnPercent: 0,
      trackingErrorPercent: 1,
    }),
    null
  );
}

{
  assert.equal(
    calculateInformationRatio({
      beginningValue: 100,
      endingValue: 110,
      benchmarkReturnPercent: 5,
      trackingErrorPercent: 0,
    }),
    null
  );
}

console.log('information-ratio calculation.test.ts: ok');
