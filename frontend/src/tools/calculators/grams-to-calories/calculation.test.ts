import assert from 'node:assert/strict';
import {
  alcoholGramsFromVolume,
  calculateCalories,
  formatKcal,
  shareResultText,
} from './calculation';
import { parseAbvPercent, parseNonNegativeNumber } from './validation';

function approx(actual: number, expected: number, eps = 1e-9): void {
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const r = calculateCalories({
    carbsG: 10,
    proteinG: 0,
    fatG: 0,
    alcoholMode: 'none',
    alcoholGrams: 0,
    volumeMl: 0,
    abvPercent: 0,
  });
  assert.equal(r.carbsKcal, 40);
  assert.equal(r.totalKcal, 40);
}

{
  const r = calculateCalories({
    carbsG: 0,
    proteinG: 10,
    fatG: 0,
    alcoholMode: 'none',
    alcoholGrams: 0,
    volumeMl: 0,
    abvPercent: 0,
  });
  assert.equal(r.proteinKcal, 40);
}

{
  const r = calculateCalories({
    carbsG: 0,
    proteinG: 0,
    fatG: 10,
    alcoholMode: 'none',
    alcoholGrams: 0,
    volumeMl: 0,
    abvPercent: 0,
  });
  assert.equal(r.fatKcal, 90);
}

{
  const r = calculateCalories({
    carbsG: 0,
    proteinG: 0,
    fatG: 0,
    alcoholMode: 'grams',
    alcoholGrams: 10,
    volumeMl: 0,
    abvPercent: 0,
  });
  assert.equal(r.alcoholKcal, 70);
  assert.equal(r.alcoholGramsUsed, 10);
}

{
  const r = calculateCalories({
    carbsG: 30,
    proteinG: 20,
    fatG: 10,
    alcoholMode: 'none',
    alcoholGrams: 99,
    volumeMl: 355,
    abvPercent: 5,
  });
  assert.equal(r.carbsKcal, 120);
  assert.equal(r.proteinKcal, 80);
  assert.equal(r.fatKcal, 90);
  assert.equal(r.alcoholKcal, 0);
  assert.equal(r.totalKcal, 290);
}

{
  const r = calculateCalories({
    carbsG: 25,
    proteinG: 15,
    fatG: 8,
    alcoholMode: 'none',
    alcoholGrams: 0,
    volumeMl: 0,
    abvPercent: 0,
  });
  assert.equal(r.totalKcal, 232);
}

{
  const r = calculateCalories({
    carbsG: 0,
    proteinG: 0,
    fatG: 0,
    alcoholMode: 'grams',
    alcoholGrams: 14,
    volumeMl: 0,
    abvPercent: 0,
  });
  assert.equal(r.alcoholKcal, 98);
}

{
  const mass = alcoholGramsFromVolume(355, 5);
  approx(mass, 14.00475);
  const r = calculateCalories({
    carbsG: 0,
    proteinG: 0,
    fatG: 0,
    alcoholMode: 'volume',
    alcoholGrams: 999,
    volumeMl: 355,
    abvPercent: 5,
  });
  approx(r.alcoholGramsUsed, 14.00475);
  approx(r.alcoholKcal, 98.03325);
}

assert.equal(
  calculateCalories({
    carbsG: 0,
    proteinG: 0,
    fatG: 0,
    alcoholMode: 'none',
    alcoholGrams: 0,
    volumeMl: 0,
    abvPercent: 0,
  }).totalKcal,
  0,
);

assert.equal(parseNonNegativeNumber('').blank, true);
assert.ok(parseNonNegativeNumber('-1').error);
assert.ok(parseAbvPercent('101').error);
assert.equal(parseAbvPercent('5').value, 5);

{
  const r = calculateCalories({
    carbsG: 30,
    proteinG: 20,
    fatG: 10,
    alcoholMode: 'none',
    alcoholGrams: 0,
    volumeMl: 0,
    abvPercent: 0,
  });
  const share = shareResultText(30, 20, 10, 0, r);
  assert.match(share, /Total: 290 kcal/);
  assert.match(share, /120 kcal/);
}

assert.equal(formatKcal(1250), '1,250');

console.log('grams-to-calories calculation.test.ts: ok');
