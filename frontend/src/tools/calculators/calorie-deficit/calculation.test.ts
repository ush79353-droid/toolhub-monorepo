import assert from 'node:assert/strict';
import {
  calculateCalorieDeficit,
  calendarDaysBetween,
  KCAL_PER_KG_BODY_WEIGHT,
  todayUtcDateOnly,
} from './calculation';
import { validateCalorieDeficitInput } from './validation';
import { createDefaultInput, createEmptyInput } from './types';
import { mifflinStJeorBmrKcal } from '../calorie/calculation';

{
  const days = calendarDaysBetween('2026-11-22', '2026-11-29');
  assert.equal(days, 7);
}

{
  // 1 kg in 7 days → 7700/7 ≈ 1100 kcal/day
  const r = calculateCalorieDeficit({
    sex: 'female',
    ageYears: 30,
    heightCm: 165,
    currentWeightKg: 70,
    targetWeightKg: 69,
    days: 7,
    asOfDate: '2026-11-22',
    targetDate: '2026-11-29',
  });
  assert.ok(Math.abs(r.dailyDeficitKcal - KCAL_PER_KG_BODY_WEIGHT / 7) < 1e-9);
  const bmr = mifflinStJeorBmrKcal(70, 165, 30, 'female')!;
  assert.ok(Math.abs(r.maintenanceKcal - bmr * 1.2) < 1e-9);
  assert.ok(Math.abs(r.plannedIntakeKcal - (r.maintenanceKcal - r.dailyDeficitKcal)) < 1e-9);
}

{
  const v = validateCalorieDeficitInput(createEmptyInput(), '2026-11-22');
  assert.equal(v.isValid, false);
}

{
  const v = validateCalorieDeficitInput(
    {
      ...createDefaultInput(),
      ageYears: '30',
      heightValue: '165',
      currentWeightValue: '70',
      targetWeightValue: '70',
      targetDate: '2027-02-21',
    },
    '2026-11-22'
  );
  assert.equal(v.isValid, false);
  assert.ok(v.errors.targetWeightValue);
}

{
  const v = validateCalorieDeficitInput(
    {
      ...createDefaultInput(),
      ageYears: '30',
      heightValue: '165',
      currentWeightValue: '70',
      targetWeightValue: '68',
      targetDate: '2026-11-22',
    },
    '2026-11-22'
  );
  assert.equal(v.isValid, false);
  assert.ok(v.errors.targetDate);
}

{
  // Extreme: 10 kg in 7 days should fail weekly-loss / intake floor guards
  const v = validateCalorieDeficitInput(
    {
      ...createDefaultInput(),
      ageYears: '30',
      heightValue: '165',
      currentWeightValue: '80',
      targetWeightValue: '70',
      targetDate: '2026-11-29',
    },
    '2026-11-22'
  );
  assert.equal(v.isValid, false);
  assert.ok(v.errors.form);
}

{
  const asOf = todayUtcDateOnly(new Date(Date.UTC(2026, 10, 22)));
  assert.equal(asOf, '2026-11-22');
}

console.log('calorie-deficit calculation.test.ts: ok');
