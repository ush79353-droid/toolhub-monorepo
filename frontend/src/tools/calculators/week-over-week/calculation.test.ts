import assert from 'node:assert/strict';
import { calculateWeekOverWeek, formatWowPercent } from './calculation';

{
  const r = calculateWeekOverWeek({ initialWeek: 1000, followingWeek: 1200 });
  assert.ok(r);
  assert.equal(r!.wowGrowthPercent, 20);
  assert.equal(r!.formattedWowGrowth, '+20');
}

{
  const r = calculateWeekOverWeek({ initialWeek: 1000, followingWeek: 800 });
  assert.ok(r);
  assert.equal(r!.wowGrowthPercent, -20);
  assert.equal(r!.formattedWowGrowth, '-20');
}

{
  const r = calculateWeekOverWeek({ initialWeek: 500, followingWeek: 500 });
  assert.ok(r);
  assert.equal(r!.wowGrowthPercent, 0);
  assert.equal(r!.formattedWowGrowth, '0');
}

{
  const r = calculateWeekOverWeek({ initialWeek: 1000, followingWeek: 0 });
  assert.ok(r);
  assert.equal(r!.wowGrowthPercent, -100);
}

{
  assert.equal(calculateWeekOverWeek({ initialWeek: 0, followingWeek: 100 }), null);
  assert.equal(formatWowPercent(12.34567), '+12.3457');
}

console.log('week-over-week calculation.test.ts: ok');
