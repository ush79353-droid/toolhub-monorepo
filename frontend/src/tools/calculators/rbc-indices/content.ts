import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RBC_INDICES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'RBC Indices Calculator' },
  { id: 'formulas', label: 'How to calculate RBC indices' },
  { id: 'mchc', label: 'What is MCHC?' },
  { id: 'limits', label: 'Limits' },
  { id: 'rbc-faq', label: 'Frequently Asked Questions' },
];

export const RBC_INDICES_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate MCH, MCHC, and MCV?',
    answer:
      'MCH (pg/cell) = 10 × hemoglobin (g/dL) ÷ RBC (10⁶/µL). MCHC (g/dL) = 100 × hemoglobin ÷ hematocrit (%). MCV (fL) = 10 × hematocrit ÷ RBC.',
  },
  {
    question: 'What is MCHC?',
    answer:
      'Mean corpuscular hemoglobin concentration estimates the average hemoglobin concentration inside red cells. It is hemoglobin divided by hematocrit (scaled to g/dL).',
  },
  {
    question: 'Does sex change the formulas?',
    answer:
      'No. The three index formulas are the same for females and males. Sex may matter for lab-specific reference intervals shown for context only.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your lab values.',
  },
];
