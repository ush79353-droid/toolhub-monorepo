import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'LV Calculator' },
  { id: 'formula', label: 'ASE Cube Formula' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'lv-faq', label: 'Frequently Asked Questions' },
];

export const LV_FAQS: readonly FAQItem[] = [
  {
    question: 'What formula is used?',
    answer:
      'ASE recommended linear (cube) method: LVM = 0.8 × 1.04 × [(LVEDD+IVSd+PWd)³ − LVEDD³] + 0.6 with dimensions in cm, then LVMI = LVM/BSA and RWT = 2×PWd/LVEDD.',
  },
  {
    question: 'Why ask for sex?',
    answer:
      'Sex does not change the mass formula. It only labels common ASE LVMI reference cutoffs (about 95 g/m² for women and 115 g/m² for men).',
  },
];
