import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TE2_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'T/E2 Index' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'formula', label: 'Formula & Units' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'te2-faq', label: 'Frequently Asked Questions' },
];

export const TE2_FAQS: readonly FAQItem[] = [
  {
    question: 'What convention does this calculator use?',
    answer:
      'It uses the customary mixed-unit numerical index: convert testosterone to ng/dL and estradiol to pg/mL, then divide those numbers. Example: 500 ng/dL and 25 pg/mL → 20.',
  },
  {
    question: 'Why is this different from a same-mass-unit ratio?',
    answer:
      'If both hormones were converted to the same mass unit (e.g. ng/mL) before dividing, 500 ng/dL and 25 pg/mL would yield about 200, not 20. This tool follows the mixed-unit index, not that mass-normalized ratio.',
  },
  {
    question: 'Which units are supported?',
    answer:
      'Testosterone: ng/dL (default), ng/mL, nmol/L (1 ng/mL = 3.467 nmol/L). Estradiol: pg/mL (default), ng/mL, pmol/L (1 pg/mL = 3.6713 pmol/L). Switching units preserves the physical concentration.',
  },
  {
    question: 'Is this a diagnosis?',
    answer:
      'No. It is educational arithmetic only. Interpretation of hormone panels belongs with a clinician.',
  },
  {
    question: 'Does Share send my lab values?',
    answer: 'No. Share copies or opens only the public calculator page URL.',
  },
];