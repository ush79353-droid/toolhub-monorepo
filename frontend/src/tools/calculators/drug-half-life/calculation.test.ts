/**
 * Drug Half-Life — assert-based engine check.
 * Run: npx tsx src/tools/calculators/drug-half-life/calculation.test.ts
 */
import {
  calculateDrugHalfLife,
  concentrationFraction,
  massToMg,
  mgToMass,
  minutesToTime,
  remainingMass,
  timeToMinutes,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDrugHalfLifeInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Zero elapsed time → full dose remains
{
  const r = remainingMass(100, 0, 12);
  assert(r === 100, `t=0 remaining ${r}`);
  assert(concentrationFraction(0, 12) === 1, 't=0 concentration');
}

// Two half-lives → 25%
{
  const r = remainingMass(100, 24, 12);
  assert(approx(r, 25), `two half-lives remaining ${r}`);
  assert(approx(concentrationFraction(24, 12), 0.25), 'two half-lives fraction');
}

// One half-life → 50%; five → ~3.125%
{
  assert(approx(remainingMass(80, 10, 10), 40), 'one half-life');
  assert(approx(remainingMass(80, 50, 10), 2.5), 'five half-lives');
}

// Nonpositive half-life throws
{
  let threw = false;
  try {
    remainingMass(10, 1, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero half-life must throw');

  threw = false;
  try {
    remainingMass(10, 1, -5);
  } catch {
    threw = true;
  }
  assert(threw, 'negative half-life must throw');
}

// Unit conversion helpers (physical value preserved)
{
  assert(timeToMinutes(2, 'h') === 120, '2 h → minutes');
  assert(minutesToTime(120, 'h') === 2, '120 min → hours');
  assert(timeToMinutes(1, 'd') === 1440, '1 d → minutes');
  assert(approx(massToMg(1, 'g'), 1000), '1 g → mg');
  assert(approx(mgToMass(1000, 'g'), 1), '1000 mg → g');
  assert(approx(massToMg(500, 'mcg'), 0.5), '500 mcg → mg');
}

// Full calculator: blank defaults → empty cycles
{
  const r = calculateDrugHalfLife(createDefaultInput());
  assert(r.cycles.length === 0, 'blank no cycles');
  assert(r.timeUnit === 'min' && r.dosageUnit === 'mg', 'default units');
}

// Full calculator: 100 mg, t½ = 60 min → cycle 2 = 25 mg
{
  const r = calculateDrugHalfLife({
    halfLifeText: '60',
    halfLifeUnit: 'min',
    dosageText: '100',
    dosageUnit: 'mg',
  });
  assert(r.cycles.length === 6, `cycle count ${r.cycles.length}`);
  assert(r.cycles[0].remainingDosage === 100, 'cycle 0');
  assert(approx(r.cycles[1].remainingDosage, 50), 'cycle 1');
  assert(approx(r.cycles[2].remainingDosage, 25), 'cycle 2');
  assert(approx(r.cycles[2].concentrationFraction, 0.25), 'cycle 2 fraction');
  assert(r.cycles[2].elapsedTime === 120, 'cycle 2 elapsed');
}

// Validation: nonpositive half-life
{
  const v = validateDrugHalfLifeInput({
    halfLifeText: '0',
    halfLifeUnit: 'h',
    dosageText: '10',
    dosageUnit: 'mg',
  });
  assert(v.errors.halfLifeText, 'zero half-life error');
  assert(v.result?.cycles.length === 0, 'no cycles for bad half-life');
}

{
  const v = validateDrugHalfLifeInput({
    halfLifeText: '-3',
    halfLifeUnit: 'min',
    dosageText: '10',
    dosageUnit: 'mg',
  });
  assert(v.errors.halfLifeText, 'negative half-life error');
}

// Equivalence: A₀ × 2^(-t/t½)
{
  const a0 = 64;
  const t = 3;
  const tHalf = 1;
  const viaHalf = remainingMass(a0, t, tHalf);
  const viaPow2 = a0 * Math.pow(2, -t / tHalf);
  assert(approx(viaHalf, viaPow2), '0.5^(t/t½) ≡ 2^(-t/t½)');
  assert(approx(viaHalf, 8), 'three half-lives → 12.5% of 64 = 8');
}

console.log('drug-half-life calculation.test.ts: ok');
