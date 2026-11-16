import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STUDENT_LOAN_FORGIVENESS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-historical', label: 'What Is This Tool?' },
  { id: 'why-no-estimate', label: 'Why No Forgiveness Estimate?' },
  { id: 'slf-faq', label: 'Frequently Asked Questions' },
];

export const STUDENT_LOAN_FORGIVENESS_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator estimate current federal forgiveness?',
    answer:
      'No. It preserves the screenshot input fields for a historical form resembling the blocked 2022 U.S. federal student debt relief proposal. It does not claim an active government benefit.',
  },
  {
    question: 'Why is there no forgiveness dollar amount?',
    answer:
      'Verified income thresholds, Pell Grant distinctions, and debt caps for that historical model are not defined in available project/reference data. Fabricated amounts are not shown.',
  },
  {
    question: 'Does this include PSLF or income-driven repayment?',
    answer:
      'No. Those models are outside the screenshot scope and are not added here.',
  },
];
