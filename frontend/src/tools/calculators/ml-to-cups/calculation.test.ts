import assert from 'node:assert/strict';
import {
  calculateMlToCups,
  cupsToMl,
  formatVolume,
  mlToCups,
} from './calculation';
import { parseVolumeField } from './validation';
import {
  DEFAULT_ML_TO_CUPS_INPUT,
  ML_PER_CUP,
  type MlToCupsInput,
} from './types';
import { validateMlToCups } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

function base(overrides: Partial<MlToCupsInput> = {}): MlToCupsInput {
  return { ...DEFAULT_ML_TO_CUPS_INPUT, ...overrides };
}

{
  assertClose(ML_PER_CUP.usCustomary, 236.5882365);
  assertClose(ML_PER_CUP.usLegal, 240);
  assertClose(ML_PER_CUP.metric, 250);
  assertClose(ML_PER_CUP.imperial, 284.130625);
}

{
  assertClose(cupsToMl(1, 'usCustomary'), 236.5882365);
  assertClose(cupsToMl(2, 'usCustomary'), 473.176473);
  assertClose(cupsToMl(0.5, 'usCustomary'), 118.29411825);
  assertClose(cupsToMl(0.25, 'usCustomary'), 59.147059125);
  assertClose(cupsToMl(3, 'usCustomary'), 709.7647095);
  assertClose(cupsToMl(4, 'usCustomary'), 946.352946);
  assertClose(cupsToMl(0, 'usCustomary'), 0);
}

{
  assertClose(cupsToMl(1, 'metric'), 250);
  assertClose(cupsToMl(2, 'metric'), 500);
  assertClose(cupsToMl(0.5, 'metric'), 125);
  assertClose(cupsToMl(3, 'metric'), 750);
  assertClose(cupsToMl(4, 'metric'), 1000);
}

{
  assertClose(cupsToMl(1, 'usLegal'), 240);
  assertClose(cupsToMl(2, 'usLegal'), 480);
  assertClose(cupsToMl(0.5, 'usLegal'), 120);
}

{
  assertClose(cupsToMl(1, 'imperial'), 284.130625);
  assertClose(cupsToMl(2, 'imperial'), 568.26125);
  assertClose(cupsToMl(0.5, 'imperial'), 142.0653125);
}

{
  assertClose(mlToCups(473.176473, 'usCustomary'), 2);
  assertClose(mlToCups(250, 'usCustomary'), 250 / 236.5882365);
  assertClose(mlToCups(500, 'usCustomary'), 500 / 236.5882365);
  assertClose(mlToCups(250, 'metric'), 1);
  assertClose(mlToCups(500, 'metric'), 2);
}

{
  // Standard switch: preserve milliliters source
  const fromMl = calculateMlToCups(
    base({ source: 'ml', ml: 500, cups: null, cupStandard: 'usCustomary' })
  );
  assertClose(fromMl.cups, 500 / 236.5882365);

  const metric = calculateMlToCups(
    base({ source: 'ml', ml: 500, cups: null, cupStandard: 'metric' })
  );
  assertClose(metric.cups, 2);
  assertClose(metric.ml, 500);
}

{
  // Standard switch: preserve cups source
  const us = calculateMlToCups(
    base({ source: 'cups', cups: 2, ml: null, cupStandard: 'usCustomary' })
  );
  assertClose(us.ml, 473.176473);

  const metric = calculateMlToCups(
    base({ source: 'cups', cups: 2, ml: null, cupStandard: 'metric' })
  );
  assertClose(metric.ml, 500);
  assertClose(metric.cups, 2);
}

{
  assertClose(parseVolumeField('1/2', true).value!, 0.5);
  assertClose(parseVolumeField('1/4', true).value!, 0.25);
  assertClose(parseVolumeField('3/4', true).value!, 0.75);
  assertClose(parseVolumeField('1 1/2', true).value!, 1.5);
  assert.equal(parseVolumeField('1/0', true).value, Number.NaN);
  assert.ok(parseVolumeField('1/0', true).error);
  assert.equal(parseVolumeField('1.', true).value, null);
}

{
  const def = calculateMlToCups(DEFAULT_ML_TO_CUPS_INPUT);
  assertClose(def.cups, 2);
  assertClose(def.ml, 473.176473);
  assert.ok(def.otherUnits.some((row) => row.unit === 'L'));
  assert.ok(def.otherUnits.some((row) => row.unit === 'US fl oz'));
}

{
  const ok = validateMlToCups(DEFAULT_ML_TO_CUPS_INPUT);
  assert.equal(ok.isValid, true);
  const blank = validateMlToCups(base({ source: 'ml', ml: null, cups: null }));
  assert.equal(blank.isValid, false);
  const neg = validateMlToCups(base({ source: 'cups', cups: -1 }));
  assert.equal(neg.isValid, false);
}

{
  assert.equal(formatVolume(0), '0');
  assert.equal(formatVolume(236.5882365), '236.5882365');
}

console.log('ml-to-cups calculation.test.ts: ok');
