import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AGE_ADJUSTED_D_DIMER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Age-Adjusted D-dimer Calculator' },
  { id: 'formula', label: 'Cutoff Rules' },
  { id: 'units', label: 'Units' },
  { id: 'd-dimer-faq', label: 'Frequently Asked Questions' },
];

export const AGE_ADJUSTED_D_DIMER_FAQS: readonly FAQItem[] = [
  {
    question: 'When does age adjustment apply?',
    answer:
      'In validated FEU protocols, patients older than 50 years use cutoff = age × 10 µg/L; age 50 and younger use 500 µg/L FEU.',
  },
  {
    question: 'How do FEU and DDU differ here?',
    answer:
      'FEU (fibrinogen equivalent units) and DDU (D-dimer units) report different numeric scales. This tool applies age×10 µg/L FEU or age×5 µg/L DDU when age > 50, with fixed younger thresholds 500 and 250 µg/L respectively.',
  },
  {
    question: 'Why show µg/mL and µg/L?',
    answer:
      'Laboratories may report D-dimer in µg/mL or µg/L. Multiply µg/mL by 1,000 to compare with µg/L (1 µg/mL = 1,000 µg/L).',
  },
  {
    question: 'Is my age stored?',
    answer: 'No. Inputs remain in the browser; share uses the page URL only.',
  },
];