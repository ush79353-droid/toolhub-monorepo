import assert from 'node:assert/strict';
import { calculateYearOverYearGrowth } from './calculation';

{
  const r = calculateYearOverYearGrowth({
    initialYearValue: 100_000,
    finalYearValue: 120_000,
  });
  assert.ok(r);
  assert.equal(r!.yoyGrowthPercent, 20);
  assert.equal(r!.formattedYoyGrowth, '+20');
}

{
  const r = calculateYearOverYearGrowth({
    initialYearValue: 100_000,
    finalYearValue: 85_000,
  });
  assert.ok(r);
  assert.equal(r!.yoyGrowthPercent, -15);
}

{
  const r = calculateYearOverYearGrowth({
    initialYearValue: 50_000,
    finalYearValue: 50_000,
  });
  assert.ok(r);
  assert.equal(r!.yoyGrowthPercent, 0);
}

{
  const r = calculateYearOverYearGrowth({
    initialYearValue: 100,
    finalYearValue: 121,
    numberOfYears: 2,
  });
  assert.ok(r);
  assert.ok(r!.cagrPercent !== null);
  assert.ok(Math.abs(r!.cagrPercent! - 10) < 1e-6);
}

{
  assert.equal(
    calculateYearOverYearGrowth({ initialYearValue: 0, finalYearValue: 100 }),
    null
  );
}

console.log('year-over-year-growth calculation.test.ts: ok');
