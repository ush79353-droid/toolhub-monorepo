/**
 * Quarantine Activity Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/quarantine-activity/calculation.test.ts
 */
import {
  calculateQuarantineActivity,
  caloriesFromMet,
  formatPal,
  palFromLevels,
  timeToMinutes,
} from './calculation';
import { validateQuarantineActivityInput } from './validation';
import { createDefaultInput, emptySlot } from './types';
import { activityById } from './activities';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Omni PAL map: home office + basic + light = 1+1+1 → 1.5
assert(palFromLevels(1, 1, 1) === 1.5, 'default PAL 1.5');
assert(palFromLevels(0, 0, 0) === 1.2, 'sedentary PAL 1.2');
assert(palFromLevels(3, 3, 3) === 2.4, 'max PAL 2.4');
assert(formatPal(1.5) === '1.5', 'pal display');

assert(activityById('running')?.met === 9.8, 'running MET');
assert(activityById('yoga')?.met === 3, 'yoga MET');

assert(timeToMinutes(1, 'hrs') === 60, 'hrs→min');
assert(timeToMinutes(30, 'min') === 30, 'min');

// Compendium: 9.8 MET × 3.5 × 65 kg × 60 min / 200
{
  const kcal = caloriesFromMet(9.8, 65, 60);
  assert(kcal != null && Math.abs(kcal - 668.85) < 1e-6, 'running 60m @65kg');
}

{
  const input = {
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '170',
    weightText: '65',
  };
  const r = calculateQuarantineActivity(input);
  assert(r.pal === 1.5, 'result PAL');
  // BMR female = 10*65 + 6.25*170 - 5*30 - 161 = 1401.5; ×1.5 = 2102.25
  assert(r.maintenanceKcalPerDay != null, 'maintenance present');
  assert(
    Math.abs(r.maintenanceKcalPerDay! - 2102.25) < 1e-6,
    `maintenance got ${r.maintenanceKcalPerDay}`,
  );
  assert(r.maintenanceDisplay === '2,102', 'rounded display');
}

// Identical added/removed → net zero
{
  const slot = { activityId: 'running', timeText: '45', timeUnit: 'min' as const };
  const input = {
    ...createDefaultInput(),
    ageYearsText: '30',
    heightText: '170',
    weightText: '65',
    removed: [slot, emptySlot(), emptySlot()],
    added: [{ ...slot }, emptySlot(), emptySlot()],
  };
  const r = calculateQuarantineActivity(input);
  assert(r.removedKcal != null && r.addedKcal != null, 'both kcal');
  assert(Math.abs(r.deltaKcal!) < 1e-9, 'identical net zero');
  assert(/net ≈ 0/i.test(r.deltaDisplay), 'net zero copy');
}

// Avoid counting same bout in PAL and delta: PAL unchanged when only MET rows change
{
  const base = {
    ...createDefaultInput(),
    ageYearsText: '40',
    heightText: '175',
    weightText: '70',
  };
  const withActs = {
    ...base,
    removed: [
      { activityId: 'walking', timeText: '60', timeUnit: 'min' as const },
      emptySlot(),
      emptySlot(),
    ],
  };
  const a = calculateQuarantineActivity(base);
  const b = calculateQuarantineActivity(withActs);
  assert(a.pal === b.pal, 'PAL independent of MET rows');
  assert(a.maintenanceKcalPerDay === b.maintenanceKcalPerDay, 'TDEE independent');
  assert(b.removedKcal != null && b.removedKcal > 0, 'removed kcal only in delta');
}

{
  const v = validateQuarantineActivityInput(createDefaultInput());
  assert(v.result?.pal === 1.5, 'default validates PAL');
  assert(v.result?.maintenanceKcalPerDay == null, 'blank anthro → no TDEE');
}

{
  const v = validateQuarantineActivityInput({
    ...createDefaultInput(),
    ageYearsText: '12',
  });
  assert(v.errors.ageYearsText, 'age too young');
  assert(v.result == null, 'errors block result');
}

console.log('quarantine-activity calculation.test.ts: ok');
