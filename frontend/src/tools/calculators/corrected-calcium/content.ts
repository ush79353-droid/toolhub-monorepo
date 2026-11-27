import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CORRECTED_CALCIUM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Corrected Calcium Calculator' },
  { id: 'what-is-corrected', label: 'What is corrected calcium?' },
  { id: 'formula', label: 'Corrected calcium equation' },
  { id: 'limits', label: 'Limits and ionized calcium' },
  { id: 'cca-faq', label: 'Frequently Asked Questions' },
];

export const CORRECTED_CALCIUM_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate corrected calcium?',
    answer:
      'Using the common Payne teaching formula in conventional units: corrected Ca (mg/dL) = measured total Ca (mg/dL) + 0.8 × (4.0 − albumin g/dL). When albumin is 4.0 g/dL, corrected calcium equals the measured total.',
  },
  {
    question: 'Which units are supported?',
    answer:
      'Serum calcium and the corrected result: mg/dL (default) or mmol/L (×4 conversion). Albumin: g/dL (default) or g/L (÷10 to g/dL before the formula).',
  },
  {
    question: 'Is corrected calcium the same as ionized calcium?',
    answer:
      'No. This estimates an albumin-adjusted total calcium. Ionized (free) calcium is a separate laboratory measurement and is preferred when available, especially in critically ill patients.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your lab values.',
  },
];
