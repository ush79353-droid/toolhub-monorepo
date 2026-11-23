import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LUTEAL_PHASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Luteal Phase Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formula', label: 'Day Count Convention' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'luteal-phase-faq', label: 'Frequently Asked Questions' },
];

export const LUTEAL_PHASE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which period start date should I use?',
    answer:
      'Use the first day of the menstrual period that follows the ovulation you entered — not an earlier bleed in the same cycle.',
  },
  {
    question: 'How are days counted between ovulation and period?',
    answer:
      'This tool uses elapsed calendar days: first day of period minus ovulation date (date-only). Ovulation 10 Nov and period 24 Nov → 14 days, not 13 “days in between.”',
  },
  {
    question: 'What if the period date is before ovulation?',
    answer:
      'The calculator rejects reversed dates. The next period must fall after ovulation.',
  },
  {
    question: 'Can I share my dates in the link?',
    answer:
      'No. Share uses the public tool page URL only — cycle dates stay in your browser.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational worksheet. Confirm cycle timing with a licensed clinician if needed.',
  },
];