import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ppm', label: 'What Are Pre- and Post-Money Valuations?' },
  { id: 'ppm-formula', label: 'Formulas' },
  { id: 'ppm-example', label: 'Example' },
  { id: 'ppm-faq', label: 'Frequently Asked Questions' },
];

export const PPM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is pre-money valuation?',
    answer:
      'Pre-money valuation is the company’s value before the new investment is added. Post-money equals pre-money plus the investment.',
  },
  {
    question: 'How is investor equity calculated?',
    answer:
      'Investor equity (%) = (Investment ÷ Post-money valuation) × 100. Enter any two related values and the others fill automatically.',
  },
  {
    question: 'Will the calculator overwrite values I typed?',
    answer:
      'No. Fields you enter stay as typed. Only blank fields are filled when other inputs make them determinable.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only labels monetary fields. Enter amounts already in the currency you select.',
  },
];
