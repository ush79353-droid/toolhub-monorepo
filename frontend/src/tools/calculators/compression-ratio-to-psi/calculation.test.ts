import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ATM_TO_KPA,
  calculateCompressionRatioFromPressure,
  calculateCompressionRatioToPsiFromInput,
  calculateGaugePressure,
  calculatePolytropicCompressionPressure,
  calculateSimplifiedCompressionPressure,
  convertPressure,
  PSI_TO_KPA,
} from './calculation';
import {
  createEmptyInput,
  createExample12to1,
  createExample8to1,
  createExamplePolytropic,
} from './types';
import { validateCompressionRatioToPsiInputs } from './validation';

describe('Compression Ratio to PSI Calculator engine', () => {
  it('10:1 · 14.7 simplified → 147 psia', () => {
    assert.equal(calculateSimplifiedCompressionPressure(10, 14.7), 147);
  });

  it('10:1 · 14.7 → 132.3 psig', () => {
    assert.ok(
      Math.abs((calculateGaugePressure(147, 14.7) ?? 0) - 132.3) < 1e-9,
    );
  });

  it('8:1 · 14.7 → 117.6 psia', () => {
    assert.equal(calculateSimplifiedCompressionPressure(8, 14.7), 117.6);
  });

  it('12:1 · 14.7 → 176.4 psia', () => {
    assert.ok(
      Math.abs(
        (calculateSimplifiedCompressionPressure(12, 14.7) ?? 0) - 176.4,
      ) < 1e-9,
    );
  });

  it('10:1 · 14.7 · n=1.3 → ≈293.30 psia', () => {
    const p = calculatePolytropicCompressionPressure(10, 14.7, 1.3);
    assert.ok(p != null && Math.abs(p - 293.3) < 0.05);
  });

  it('example input → 147 / 132.3', () => {
    const r = calculateCompressionRatioToPsiFromInput(createEmptyInput());
    assert.ok(r);
    assert.equal(r.absolutePressurePsi, 147);
    assert.ok(Math.abs(r.gaugePressurePsi - 132.3) < 1e-9);
  });

  it('8:1 and 12:1 presets', () => {
    const a = calculateCompressionRatioToPsiFromInput(createExample8to1())!;
    const b = calculateCompressionRatioToPsiFromInput(createExample12to1())!;
    assert.ok(Math.abs(a.absolutePressurePsi - 117.6) < 1e-9);
    assert.ok(Math.abs(b.absolutePressurePsi - 176.4) < 1e-9);
  });

  it('polytropic example ≈ 293.3 / 278.6', () => {
    const r = calculateCompressionRatioToPsiFromInput(
      createExamplePolytropic(),
    );
    assert.ok(r);
    assert.ok(Math.abs(r.absolutePressurePsi - 293.3) < 0.05);
    assert.ok(Math.abs(r.gaugePressurePsi - 278.6) < 0.05);
  });

  it('reverse simplified 147 psia → 10:1', () => {
    const r = calculateCompressionRatioFromPressure(147, 14.7, 'simplified', null);
    assert.equal(r, 10);
  });

  it('reverse simplified from gauge 132.3', () => {
    const input = createEmptyInput();
    input.direction = 'pressureToRatio';
    input.compressionPressure = '132.3';
    input.pressureReference = 'gauge';
    const r = calculateCompressionRatioToPsiFromInput(input);
    assert.ok(r && Math.abs(r.normalizedCompressionRatio - 10) < 1e-6);
  });

  it('1 psi → 6.894757293 kPa', () => {
    assert.ok(Math.abs(convertPressure(1, 'psi', 'kPa') - PSI_TO_KPA) < 1e-9);
  });

  it('1 atm → 101.325 kPa', () => {
    assert.equal(convertPressure(1, 'atm', 'kPa'), ATM_TO_KPA);
  });

  it('1 bar → 100 kPa', () => {
    assert.equal(convertPressure(1, 'bar', 'kPa'), 100);
  });

  it('zero denominator → validation error', () => {
    const input = createEmptyInput();
    input.denominator = '0';
    assert.ok(validateCompressionRatioToPsiInputs(input).errors.denominator);
  });

  it('zero atmospheric → validation error', () => {
    const input = createEmptyInput();
    input.atmosphericPressure = '0';
    assert.ok(
      validateCompressionRatioToPsiInputs(input).errors.atmosphericPressure,
    );
  });

  it('ratio below 1 → validation error', () => {
    const input = createEmptyInput();
    input.numerator = '1';
    input.denominator = '2';
    assert.ok(validateCompressionRatioToPsiInputs(input).errors.numerator);
  });

  it('invalid exponent', () => {
    const input = createExamplePolytropic();
    input.polytropicExponent = '0';
    assert.ok(
      validateCompressionRatioToPsiInputs(input).errors.polytropicExponent,
    );
  });

  it('empty pressure reverse → no result', () => {
    const input = createEmptyInput();
    input.direction = 'pressureToRatio';
    input.compressionPressure = '';
    assert.equal(validateCompressionRatioToPsiInputs(input).result, null);
  });
});
