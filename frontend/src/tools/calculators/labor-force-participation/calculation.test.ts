import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEmploymentPopulationRatio,
  calculateLaborForce,
  calculateLaborForceParticipationRate,
  calculateNotInLaborForce,
  calculateUnemploymentRate,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateLfprInput } from './validation';

describe('labor force formulas', () => {
  it('labor force sum', () => {
    assert.equal(calculateLaborForce(5_500_000, 700_000), 6_200_000);
  });

  it('LFPR table fixtures', () => {
    assert.ok(
      Math.abs(
        calculateLaborForceParticipationRate(6_200_000, 7_200_000) - 86.1111111111
      ) < 1e-6
    );
    assert.equal(calculateLaborForceParticipationRate(1000, 1250), 80);
    assert.equal(calculateLaborForceParticipationRate(500, 1000), 50);
    assert.equal(calculateLaborForceParticipationRate(0, 1000), 0);
    assert.equal(calculateLaborForceParticipationRate(1000, 1000), 100);
    assert.equal(calculateLaborForceParticipationRate(200, 500), 40);
  });

  it('unemployment rate fixtures', () => {
    assert.equal(calculateUnemploymentRate(100, 1000), 10);
    assert.equal(calculateUnemploymentRate(200, 1000), 20);
    assert.equal(calculateUnemploymentRate(0, 500), 0);
    assert.equal(calculateUnemploymentRate(100, 100), 100);
    assert.equal(calculateUnemploymentRate(0, 0), null);
  });

  it('not in LF and EPR', () => {
    assert.equal(calculateNotInLaborForce(7_200_000, 6_200_000), 1_000_000);
    assert.ok(
      Math.abs(calculateEmploymentPopulationRatio(5_500_000, 7_200_000) - 76.3888888889) <
        1e-6
    );
  });

  it('rejects LF > working age', () => {
    assert.throws(() => calculateLaborForceParticipationRate(1100, 1000));
    assert.throws(() => calculateNotInLaborForce(1000, 1100));
  });
});

describe('validateLfprInput', () => {
  it('empty invalid', () => {
    assert.equal(validateLfprInput(createEmptyInput()).isValid, false);
    assert.equal(validateLfprInput(createDefaultInput()).isValid, false);
  });

  it('example → 86.11% LFPR', () => {
    const v = validateLfprInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.laborForce, 6_200_000);
    assert.ok(
      Math.abs(v.result!.laborForceParticipationRate - 86.1111111111) < 1e-6
    );
    assert.ok(Math.abs(v.result!.unemploymentRate! - 11.2903225806) < 1e-6);
    assert.equal(v.result?.notInLaborForce, 1_000_000);
  });

  it('zero labor force → unemployment unavailable', () => {
    const v = validateLfprInput({
      employedPopulation: '0',
      unemployedPopulation: '0',
      workingAgePopulation: '1000',
      workingAgeDefinition: 'other',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.unemploymentRate, null);
    assert.equal(v.result?.formattedUnemploymentRate, 'Unavailable');
  });

  it('rejects LF exceeding working age', () => {
    const v = validateLfprInput({
      employedPopulation: '900',
      unemployedPopulation: '200',
      workingAgePopulation: '1000',
      workingAgeDefinition: 'other',
    });
    assert.equal(v.isValid, false);
  });

  it('rejects negative / fractional', () => {
    assert.equal(
      validateLfprInput({
        ...createExampleInput(),
        employedPopulation: '-1',
      }).isValid,
      false
    );
    assert.equal(
      validateLfprInput({
        ...createExampleInput(),
        employedPopulation: '1.5',
      }).isValid,
      false
    );
  });
});
