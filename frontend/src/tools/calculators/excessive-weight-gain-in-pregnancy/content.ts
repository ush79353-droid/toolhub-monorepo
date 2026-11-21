import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EWG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Excessive Weight Gain in Pregnancy?' },
  { id: 'guidelines', label: 'Recommended Gain Ranges' },
  { id: 'how', label: 'How to Use' },
  { id: 'discuss', label: 'Discussing Deviations' },
  { id: 'sources', label: 'Sources' },
  { id: 'ewg-faq', label: 'Frequently Asked Questions' },
];

export const EWG_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this tool classify “excessive” gain from my current weight?',
    answer:
      'No. It shows the same IOM / CDC recommended min/max weight and gain bands as the Pregnancy Weight Gain Calculator so you can compare your trajectory with a clinician. It does not take current weight or label excess.',
  },
  {
    question: 'Are the numbers the same as Pregnancy Weight Gain?',
    answer:
      'Yes. This page reuses that shared gestational engine so singleton and twin bands stay numerically identical for the same inputs.',
  },
  {
    question: 'When are twin results unavailable?',
    answer:
      'IOM did not publish an underweight twin total band. Provisional twin totals are shown only from week 37 onward; mid-pregnancy twin weeks are not extrapolated.',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. Measurements stay in your browser. Share uses only the public page URL.',
  },
];
