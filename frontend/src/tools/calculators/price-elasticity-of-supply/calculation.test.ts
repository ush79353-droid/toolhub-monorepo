import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateMidpointPES,
  calculateStandardPES,
  calculateStandardPriceChangePercent,
  calculateStandardQuantityChangePercent,
  classifySupplyElasticity,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validatePriceElasticityOfSupplyInput } from './validation';

describe('pes math', () => {
  it('unit elastic standard', () => {
    assert.equal(calculateStandardPriceChangePercent(100, 120), 20);
    assert.equal(calculateStandardQuantityChangePercent(500, 600), 20);
    assert.equal(calculateStandardPES(100, 120, 500, 600), 1);
    assert.equal(classifySupplyElasticity(1), 'unitElastic');
  });

  it('elastic standard PES=2', () => {
    assert.equal(calculateStandardPES(100, 110, 500, 600), 2);
    assert.equal(classifySupplyElasticity(2), 'elastic');
  });

  it('inelastic standard PES=0.5', () => {
    assert.equal(calculateStandardPES(100, 120, 500, 550), 0.5);
    assert.equal(classifySupplyElasticity(0.5), 'inelastic');
  });

  it('perfectly inelastic', () => {
    assert.equal(calculateStandardPES(100, 120, 500, 500), 0);
    assert.equal(classifySupplyElasticity(0), 'perfectlyInelastic');
  });

  it('negative observed PES', () => {
    assert.equal(calculateStandardPES(100, 120, 500, 400), -1);
    assert.equal(classifySupplyElasticity(-1), 'negative');
  });

  it('undefined when price unchanged', () => {
    assert.equal(calculateStandardPES(100, 100, 500, 600), null);
  });

  it('midpoint unit elastic', () => {
    assert.equal(calculateMidpointPES(100, 120, 500, 600), 1);
  });

  it('midpoint reverse-symmetric', () => {
    const a = calculateMidpointPES(100, 120, 500, 600);
    const b = calculateMidpointPES(120, 100, 600, 500);
    assert.equal(a, b);
  });
});

describe('validatePriceElasticityOfSupplyInput', () => {
  it('empty incomplete', () => {
    const v = validatePriceElasticityOfSupplyInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result?.status, 'incomplete');
  });

  it('example unit elastic', () => {
    const v = validatePriceElasticityOfSupplyInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.pes, 1);
    assert.equal(v.result?.classification, 'unitElastic');
  });

  it('undefined equal prices', () => {
    const v = validatePriceElasticityOfSupplyInput({
      ...createDefaultInput(),
      price1: '100',
      price2: '100',
      quantity1: '500',
      quantity2: '600',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result?.status, 'undefinedElasticity');
    assert.equal(v.result?.pes, null);
  });

  it('midpoint example', () => {
    const v = validatePriceElasticityOfSupplyInput(
      createExampleInput('midpoint')
    );
    assert.equal(v.isValid, true);
    assert.equal(v.result?.pes, 1);
  });

  it('rejects Q1=0 in standard', () => {
    const v = validatePriceElasticityOfSupplyInput({
      ...createExampleInput('standard'),
      quantity1: '0',
    });
    assert.equal(v.isValid, false);
  });
});
