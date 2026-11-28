import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEffectiveRodWidth,
  calculateTotalCurtainWidth,
  calculateCurtainWidthPerPanel,
  calculateSillCurtainLength,
  calculateCafeCurtainLength,
  calculateFloorCurtainLength,
  convertCmToLength,
  calculateCurtainSizeResults,
} from './calculation';
import { createBlankInput, createEmptyInput } from './types';
import { validateCurtainSizeInputs } from './validation';

function approx(actual: number, expected: number, tol = 0.02) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Curtain Size Calculator engine', () => {
  it('rod width 150+2×15 = 180', () => {
    approx(calculateEffectiveRodWidth(150, 15), 180);
  });

  it('standard fullness 180×1.5 = 270', () => {
    approx(calculateTotalCurtainWidth(180, 1.5), 270);
  });

  it('deluxe fullness 180×2 = 360', () => {
    approx(calculateTotalCurtainWidth(180, 2), 360);
  });

  it('ultra fullness 180×2.5 = 450', () => {
    approx(calculateTotalCurtainWidth(180, 2.5), 450);
  });

  it('panel width 360/2 = 180', () => {
    approx(calculateCurtainWidthPerPanel(360, 2), 180);
  });

  it('sill length 120+15+0 = 135', () => {
    approx(calculateSillCurtainLength(120, 15, 0), 135);
  });

  it('café length 120×0.5 = 60', () => {
    approx(calculateCafeCurtainLength(120, 0.5), 60);
  });

  it('floor length 240−2+0 = 238', () => {
    approx(calculateFloorCurtainLength(240, 2, 0), 238);
  });

  it('100 cm → ≈39.37 in', () => {
    approx(convertCmToLength(100, 'in'), 39.37007874, 0.01);
  });

  it('worked sill example end-to-end', () => {
    const r = calculateCurtainSizeResults({
      curtainType: 'sill-length',
      fullnessMultiplier: 2,
      windowHeightCm: 120,
      windowWidthCm: 150,
      rodMountingHeightCm: 15,
      rodExtensionCm: 15,
      extraLengthBelowSillCm: 0,
      cafeCoverageRatio: 0.5,
      rodHeightAboveFloorCm: 240,
      floorClearanceCm: 2,
      puddlingLengthCm: 0,
      numberOfPanels: 2,
    });
    approx(r.effectiveRodWidthCm, 180);
    approx(r.totalCurtainWidthCm, 360);
    approx(r.curtainWidthPerPanelCm, 180);
    approx(r.recommendedCurtainLengthCm, 135);
  });

  it('width 0 invalid', () => {
    const v = validateCurtainSizeInputs({
      ...createEmptyInput(),
      windowWidth: '0',
    });
    assert.ok(v.errors.windowWidth);
  });

  it('negative height invalid', () => {
    const v = validateCurtainSizeInputs({
      ...createEmptyInput(),
      windowHeight: '-10',
    });
    assert.ok(v.errors.windowHeight);
  });

  it('extra-long missing floor height', () => {
    const v = validateCurtainSizeInputs({
      ...createEmptyInput(),
      curtainType: 'extra-long',
      rodHeightAboveFloor: '',
    });
    assert.ok(v.errors.rodHeightAboveFloor);
    assert.equal(v.result, null);
  });

  it('empty → no result', () => {
    const v = validateCurtainSizeInputs(createBlankInput());
    assert.equal(v.result, null);
  });
});
