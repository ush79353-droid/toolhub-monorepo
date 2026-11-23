/**
 * Period Calculator — assert-based engine check.
 * Run: npx tsx src/tools/calculators/period/calculation.test.ts
 */
import {
  bleedingEndIso,
  calculatePeriodForecast,
  cycleStartIso,
  fertileWindowForCycle,
  ovulationIso,
} from './calculation';
import { validatePeriodInput } from './validation';
import { createExampleInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(cycleStartIso('2026-01-01', 28, 0) === '2026-01-01', 'k0');
assert(cycleStartIso('2026-01-01', 28, 1) === '2026-01-29', 'k1');
assert(bleedingEndIso('2026-01-01', 6) === '2026-01-06', '6-day inclusive');
assert(ovulationIso('2026-01-01', 28) === '2026-01-14', 'day-14 ovulation');

{
  const w = fertileWindowForCycle('2026-01-01', 28, 0);
  assert(w.fertileStartIso === '2026-01-09', 'fertile start');
  assert(w.fertileEndIso === '2026-01-14', 'fertile end = ovulation');
}

{
  const r = calculatePeriodForecast('2026-01-01', 28, 6);
  assert(r.nextPeriods.length === 3, '3 next periods');
  assert(r.nextPeriods[0]!.startIso === '2026-01-29', 'next start');
  assert(r.nextPeriods[0]!.endIso === '2026-02-03', 'next end');
  assert(r.primaryOvulationIso === '2026-01-14', 'primary ov');
}

// Month/year boundary
assert(cycleStartIso('2026-12-20', 28, 1) === '2027-01-17', 'year boundary');

{
  const v = validatePeriodInput(createExampleInput());
  assert(v.isValid && v.result, 'example ok');
}

{
  const v = validatePeriodInput({
    cycleDays: '21',
    periodDays: '21',
    lastPeriodIso: '2026-01-01',
  });
  assert(!v.isValid && v.errors.periodDays, 'period < cycle');
}

{
  const v = validatePeriodInput({
    ...createExampleInput(),
    lastPeriodIso: '',
  });
  assert(!v.isValid && !v.result, 'blank LMP');
}

console.log('period calculation.test.ts: ok');
