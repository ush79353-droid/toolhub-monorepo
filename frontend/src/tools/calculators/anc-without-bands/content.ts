import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANC_WITHOUT_BANDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'ANC Calculator without Bands' },
  { id: 'formula', label: 'How ANC Is Calculated' },
  { id: 'lab-layout', label: 'Lab Report Layouts' },
  { id: 'anc-wb-faq', label: 'Frequently Asked Questions' },
];

export const ANC_WITHOUT_BANDS_FAQS: readonly FAQItem[] = [
  {
    question: 'Why are there different lab-report modes?',
    answer:
      'CBC differentials report neutrophils as NEUT, POLY, or segmented forms with or without separate band counts. Pick the layout that matches your report so band forms are added only when they are not already included.',
  },
  {
    question: 'What formula does this calculator use?',
    answer:
      'ANC (cells/µL) = WBC (×10³/µL) × 1,000 × (neutrophil % ÷ 100). Example: WBC 5 and 40% neutrophils give 2,000 cells/µL.',
  },
  {
    question: 'Are my lab values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only, not your numbers.',
  },
];