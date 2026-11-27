import assert from 'node:assert/strict';
import test from 'node:test';
import { buildLlmsTxt } from './llms-txt';

test('llms.txt lists main pages, a category, and its live tool', () => {
  const text = buildLlmsTxt({
    origin: 'https://omegacalculators.com/',
    siteName: 'Omega Calculators',
    categories: [
      {
        name: 'Finance',
        slug: 'finance',
        description: 'Money and loan calculators.',
      },
    ],
    tools: [
      {
        name: 'Loan [calculator]',
        slug: 'loan-calculator',
        shortDescription: 'Monthly payment\nfrom principal and rate.',
        categorySlug: 'finance',
      },
    ],
  });

  assert.match(text, /^# Omega Calculators\n/);
  assert.match(text, /^> Omega Calculators is a free collection/m);
  assert.match(text, /- \[Home\]\(https:\/\/omegacalculators\.com\/\): Search calculators/);
  assert.match(text, /- \[All tools\]\(https:\/\/omegacalculators\.com\/tools\)/);
  assert.match(
    text,
    /- \[Finance\]\(https:\/\/omegacalculators\.com\/categories\/finance\): Money and loan calculators\./
  );
  assert.match(
    text,
    /- \[Loan calculator\]\(https:\/\/omegacalculators\.com\/tools\/loan-calculator\): Monthly payment from principal and rate\./
  );
  assert.match(text, /- \[XML sitemap\]\(https:\/\/omegacalculators\.com\/sitemap\.xml\)/);
  assert.doesNotMatch(text, /\[\]/);
  assert.doesNotMatch(text, /\n\n\n/);
});

test('tools without a category section are still listed', () => {
  const text = buildLlmsTxt({
    origin: '',
    siteName: 'Omega Calculators',
    categories: [],
    tools: [
      {
        name: 'BMI calculator',
        slug: 'bmi-calculator',
        shortDescription: '',
        categorySlug: 'health',
      },
    ],
  });

  assert.match(text, /## Other tools\n\n- \[BMI calculator\]\(\/tools\/bmi-calculator\)\n/);
  assert.doesNotMatch(text, /bmi-calculator\):/);
});
