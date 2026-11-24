import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DLBCL_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'DLBCL R-IPI' },
  { id: 'outcomes', label: '4-year outcomes' },
];

export const DLBCL_FAQS: readonly FAQItem[] = [
  {
    question: 'What cohort are the survival rates from?',
    answer: 'Revised IPI (R-IPI) in rituximab-era DLBCL (Sehn et al., Blood 2007).',
  },
];