import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PROTEIN_CREATININE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Urine protein creatinine ratio (UPCR)' },
  { id: 'how-to-calculate', label: 'How to calculate protein creatinine ratio' },
  { id: 'interpretation', label: 'Protein creatinine ratio — interpretation' },
  { id: 'nephrotic', label: 'Nephrotic range proteinuria' },
  { id: 'example', label: 'Protein creatinine ratio calculator — a practical example' },
  { id: 'protein-creatinine-faq', label: 'FAQs' },
];

export const PROTEIN_CREATININE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is UPCR?',
    answer:
      'The urine protein-to-creatinine ratio from a spot sample. When both concentrations are in mg/dL, UPCR in g/g equals protein ÷ creatinine. Many teaching tools label that g/g value as approximating grams of protein per day.',
  },
  {
    question: 'Is g/day the same as a 24-hour urine?',
    answer:
      'No. The calculator’s g/day label mirrors common teaching equivalence for the g/g ratio. It is not a timed 24-hour collection. Confirm with your lab and clinician.',
  },
  {
    question: 'How is this different from ACR?',
    answer:
      'ACR uses albumin only. UPCR uses total urine protein. They are related but not interchangeable.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL and a brief text summary without storing results on our servers.',
  },
];
