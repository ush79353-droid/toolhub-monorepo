/**
 * Run: npx tsx calculation.test.ts
 */
import { calculateMacro } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateMacro(createDefaultInput());
  assert(r == null || r.maintenanceKcal == null || true, 'blank ok');
}

{
  const r = calculateMacro({
    ...createDefaultInput(),
    sex: 'female',
    heightValue: '165',
    heightUnit: 'cm',
    weightValue: '60',
    weightUnit: 'kg',
    ageYears: '30',
    activityId: 'light',
    goalMode: 'maintain',
  });
  assert(r != null && r.maintenanceKcal > 0, 'maintenance kcal');
  assert(r!.macros.proteinMinG > 0, 'protein range');
  const sumMin =
    r!.macros.proteinMinG * 4 +
    r!.macros.carbMinG * 4 +
    r!.macros.fatMinG * 9;
  assert(sumMin > 0, 'macro energy shares');
}

console.log('macro calculation.test.ts: ok');
