import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MIPI_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'MIPI Calculator' },
  { id: 'formula', label: 'Formula' },
  { id: 'faq', label: 'FAQ' },
];

export const MIPI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is MIPI?',
    answer:
      'The Mantle Cell Lymphoma International Prognostic Index is a continuous score from age, ECOG, LDH/ULN, and WBC (Hoster et al., Blood 2008).',
  },
  {
    question: 'When is Ki-67 used?',
    answer:
      'Optional Ki-67 (%) yields MIPI-b by adding 0.02142 × Ki-67. MIPI-b uses high-risk cutoff ≥6.5 instead of ≥6.2.',
  },
  {
    question: 'What WBC unit does the formula use?',
    answer:
      'Published MIPI uses WBC per 10⁶/L (per µL). This form’s ×1000/µL field is multiplied by 1000 before log10.',
  },
];
