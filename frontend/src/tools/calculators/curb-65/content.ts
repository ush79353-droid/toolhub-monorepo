import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CURB65_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Diseases of the lungs' },
  { id: 'cap', label: 'What is community-acquired pneumonia?' },
  { id: 'criteria', label: 'What are the CURB-65 criteria?' },
  { id: 'calculator', label: 'CURB-65 calculator' },
  { id: 'admission', label: 'Pneumonia admission criteria' },
  { id: 'curb65-faq', label: 'Frequently Asked Questions' },
];

export const CURB65_FAQS: readonly FAQItem[] = [
  {
    question: 'What does CURB-65 stand for?',
    answer:
      'Confusion, Urea (>7 mmol/L), Respiratory rate (≥30/min), Blood pressure (SBP <90 or DBP ≤60), and age ≥65. Each criterion scores one point (Lim et al., Thorax 2003).',
  },
  {
    question: 'How is BUN converted?',
    answer:
      'Urea in mmol/L ≈ BUN in mg/dL ÷ 2.8. The urea point is awarded when urea > 7 mmol/L (BUN > 19.6 mg/dL).',
  },
  {
    question: 'Do both low SBP and low DBP add two points?',
    answer:
      'No. Blood pressure contributes at most one point if SBP < 90 mmHg, DBP ≤ 60 mmHg, or both.',
  },
  {
    question: 'Are values stored or shared?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only.',
  },
];
