import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBoxedToteFabric,
  calculateFlatToteFabric,
  convertArea,
  convertLength,
  convertLengthToMm,
  computeBagFabric,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateBagInputs } from './validation';

function approx(actual: number, expected: number, tol = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Bag Calculator engine', () => {
  it('flat tote 40×35 · S1 · T2 → 37 × 84 · area 3108', () => {
    const cut = calculateFlatToteFabric(400, 350, 10, 20);
    approx(cut.fabricWidthMm, 370);
    approx(cut.fabricHeightMm, 840);
    const r = computeBagFabric({
      heightMm: 400,
      widthMm: 350,
      depthMm: 0,
      boxCorners: false,
      seamMm: 10,
      hemMm: 20,
      displayUnit: 'cm',
      areaUnit: 'cm2',
    });
    approx(r.fabricWidthMm / 10, 37);
    approx(r.fabricHeightMm / 10, 84);
    approx(r.fabricAreaMm2 / 100, 3108);
  });

  it('boxed 40×35×10 · S1 · T2 → 47 × 94 · area 4418', () => {
    const cut = calculateBoxedToteFabric(400, 350, 100, 10, 20);
    approx(cut.fabricWidthMm, 470);
    approx(cut.fabricHeightMm, 940);
    const r = computeBagFabric({
      heightMm: 400,
      widthMm: 350,
      depthMm: 100,
      boxCorners: true,
      seamMm: 10,
      hemMm: 20,
      displayUnit: 'cm',
      areaUnit: 'cm2',
    });
    approx(r.fabricAreaMm2 / 100, 4418);
  });

  it('no allowances → 25 × 60', () => {
    const cut = calculateFlatToteFabric(300, 250, 0, 0);
    approx(cut.fabricWidthMm, 250);
    approx(cut.fabricHeightMm, 600);
  });

  it('10 in → 25.4 cm', () => {
    approx(convertLength(10, 'in', 'cm'), 25.4);
  });

  it('10000 cm² → 1 m²', () => {
    approx(convertArea(10000, 'cm2', 'm2'), 1);
  });

  it('default flat fixture validates → 37×84', () => {
    const v = validateBagInputs(createEmptyInput());
    assert.ok(v.result);
    approx(v.result!.fabricWidthMm / 10, 37);
    approx(v.result!.fabricHeightMm / 10, 84);
    assert.equal(v.result!.depthIgnored, true);
  });

  it('box corners yes on default dims → 47×94', () => {
    const v = validateBagInputs({
      ...createEmptyInput(),
      boxCorners: true,
    });
    assert.ok(v.result);
    approx(v.result!.fabricWidthMm / 10, 47);
    approx(v.result!.fabricHeightMm / 10, 94);
  });

  it('negative height invalid', () => {
    const v = validateBagInputs({ ...createEmptyInput(), height: '-10' });
    assert.ok(v.errors.height);
    assert.equal(v.result, null);
  });

  it('zero width invalid', () => {
    const v = validateBagInputs({ ...createEmptyInput(), width: '0' });
    assert.ok(v.errors.width);
    assert.equal(v.result, null);
  });

  it('blank → no result', () => {
    const v = validateBagInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('mm conversion', () => {
    approx(convertLengthToMm(1, 'cm'), 10);
  });
});
