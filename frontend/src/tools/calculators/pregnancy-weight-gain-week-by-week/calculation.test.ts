import assert from 'node:assert/strict';
import {
  buildWeeklySeries,
  calculatePregnancyWeightGainWeekByWeek,
  heightToMeters,
  weightToKg,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validatePregnancyWeightGainWeekByWeekInput } from './validation';

{
  const m = heightToMeters(165, 'cm');
  const kg = weightToKg(60, 'kg');
  const series = buildWeeklySeries({
    heightMeters: m,
    weightKg: kg,
    twins: false,
  });
  assert.equal(series.length, 40);
  assert.equal(series[0]!.week, 1);
  assert.equal(series[39]!.week, 40);
  // Monotonic min/max through mid-pregnancy for singleton
  for (let i = 1; i < 39; i++) {
    assert.ok(series[i]!.minGainKg >= series[i - 1]!.minGainKg - 1e-9);
    assert.ok(series[i]!.maxGainKg >= series[i - 1]!.maxGainKg - 1e-9);
  }
}

{
  const result = calculatePregnancyWeightGainWeekByWeek(createExampleInput());
  assert.ok(result);
  assert.ok(result!.series.length > 0);
  assert.ok(result!.minGainKg != null && result!.maxGainKg != null);
  assert.ok(result!.minGainKg! < result!.maxGainKg!);
}

{
  const v = validatePregnancyWeightGainWeekByWeekInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.result, null);
}

console.log('pregnancy-weight-gain-week-by-week calculation.test.ts: ok');
