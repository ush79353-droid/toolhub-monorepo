import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SINKING_FUND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sinking-fund', label: 'What Is a Sinking Fund?' },
  { id: 'sinking-fund-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'sinking-fund-faq', label: 'Frequently Asked Questions' },
];

export const SINKING_FUND_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a sinking fund?',
    answer:
      'A sinking fund is a series of equal deposits that grow with interest to a target future amount. The USSF factor converts the target into the required periodic contribution.',
  },
  {
    question: 'How is the USSF factor calculated?',
    answer:
      'USSF = i / ((1 + i)^n − 1), where i is the rate per compounding period and n is the number of periods. When i = 0, USSF = 1 / n.',
  },
  {
    question: 'How are months handled in the period?',
    answer:
      'Years and months combine as t = years + months/12. Total periods n = m × t may be fractional. The contribution is still the equal end-of-period amount for the selected compounding frequency.',
  },
  {
    question: 'Does the contribution frequency match compounding?',
    answer:
      'Yes. Equal contributions are assumed at the end of each compounding period (yearly, monthly, and so on).',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter amounts already in the selected currency.',
  },
];
