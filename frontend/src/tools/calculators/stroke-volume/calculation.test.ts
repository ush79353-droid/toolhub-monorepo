/**
 * Self-check: npx tsx calculation.test.ts
 */
import {
  cardiacIndexFromCo,
  mostellerBsaM2,
  strokeVolumeFromCoHr,
  strokeVolumeIndex,
  calculateStrokeVolume,
  coToLPerMin,
  heightToCm,
  weightToKg,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateStrokeVolumeInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Prompt fixture: CO=5, HR=100, BSA=2 → SV 50, CI 2.5, SVI 25
assert(approx(strokeVolumeFromCoHr(5, 100)!, 50), 'SV 50 mL');
assert(approx(mostellerBsaM2(180, 80)!, 2), 'Mosteller BSA 2');
assert(approx(cardiacIndexFromCo(5, 2)!, 2.5), 'CI 2.5');
assert(approx(strokeVolumeIndex(50, 2)!, 25), 'SVI 25');

// Zero denominators rejected
assert(strokeVolumeFromCoHr(5, 0) == null, 'HR 0 rejected');
assert(strokeVolumeFromCoHr(0, 100) == null, 'CO 0 rejected');
assert(mostellerBsaM2(180, 0) == null, 'weight 0 rejected');
assert(cardiacIndexFromCo(5, 0) == null, 'BSA 0 rejected');
assert(strokeVolumeIndex(50, 0) == null, 'SVI BSA 0 rejected');

// Alternate units: 5000 mL/min ≡ 5 L/min; 70.866 in ≡ 180 cm; 176.37 lb ≈ 80 kg
assert(approx(coToLPerMin(5000, 'mL/min'), 5), 'mL/min → L/min');
assert(approx(heightToCm(70.86614173228346, 'in'), 180, 1e-6), 'in → cm');
assert(approx(weightToKg(176.369809747901, 'lb'), 80, 1e-6), 'lb → kg');

// Partial: CO+HR alone yields SV without BSA
{
  const input = { ...createDefaultInput(), cardiacOutput: '5', heartRateBpm: '100' };
  const v = validateStrokeVolumeInput(input);
  assert(v.result.strokeVolumeMl != null && approx(v.result.strokeVolumeMl, 50), 'partial SV');
  assert(v.result.bsaM2 == null, 'partial no BSA');
  assert(v.result.cardiacIndex == null, 'partial no CI');
}

// Example path through validate
{
  const v = validateStrokeVolumeInput(createExampleInput());
  assert(v.isValid, 'example valid');
  assert(v.result.strokeVolumeMl != null && approx(v.result.strokeVolumeMl, 50), 'example SV');
  assert(v.result.bsaM2 != null && approx(v.result.bsaM2!, 2), 'example BSA');
  assert(v.result.cardiacIndex != null && approx(v.result.cardiacIndex!, 2.5), 'example CI');
  assert(
    v.result.strokeVolumeIndex != null && approx(v.result.strokeVolumeIndex!, 25),
    'example SVI'
  );
}

// Display unit switch does not change canonical SV
{
  const base = createExampleInput();
  const ml = calculateStrokeVolume(base, {
    coLMin: 5,
    hrBpm: 100,
    heightCm: 180,
    weightKg: 80,
  });
  const liters = calculateStrokeVolume(
    { ...base, svUnit: 'L' },
    { coLMin: 5, hrBpm: 100, heightCm: 180, weightKg: 80 }
  );
  assert(approx(ml.strokeVolumeMl!, liters.strokeVolumeMl!), 'SV unit display-only');
  assert(liters.formattedSv === '0.05', `SV in L got ${liters.formattedSv}`);
}

console.log('stroke-volume calculation.test.ts: ok');
