import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const KIDNEY_STONE_PCNL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Kidney STONE Calculator for PCNL' },
  { id: 'scoring', label: 'S.T.O.N.E. scoring system (nephrolithometry)' },
  { id: 'using', label: 'Using the kidney STONE calculator' },
  { id: 'pcnl', label: 'Percutaneous nephrolithotomy' },
  { id: 'stone-faq', label: 'Frequently Asked Questions' },
];

export const KIDNEY_STONE_PCNL_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this the emergency renal-colic STONE score?',
    answer:
      'No. This is Okhunov S.T.O.N.E. nephrolithometry for planning percutaneous nephrolithotomy (PCNL). It is unrelated to the emergency-department renal-colic STONE score.',
  },
  {
    question: 'How is stone size measured?',
    answer:
      'On axial CT, multiply stone length by width in millimeters to get area in mm², then pick the matching band (0–399, 400–799, 800–1599, or ≥1600).',
  },
  {
    question: 'What does the percentage mean?',
    answer:
      'It is an approximate educational single-procedure stone-free probability mapped from the total score (for example score 5 ≈ 94%). It is not a guarantee for an individual patient.',
  },
  {
    question: 'Are CT values stored?',
    answer:
      'No. Selections stay in your browser. Share uses the page URL and a score summary only.',
  },
];
