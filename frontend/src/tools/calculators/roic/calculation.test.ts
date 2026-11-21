import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateInvestedCapital,
  calculateNopat,
  calculateRoic,
  formatRoicPercent,
  interpretRoic,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateRoicInput } from './validation';

describe('calculateNopat', () => {
  it('500000 × (1 − 0.25) → 375000', () => {
    assert.equal(calculateNopat(500_000, 25), 375_000);
  });

  it('negative EBIT preserves simplified tax formula', () => {
    assert.equal(calculateNopat(-100_000, 20), -80_000);
  });

  it('invalid tax → null', () => {
    assert.equal(calculateNopat(100_000, 120), null);
    assert.equal(calculateNopat(100_000, -5), null);
  });
});

describe('calculateInvestedCapital', () => {
  it('equity + debt', () => {
    assert.equal(calculateInvestedCapital(1_200_000, 800_000), 2_000_000);
  });
});

describe('calculateRoic', () => {
  it('375000 / 2000000 → 18.75%', () => {
    const r = calculateRoic(375_000, 2_000_000)!;
    assert.equal(r.roicPercentage, 18.75);
    assert.equal(formatRoicPercent(r.roicPercentage), '18.75%');
  });

  it('140000 / 1400000 → 10%', () => {
    assert.equal(calculateRoic(140_000, 1_400_000)!.roicPercentage, 10);
  });

  it('zero NOPAT → 0%', () => {
    assert.equal(calculateRoic(0, 1_000_000)!.roicPercentage, 0);
  });

  it('negative NOPAT → -8%', () => {
    assert.equal(calculateRoic(-80_000, 1_000_000)!.roicPercentage, -8);
  });

  it('zero capital → null', () => {
    assert.equal(calculateRoic(100_000, 0), null);
  });

  it('100% return', () => {
    assert.equal(calculateRoic(200_000, 200_000)!.roicPercentage, 100);
  });
});

describe('interpretRoic', () => {
  it('bands', () => {
    assert.match(interpretRoic(18.75), /positive/i);
    assert.match(interpretRoic(0), /no after-tax/i);
    assert.match(interpretRoic(-8), /operating loss/i);
  });
});

describe('validateRoicInput', () => {
  it('defaults → 18.75%', () => {
    const v = validateRoicInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedRoic, '18.75%');
    assert.equal(v.result!.nopat, 375_000);
    assert.equal(v.result!.investedCapital, 2_000_000);
  });

  it('moderate return 10%', () => {
    const v = validateRoicInput({
      ...createDefaultInput(),
      ebit: '200000',
      taxRate: '30',
      equity: '900000',
      debt: '500000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.roicPercentage, 10);
  });

  it('average capital path', () => {
    const v = validateRoicInput({
      ...createDefaultInput(),
      useAverageCapital: true,
      beginningCapital: '1800000',
      endingCapital: '2200000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.investedCapital, 2_000_000);
    assert.equal(v.result!.usedAverageCapital, true);
    assert.equal(v.result!.roicPercentage, 18.75);
  });

  it('empty → invalid', () => {
    assert.equal(validateRoicInput(createEmptyInput()).isValid, false);
  });

  it('zero capital error', () => {
    const v = validateRoicInput({
      ...createDefaultInput(),
      equity: '0',
      debt: '0',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.form);
  });

  it('invalid tax', () => {
    const v = validateRoicInput({
      ...createDefaultInput(),
      taxRate: '120',
    });
    assert.equal(v.isValid, false);
    assert.ok(v.errors.taxRate);
  });

  it('negative EBIT warning', () => {
    const v = validateRoicInput({
      ...createDefaultInput(),
      ebit: '-100000',
      taxRate: '20',
      equity: '600000',
      debt: '400000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.roicPercentage, -8);
    assert.ok(v.result!.warningMessage);
    assert.equal(v.result!.hasNegativeEbit, true);
  });
});
