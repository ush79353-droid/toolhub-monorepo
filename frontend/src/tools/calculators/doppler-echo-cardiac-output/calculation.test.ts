/**
 * Doppler Echo Cardiac Output — assert-based engine check.
 * Run: npx tsx src/tools/calculators/doppler-echo-cardiac-output/calculation.test.ts
 */
import assert from 'node:assert/strict';
import {
  cardiacOutputLPerMin,
  deriveOutputsFromNumbers,
  lvotCrossSectionalAreaCm2,
  strokeVolumeMl,
} from './calculation';

const diameterCm = 2;
const area = lvotCrossSectionalAreaCm2(diameterCm);
assert.ok(area != null);
assert.ok(Math.abs(area - Math.PI) < 1e-9);

const vtiCm = 20;
const sv = strokeVolumeMl(area, vtiCm);
assert.ok(sv != null);
assert.ok(Math.abs(sv - 62.83185307) < 0.01, `SV expected ~62.83, got ${sv}`);

const hr = 80;
const co = cardiacOutputLPerMin(sv, hr);
assert.ok(co != null);
assert.ok(Math.abs(co - 5.026548246) < 0.01, `CO expected ~5.03, got ${co}`);

const partial = deriveOutputsFromNumbers({
  heightCm: null,
  weightKg: null,
  heartRateBpm: hr,
  lvotDiameterCm: diameterCm,
  lvotVtiCm: vtiCm,
});
assert.ok(partial.strokeVolumeMl != null);
assert.ok(partial.cardiacOutputLPerMin != null);
assert.equal(partial.bsaM2, null);
assert.equal(partial.cardiacIndexLPerMinM2, null);

const withBsa = deriveOutputsFromNumbers({
  heightCm: 170,
  weightKg: 70,
  heartRateBpm: hr,
  lvotDiameterCm: diameterCm,
  lvotVtiCm: vtiCm,
});
assert.ok(withBsa.bsaM2 != null && withBsa.bsaM2 > 0);
assert.ok(withBsa.cardiacIndexLPerMinM2 != null);

console.log('doppler-echo-cardiac-output calculation.test.ts: ok');