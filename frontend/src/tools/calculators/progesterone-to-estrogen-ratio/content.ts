import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PGE2_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Pg/E2 Ratio' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'formula', label: 'Formula & Units' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'pge2-faq', label: 'Frequently Asked Questions' },
];

export const PGE2_FAQS: readonly FAQItem[] = [
  {
    question: 'What does estrogen mean here?',
    answer:
      'This calculator uses estradiol (E2) as the estrogen analyte in the Pg/E2 or P/E2 ratio.',
  },
  {
    question: 'How is the ratio calculated?',
    answer:
      'Both hormones are converted to pg/mL, then ratio = progesterone (pg/mL) ÷ estradiol (pg/mL). With progesterone in ng/mL and estradiol in pg/mL that is the same as 1000 × P ÷ E2. Example: 10 ng/mL and 100 pg/mL → 100.',
  },
  {
    question: 'Which units are supported?',
    answer:
      'Progesterone: ng/mL, pg/mL, nmol/L (1 ng/mL = 3.18 nmol/L). Estradiol: pg/mL, ng/mL, pmol/L (1 pg/mL = 3.6713 pmol/L). Switching units preserves the physical concentration.',
  },
  {
    question: 'Is this a diagnosis?',
    answer:
      'No. It is educational arithmetic only. Cycle phase, IVF cutoffs, and treatment decisions belong with a clinician.',
  },
  {
    question: 'Does Share send my lab values?',
    answer:
      'No. Share/copy uses only the public calculator page URL.',
  },
];
