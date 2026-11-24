import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ISOTRETINOIN_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Isotretinoin Dose Worksheet' },
  { id: 'math', label: 'How the math works' },
  { id: 'isotretinoin-faq', label: 'Frequently Asked Questions' },
];

export const ISOTRETINOIN_FAQS: readonly FAQItem[] = [
  {
    question: 'Is 135 mg/kg an FDA-labeled dose?',
    answer:
      'No. FDA Accutane labeling recommends 0.5–1 mg/kg/day for about 15–20 weeks. The 135 mg/kg figure is a teaching example for cumulative planning (often discussed in the 120–150 mg/kg band), not a labeled target or prescription.',
  },
  {
    question: 'What does this calculator compute?',
    answer:
      'It multiplies weight (kg) by a planned cumulative mg/kg to get total milligrams, then solves either duration = total ÷ daily mg, or daily mg = total ÷ duration days.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
