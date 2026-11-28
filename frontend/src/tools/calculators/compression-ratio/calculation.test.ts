import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateClearanceVolumeFromRatio,
  calculateCompressionFromInput,
  calculateCompressionRatioFromVolumes,
  calculateEffectiveCompressionStroke,
  calculateEngineDisplacement,
  calculatePistonPosition,
  calculateStaticCompressionRatio,
  calculateSweptVolume,
  convertLength,
  convertVolume,
  MM_PER_IN,
  CC_PER_IN3,
} from './calculation';
import {
  createEmptyInput,
  createExampleFourCylinder,
  createExampleKnownVolumes,
  createExampleSingleCylinder,
} from './types';
import { validateCompressionInputs } from './validation';

describe('Compression Ratio Calculator engine', () => {
  it('bore 86 · stroke 86 → ≈499.56 cc', () => {
    const vs = calculateSweptVolume(86, 86);
    assert.ok(vs != null && Math.abs(vs - 499.56) < 0.05);
  });

  it('4 × 499.56 → ≈1998.23 cc', () => {
    const vs = calculateSweptVolume(86, 86)!;
    const eng = calculateEngineDisplacement(vs, 4)!;
    assert.ok(Math.abs(eng - 1998.23) < 0.1);
  });

  it('450 / 50 → 10:1', () => {
    assert.equal(calculateStaticCompressionRatio(450, 50), 10);
  });

  it('495 / 55 → 10:1', () => {
    assert.equal(calculateCompressionRatioFromVolumes(495, 55), 10);
  });

  it('450 · CR 10 → Vc 50', () => {
    assert.equal(calculateClearanceVolumeFromRatio(450, 10), 50);
  });

  it('1 in = 25.4 mm', () => {
    assert.equal(convertLength(1, 'in', 'mm'), MM_PER_IN);
  });

  it('1 in³ = 16.387064 cc', () => {
    assert.equal(convertVolume(1, 'in3', 'cc'), CC_PER_IN3);
  });

  it('1 L = 1000 cc', () => {
    assert.equal(convertVolume(1, 'L', 'cc'), 1000);
  });

  it('known volumes example → 10:1', () => {
    const r = calculateCompressionFromInput(createExampleKnownVolumes());
    assert.ok(r);
    assert.equal(r.staticCompressionRatio, 10);
  });

  it('four-cylinder example produces CR > 1', () => {
    const r = calculateCompressionFromInput(createExampleFourCylinder());
    assert.ok(r);
    assert.ok(r.staticCompressionRatio > 1);
    assert.ok(Math.abs(r.sweptVolumePerCylinderCc - 499.56) < 0.05);
    assert.ok(r.gasketVolumeCc > 0);
  });

  it('single-cylinder example', () => {
    const r = calculateCompressionFromInput(createExampleSingleCylinder());
    assert.ok(r);
    assert.equal(r.cylinders, 1);
    assert.ok(r.staticCompressionRatio > 1);
  });

  it('piston at TDC ≈ 0', () => {
    const x = calculatePistonPosition(86, 150, 0);
    assert.ok(x != null && Math.abs(x) < 1e-9);
  });

  it('piston at BDC ≈ stroke', () => {
    const x = calculatePistonPosition(86, 150, Math.PI);
    assert.ok(x != null && Math.abs(x - 86) < 1e-6);
  });

  it('IVC at BDC (0° ABDC) → Leff ≈ stroke', () => {
    const leff = calculateEffectiveCompressionStroke(86, 150, 0);
    assert.ok(leff != null && Math.abs(leff - 86) < 1e-6);
  });

  it('later IVC reduces effective stroke', () => {
    const a = calculateEffectiveCompressionStroke(86, 150, 20)!;
    const b = calculateEffectiveCompressionStroke(86, 150, 60)!;
    assert.ok(b < a && a < 86);
  });

  it('IVC 0° → DCR ≈ SCR', () => {
    const input = createExampleFourCylinder();
    input.enableDynamic = true;
    input.rodLength = '143';
    input.ivcAbdc = '0';
    const r = calculateCompressionFromInput(input);
    assert.ok(r?.dynamicCompressionRatio != null);
    assert.ok(
      Math.abs(r!.dynamicCompressionRatio! - r!.staticCompressionRatio) <
        0.01,
    );
  });

  it('later IVC lowers DCR', () => {
    const base = createExampleFourCylinder();
    base.enableDynamic = true;
    base.rodLength = '143';
    base.ivcAbdc = '20';
    const early = calculateCompressionFromInput(base)!;
    base.ivcAbdc = '60';
    const late = calculateCompressionFromInput(base)!;
    assert.ok(
      late.dynamicCompressionRatio! < early.dynamicCompressionRatio!,
    );
  });

  it('zero bore → validation error', () => {
    const input = createExampleFourCylinder();
    input.bore = '0';
    assert.ok(validateCompressionInputs(input).errors.bore);
  });

  it('negative stroke → validation error', () => {
    const input = createExampleFourCylinder();
    input.stroke = '-10';
    assert.ok(validateCompressionInputs(input).errors.stroke);
  });

  it('zero cylinders → validation error', () => {
    const input = createExampleFourCylinder();
    input.cylinders = '0';
    assert.ok(validateCompressionInputs(input).errors.cylinders);
  });

  it('CR = 1 reverse → validation error', () => {
    const input = createEmptyInput();
    input.mode = 'clearanceFromRatio';
    input.displacementVolume = '450';
    input.targetCR = '1';
    assert.ok(validateCompressionInputs(input).errors.targetCR);
  });

  it('empty form → no result', () => {
    assert.equal(validateCompressionInputs(createEmptyInput()).result, null);
  });

  it('invalid rod length', () => {
    const input = createExampleFourCylinder();
    input.enableDynamic = true;
    input.rodLength = '10';
    input.ivcAbdc = '40';
    assert.ok(validateCompressionInputs(input).errors.rodLength);
  });
});
