import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UAG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'How does the urine anion gap calculator work?' },
  { id: 'normal', label: 'What is a normal urine anion gap?' },
  { id: 'uag-faq', label: 'FAQs' },
];

export const UAG_FAQS: readonly FAQItem[] = [
  {
    question: 'How is urine anion gap calculated?',
    answer:
      'UAG (mEq/L) = (urine Na⁺ + urine K⁺) − urine Cl⁻. For these monovalent ions, mEq/L equals mmol/L numerically. Negative values are valid.',
  },
  {
    question: 'Is this the same as the serum anion gap?',
    answer:
      'No. Serum AG usually uses Na, Cl, and HCO₃ (with optional K/albumin corrections). Urine AG uses only urinary Na, K, and Cl and is interpreted in a different acid–base context.',
  },
  {
    question: 'Are my lab values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
