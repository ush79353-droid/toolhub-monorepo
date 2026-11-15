import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PVGO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pvgo', label: 'What Is PVGO?' },
  { id: 'pvgo-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'pvgo-faq', label: 'Frequently Asked Questions' },
];

export const PVGO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is PVGO?',
    answer:
      'Present value of growth opportunities (PVGO) is the part of a share’s price that is not explained by a no-growth earnings perpetuity. It equals share price minus EPS divided by the cost of equity.',
  },
  {
    question: 'How is EPS calculated?',
    answer: 'EPS = total earnings ÷ number of shares outstanding.',
  },
  {
    question: 'How is PVGO calculated?',
    answer:
      'PVGO = share price − (EPS ÷ (cost of equity ÷ 100)). Example: 150 − (10 ÷ 0.10) = 50.',
  },
  {
    question: 'Can PVGO be negative?',
    answer:
      'Yes. If the no-growth value (EPS ÷ cost of equity) exceeds the share price, PVGO is negative.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
