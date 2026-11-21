import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBuyingPower,
  formatPercent,
  formatUsd,
  interpretBuyingPower,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import {
  getUsCpiForYear,
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_U_ANNUAL,
} from './us-cpi-u-annual';
import { validateBuyingPowerInput } from './validation';

describe('calculateBuyingPower', () => {
  it('rising prices 1000 · 200 → 250 = 1250', () => {
    const r = calculateBuyingPower(1000, 200, 250)!;
    assert.equal(r.adjustedAmount, 1250);
    assert.equal(r.inflationChangePercent, 25);
  });

  it('falling prices 1000 · 250 → 200 = 800', () => {
    const r = calculateBuyingPower(1000, 250, 200)!;
    assert.equal(r.adjustedAmount, 800);
    assert.ok(Math.abs(r.inflationChangePercent - -20) < 1e-12);
  });

  it('same CPI → unchanged', () => {
    const r = calculateBuyingPower(1000, 200, 200)!;
    assert.equal(r.adjustedAmount, 1000);
    assert.equal(r.inflationChangePercent, 0);
    assert.equal(r.purchasingPowerChangePercent, 0);
  });

  it('zero amount → 0', () => {
    const r = calculateBuyingPower(0, 200, 250)!;
    assert.equal(r.adjustedAmount, 0);
  });

  it('small amount 10 · 200 → 220 = 11', () => {
    const r = calculateBuyingPower(10, 200, 220)!;
    assert.equal(r.adjustedAmount, 11);
  });

  it('large amount 1e6 · 100 → 250 = 2.5e6', () => {
    const r = calculateBuyingPower(1_000_000, 100, 250)!;
    assert.equal(r.adjustedAmount, 2_500_000);
  });

  it('illustrative 1000 · 220 → 260 ≈ 1181.818…', () => {
    const r = calculateBuyingPower(1000, 220, 260)!;
    assert.ok(Math.abs(r.adjustedAmount - 1181.818181818182) < 1e-9);
    assert.ok(Math.abs(r.inflationChangePercent - 18.18181818181818) < 1e-9);
  });

  it('negative amount → null', () => {
    assert.equal(calculateBuyingPower(-1, 200, 250), null);
  });

  it('zero or negative CPI → null', () => {
    assert.equal(calculateBuyingPower(100, 0, 250), null);
    assert.equal(calculateBuyingPower(100, 200, -1), null);
  });
});

describe('interpretBuyingPower', () => {
  it('bands', () => {
    assert.match(interpretBuyingPower(10, 2010, 2020), /increased/i);
    assert.match(interpretBuyingPower(-10, 2010, 2020), /decreased/i);
    assert.match(interpretBuyingPower(0, 2010, 2010), /identical/i);
  });
});

describe('US CPI dataset', () => {
  it('covers 1913 through latest final year without gaps', () => {
    assert.equal(US_CPI_MIN_YEAR, 1913);
    assert.equal(US_CPI_MAX_YEAR, 2025);
    assert.equal(US_CPI_U_ANNUAL.length, US_CPI_MAX_YEAR - US_CPI_MIN_YEAR + 1);
    for (let y = US_CPI_MIN_YEAR; y <= US_CPI_MAX_YEAR; y++) {
      const row = getUsCpiForYear(y);
      assert.ok(row, `missing CPI for ${y}`);
      assert.ok(row!.annualAverageCPI > 0);
      assert.equal(row!.dataStatus, 'final');
    }
  });

  it('spot-check known BLS annual averages', () => {
    assert.equal(getUsCpiForYear(1913)!.annualAverageCPI, 9.9);
    assert.equal(getUsCpiForYear(2010)!.annualAverageCPI, 218.056);
    assert.equal(getUsCpiForYear(2020)!.annualAverageCPI, 258.811);
    assert.equal(getUsCpiForYear(2025)!.annualAverageCPI, 321.943);
  });
});

describe('validateBuyingPowerInput', () => {
  it('defaults (empty amount) → invalid, no silent zero', () => {
    const v = validateBuyingPowerInput(createDefaultInput(US_CPI_MAX_YEAR));
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
    assert.match(v.errors.amount ?? '', /amount/i);
  });

  it('empty → invalid', () => {
    assert.equal(validateBuyingPowerInput(createEmptyInput()).isValid, false);
  });

  it('negative amount → invalid', () => {
    const v = validateBuyingPowerInput({
      amount: '-10',
      referenceYear: '2010',
      targetYear: '2020',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.amount ?? '', /negative/i);
  });

  it('missing years → invalid', () => {
    const v = validateBuyingPowerInput({
      amount: '1000',
      referenceYear: '',
      targetYear: '',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.referenceYear);
    assert.ok(v.errors.targetYear);
  });

  it('unsupported year → invalid', () => {
    const v = validateBuyingPowerInput({
      amount: '1000',
      referenceYear: '1800',
      targetYear: '2020',
    });
    assert.equal(v.isValid, false);
  });

  it('same year → adjusted equals original', () => {
    const v = validateBuyingPowerInput({
      amount: '1000',
      referenceYear: '2010',
      targetYear: '2010',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.adjustedAmount, 1000);
    assert.match(v.result!.interpretation, /identical/i);
  });

  it('2010 → 2020 real CPI path', () => {
    const v = validateBuyingPowerInput({
      amount: '1000',
      referenceYear: '2010',
      targetYear: '2020',
    });
    assert.equal(v.isValid, true);
    const expected = 1000 * (258.811 / 218.056);
    assert.ok(Math.abs(v.result!.adjustedAmount - expected) < 1e-9);
    assert.equal(v.result!.formattedAdjustedAmount, formatUsd(expected));
    assert.match(v.result!.formattedInflationChange, /^\+/);
  });

  it('earlier target (deflation path 1920 → 1933)', () => {
    const v = validateBuyingPowerInput({
      amount: '100',
      referenceYear: '1920',
      targetYear: '1933',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result!.adjustedAmount < 100);
    assert.ok(v.result!.inflationChangePercent < 0);
  });

  it('comma-formatted amount', () => {
    const v = validateBuyingPowerInput({
      amount: '1,000.50',
      referenceYear: '2010',
      targetYear: '2010',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.originalAmount, 1000.5);
  });

  it('format helpers', () => {
    assert.equal(formatUsd(1181.818181), '$1,181.82');
    assert.equal(formatPercent(18.1818), '+18.18%');
    assert.equal(formatPercent(-5), '-5.00%');
  });
});
