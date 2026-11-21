import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CROSS_EXCHANGE_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cross Exchange Rate Calculator' },
  { id: 'what-is', label: 'What Is a Cross Rate?' },
  { id: 'formula', label: 'Cross Rate Formula' },
  { id: 'how-to', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'notes', label: 'Quoting Conventions' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cross-exchange-rate-faq', label: 'Frequently Asked Questions' },
];

export const CROSS_EXCHANGE_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a cross exchange rate?',
    answer:
      'A cross rate is the exchange rate between two currencies inferred from each currency’s rate against a common third (bridge) currency, rather than quoted directly in the market.',
  },
  {
    question: 'How do you calculate a cross rate?',
    answer:
      'Express both legs against the bridge C, then compute A/B = (A/C) ÷ (B/C). The reciprocal B/A = 1 ÷ (A/B).',
  },
  {
    question: 'Why enter only one direction for each pair?',
    answer:
      'A/C and C/A are reciprocals. Entering both with inconsistent values creates a conflict. Enter one direction; the calculator derives the other.',
  },
  {
    question: 'Do A, B, and C have to be specific currencies?',
    answer:
      'No. A, B, and C are arbitrary labels for three different currencies. Assign whichever market pairs you have to those letters consistently.',
  },
  {
    question: 'Does this calculator use live FX rates?',
    answer:
      'No. There are no currency selectors. You enter the rates yourself. The tool does not fetch or convert using stored exchange-rate snapshots.',
  },
  {
    question: 'Can rates be zero or negative?',
    answer:
      'No. Exchange rates must be strictly positive finite numbers. Zero or negative inputs are rejected.',
  },
];
