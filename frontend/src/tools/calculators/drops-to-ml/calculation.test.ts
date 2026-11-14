import assert from 'node:assert/strict';
import {
  calculateDropsToMl,
  calibrateDropsPerMl,
  dropsPerMlFromVolumePerDrop,
  dropsToMl,
  mlPerDrop,
  mlToDrops,
} from './calculation';
import {
  DEFAULT_DROPS_PER_ML,
  DEFAULT_DROPS_TO_ML_INPUT,
  ML_PER_US_CUP,
  ML_PER_US_FL_OZ,
  type DropsToMlInput,
} from './types';
import { validateCalibration, validateDropsToMl } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

function base(overrides: Partial<DropsToMlInput> = {}): DropsToMlInput {
  return { ...DEFAULT_DROPS_TO_ML_INPUT, ...overrides };
}

{
  assert.equal(DEFAULT_DROPS_PER_ML, 20);
  assertClose(mlPerDrop(20), 0.05);
  assertClose(dropsPerMlFromVolumePerDrop(0.05), 20);
  assertClose(dropsPerMlFromVolumePerDrop(0.04), 25);
}

{
  const cases: readonly [number, number][] = [
    [0, 0],
    [1, 0.05],
    [2, 0.1],
    [5, 0.25],
    [10, 0.5],
    [20, 1],
    [50, 2.5],
    [100, 5],
    [200, 10],
    [500, 25],
    [1000, 50],
  ];
  for (const [drops, ml] of cases) {
    assertClose(dropsToMl(drops, 20), ml);
    assertClose(mlToDrops(ml, 20), drops);
  }
}

{
  assertClose(dropsToMl(1, 25), 0.04);
  assertClose(dropsToMl(25, 25), 1);
  assertClose(dropsToMl(50, 25), 2);
  assertClose(dropsToMl(100, 25), 4);
  assertClose(mlToDrops(5, 25), 125);
}

{
  const r = calculateDropsToMl(base({ source: 'drops', drops: 100, dropsPerMl: 20 }));
  assertClose(r.ml, 5);
  assertClose(r.mlPerDrop, 0.05);
  assert.equal(r.factorAssumed, true);

  const custom = calculateDropsToMl(
    base({ source: 'drops', drops: 100, dropsPerMl: 25 })
  );
  assertClose(custom.ml, 4);
  assert.equal(custom.factorAssumed, false);
}

{
  // Source preservation: drops stay, factor change updates ml
  const before = calculateDropsToMl(
    base({ source: 'drops', drops: 100, dropsPerMl: 20 })
  );
  assertClose(before.ml, 5);
  const after = calculateDropsToMl(
    base({ source: 'drops', drops: 100, dropsPerMl: 25 })
  );
  assertClose(after.drops, 100);
  assertClose(after.ml, 4);

  const mlSource = calculateDropsToMl(
    base({ source: 'ml', ml: 5, drops: null, dropsPerMl: 25 })
  );
  assertClose(mlSource.ml, 5);
  assertClose(mlSource.drops, 125);
}

{
  assertClose(calibrateDropsPerMl(50, 2), 25);
  const calOk = validateCalibration(50, 2);
  assert.equal(calOk.isValid, true);
  const calBad = validateCalibration(50, 0);
  assert.equal(calBad.isValid, false);
  const calNeg = validateCalibration(-1, 2);
  assert.equal(calNeg.isValid, false);
}

{
  const badFactor = validateDropsToMl(base({ dropsPerMl: 0 }));
  assert.equal(badFactor.isValid, false);
  assert.ok(badFactor.errors.dropsPerMl);

  const neg = validateDropsToMl(base({ drops: -1 }));
  assert.equal(neg.isValid, false);

  const blank = validateDropsToMl(base({ drops: null, ml: null }));
  assert.equal(blank.isValid, false);

  const ok = validateDropsToMl(base());
  assert.equal(ok.isValid, true);
}

{
  const def = calculateDropsToMl(DEFAULT_DROPS_TO_ML_INPUT);
  assertClose(def.ml, 5);
  assertClose(def.otherUnits.find((u) => u.unit === 'µL')!.value, 5000);
  assertClose(def.otherUnits.find((u) => u.unit === 'cm³')!.value, 5);
  assertClose(
    def.otherUnits.find((u) => u.unit === 'US fl oz')!.value,
    5 / ML_PER_US_FL_OZ
  );
}

{
  // Educational: 1 L @ 20 drops/mL = 20000 drops; 1 US cup ≈ 4731.76 drops
  assertClose(mlToDrops(1000, 20), 20000);
  assertClose(mlToDrops(ML_PER_US_CUP, 20), ML_PER_US_CUP * 20);
  assertClose(0.05 / ML_PER_US_FL_OZ, 0.05 / 29.5735295625, 1e-15);
}

console.log('drops-to-ml calculation.test.ts: ok');
