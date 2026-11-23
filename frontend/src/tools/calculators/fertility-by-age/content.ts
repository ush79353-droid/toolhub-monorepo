import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FERTILITY_BY_AGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fertility by Age Calculator' },
  { id: 'what-it-shows', label: 'What the Percent Means' },
  { id: 'bands', label: 'Age Bands Used' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'fertility-faq', label: 'Frequently Asked Questions' },
];

export const FERTILITY_BY_AGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator show?',
    answer:
      'It looks up an educational average chance of pregnancy per menstrual cycle for the selected female age band. It does not predict your personal outcome.',
  },
  {
    question: 'Where do the percentages come from?',
    answer:
      'They are commonly cited ASRM/ACOG patient-education fecundability bands for couples without known infertility (about 24%, 20%, 17%, 12%, and 6% across ages 20–24 through 40–44). They are not computed by dividing yearly rates by 12.',
  },
  {
    question: 'Why is age 45 not listed?',
    answer:
      'This tool only maps ages with published educational band rates used here (20–44). Ages outside that range are unsupported rather than extrapolated.',
  },
];
