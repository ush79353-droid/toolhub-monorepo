import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateRetentionRatio,
  calculateRoe,
  calculateSustainableGrowthRate,
  formatSgrPercent,
  interpretSgr,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateSustainableGrowthRateInput } from './validation';

describe('calculateRetentionRatio', () => {
  it('2M − 1M → 50%', () => {
    const r = calculateRetentionRatio(2_000_000, 1_000_000)!;
    assert.equal(r.retainedEarnings, 1_000_000);
    assert.equal(r.retentionRatioPercent, 50);
  });

  it('zero NI → null', () => {
    assert.equal(calculateRetentionRatio(0, 0), null);
  });

  it('negative dividends → null', () => {
    assert.equal(calculateRetentionRatio(500_000, -100_000), null);
  });
});

describe('calculateRoe', () => {
  it('2M / 10M → 20%', () => {
    assert.equal(calculateRoe(2_000_000, 10_000_000), 20);
  });

  it('zero equity → null', () => {
    assert.equal(calculateRoe(500_000, 0), null);
  });
});

describe('calculateSustainableGrowthRate', () => {
  it('20% × 50% → 10%', () => {
    assert.equal(calculateSustainableGrowthRate(20, 50), 10);
    assert.equal(formatSgrPercent(10), '10.00%');
  });

  it('direct 18 × 60 → 10.8', () => {
    assert.equal(calculateSustainableGrowthRate(18, 60), 10.8);
  });
});

describe('interpretSgr', () => {
  it('bands', () => {
    assert.match(interpretSgr(10), /positive/i);
    assert.match(interpretSgr(0), /no positive/i);
    assert.match(interpretSgr(-5), /negative/i);
  });
});

describe('validateSustainableGrowthRateInput', () => {
  it('defaults → 10%', () => {
    const v = validateSustainableGrowthRateInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedSgr, '10.00%');
    assert.equal(v.result!.retentionRatioPercent, 50);
    assert.equal(v.result!.returnOnEquityPercent, 20);
  });

  it('no dividends → 20%', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      netIncome: '1000000',
      dividendsPaid: '0',
      shareholdersEquity: '5000000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.sustainableGrowthRatePercent, 20);
  });

  it('all paid → 0%', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      netIncome: '1000000',
      dividendsPaid: '1000000',
      shareholdersEquity: '5000000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.sustainableGrowthRatePercent, 0);
  });

  it('partial retention → 15%', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      netIncome: '500000',
      dividendsPaid: '200000',
      shareholdersEquity: '2000000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.sustainableGrowthRatePercent, 15);
  });

  it('excess dividends → -5%', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      netIncome: '100000',
      dividendsPaid: '150000',
      shareholdersEquity: '1000000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.sustainableGrowthRatePercent, -5);
    assert.ok(v.result!.warningMessage);
  });

  it('zero NI → invalid', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      netIncome: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('zero equity → invalid', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      shareholdersEquity: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('negative dividends → invalid', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      dividendsPaid: '-100000',
    });
    assert.equal(v.isValid, false);
  });

  it('empty → invalid', () => {
    assert.equal(
      validateSustainableGrowthRateInput(createEmptyInput()).isValid,
      false
    );
  });

  it('direct mode → 10.8%', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      mode: 'direct',
      roePercent: '18',
      retentionPercent: '60',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.sustainableGrowthRatePercent, 10.8);
    assert.equal(v.result!.usedDirectInputs, true);
  });

  it('average equity path', () => {
    const v = validateSustainableGrowthRateInput({
      ...createDefaultInput(),
      useAverageEquity: true,
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result!.equityBase, 10_000_000);
    assert.equal(v.result!.sustainableGrowthRatePercent, 10);
  });
});
