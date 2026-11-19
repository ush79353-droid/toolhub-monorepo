import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UNPAID_WORK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-unpaid-work', label: 'What is unpaid work, exactly?' },
  {
    id: 'full-time-part-time-sahm',
    label: 'Full-time, part-time, or SAHM/SAHD?',
  },
  {
    id: 'care-diamond',
    label: 'Why we should care about unpaid work: the Care Diamond',
  },
  {
    id: 'triple-r',
    label: 'The Triple R Approach: Recognize, Reduce, Redistribute',
  },
];

export const UNPAID_WORK_FAQS: readonly FAQItem[] = [
  {
    question: 'Is the replacement cost the same as lost wages?',
    answer:
      'No. Replacement cost is what it might cost to hire someone for the same tasks. Opportunity cost is a separate estimate of professional earnings tied to those hours. They are not added together as cash you spend.',
  },
  {
    question: 'Are the hourly outsourcing rates official prices?',
    answer:
      'No. Default rates are labeled illustrative assumptions so the calculator can run. Edit them to match quotes in your area. Changing country changes currency formatting only — it does not convert amounts.',
  },
  {
    question: 'How is monthly value calculated from weekly hours?',
    answer:
      'Weekly replacement cost is multiplied by 52/12 for a monthly figure and by 52 for an annual figure. That spreads a weekly pattern across a year without assuming every month has the same number of days.',
  },
];
