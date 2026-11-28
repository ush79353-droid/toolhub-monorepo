import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  convertLengthToMillimeters,
  convertMillimetersToUnit,
  calculatePiecesAcross,
  calculateRowsRequired,
  calculateBaseFabricLength,
  calculateFabricYardage,
  calculateUsableFabricWidth,
  calculateShrinkageAllowance,
  calculateExtraFabricAllowance,
  calculateFabricUtilization,
  calculateFabricResults,
  MM_PER_IN,
  MM_PER_M,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateFabricInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Fabric Calculator engine', () => {
  it('60×12×18 · 12 pieces → 5 across · 3 rows · 54 in · 1.5 yd', () => {
    const r = calculateFabricResults({
      fabricWidthMm: 60 * MM_PER_IN,
      pieceWidthMm: 12 * MM_PER_IN,
      pieceLengthMm: 18 * MM_PER_IN,
      numberOfPieces: 12,
      allowRotation: false,
      cuttingGapMm: 0,
      edgeAllowanceMm: 0,
      shrinkagePercent: 0,
      extraFabricPercent: 0,
    });
    assert.equal(r.piecesAcross, 5);
    assert.equal(r.rowsRequired, 3);
    approx(r.baseFabricLengthMm / MM_PER_IN, 54);
    approx(r.fabricYards, 1.5);
    approx(r.fabricMeters, 1.3716, 0.001);
    approx(r.utilizationPercent, 80, 0.1);
  });

  it('60 in → 152.4 cm', () => {
    const mm = convertLengthToMillimeters(60, 'in');
    approx(convertMillimetersToUnit(mm, 'cm'), 152.4);
  });

  it('pieces across 50/12 = 4', () => {
    assert.equal(calculatePiecesAcross(50, 12, 0), 4);
  });

  it('rows ceil(12/4) = 3', () => {
    assert.equal(calculateRowsRequired(12, 4), 3);
  });

  it('cutting gap: 50 · 12 · gap 1 → 3 across', () => {
    assert.equal(calculatePiecesAcross(50, 12, 1), 3);
  });

  it('edge allowance 60 − 2×2 = 56', () => {
    approx(calculateUsableFabricWidth(60, 2), 56);
  });

  it('shrinkage 3 m / 5% → ≈3.1579 m', () => {
    const before = calculateShrinkageAllowance(3 * MM_PER_M, 5);
    approx(before / MM_PER_M, 3.157894736, 0.001);
  });

  it('extra 2 m + 10% → 2.2 m', () => {
    approx(calculateExtraFabricAllowance(2 * MM_PER_M, 10) / MM_PER_M, 2.2);
  });

  it('rotation picks shorter valid length', () => {
    // Wide short pieces vs tall: fabric 40, piece 30×10, 4 pcs — non-rotated: 1 across, 4 rows = 40 length; rotated: 4 across, 1 row = 30 length
    const r = calculateFabricResults({
      fabricWidthMm: 40,
      pieceWidthMm: 30,
      pieceLengthMm: 10,
      numberOfPieces: 4,
      allowRotation: true,
      cuttingGapMm: 0,
      edgeAllowanceMm: 0,
      shrinkagePercent: 0,
      extraFabricPercent: 0,
    });
    assert.equal(r.isRotated, true);
    approx(r.baseFabricLengthMm, 30);
    assert.equal(r.piecesAcross, 4);
  });

  it('piece too wide → 0 across, warning', () => {
    const r = calculateFabricResults({
      fabricWidthMm: 40 * MM_PER_IN,
      pieceWidthMm: 50 * MM_PER_IN,
      pieceLengthMm: 10 * MM_PER_IN,
      numberOfPieces: 2,
      allowRotation: false,
      cuttingGapMm: 0,
      edgeAllowanceMm: 0,
      shrinkagePercent: 0,
      extraFabricPercent: 0,
    });
    assert.equal(r.piecesAcross, 0);
    assert.ok(r.warnings.length > 0);
  });

  it('utilization 80%', () => {
    const pieceArea = 12 * 12 * 18;
    const fabricArea = 60 * 54;
    approx(calculateFabricUtilization(pieceArea, fabricArea), 80);
  });

  it('empty → no result', () => {
    const v = validateFabricInputs(createBlankInput());
    assert.equal(v.result, null);
  });

  it('base length 3×18 = 54', () => {
    approx(calculateBaseFabricLength(3, 18), 54);
  });

  it('yardage 54 in → 1.5 yd', () => {
    approx(calculateFabricYardage(54 * MM_PER_IN), 1.5);
  });

  it('zero fabric width invalid', () => {
    const v = validateFabricInputs({
      ...createEmptyInput(),
      fabricWidth: '0',
    });
    assert.ok(v.errors.fabricWidth);
  });
});
