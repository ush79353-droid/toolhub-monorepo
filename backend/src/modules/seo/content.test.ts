import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SECTION_PARAGRAPH_MAX,
  clipSeoRaw,
  clipStringList,
  seoContentSchema,
} from './content';

test('clipStringList merges overflow paragraphs into the last slot', () => {
  const paragraphs = Array.from({ length: 18 }, (_, index) => `P${index + 1}`);
  const clipped = clipStringList(paragraphs, SECTION_PARAGRAPH_MAX, 5000, {
    mergeExtra: true,
  });
  assert.ok(Array.isArray(clipped));
  assert.equal(clipped.length, SECTION_PARAGRAPH_MAX);
  assert.equal(clipped[0], 'P1');
  assert.equal(clipped[14], 'P15');
  assert.equal(clipped[15], 'P16\n\nP17\n\nP18');
});

test('clipStringList truncates bullets without merging', () => {
  const bullets = Array.from({ length: 15 }, (_, index) => `B${index + 1}`);
  assert.deepEqual(clipStringList(bullets, 12, 500), bullets.slice(0, 12));
});

test('clipSeoRaw keeps over-split sections inside the Zod limit', () => {
  const paragraphs = Array.from({ length: 20 }, (_, index) => `Paragraph ${index + 1}.`);
  const raw = {
    metaTitle: 'Mortgage Comparison Calculator',
    metaDescription: 'Compare two mortgage options side by side.',
    keywords: 'mortgage comparison calculator',
    primaryKeyword: 'mortgage comparison calculator',
    disclaimer: 'Educational only. Not financial advice.',
    sections: [
      {
        id: 'what-this-covers',
        title: 'What this covers',
        paragraphs: ['Intro about mortgage comparison.'],
        bullets: [],
        formula: '',
        formulaNote: '',
      },
      {
        id: 'how-to-use',
        title: 'How to use',
        paragraphs,
        bullets: Array.from({ length: 20 }, (_, index) => `Step ${index + 1}`),
        formula: '',
        formulaNote: '',
      },
      {
        id: 'how-it-works',
        title: 'How it works',
        paragraphs: ['Rates and terms drive the comparison.'],
        bullets: [],
        formula: '',
        formulaNote: '',
      },
      {
        id: 'worked-example',
        title: 'Example',
        paragraphs: ['This example is illustrative only.'],
        bullets: [],
        formula: '',
        formulaNote: '',
      },
      {
        id: 'how-to-read',
        title: 'How to read',
        paragraphs: ['Read the monthly figure first.'],
        bullets: [],
        formula: '',
        formulaNote: '',
      },
      {
        id: 'mistakes',
        title: 'Mistakes',
        paragraphs: ['Do not mix monthly and yearly rates.'],
        bullets: [],
        formula: '',
        formulaNote: '',
      },
    ],
    faqs: [
      { question: 'What does it compare?', answer: 'Two loan options.' },
      { question: 'Is it advice?', answer: 'No.' },
      { question: 'Can rates change?', answer: 'Yes.' },
    ],
    links: [
      { slug: 'loan-calculator', anchor: 'Loan calculator' },
      { slug: 'mortgage-calculator', anchor: 'Mortgage calculator' },
      { slug: 'refinance-calculator', anchor: 'Refinance calculator' },
    ],
  };

  const clipped = clipSeoRaw(raw);
  const parsed = seoContentSchema.parse(clipped);
  assert.equal(parsed.sections[1]?.paragraphs.length, SECTION_PARAGRAPH_MAX);
  assert.equal(parsed.sections[1]?.bullets.length, 12);
  assert.match(parsed.sections[1]?.paragraphs[15] ?? '', /Paragraph 20\./);
});
