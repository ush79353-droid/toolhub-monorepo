import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DIET_RISK_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Diet Risk Score' },
  { id: 'scoring', label: 'Scoring' },
];

export const DIET_RISK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the score range?',
    answer: '0–27: low risk 0–8, moderate 9–18, high 19–27 (BMJ DRS validation study).',
  },
];