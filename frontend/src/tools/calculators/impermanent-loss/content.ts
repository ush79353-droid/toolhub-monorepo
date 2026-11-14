import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IMPERMANENT_LOSS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-il', label: 'What Is Impermanent Loss?' },
  { id: 'il-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'il-faq', label: 'Frequently Asked Questions' },
];

export const IMPERMANENT_LOSS_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'It estimates impermanent loss for a constant-weight two-asset AMM by comparing pool value to holding the same initial allocation (HODL), ignoring trading fees and rewards.',
  },
  {
    question: 'What formula is used?',
    answer:
      'HODL = Deposit × (wA × rA + wB × rB). Pool = Deposit × rA^wA × rB^wB. IL% = (Pool / HODL − 1) × 100. Net loss vs holding = HODL − Pool.',
  },
  {
    question: 'Which weight pairs are supported?',
    answer: 'Constant-weight pairs: 50/50, 80/20, 20/80, 70/30, and 30/70.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and formatting. Enter amounts already in the selected currency.',
  },
];
