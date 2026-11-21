import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAltmanZScore,
  calculateAltmanZScoreCore,
  calculateMarketValueOfEquity,
  calculateNetWorkingCapital,
  calculateRetainedEarnings,
  classifyAltmanZone,
} from './calculation';
import { collectFieldErrors, validateAltmanZScoreInput } from './validation';
import {
  createEmptyInput,
  createExampleInput,
  type AltmanZScoreInput,
} from './types';

function base(overrides: Partial<AltmanZScoreInput> = {}): AltmanZScoreInput {
  return { ...createExampleInput(), ...overrides };
}

describe('altman z-score', () => {
  it('NWC from current assets − liabilities', () => {
    const nwc = calculateNetWorkingCapital({
      source: 'balance-sheet',
      currentAssets: 1_500_000,
      currentLiabilities: 700_000,
      accountsReceivable: null,
      inventory: null,
      accountsPayable: null,
      workingCapital: null,
    });
    assert.equal(nwc, 800_000);
  });

  it('simplified NWC = AR + I − AP', () => {
    const nwc = calculateNetWorkingCapital({
      source: 'simplified',
      currentAssets: null,
      currentLiabilities: null,
      accountsReceivable: 500_000,
      inventory: 300_000,
      accountsPayable: 200_000,
      workingCapital: null,
    });
    assert.equal(nwc, 600_000);
  });

  it('market capitalization = shares × price', () => {
    const mve = calculateMarketValueOfEquity({
      source: 'shares',
      sharesOutstanding: 10_000_000,
      sharePrice: 50,
      marketValueOfEquity: null,
    });
    assert.equal(mve, 500_000_000);
  });

  it('ending RE = begin + NI − dividends', () => {
    const { retainedEarnings, totalDividends } = calculateRetainedEarnings({
      source: 'rollforward',
      beginningRetainedEarnings: 150_000_000,
      netIncome: 80_000_000,
      dividendPerShare: 2,
      sharesOutstanding: 10_000_000,
      otherDividends: 0,
      retainedEarnings: null,
    });
    assert.equal(totalDividends, 20_000_000);
    assert.equal(retainedEarnings, 210_000_000);
  });

  it('worked example Z = 2.902 grey', () => {
    const r = calculateAltmanZScore(createExampleInput());
    assert.ok(r);
    assert.ok(Math.abs(r.zScore - 2.902) < 1e-9);
    assert.equal(r.riskZone, 'grey');
    assert.equal(r.x1, 0.16);
    assert.equal(r.x2, 0.2);
    assert.equal(r.x3, 0.1);
    assert.equal(r.x4, 1.5);
    assert.equal(r.x5, 1.2);
  });

  it('zone boundaries', () => {
    assert.equal(classifyAltmanZone(1.8), 'distress');
    assert.equal(classifyAltmanZone(1.81), 'grey');
    assert.equal(classifyAltmanZone(2.99), 'grey');
    assert.equal(classifyAltmanZone(3.0), 'safer');
  });

  it('allows negative EBIT, WC, RE', () => {
    const core = calculateAltmanZScoreCore({
      workingCapital: -100,
      retainedEarnings: -200,
      ebit: -50,
      marketValueOfEquity: 1000,
      totalAssets: 1000,
      totalLiabilities: 500,
      sales: 800,
    });
    assert.ok(core);
    assert.ok(Number.isFinite(core.zScore));
  });

  it('rejects zero total assets', () => {
    const e = collectFieldErrors(base({ totalAssets: '0' }));
    assert.ok(e.totalAssets);
    assert.equal(calculateAltmanZScore(base({ totalAssets: '0' })), null);
  });

  it('rejects zero total liabilities (no Infinity)', () => {
    const e = collectFieldErrors(base({ totalLiabilities: '0' }));
    assert.ok(e.totalLiabilities);
    assert.equal(
      calculateAltmanZScore(base({ totalLiabilities: '0' })),
      null
    );
  });

  it('rejects negative shares and share price', () => {
    const e = collectFieldErrors(
      base({
        marketEquitySource: 'shares',
        sharesOutstanding: '-1',
        sharePrice: '-2',
        marketValueOfEquity: '',
      })
    );
    assert.ok(e.sharesOutstanding);
    assert.ok(e.sharePrice);
  });

  it('rejects negative sales', () => {
    const e = collectFieldErrors(base({ sales: '-10' }));
    assert.ok(e.sales);
  });

  it('clear/empty helpers', () => {
    assert.equal(createEmptyInput().totalAssets, '');
  });

  it('validation returns result for example', () => {
    const v = validateAltmanZScoreInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.riskZone, 'grey');
  });
});
