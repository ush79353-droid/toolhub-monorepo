import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DAYS_OFF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-days-off', label: 'What Is This Calculator?' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'days-off-faq', label: 'Frequently Asked Questions' },
];

export const DAYS_OFF_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator compute a numeric leave balance?',
    answer:
      'No. It summarizes statutory rules and common practices for the selected country and contract type. It does not invent a guaranteed number of days for every situation.',
  },
  {
    question: 'Why do U.S. results emphasize employer policy?',
    answer:
      'U.S. federal law generally does not require private employers to provide paid vacation. Typical 10–15 day offers for full-time staff are common practice, not a federal entitlement.',
  },
  {
    question: 'Do UK part-time workers get the same leave as full-time workers?',
    answer:
      'They get the same 5.6-week statutory entitlement, pro-rated to the days or hours they work, and must not be treated less favourably than comparable full-time workers.',
  },
  {
    question: 'Do freelancers get paid holiday?',
    answer:
      'Genuinely self-employed people usually do not have a statutory paid-holiday right from the client. Agency “worker” status in the UK, or an employment contract in Poland, can change that.',
  },
];
