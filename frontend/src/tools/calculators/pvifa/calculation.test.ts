import assert from 'node:assert/strict';
import { calculatePvifa, formatPvifa } from './calculation';

{
  const r = calculatePvifa({ interestRatePercent: 5, periods: 10 });
  assert.ok(r);
  assert.ok(Math.abs(r!.pvifa - 7.7217349292) < 1e-9);
  assert.equal(r!.formattedPvifa.slice(0, 6), '7.7217');
}

{
  const r = calculatePvifa({ interestRatePercent: 0, periods: 10 });
  assert.ok(r);
  assert.equal(r!.pvifa, 10);
}

{
  const r = calculatePvifa({ interestRatePercent: 5, periods: 0 });
  assert.ok(r);
  assert.equal(r!.pvifa, 0);
}

{
  const r = calculatePvifa({ interestRatePercent: -5, periods: 5 });
  assert.ok(r);
  assert.ok(Number.isFinite(r!.pvifa));
  assert.ok(r!.pvifa > 5);
}

{
  assert.equal(calculatePvifa({ interestRatePercent: -100, periods: 5 }), null);
  assert.equal(calculatePvifa({ interestRatePercent: 5, periods: 2.5 }), null);
  assert.equal(calculatePvifa({ interestRatePercent: 5, periods: -1 }), null);
}

{
  assert.equal(formatPvifa(7.7217349292).startsWith('7.7217'), true);
}

console.log('pvifa calculation.test.ts: ok');
