import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BUILD_VS_BUY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-build-vs-buy', label: 'What Build vs Buy Means' },
  { id: 'build-vs-buy-formulas', label: 'Formulas' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'build-vs-buy-examples', label: 'Example' },
  { id: 'build-vs-buy-faq', label: 'Frequently Asked Questions' },
];

export const BUILD_VS_BUY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does annual savings mean?',
    answer:
      'Annual savings is the yearly external service cost minus yearly maintenance of the in-house build. A positive figure means buying costs more per year than maintaining your own software.',
  },
  {
    question: 'When does the calculator show “No payback”?',
    answer:
      'When annual savings is zero or negative, the build never recovers its upfront cost through lower yearly spend under these assumptions. The calculator shows “No payback” instead of inventing a years figure.',
  },
  {
    question: 'How is overhead applied?',
    answer:
      'Effective monthly employee cost = gross monthly salary × (1 + overhead ÷ 100). Overhead covers benefits, taxes, tools, and similar load. It does not invent a second salary line.',
  },
  {
    question: 'Why 22 days and 52/12 weeks?',
    answer:
      'Maintenance and day-based build durations use 22 working days per month. Week-based durations convert with 52 ÷ 12 weeks per month. Those are fixed documented assumptions, not extra inputs.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter buy cost and salaries in the same currency.',
  },
];
