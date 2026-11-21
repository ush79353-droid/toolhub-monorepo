import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COMMISSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-commission-calculator', label: 'What Is This Calculator?' },
  { id: 'commission-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'commission-faq', label: 'Frequently Asked Questions' },
];

export const COMMISSION_FAQS: readonly FAQItem[] = [
  {
    question: 'Which field should I leave blank?',
    answer:
      'Leave exactly one of Sales Price, Commission Rate, or Commission blank. The calculator solves for that unknown from the other two using a simple percentage commission structure.',
  },
  {
    question: 'Is zero a valid value?',
    answer:
      'Yes. Entering 0 counts as a filled value, not a blank. A blank field is the one left empty so the calculator can solve for it. Zero denominators (for example a $0 sales price when solving for rate) are rejected.',
  },
  {
    question: 'Why is there no currency selector?',
    answer:
      'The reference layout formats money in USD only. Commission rate is a percentage and is never converted.',
  },
  {
    question: 'How is this different from the Sales Commission Calculator?',
    answer:
      'This tool solves one unknown among sales price, rate, and commission for a flat percentage. The Sales Commission Calculator models bases, thresholds, margins, and related operating metrics.',
  },
];
