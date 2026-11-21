import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGrowthGapFromUnemploymentChange,
  calculateOutputGap,
  calculateRequiredGDPGrowth,
  calculateUnemploymentChange,
  calculateUnemploymentGap,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateOkunsLawInput } from './validation';

describe('okun math', () => {
  it('output gap −4%', () => {
    assert.equal(calculateUnemploymentGap(7, 5), 2);
    assert.equal(calculateOutputGap(7, 5, 2), -4);
  });

  it('positive output gap +2%', () => {
    assert.equal(calculateOutputGap(3, 4, 2), 2);
  });

  it('zero output gap', () => {
    assert.equal(calculateOutputGap(5, 5, 2), 0);
  });

  it('falling unemployment −0.8 pp', () => {
    assert.equal(calculateUnemploymentChange(4.5, 2.5, 0.4), -0.8);
  });

  it('rising unemployment +1 pp', () => {
    assert.equal(calculateUnemploymentChange(1, 3, 0.5), 1);
  });

  it('required GDP growth 4%', () => {
    assert.equal(calculateRequiredGDPGrowth(-1, 2, 0.5), 4);
  });

  it('growth gap from Δu', () => {
    assert.equal(calculateGrowthGapFromUnemploymentChange(-0.8, 0.4), 2);
  });

  it('zero coefficient blocked', () => {
    assert.equal(calculateRequiredGDPGrowth(-1, 2, 0), null);
    assert.equal(calculateUnemploymentChange(4, 2, 0), null);
  });
});

describe('validateOkunsLawInput', () => {
  it('empty invalid', () => {
    assert.equal(validateOkunsLawInput(createEmptyInput()).isValid, false);
    assert.equal(validateOkunsLawInput(createDefaultInput()).isValid, false);
  });

  it('output-gap example → −4%', () => {
    const v = validateOkunsLawInput(createExampleInput('output-gap'));
    assert.equal(v.isValid, true);
    assert.equal(v.result?.outputGap, -4);
  });

  it('unemployment-change example → −0.8', () => {
    const v = validateOkunsLawInput(createExampleInput('unemployment-change'));
    assert.equal(v.isValid, true);
    assert.equal(v.result?.unemploymentChange, -0.8);
  });

  it('required growth example → 4%', () => {
    const v = validateOkunsLawInput(createExampleInput('required-gdp-growth'));
    assert.equal(v.isValid, true);
    assert.equal(v.result?.requiredGDPGrowth, 4);
  });

  it('rejects unemployment > 100', () => {
    const v = validateOkunsLawInput({
      ...createExampleInput('output-gap'),
      unemploymentRate: '120',
    });
    assert.equal(v.isValid, false);
  });

  it('zero α error', () => {
    const v = validateOkunsLawInput({
      ...createExampleInput('required-gdp-growth'),
      growthCoefficient: '0',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.growthCoefficient ?? '', /zero|greater/i);
  });

  it('accepts negative GDP growth', () => {
    const v = validateOkunsLawInput({
      ...createExampleInput('unemployment-change'),
      actualGDPGrowthRate: '-2',
      trendGDPGrowthRate: '2',
      growthCoefficient: '0.5',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.unemploymentChange, 2);
  });
});
