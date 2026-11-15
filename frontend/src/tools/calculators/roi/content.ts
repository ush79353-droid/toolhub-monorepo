import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ROI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-roi', label: 'What Is ROI?' },
  { id: 'roi-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'roi-faq', label: 'Frequently Asked Questions' },
];

export const ROI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is basic ROI calculated?',
    answer:
      'Total investment is the initial amount plus any periodic contributions. Total gain or loss is returned amount minus total investment. ROI (%) = (gain or loss ÷ total investment) × 100.',
  },
  {
    question: 'How are rate of return and returned amount linked?',
    answer:
      'Without contributions, returned amount = initial × (1 + r)^t. Editing either field updates the other from the most recently changed source. With contributions, the same period-compounding future-value schedule is used.',
  },
  {
    question: 'How is annualized ROI calculated?',
    answer:
      'Years are derived from the start and end calendar dates (365.25-day years). With no contributions, annualized ROI = (returned ÷ initial)^(1 ÷ years) − 1. With contributions, the calculator solves the period-compounding rate that reproduces the ending value.',
  },
  {
    question: 'Is this the same as the Annualized Return or Rate of Return calculators?',
    answer:
      'No. This ROI Calculator combines basic ROI with optional contributions and a date-based annualized section. Those other tools stay separate.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter money fields already in the selected currency.',
  },
];
