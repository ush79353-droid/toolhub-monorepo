import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CORRECTED_MAGNESIUM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Corrected Magnesium Calculator' },
  { id: 'what-is', label: 'What is corrected magnesium?' },
  { id: 'formula', label: 'Magnesium correction for albumin' },
  { id: 'limits', label: 'Limits' },
  { id: 'cmg-faq', label: 'Frequently Asked Questions' },
];

export const CORRECTED_MAGNESIUM_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate corrected magnesium?',
    answer:
      'In the published mmol/L convention: corrected Mg = measured Mg (mmol/L) + 0.005 × (40 − albumin g/L). When albumin is 40 g/L, corrected magnesium equals the measured value. Magnesium mEq/L uses the divalent factor ×2 versus mmol/L.',
  },
  {
    question: 'Is this the same as the calcium correction?',
    answer:
      'No. Do not reuse Payne calcium coefficients. This tool uses the Kroll & Elin magnesium/albumin adjustment.',
  },
  {
    question: 'Which units are supported?',
    answer:
      'Magnesium and the corrected result: mEq/L (default), mmol/L, or mg/dL. Albumin: g/L (default) or g/dL.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
