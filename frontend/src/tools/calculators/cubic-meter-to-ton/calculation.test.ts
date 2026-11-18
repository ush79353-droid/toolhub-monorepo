import assert from 'node:assert/strict';
import {
  calculateCubicMeterToTon,
  cubicMetersToTons,
  densityToKgPerM3,
  kgPerM3ToDensity,
  shareResultText,
  tonsToCubicMeters,
} from './calculation';
import {
  KG_PER_METRIC_TONNE,
  KG_PER_UK_LONG_TON,
  KG_PER_US_SHORT_TON,
  WATER_DENSITY_KG_PER_M3,
} from './types';
import { parseOptionalNumber, validateCubicMeterToTon } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KG_PER_METRIC_TONNE, 1000);
assert.equal(KG_PER_US_SHORT_TON, 907.18474);
close(KG_PER_UK_LONG_TON, 1016.0469088, 10);

assert.equal(cubicMetersToTons(0, 1000), 0);
close(cubicMetersToTons(1, 1000), 1, 10);
close(cubicMetersToTons(3, 2400), 7.2, 10);
close(cubicMetersToTons(2, 7850), 15.7, 10);
close(tonsToCubicMeters(8, 1600), 5, 10);

close(cubicMetersToTons(1, 1000, 'usShortTon'), 1000 / KG_PER_US_SHORT_TON, 7);
close(cubicMetersToTons(1, 1000, 'ukLongTon'), 1000 / KG_PER_UK_LONG_TON, 7);

assert.throws(() => cubicMetersToTons(-1, 1000));
assert.throws(() => cubicMetersToTons(1, 0));
assert.throws(() => cubicMetersToTons(1, -5));
assert.throws(() => tonsToCubicMeters(-1, 1000));
assert.throws(() => tonsToCubicMeters(1, 0));

assert.equal(densityToKgPerM3(1, 'gPerCm3'), 1000);
assert.equal(kgPerM3ToDensity(1000, 'gPerMl'), 1);
close(densityToKgPerM3(62.428, 'lbPerFt3'), 1000, 2);

{
  const result = calculateCubicMeterToTon({
    source: 'volume',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: WATER_DENSITY_KG_PER_M3,
    densityUnit: 'kgPerM3',
    volumeM3: 1,
    massTons: null,
    tonUnit: 'metricTonne',
  });
  close(result.massTons, 1, 10);
  close(result.massKg, 1000, 10);
  assert.match(shareResultText(result), /Water/);
}

{
  const reverse = calculateCubicMeterToTon({
    source: 'mass',
    category: 'construction',
    materialId: 'dry-sand-bulk',
    densityValue: 1600,
    densityUnit: 'kgPerM3',
    volumeM3: null,
    massTons: 8,
    tonUnit: 'metricTonne',
  });
  close(reverse.volumeM3, 5, 10);
}

assert.equal(parseOptionalNumber(''), null);
assert.ok(
  !validateCubicMeterToTon({
    source: 'volume',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: 0,
    densityUnit: 'kgPerM3',
    volumeM3: 1,
    massTons: null,
    tonUnit: 'metricTonne',
  }).isValid,
);

console.log('cubic-meter-to-ton calculation.test.ts: ok');
