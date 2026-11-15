import assert from 'node:assert/strict';
import {
  calculateOzToCups,
  cupsToMl,
  flOzToMl,
  mlToCups,
  mlToFlOz,
} from './calculation';
import {
  DEFAULT_OZ_TO_CUPS_INPUT,
  ML_PER_CUP,
  ML_PER_IMPERIAL_FL_OZ,
  ML_PER_US_FL_OZ,
  type OzToCupsInput,
} from './types';
import { validateOzToCups } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

function base(overrides: Partial<OzToCupsInput> = {}): OzToCupsInput {
  return { ...DEFAULT_OZ_TO_CUPS_INPUT, ...overrides };
}

{
  assertClose(ML_PER_US_FL_OZ, 29.5735295625);
  assertClose(ML_PER_IMPERIAL_FL_OZ, 28.4130625);
  assertClose(ML_PER_CUP.usCustomary, 236.5882365);
  assertClose(ML_PER_CUP.usLegal, 240);
  assertClose(ML_PER_CUP.metric, 250);
  assertClose(ML_PER_CUP.imperial, 284.130625);
  assertClose(ML_PER_CUP.usCustomary, 8 * ML_PER_US_FL_OZ);
  assertClose(ML_PER_CUP.imperial, 10 * ML_PER_IMPERIAL_FL_OZ);
}

{
  const cases: readonly [number, number][] = [
    [0, 0],
    [1, 0.125],
    [2, 0.25],
    [3, 0.375],
    [4, 0.5],
    [5, 0.625],
    [6, 0.75],
    [7, 0.875],
    [8, 1],
    [12, 1.5],
    [16, 2],
    [20, 2.5],
    [24, 3],
    [32, 4],
    [40, 5],
    [64, 8],
  ];
  for (const [flOz, cups] of cases) {
    const r = calculateOzToCups(
      base({ source: 'flOz', flOz, cups: null, flOzStandard: 'us', cupStandard: 'usCustomary' })
    );
    assertClose(r.cups, cups);
    assertClose(r.volumeMl, flOz * ML_PER_US_FL_OZ);
  }
}

{
  const reverse: readonly [number, number][] = [
    [0.125, 1],
    [0.25, 2],
    [0.5, 4],
    [0.75, 6],
    [1, 8],
    [1.5, 12],
    [2, 16],
    [3, 24],
  ];
  for (const [cups, flOz] of reverse) {
    const r = calculateOzToCups(
      base({
        source: 'cups',
        cups,
        flOz: null,
        flOzStandard: 'us',
        cupStandard: 'usCustomary',
      })
    );
    assertClose(r.flOz, flOz);
  }
}

{
  assertClose(flOzToMl(1, 'imperial'), 28.4130625);
  assertClose(mlToFlOz(284.130625, 'imperial'), 10);
  const imp = calculateOzToCups(
    base({
      source: 'flOz',
      flOz: 10,
      flOzStandard: 'imperial',
      cupStandard: 'imperial',
    })
  );
  assertClose(imp.cups, 1);
  assertClose(imp.volumeMl, 284.130625);

  const two = calculateOzToCups(
    base({
      source: 'cups',
      cups: 2,
      flOz: null,
      flOzStandard: 'imperial',
      cupStandard: 'imperial',
    })
  );
  assertClose(two.flOz, 20);
}

{
  const metric = calculateOzToCups(
    base({ source: 'flOz', flOz: 8, flOzStandard: 'us', cupStandard: 'metric' })
  );
  assertClose(metric.volumeMl, 236.5882365);
  assertClose(metric.cups, 236.5882365 / 250);

  const legal = calculateOzToCups(
    base({ source: 'flOz', flOz: 8, flOzStandard: 'us', cupStandard: 'usLegal' })
  );
  assertClose(legal.cups, 236.5882365 / 240);
}

{
  // Fractions under US customary
  assertClose(mlToCups(cupsToMl(0.125, 'usCustomary'), 'usCustomary'), 0.125);
  assertClose(
    calculateOzToCups(
      base({ source: 'cups', cups: 0.125, flOz: null, cupStandard: 'usCustomary' })
    ).flOz,
    1
  );
  assertClose(
    calculateOzToCups(
      base({ source: 'cups', cups: 0.25, flOz: null })
    ).flOz,
    2
  );
  assertClose(
    calculateOzToCups(base({ source: 'cups', cups: 0.5, flOz: null })).flOz,
    4
  );
  assertClose(
    calculateOzToCups(base({ source: 'cups', cups: 0.75, flOz: null })).flOz,
    6
  );
  assertClose(
    calculateOzToCups(base({ source: 'cups', cups: 1.5, flOz: null })).flOz,
    12
  );
}

{
  const bad = validateOzToCups(base({ flOz: -1 }));
  assert.equal(bad.isValid, false);
  const blank = validateOzToCups(base({ flOz: null, cups: null }));
  assert.equal(blank.isValid, false);
  const ok = validateOzToCups(base());
  assert.equal(ok.isValid, true);
}

{
  const def = calculateOzToCups(DEFAULT_OZ_TO_CUPS_INPUT);
  assertClose(def.flOz, 8);
  assertClose(def.cups, 1);
  assertClose(def.volumeMl, 236.5882365);
  assert.ok(def.otherUnits.length > 0);
}

console.log('oz-to-cups calculation.test.ts: ok');
