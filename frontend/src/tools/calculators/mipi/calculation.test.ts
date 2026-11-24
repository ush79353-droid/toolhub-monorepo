import assert from 'node:assert/strict';
import {
  COEF_AGE,
  COEF_ECOG,
  COEF_KI67,
  COEF_LDH,
  COEF_WBC,
  calculateMipi,
  computeContinuousMipi,
  riskGroupForScore,
  wbcPerUlFromScreenshotThousands,
} from './calculation';
import { createEmptyInput } from './types';

function approx(actual: number, expected: number, eps = 1e-6) {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

// LDH/ULN = 1 → log10 term is 0
{
  const { score, variant } = computeContinuousMipi({
    ageYears: 60,
    ecogTwoToFour: false,
    ldh: 160,
    uln: 160,
    wbcPerUl: 7000,
    ki67Percent: null,
  });
  const expected = COEF_AGE * 60 + COEF_WBC * Math.log10(7000);
  approx(score, expected);
  assert.equal(variant, 'mipi');
  assert.equal(riskGroupForScore(score, 'mipi'), 'intermediate');
}

// WBC screenshot unit ×1000/µL
{
  assert.equal(wbcPerUlFromScreenshotThousands(7), 7000);
}

// ECOG step
{
  const base = computeContinuousMipi({
    ageYears: 50,
    ecogTwoToFour: false,
    ldh: 160,
    uln: 160,
    wbcPerUl: 5000,
    ki67Percent: null,
  }).score;
  const high = computeContinuousMipi({
    ageYears: 50,
    ecogTwoToFour: true,
    ldh: 160,
    uln: 160,
    wbcPerUl: 5000,
    ki67Percent: null,
  }).score;
  approx(high - base, COEF_ECOG);
}

// MIPI-b Ki-67 extension
{
  const { score, variant } = computeContinuousMipi({
    ageYears: 65,
    ecogTwoToFour: false,
    ldh: 200,
    uln: 160,
    wbcPerUl: 9000,
    ki67Percent: 30,
  });
  const without =
    COEF_AGE * 65 +
    COEF_LDH * Math.log10(200 / 160) +
    COEF_WBC * Math.log10(9000);
  approx(score, without + COEF_KI67 * 30);
  assert.equal(variant, 'mipi_b');
  assert.equal(riskGroupForScore(5.6, 'mipi_b'), 'low');
  assert.equal(riskGroupForScore(6.0, 'mipi_b'), 'intermediate');
  assert.equal(riskGroupForScore(6.5, 'mipi_b'), 'high');
  assert.equal(riskGroupForScore(6.2, 'mipi'), 'high');
  assert.equal(riskGroupForScore(6.2, 'mipi_b'), 'intermediate');
}

// End-to-end calculateMipi with missing Ki-67 when optional off
{
  const input = createEmptyInput();
  input.ageYearsText = '60';
  input.serumLdhText = '160';
  input.ldhUlnText = '160';
  input.wbcThousandPerUlText = '7';
  input.knowKi67 = false;
  const r = calculateMipi(input);
  assert.ok(r.score != null);
  assert.equal(r.variant, 'mipi');
  assert.ok(r.formattedScore.length > 0);
}

// Missing Ki-67 when knowKi67 true → no score
{
  const input = createEmptyInput();
  input.ageYearsText = '60';
  input.serumLdhText = '160';
  input.ldhUlnText = '160';
  input.wbcThousandPerUlText = '7';
  input.knowKi67 = true;
  input.ki67PercentText = '';
  const r = calculateMipi(input);
  assert.equal(r.score, null);
}

console.log('mipi calculation.test.ts: ok');
