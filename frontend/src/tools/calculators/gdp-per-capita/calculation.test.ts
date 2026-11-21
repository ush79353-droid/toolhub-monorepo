import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateGDP,
  calculateGDPPerCapita,
  calculatePopulation,
  toGdpBase,
  toPopulationBase,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateGdpPerCapitaInput } from './validation';

describe('GDP per capita formulas', () => {
  it('$2T / 50M = 40000', () => {
    assert.equal(
      calculateGDPPerCapita(
        toGdpBase(2, 'trillions'),
        toPopulationBase(50, 'millions')
      ),
      40_000
    );
  });

  it('$300B / 15M = 20000', () => {
    assert.equal(
      calculateGDPPerCapita(
        toGdpBase(300, 'billions'),
        toPopulationBase(15, 'millions')
      ),
      20_000
    );
  });

  it('$1.5T / 300M = 5000', () => {
    assert.equal(
      calculateGDPPerCapita(
        toGdpBase(1.5, 'trillions'),
        toPopulationBase(300, 'millions')
      ),
      5_000
    );
  });

  it('2,000 billion / 50M = 40000', () => {
    assert.equal(
      calculateGDPPerCapita(
        toGdpBase(2_000, 'billions'),
        toPopulationBase(50, 'millions')
      ),
      40_000
    );
  });

  it('reverse GDP and population', () => {
    assert.equal(
      calculateGDP(40_000, toPopulationBase(50, 'millions')),
      toGdpBase(2, 'trillions')
    );
    assert.equal(
      calculatePopulation(toGdpBase(2, 'trillions'), 40_000),
      toPopulationBase(50, 'millions')
    );
  });

  it('rejects zero population', () => {
    assert.throws(() => calculateGDPPerCapita(1e12, 0));
  });

  it('rejects negative GDP', () => {
    assert.throws(() => calculateGDPPerCapita(-1, 1e6));
  });
});

describe('validateGdpPerCapitaInput', () => {
  it('empty invalid', () => {
    assert.equal(validateGdpPerCapitaInput(createEmptyInput()).isValid, false);
    assert.equal(validateGdpPerCapitaInput(createDefaultInput()).isValid, false);
  });

  it('example → 40000', () => {
    const v = validateGdpPerCapitaInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.gdpPerCapita, 40_000);
  });

  it('gdp mode', () => {
    const input = createEmptyInput('gdp');
    input.population = '50';
    input.populationMagnitude = 'millions';
    input.gdpPerCapita = '40000';
    const v = validateGdpPerCapitaInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result?.gdpBase, toGdpBase(2, 'trillions'));
  });

  it('population mode', () => {
    const input = createEmptyInput('population');
    input.gdp = '2';
    input.gdpMagnitude = 'trillions';
    input.gdpPerCapita = '40000';
    const v = validateGdpPerCapitaInput(input);
    assert.equal(v.isValid, true);
    assert.equal(v.result?.populationBase, toPopulationBase(50, 'millions'));
  });

  it('zero population rejected', () => {
    const input = createExampleInput();
    input.population = '0';
    assert.equal(validateGdpPerCapitaInput(input).isValid, false);
  });
});
