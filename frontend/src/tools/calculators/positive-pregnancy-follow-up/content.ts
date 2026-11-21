import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const POSITIVE_PREGNANCY_FOLLOW_UP_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'After a Positive Pregnancy Test' },
    { id: 'timing-widget', label: 'Testing Timing Widget' },
    { id: 'next-steps', label: 'General Next Steps' },
    { id: 'limitations', label: 'Limitations' },
    {
      id: 'positive-pregnancy-follow-up-faq',
      label: 'Frequently Asked Questions',
    },
  ];

export const POSITIVE_PREGNANCY_FOLLOW_UP_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this page confirm I am pregnant?',
    answer:
      'No. A home urine test estimate of timing does not diagnose pregnancy. Clinicians may confirm with examination and laboratory testing.',
  },
  {
    question: 'What does the timetable widget do?',
    answer:
      'It reuses the same educational natural-conception and IVF testing timetable used on related pregnancy-test tools: optional LMP/ovulation or transfer dates to estimate when urine or blood testing is often discussed. It does not interpret hCG values.',
  },
  {
    question: 'Is medical advice included?',
    answer:
      'No treatment plans, medication changes, or emergency triage beyond general “contact a clinician / urgent care if severe symptoms” language. Follow local clinical guidance.',
  },
];
