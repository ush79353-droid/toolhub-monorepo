import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PENCE_TO_POUNDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pence to Pounds Converter' },
  { id: 'formula', label: 'Conversion Formula' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'notes', label: 'GBX vs GBP' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'pence-to-pounds-faq', label: 'Frequently Asked Questions' },
];

export const PENCE_TO_POUNDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many pence are in a pound?',
    answer:
      'Exactly 100 pence equal one pound sterling. This is a fixed legal subdivision of GBP, not a market exchange rate.',
  },
  {
    question: 'How do you convert pence to pounds?',
    answer: 'Divide pence by 100: pounds = pence ÷ 100. Example: 250p ÷ 100 = £2.50.',
  },
  {
    question: 'How do you convert pounds to pence?',
    answer: 'Multiply pounds by 100: pence = pounds × 100. Example: £3.75 × 100 = 375p.',
  },
  {
    question: 'What does GBX mean?',
    answer:
      'GBX is a market ticker-style code for sterling quoted in pence (penny sterling), while GBP is pounds. Both refer to the same currency at a fixed 100:1 ratio.',
  },
  {
    question: 'Does this converter use live FX rates?',
    answer:
      'No. It only applies the fixed 100 pence = 1 pound rule. It does not fetch exchange rates against other currencies.',
  },
];
