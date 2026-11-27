import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WINTERS_FORMULA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: "Winters' Formula Calculator" },
  { id: 'what-is', label: "What is Winters' equation?" },
  { id: 'how', label: 'How to calculate' },
  { id: 'range', label: 'Compensation range' },
  { id: 'wf-faq', label: 'Frequently Asked Questions' },
];

export const WINTERS_FORMULA_FAQS: readonly FAQItem[] = [
  {
    question: "What is Winters' formula?",
    answer:
      'For metabolic acidosis, expected compensatory pCO₂ (mmHg) ≈ 1.5 × HCO₃ + 8. A common teaching band is that value ± 2 mmHg.',
  },
  {
    question: 'Why is the default unit kPa?',
    answer:
      'The reference UI defaults expected pCO₂ to kPa. The equation is evaluated in mmHg, then center and ±2 bounds are converted.',
  },
  {
    question: 'Is this a measured pCO₂?',
    answer:
      'No. This estimates the expected compensatory pCO₂ from bicarbonate. Compare it with the measured arterial pCO₂ separately.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
