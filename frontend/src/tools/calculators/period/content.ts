import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PERIOD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Period Calculator' },
  { id: 'method', label: 'Calendar Method' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'period-faq', label: 'Frequently Asked Questions' },
];

export const PERIOD_FAQS: readonly FAQItem[] = [
  {
    question: 'How are next periods calculated?',
    answer:
      'Each next period start is LMP + k × cycle length (calendar days). Bleeding ends on start + period duration − 1 so a 6-day period is six inclusive days.',
  },
  {
    question: 'How are ovulation and the fertile window estimated?',
    answer:
      'Using the ASRM calendar convention: ovulation falls on cycle day (length − 14), i.e. start + length − 15 calendar days. The fertile window is the six days ending on ovulation.',
  },
];
