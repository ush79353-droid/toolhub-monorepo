import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateActualPrice,
  calculateActualPriceFromPercentage,
  calculateMarkdown,
  calculateMarkdownAmount,
  calculateMarkdownFromInput,
  calculateMarkdownPercentage,
  calculateOriginalPrice,
  calculateOriginalPriceFromPercentage,
} from './calculation';
import {
  createExampleInput,
  pushAuthoritative,
  type MarkdownInput,
} from './types';
import { validateMarkdownInput } from './validation';

function base(patch: Partial<MarkdownInput> = {}): MarkdownInput {
  return { ...createExampleInput(), ...patch };
}

describe('markdown calculator', () => {
  it('Test 1: original 100 + actual 75 → md 25 · 25%', () => {
    const s = calculateMarkdown(
      { originalPrice: 100, actualPrice: 75 },
      ['originalPrice', 'actualPrice'],
    );
    assert.ok(s);
    assert.equal(s.markdownAmount, 25);
    assert.equal(s.markdownPercentage, 25);
  });

  it('Test 2: original 150 + markdown 30 → actual 120 · 20%', () => {
    const s = calculateMarkdown(
      { originalPrice: 150, markdownAmount: 30 },
      ['originalPrice', 'markdownAmount'],
    );
    assert.ok(s);
    assert.equal(s.actualPrice, 120);
    assert.equal(s.markdownPercentage, 20);
  });

  it('Test 3: original 250 + 20% → md 50 · actual 200', () => {
    const s = calculateMarkdown(
      { originalPrice: 250, markdownPercentage: 20 },
      ['originalPrice', 'markdownPercentage'],
    );
    assert.ok(s);
    assert.equal(s.markdownAmount, 50);
    assert.equal(s.actualPrice, 200);
  });

  it('Test 4: actual 80 + markdown 20 → original 100 · 20%', () => {
    const s = calculateMarkdown(
      { actualPrice: 80, markdownAmount: 20 },
      ['actualPrice', 'markdownAmount'],
    );
    assert.ok(s);
    assert.equal(s.originalPrice, 100);
    assert.equal(s.markdownPercentage, 20);
  });

  it('Test 5: actual 120 + 20% → original 150 · md 30', () => {
    const s = calculateMarkdown(
      { actualPrice: 120, markdownPercentage: 20 },
      ['actualPrice', 'markdownPercentage'],
    );
    assert.ok(s);
    assert.equal(s.originalPrice, 150);
    assert.equal(s.markdownAmount, 30);
  });

  it('Test 6: markdown 40 + 20% → original 200 · actual 160', () => {
    const s = calculateMarkdown(
      { markdownAmount: 40, markdownPercentage: 20 },
      ['markdownAmount', 'markdownPercentage'],
    );
    assert.ok(s);
    assert.equal(s.originalPrice, 200);
    assert.equal(s.actualPrice, 160);
  });

  it('Test 7: zero markdown', () => {
    const s = calculateMarkdown(
      { originalPrice: 100, actualPrice: 100 },
      ['originalPrice', 'actualPrice'],
    );
    assert.ok(s);
    assert.equal(s.markdownAmount, 0);
    assert.equal(s.markdownPercentage, 0);
  });

  it('Test 8: full markdown 100%', () => {
    const s = calculateMarkdown(
      { originalPrice: 100, actualPrice: 0 },
      ['originalPrice', 'actualPrice'],
    );
    assert.ok(s);
    assert.equal(s.markdownAmount, 100);
    assert.equal(s.markdownPercentage, 100);
  });

  it('Test 9: negative price rejected', () => {
    const v = validateMarkdownInput(
      base({
        originalPrice: '-10',
        actualPrice: '5',
        authoritativeFields: ['originalPrice', 'actualPrice'],
      }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 10: actual > original rejected', () => {
    assert.equal(calculateMarkdownAmount(100, 120), null);
    const v = validateMarkdownInput(
      base({
        originalPrice: '100',
        actualPrice: '120',
        authoritativeFields: ['originalPrice', 'actualPrice'],
      }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 11: percentage > 100 rejected', () => {
    const v = validateMarkdownInput(
      base({
        originalPrice: '100',
        markdownPercentage: '120',
        authoritativeFields: ['originalPrice', 'markdownPercentage'],
      }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 12: 100% with actual blocks reverse', () => {
    assert.equal(calculateOriginalPriceFromPercentage(0, 100), null);
    const s = calculateMarkdown(
      { actualPrice: 0, markdownPercentage: 100 },
      ['actualPrice', 'markdownPercentage'],
    );
    assert.equal(s, null);
  });

  it('Test 13: decimal precision 10% of 99.99', () => {
    const actual = calculateActualPriceFromPercentage(99.99, 10);
    assert.ok(actual != null);
    assert.ok(Math.abs(actual - 89.991) < 1e-9);
  });

  it('Test 14: input priority keeps original when % changes', () => {
    let fields = pushAuthoritative(null, 'originalPrice');
    fields = pushAuthoritative(fields, 'actualPrice');
    assert.deepEqual(fields, ['originalPrice', 'actualPrice']);
    fields = pushAuthoritative(fields, 'markdownPercentage');
    assert.deepEqual(fields, ['originalPrice', 'markdownPercentage']);
    const s = calculateMarkdown(
      { originalPrice: 200, markdownPercentage: 30 },
      fields,
    );
    assert.ok(s);
    assert.equal(s.markdownAmount, 60);
    assert.equal(s.actualPrice, 140);
  });

  it('helpers', () => {
    assert.equal(calculateMarkdownPercentage(200, 160), 20);
    assert.equal(calculateActualPrice(150, 30), 120);
    assert.equal(calculateOriginalPrice(80, 20), 100);
  });

  it('example input solves', () => {
    const r = calculateMarkdownFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.markdownAmount, 25);
    assert.equal(r.markdownPercentage, 25);
  });
});
