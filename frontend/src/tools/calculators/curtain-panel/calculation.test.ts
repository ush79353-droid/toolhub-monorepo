import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCurtainCoverageWidth,
  calculateFinishedPanelWidth,
  calculateCutPanelWidth,
  calculateFabricDropsPerPanel,
  calculateBaseCutLength,
  calculateTotalFabricLength,
  calculateFabricYardage,
  roundFabricPurchaseQuantity,
  calculatePatternRepeatLength,
  convertCmToLength,
  calculateCurtainPanelResults,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateCurtainPanelInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Curtain Panel Calculator engine', () => {
  it('coverage 200×2 = 400', () => {
    approx(calculateCurtainCoverageWidth(200, 2), 400);
  });

  it('panel width 400/2 = 200', () => {
    approx(calculateFinishedPanelWidth(400, 2), 200);
  });

  it('cut width 200+6 = 206', () => {
    approx(calculateCutPanelWidth(200, 3), 206);
  });

  it('drops: 206 cut · 140 fabric · 1.5 seam → 2', () => {
    const d = calculateFabricDropsPerPanel(206, 140, 1.5);
    assert.equal(d.drops, 2);
    approx(d.assembledWidthCm, 277);
  });

  it('cut length 220+10+15 = 245', () => {
    approx(calculateBaseCutLength(220, 10, 15), 245);
  });

  it('total length 245×4 = 980', () => {
    approx(calculateTotalFabricLength(245, 4), 980);
  });

  it('9.8 m → ≈10.7174 yd', () => {
    approx(calculateFabricYardage(980), 10.7174, 0.001);
  });

  it('purchase round up to ¼ yd', () => {
    approx(roundFabricPurchaseQuantity(10.7174, 0.25), 10.75);
  });

  it('100 cm → ≈39.37 in', () => {
    approx(convertCmToLength(100, 'in'), 39.37007874, 0.01);
  });

  it('pattern repeat 245 / 30 → 270', () => {
    approx(calculatePatternRepeatLength(245, 30), 270);
  });

  it('worked example end-to-end', () => {
    const r = calculateCurtainPanelResults({
      panelType: 'standard',
      fullnessRatio: 2,
      rodWidthCm: 200,
      finishedLengthCm: 220,
      numberOfPanels: 2,
      fabricWidthCm: 140,
      sideHemAllowanceCm: 3,
      topAllowanceCm: 10,
      bottomAllowanceCm: 15,
      joiningSeamAllowanceCm: 1.5,
      patternRepeatCm: 0,
      shrinkagePercentage: 0,
      wastePercentage: 0,
    });
    approx(r.totalCoverageWidthCm, 400);
    approx(r.finishedWidthPerPanelCm, 200);
    approx(r.cutWidthPerPanelCm, 206);
    assert.equal(r.fabricDropsPerPanel, 2);
    assert.equal(r.totalFabricDrops, 4);
    approx(r.cutLengthPerDropCm, 245);
    approx(r.totalFabricLengthCm, 980);
    approx(r.recommendedPurchaseYards, 10.75);
  });

  it('rod width 0 invalid', () => {
    const v = validateCurtainPanelInputs({
      ...createEmptyInput(),
      rodWidth: '0',
    });
    assert.ok(v.errors.rodWidth);
  });

  it('negative length invalid', () => {
    const v = validateCurtainPanelInputs({
      ...createEmptyInput(),
      finishedLength: '-10',
    });
    assert.ok(v.errors.finishedLength);
  });

  it('empty → no result', () => {
    const v = validateCurtainPanelInputs(createBlankInput());
    assert.equal(v.result, null);
  });
});
