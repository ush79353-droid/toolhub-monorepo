import assert from 'node:assert/strict';
import test from 'node:test';
import type { SeoContent } from './content';
import { validateDraft } from './validate-draft';

function words(count: number): string {
  return Array.from({ length: count }, () => 'payment').join(' ');
}

function content(overrides: Partial<SeoContent> = {}): SeoContent {
  const base: SeoContent = {
    metaTitle: 'Auto Loan Calculator — Monthly Payment',
    metaDescription: 'Estimate an auto loan payment from price, rate, term, and down payment.',
    keywords: 'auto loan calculator, car payment calculator',
    primaryKeyword: 'auto loan calculator',
    disclaimer: 'This calculator is educational and is not financial, tax, or investment advice.',
    sections: [
      { id: 'what-this-covers', title: 'What this covers', paragraphs: [words(1550)], bullets: [], formula: '', formulaNote: '' },
      { id: 'how-to-use', title: 'How to use', paragraphs: ['Enter the price.'], bullets: [], formula: '', formulaNote: '' },
      { id: 'how-it-works', title: 'How it works', paragraphs: ['The term changes the payment.'], bullets: [], formula: '', formulaNote: '' },
      { id: 'worked-example', title: 'Example', paragraphs: ['This example is illustrative only.'], bullets: [], formula: '', formulaNote: '' },
      { id: 'how-to-read', title: 'How to read', paragraphs: ['Read the monthly figure first.'], bullets: [], formula: '', formulaNote: '' },
      { id: 'mistakes', title: 'Mistakes', paragraphs: ['Do not mix monthly and yearly rates.'], bullets: [], formula: '', formulaNote: '' },
    ],
    faqs: [
      { question: 'What is the payment?', answer: 'The payment is the amount due each month on the loan.' },
      { question: 'Does the rate change?', answer: 'This example uses one fixed rate for the whole term.' },
      { question: 'Is this an offer?', answer: 'No. It is an estimate for education, not a loan offer.' },
      { question: 'What is left out?', answer: 'Taxes, fees, and insurance are not part of this estimate.' },
    ],
    links: [
      { slug: 'loan-calculator', anchor: 'Loan Calculator' },
      { slug: 'mortgage-calculator', anchor: 'Mortgage Calculator' },
      { slug: 'interest-calculator', anchor: 'Interest Calculator' },
    ],
  };
  return { ...base, ...overrides };
}

const allowed = new Map([
  ['loan-calculator', 'Loan Calculator'],
  ['mortgage-calculator', 'Mortgage Calculator'],
  ['interest-calculator', 'Interest Calculator'],
]);

function check(overrides: Partial<SeoContent> = {}, extra: { keywords?: string[]; locked?: string; duplicate?: boolean; slugs?: Map<string, string> } = {}) {
  const body = content(overrides);
  return validateDraft({
    content: body,
    allowedKeywords: extra.keywords ?? ['auto loan calculator', 'car payment calculator'],
    lockedPrimary: extra.locked ?? body.primaryKeyword,
    allowedSlugs: extra.slugs ?? allowed,
    duplicatePrimary: extra.duplicate ?? false,
  });
}

test('accepts a draft whose only issue is an unverified formula', () => {
  const report = check({
    sections: content().sections.map((section, index) =>
      index === 2 ? { ...section, formula: 'M = P * r' } : section
    ),
  });
  assert.equal(report.ok, true);
  assert.ok(report.issues.some((issue) => issue.code === 'formula_unverified' && issue.severity === 'flag'));
});

test('warns when the guide is 1,200 to 1,499 words and still allows approval', () => {
  const sections = content().sections.map((section, index) =>
    index === 0 ? { ...section, paragraphs: [words(1100)] } : section
  );
  const report = check({ sections });
  assert.equal(report.ok, true);
  assert.ok(report.issues.some((issue) => issue.code === 'word_count' && issue.severity === 'flag'));
});

test('blocks a guide under 1,200 words', () => {
  const sections = content().sections.map((section, index) =>
    index === 0 ? { ...section, paragraphs: [words(800)] } : section
  );
  const report = check({ sections });
  assert.equal(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.code === 'word_count' && issue.severity === 'block'));
});

test('rejects an over-long title', () => {
  const report = check({ metaTitle: 'T'.repeat(71) });
  assert.equal(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.code === 'title_length'));
});

test('rejects a primary keyword that DataForSEO did not return', () => {
  const report = check({ primaryKeyword: 'invented keyword' }, { locked: 'invented keyword' });
  assert.equal(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.code === 'primary_not_in_research'));
});

test('rejects a slug that is not a live sibling calculator', () => {
  const report = check({
    links: [
      { slug: 'loan-calculator', anchor: 'Loan Calculator' },
      { slug: 'missing-calculator', anchor: 'Missing' },
      { slug: 'interest-calculator', anchor: 'Interest Calculator' },
    ],
  });
  assert.equal(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.code === 'dead_slug'));
});

test('rejects a missing disclaimer', () => {
  const report = check({ disclaimer: '   ' });
  assert.equal(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.code === 'disclaimer_missing'));
});

test('rejects fewer than 4 FAQs', () => {
  const report = check({ faqs: content().faqs.slice(0, 2) });
  assert.equal(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.code === 'faq_count'));
});
