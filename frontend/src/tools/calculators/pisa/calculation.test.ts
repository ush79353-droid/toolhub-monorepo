import assert from 'node:assert/strict';
import {
  angleCorrectedPisaCm2,
  hemisphereSurfaceCm2,
  orificeAreaCm2,
  regurgitantVolumeMl,
  volumeFlowRateMlPerS,
} from './calculation';
import { createExampleInput, createEmptyInput } from './types';
import { validatePisaInput } from './validation';

// Hemisphere 180°
{
  const a = hemisphereSurfaceCm2(1);
  assert.ok(a != null);
  assert.ok(Math.abs(a - 2 * Math.PI) < 1e-9);
  const a180 = angleCorrectedPisaCm2(1, 180);
  assert.ok(a180 != null && Math.abs(a180 - a) < 1e-12);
  const a90 = angleCorrectedPisaCm2(1, 90);
  assert.ok(a90 != null && Math.abs(a90 - a / 2) < 1e-12);
}

// Prompt fixture
{
  const pisa = angleCorrectedPisaCm2(1, 180)!;
  const vfr = volumeFlowRateMlPerS(pisa, 40)!;
  const orifice = orificeAreaCm2(vfr, 500)!;
  const rvol = regurgitantVolumeMl(orifice, 100)!;
  assert.ok(Math.abs(vfr - 2 * Math.PI * 40) < 1e-6);
  assert.ok(Math.abs(orifice - vfr / 500) < 1e-9);
  assert.ok(Math.abs(rvol - orifice * 100) < 1e-9);
  assert.ok(Math.abs(orifice * 100 - 50.2654824574) < 1e-6);
}

// Zero Vmax → no orifice
{
  assert.equal(orificeAreaCm2(100, 0), null);
  const v = validatePisaInput({
    ...createExampleInput(),
    vmax: '0',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.vmax);
}

// Blank α → 180°
{
  const v = validatePisaInput({
    ...createExampleInput(),
    alpha: '',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result.alphaUsedDeg, 180);
  assert.ok(v.result.pisaCm2 != null);
}

// Partial: radius only → PISA
{
  const v = validatePisaInput({
    ...createEmptyInput(),
    radius: '1',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result?.pisaCm2 != null);
  assert.equal(v.result?.vfrMlPerS, null);
  assert.equal(v.result?.mvaCm2, null);
}

// Unit scaling mm radius
{
  const v = validatePisaInput({
    ...createExampleInput(),
    radius: '10',
    radiusUnit: 'mm',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result?.pisaCm2 != null);
  assert.ok(Math.abs(v.result!.pisaCm2! - 2 * Math.PI) < 1e-6);
}

console.log('pisa calculation.test.ts: ok');
