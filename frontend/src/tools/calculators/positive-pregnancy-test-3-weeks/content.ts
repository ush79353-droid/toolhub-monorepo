import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARTICLE_THESIS =
  'Have you been wondering when to take a pregnancy test? Find the answer with our calculator below! Early negatives are common; this widget estimates educational timing only — it does not diagnose pregnancy or confirm that a positive at “3 weeks” is possible for every person.';

export const PPT3_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Positive Test at 3 Weeks?' },
  { id: 'timing', label: 'When to Test' },
  { id: 'ivf', label: 'IVF Timing' },
  { id: 'limits', label: 'What This Tool Does Not Do' },
  { id: 'ppt3-faq', label: 'Frequently Asked Questions' },
];

export const PPT3_FAQS: readonly FAQItem[] = [
  {
    question: 'Can a pregnancy test be positive at 3 weeks pregnant?',
    answer:
      '“3 weeks pregnant” is often counted from LMP, which is about 1 week after ovulation for a 28-day cycle. Some people see a positive urine test around then; others need more time or a blood test. This widget only estimates educational timing — it does not diagnose pregnancy.',
  },
  {
    question: 'Does this calculator say yes or no?',
    answer:
      'No. It reuses Omega’s educational pregnancy-test timetable (natural and IVF). It never outputs a clinical yes/no verdict.',
  },
];
