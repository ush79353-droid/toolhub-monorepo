import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCpiInflation,
  formatPercent,
  formatUsd,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createIllustrativeCustomInput,
} from './types';
import { US_CPI_MAX_YEAR, getUsCpiForYear } from '../buying-power/us-cpi-u-annual';
import { validateCpiInflationInput } from './validation';

describe('calculateCpiInflation', () => {
  it('illustrative 1000 · 220 → 260 · 10y', () => {
    const r = calculateCpiInflation(1000, 220, 260, 2010, 2020)!;
    const annual = (Math.pow(260 / 220, 1 / 10) - 1) * 100;
    assert.ok(Math.abs(r.equivalentValue - 1000 * (260 / 220)) < 1e-9);
    assert.ok(Math.abs(r.cumulativeInflationPercent - (260 / 220 - 1) * 100) < 1e-9);
    assert.ok(Math.abs((r.averageAnnualInflationPercent ?? 0) - annual) < 1e-12);
    assert.ok(
      Math.abs(r.purchasingPowerChangePercent - (220 / 260 - 1) * 100) < 1e-9
    );
    assert.equal(r.sameYear, false);
    assert.ok(Math.abs(annual - 1.68) < 0.01); // brief ≈1.68%
  });

  it('same year → zero cumulative, null annualized', () => {
    const r = calculateCpiInflation(100, 200, 200, 2015, 2015)!;
    assert.equal(r.equivalentValue, 100);
    assert.equal(r.cumulativeInflationPercent, 0);
    assert.equal(r.averageAnnualInflationPercent, null);
    assert.equal(r.sameYear, true);
  });

  it('deflation path', () => {
    const r = calculateCpiInflation(1000, 260, 220, 2020, 2010)!;
    assert.ok(r.equivalentValue < 1000);
    assert.ok(r.cumulativeInflationPercent < 0);
    assert.ok((r.averageAnnualInflationPercent ?? 0) > 0); // chronological CAGR
  });

  it('zero amount', () => {
    const r = calculateCpiInflation(0, 220, 260, 2010, 2020)!;
    assert.equal(r.equivalentValue, 0);
  });

  it('invalid CPI → null', () => {
    assert.equal(calculateCpiInflation(100, 0, 260, 2010, 2020), null);
    assert.equal(calculateCpiInflation(100, 220, -1, 2010, 2020), null);
  });

  it('custom span annualization', () => {
    const r = calculateCpiInflation(1000, 220, 260, null, null, 10)!;
    const annual = (Math.pow(260 / 220, 1 / 10) - 1) * 100;
    assert.ok(Math.abs((r.averageAnnualInflationPercent ?? 0) - annual) < 1e-12);
  });
});

describe('validateCpiInflationInput', () => {
  it('default without base year → invalid', () => {
    const v = validateCpiInflationInput(createDefaultInput(US_CPI_MAX_YEAR));
    assert.equal(v.isValid, false);
  });

  it('empty → invalid', () => {
    assert.equal(validateCpiInflationInput(createEmptyInput()).isValid, false);
  });

  it('historical 2010 → 2020 real BLS path', () => {
    const v = validateCpiInflationInput({
      mode: 'historical',
      amount: '1000',
      baseYear: '2010',
      targetYear: '2020',
      baseCPI: '',
      targetCPI: '',
      yearsSpan: '',
    });
    assert.equal(v.isValid, true);
    const expected =
      1000 *
      (getUsCpiForYear(2020)!.annualAverageCPI /
        getUsCpiForYear(2010)!.annualAverageCPI);
    assert.ok(Math.abs(v.result!.equivalentValue - expected) < 1e-9);
    assert.equal(v.result!.formattedEquivalentValue, formatUsd(expected));
  });

  it('custom illustrative', () => {
    const v = validateCpiInflationInput(createIllustrativeCustomInput());
    assert.equal(v.isValid, true);
    assert.ok(Math.abs(v.result!.equivalentValue - 1181.8181818181818) < 1e-9);
    assert.match(v.result!.formattedCumulativeInflation, /18\.18%/);
    assert.equal(formatPercent(1.68224), '+1.68%');
  });

  it('same year historical', () => {
    const v = validateCpiInflationInput({
      mode: 'historical',
      amount: '100',
      baseYear: '2010',
      targetYear: '2010',
      baseCPI: '',
      targetCPI: '',
      yearsSpan: '',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.cumulativeInflationPercent, 0);
    assert.equal(v.result!.formattedAverageAnnualInflation, 'N/A');
  });

  it('unsupported year', () => {
    const v = validateCpiInflationInput({
      mode: 'historical',
      amount: '100',
      baseYear: '1800',
      targetYear: '2020',
      baseCPI: '',
      targetCPI: '',
      yearsSpan: '',
    });
    assert.equal(v.isValid, false);
  });

  it('zero custom CPI → invalid', () => {
    const v = validateCpiInflationInput({
      ...createIllustrativeCustomInput(),
      baseCPI: '0',
    });
    assert.equal(v.isValid, false);
  });
});
