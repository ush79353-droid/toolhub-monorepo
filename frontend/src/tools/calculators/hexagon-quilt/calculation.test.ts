import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateHexagonArea,
  calculateHexagonWidth,
  calculateHexagonHeight,
  convertLengthToCm,
  convertLengthUnits,
  calculateEquivalentHexagons,
  calculateHexagonQuiltResults,
  calculateHexagonColumns,
  calculateHexagonRows,
  generateHexagonGrid,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateQuiltInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Hexagon Quilt Calculator engine', () => {
  it('area s=5 ≈ 64.9519', () => {
    approx(calculateHexagonArea(5), 64.9519, 0.01);
  });

  it('point-to-point s=5 → 10', () => {
    assert.equal(calculateHexagonWidth(5), 10);
  });

  it('flat-to-flat s=5 ≈ 8.6603', () => {
    approx(calculateHexagonHeight(5), 8.6603, 0.001);
  });

  it('2 in → 5.08 cm', () => {
    approx(convertLengthToCm(2, 'in'), 5.08);
  });

  it('layout 150×200 · s=5 yields whole counts + covering actual size', () => {
    const r = calculateHexagonQuiltResults({
      desiredWidthCm: 150,
      desiredLengthCm: 200,
      sideCm: 5,
      seamAllowanceCm: 0.635,
      fabricWidthCm: null,
      wastePercent: 10,
    });
    assert.ok(Number.isInteger(r.columns) && r.columns >= 1);
    assert.ok(Number.isInteger(r.rows) && r.rows >= 1);
    assert.equal(r.fullHexagons, r.columns * r.rows);
    assert.equal(r.halfHexagons, r.verticalHalfHexagons + r.horizontalHalfHexagons);
    assert.ok(r.actualWidthCm >= 150 - 1e-6);
    assert.ok(r.actualLengthCm >= 200 - 1e-6);
    assert.equal(r.columns, calculateHexagonColumns(150, 5));
    assert.equal(r.rows, calculateHexagonRows(200, 5));
  });

  it('equivalent 100 full + 20 half → 110', () => {
    assert.equal(calculateEquivalentHexagons(100, 20), 110);
  });

  it('negative hexagon invalid', () => {
    const v = validateQuiltInputs({
      ...createEmptyInput(),
      hexagonSize: '-5',
    });
    assert.ok(v.errors.hexagonSize);
    assert.equal(v.result, null);
  });

  it('zero width invalid', () => {
    const v = validateQuiltInputs({
      ...createEmptyInput(),
      quiltWidth: '0',
    });
    assert.ok(v.errors.quiltWidth);
  });

  it('unit switching preserves cm', () => {
    approx(convertLengthUnits(150, 'cm', 'in'), 150 / 2.54, 0.001);
    approx(convertLengthUnits(150 / 2.54, 'in', 'cm'), 150, 0.001);
  });

  it('preview grid cell count matches columns×rows when small', () => {
    const cells = generateHexagonGrid(4, 3, 5);
    assert.equal(cells.length, 12);
    assert.equal(cells.every((c) => c.kind === 'full'), true);
  });

  it('empty → no result', () => {
    const v = validateQuiltInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('default example validates', () => {
    const v = validateQuiltInputs(createEmptyInput());
    assert.equal(v.result?.columns, calculateHexagonColumns(150, 5));
    assert.ok(v.result && v.result.fullHexagons > 0);
  });
});
