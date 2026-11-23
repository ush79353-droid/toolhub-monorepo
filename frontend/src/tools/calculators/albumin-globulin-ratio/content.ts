import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ALBUMIN_GLOBULIN_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Albumin Globulin Ratio Calculator' },
  { id: 'formula', label: 'Formula' },
  { id: 'ag-faq', label: 'Frequently Asked Questions' },
];

export const ALBUMIN_GLOBULIN_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'How is globulin calculated?',
    answer:
      'Globulin (g/dL) = total protein − albumin, assuming both are measured in the same g/dL unit.',
  },
  {
    question: 'What is the A/G ratio?',
    answer:
      'The albumin/globulin ratio is dimensionless: albumin ÷ globulin. It is undefined when globulin is zero.',
  },
  {
    question: 'Can I enter globulin directly?',
    answer:
      'This calculator derives globulin from albumin and total protein to match standard chemistry panels that report those two values.',
  },
  {
    question: 'Are lab values stored?',
    answer: 'No. Values stay in your browser; share uses the page URL only.',
  },
];