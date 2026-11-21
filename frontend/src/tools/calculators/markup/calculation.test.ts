import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateCostFromProfit,
  calculateCostFromRevenue,
  calculateMarkup,
  calculateMarkupFromInput,
  calculateMarkupPercentage,
  calculateProfit,
  calculateProfitMargin,
  calculateRevenue,
  marginToMarkup,
  markupToMargin,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  pushAuthoritative,
  type MarkupInput,
} from './types';
import { hasMarkupErrors, validateMarkupInput } from './validation';

function approx(actual: number | null, expected: number, tol = 1e-6) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

describe('Markup Calculator engine', () => {
  it('basic markup: cost 50, revenue 70 → markup 40%, profit 20', () => {
    approx(calculateMarkupPercentage(50, 70), 40);
    approx(calculateProfit(50, 70), 20);
    const solved = calculateMarkup(
      { cost: 50, revenue: 70 },
      ['cost', 'revenue'],
    );
    assert.ok(solved);
    approx(solved!.markupPercentage, 40);
    approx(solved!.profit, 20);
  });

  it('cost + markup: cost 100, markup 25% → revenue 125, profit 25', () => {
    approx(calculateRevenue(100, 25), 125);
    const solved = calculateMarkup(
      { cost: 100, markupPercentage: 25 },
      ['cost', 'markupPercentage'],
    );
    assert.ok(solved);
    approx(solved!.revenue, 125);
    approx(solved!.profit, 25);
  });

  it('cost + profit: cost 200, profit 50 → revenue 250, markup 25%', () => {
    const solved = calculateMarkup(
      { cost: 200, profit: 50 },
      ['cost', 'profit'],
    );
    assert.ok(solved);
    approx(solved!.revenue, 250);
    approx(solved!.markupPercentage, 25);
  });

  it('revenue + markup: revenue 150, markup 50% → cost 100, profit 50', () => {
    approx(calculateCostFromRevenue(150, 50), 100);
    const solved = calculateMarkup(
      { revenue: 150, markupPercentage: 50 },
      ['revenue', 'markupPercentage'],
    );
    assert.ok(solved);
    approx(solved!.cost, 100);
    approx(solved!.profit, 50);
  });

  it('revenue + profit: revenue 120, profit 30 → cost 90', () => {
    const solved = calculateMarkup(
      { revenue: 120, profit: 30 },
      ['revenue', 'profit'],
    );
    assert.ok(solved);
    approx(solved!.cost, 90);
    approx(solved!.markupPercentage, (30 / 90) * 100);
  });

  it('profit + markup: profit 40, markup 20% → cost 200, revenue 240', () => {
    approx(calculateCostFromProfit(40, 20), 200);
    const solved = calculateMarkup(
      { profit: 40, markupPercentage: 20 },
      ['profit', 'markupPercentage'],
    );
    assert.ok(solved);
    approx(solved!.cost, 200);
    approx(solved!.revenue, 240);
  });

  it('zero markup: cost 100, markup 0% → revenue 100, profit 0', () => {
    const solved = calculateMarkup(
      { cost: 100, markupPercentage: 0 },
      ['cost', 'markupPercentage'],
    );
    assert.ok(solved);
    approx(solved!.revenue, 100);
    approx(solved!.profit, 0);
  });

  it('negative markup: cost 100, markup -20% → revenue 80, profit -20', () => {
    const solved = calculateMarkup(
      { cost: 100, markupPercentage: -20 },
      ['cost', 'markupPercentage'],
    );
    assert.ok(solved);
    approx(solved!.revenue, 80);
    approx(solved!.profit, -20);
  });

  it('100% markup: cost 50 → revenue 100', () => {
    approx(calculateRevenue(50, 100), 100);
  });

  it('margin check: cost 60, revenue 100 → margin 40%, markup ≈ 66.67%', () => {
    approx(calculateProfitMargin(60, 100), 40);
    approx(calculateMarkupPercentage(60, 100), 66.666666, 1e-4);
  });

  it('markup ↔ margin conversion', () => {
    approx(markupToMargin(50), 33.333333, 1e-4);
    approx(marginToMarkup(20), 25);
    assert.equal(markupToMargin(-100), null);
    assert.equal(marginToMarkup(100), null);
  });

  it('zero cost percentage is undefined', () => {
    assert.equal(calculateMarkupPercentage(0, 50), null);
    assert.equal(
      calculateMarkup({ cost: 0, revenue: 50 }, ['cost', 'revenue']),
      null,
    );
  });

  it('invalid negative cost fails validation', () => {
    const input: MarkupInput = {
      ...createDefaultInput(),
      cost: '-100',
      markupPercentage: '40',
      authoritativeFields: ['cost', 'markupPercentage'],
    };
    const validation = validateMarkupInput(input);
    assert.ok(hasMarkupErrors(validation.errors));
    assert.ok(validation.errors.cost);
    assert.equal(validation.result, null);
  });

  it('profit + markup 0% is not unique', () => {
    assert.equal(calculateCostFromProfit(10, 0), null);
    assert.equal(
      calculateMarkup({ profit: 10, markupPercentage: 0 }, [
        'profit',
        'markupPercentage',
      ]),
      null,
    );
  });

  it('decimal precision: cost 19.99, markup 25%', () => {
    const input: MarkupInput = {
      ...createDefaultInput(),
      cost: '19.99',
      markupPercentage: '25',
      authoritativeFields: ['cost', 'markupPercentage'],
    };
    const result = calculateMarkupFromInput(input);
    assert.ok(result);
    approx(result!.revenue, 24.9875, 1e-6);
    // Display rounds to currency digits
    assert.equal(result!.formattedRevenue, '$24.99');
  });

  it('example input produces Omni reference values', () => {
    const result = calculateMarkupFromInput(createExampleInput());
    assert.ok(result);
    approx(result!.cost, 50);
    approx(result!.markupPercentage, 40);
    approx(result!.revenue, 70);
    approx(result!.profit, 20);
  });

  it('clear / reload helpers reset fields', () => {
    assert.equal(createEmptyInput().cost, '');
    assert.equal(createDefaultInput().authoritativeFields, null);
  });

  it('pushAuthoritative prefers cost partner for % / profit edits', () => {
    assert.deepEqual(pushAuthoritative(['cost', 'markupPercentage'], 'profit'), [
      'cost',
      'profit',
    ]);
    // Without a cost anchor, keep last partner + newly edited field
    assert.deepEqual(pushAuthoritative(['revenue', 'profit'], 'markupPercentage'), [
      'profit',
      'markupPercentage',
    ]);
  });

  it('no NaN/Infinity for -100% markup edge', () => {
    assert.equal(calculateCostFromRevenue(100, -100), null);
    assert.equal(calculateRevenue(100, -100), 0);
  });
});
