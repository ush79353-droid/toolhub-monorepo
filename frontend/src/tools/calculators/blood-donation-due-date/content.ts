import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BLOOD_DONATION_DUE_DATE_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Blood Donation Due Date Calculator' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'intervals', label: 'Male and Female Intervals' },
    { id: 'custom', label: 'Custom Period' },
    { id: 'formula', label: 'Date Formula' },
    { id: 'jurisdiction', label: 'Jurisdiction Scope' },
    { id: 'example', label: 'Worked Example' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'related', label: 'Related Calculators' },
    {
      id: 'blood-donation-due-date-faq',
      label: 'Frequently Asked Questions',
    },
  ];

export const BLOOD_DONATION_DUE_DATE_FAQS: readonly FAQItem[] = [
  {
    question: 'How often can men donate whole blood?',
    answer:
      'Under NHS Blood and Transplant guidance used by this calculator, male donors wait a minimum of 12 weeks (84 days) between whole-blood donations.',
  },
  {
    question: 'How often can women donate whole blood?',
    answer:
      'Under the same NHS / WHO-style model, female donors wait a minimum of 16 weeks (112 days) between whole-blood donations.',
  },
  {
    question: 'How is the next donation date calculated?',
    answer:
      'Next donation date = last donation date + wait interval, using date-only calendar math. For weeks, the interval is exact days × 7 (12 weeks = 84 days).',
  },
  {
    question: 'Does this match U.S. Red Cross rules?',
    answer:
      'No by default. Many U.S. services allow whole-blood donation every 56 days for all donors. Use Custom period if your service specifies a different wait, and always confirm before booking.',
  },
  {
    question: 'What about platelets or plasma?',
    answer:
      'This tool targets whole-blood waits. Platelets, plasma, and double-red donations use different schedules. Ask your blood service for the correct interval.',
  },
  {
    question: 'Is this medical clearance to donate?',
    answer:
      'No. Eligibility also depends on hemoglobin, travel, medications, infections, and other screening. The calculator only adds a wait interval to a date.',
  },
  {
    question: 'Are my donation dates stored?',
    answer:
      'No. Dates stay in your browser session for this page. Share uses the public calculator URL without your entered dates.',
  },
];
