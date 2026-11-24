import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUARANTINE_ACTIVITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Quarantine activity' },
  { id: 'formula', label: 'How it works' },
  { id: 'faq', label: 'FAQ' },
];

export const QUARANTINE_ACTIVITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does PAL mean?',
    answer:
      'Physical activity level multiplies resting energy to estimate total daily expenditure. This tool maps work, home, and exercise answers to an Omni-style PAL from 1.2 to 2.4.',
  },
  {
    question: 'Are removed and added activities part of PAL?',
    answer:
      'No. PAL comes only from the work/home/exercise radios. Removed and added activities estimate a separate MET calorie delta so you can see lifestyle swaps without double-counting the same movement in PAL.',
  },
  {
    question: 'Is this clinical isolation guidance?',
    answer:
      'No. It is an educational energy worksheet inspired by quarantine lifestyle changes. It does not compute isolation windows or medical quarantine policy.',
  },
];
