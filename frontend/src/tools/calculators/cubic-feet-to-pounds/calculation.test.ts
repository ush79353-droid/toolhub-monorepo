import assert from 'node:assert/strict';
import {
  calculateCubicFeetToPounds,
  convertDensity,
  cubicFeetToPounds,
  densityToLbPerFt3,
  lbPerFt3ToDensity,
  poundsToCubicFeet,
  shareResultText,
} from './calculation';
import {
  CONCRETE_DENSITY_LB_PER_FT3,
  CUBIC_METERS_PER_CUBIC_FOOT,
  KG_PER_POUND,
  WATER_DENSITY_LB_PER_FT3,
} from './types';
import { parseOptionalNumber, validateCubicFeetToPounds } from './validation';

function close(actual: number, expected: number, digits = 8): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

assert.equal(KG_PER_POUND, 0.45359237);
assert.equal(CUBIC_METERS_PER_CUBIC_FOOT, 0.028316846592);

assert.equal(cubicFeetToPounds(0, CONCRETE_DENSITY_LB_PER_FT3), 0);
close(cubicFeetToPounds(1, CONCRETE_DENSITY_LB_PER_FT3), 149.83, 8);
close(cubicFeetToPounds(0.5, CONCRETE_DENSITY_LB_PER_FT3), 74.915, 8);
close(cubicFeetToPounds(5, CONCRETE_DENSITY_LB_PER_FT3), 749.15, 8);
close(cubicFeetToPounds(10, CONCRETE_DENSITY_LB_PER_FT3), 1498.3, 8);
close(cubicFeetToPounds(25, CONCRETE_DENSITY_LB_PER_FT3), 3745.75, 8);
close(cubicFeetToPounds(50, CONCRETE_DENSITY_LB_PER_FT3), 7491.5, 8);
close(cubicFeetToPounds(100, CONCRETE_DENSITY_LB_PER_FT3), 14983, 8);

close(cubicFeetToPounds(1, WATER_DENSITY_LB_PER_FT3), 62.3, 8);
close(cubicFeetToPounds(10, WATER_DENSITY_LB_PER_FT3), 623, 8);
close(cubicFeetToPounds(12, 75), 900, 8);

close(poundsToCubicFeet(749.15, CONCRETE_DENSITY_LB_PER_FT3), 5, 8);
close(poundsToCubicFeet(500, 100), 5, 8);
close(poundsToCubicFeet(1000, CONCRETE_DENSITY_LB_PER_FT3), 1000 / 149.83, 8);

assert.throws(() => cubicFeetToPounds(-1, 100));
assert.throws(() => cubicFeetToPounds(1, 0));
assert.throws(() => cubicFeetToPounds(1, -5));
assert.throws(() => poundsToCubicFeet(-1, 100));
assert.throws(() => poundsToCubicFeet(1, 0));

assert.equal(densityToLbPerFt3(149.83, 'lbPerFt3'), 149.83);
close(convertDensity(149.83, 'lbPerFt3', 'lbPerFt3'), 149.83, 12);
close(
  densityToLbPerFt3(convertDensity(149.83, 'lbPerFt3', 'kgPerM3'), 'kgPerM3'),
  149.83,
  8,
);
close(lbPerFt3ToDensity(62.3, 'lbPerFt3'), 62.3, 8);

{
  const result = calculateCubicFeetToPounds({
    source: 'cubicFeet',
    category: 'nonMetals',
    materialId: 'concrete',
    densityValue: CONCRETE_DENSITY_LB_PER_FT3,
    densityUnit: 'lbPerFt3',
    cubicFeet: 5,
    pounds: null,
  });
  close(result.pounds, 749.15, 8);
  assert.equal(result.materialName, 'Concrete');
  assert.match(shareResultText(result), /Concrete/);
  assert.match(shareResultText(result), /749\.15/);
}

{
  const reverse = calculateCubicFeetToPounds({
    source: 'pounds',
    category: 'nonMetals',
    materialId: 'concrete',
    densityValue: CONCRETE_DENSITY_LB_PER_FT3,
    densityUnit: 'lbPerFt3',
    cubicFeet: null,
    pounds: 1498.3,
  });
  close(reverse.cubicFeet, 10, 8);
}

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('1.'), null);
assert.ok(Number.isNaN(parseOptionalNumber('abc') as number));

assert.ok(
  !validateCubicFeetToPounds({
    source: 'cubicFeet',
    category: 'nonMetals',
    materialId: 'concrete',
    densityValue: 0,
    densityUnit: 'lbPerFt3',
    cubicFeet: 1,
    pounds: null,
  }).isValid,
);

assert.ok(
  !validateCubicFeetToPounds({
    source: 'cubicFeet',
    category: 'nonMetals',
    materialId: 'concrete',
    densityValue: CONCRETE_DENSITY_LB_PER_FT3,
    densityUnit: 'lbPerFt3',
    cubicFeet: null,
    pounds: null,
  }).isValid,
);

assert.ok(
  validateCubicFeetToPounds({
    source: 'cubicFeet',
    category: 'custom',
    materialId: 'custom',
    densityValue: 75,
    densityUnit: 'lbPerFt3',
    cubicFeet: 12,
    pounds: null,
  }).isValid,
);

console.log('cubic-feet-to-pounds calculation.test.ts: ok');
