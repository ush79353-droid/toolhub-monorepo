import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEALTHY_WEIGHT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Healthy Weight Calculator' },
  { id: 'what-is', label: 'What is a healthy weight?' },
  { id: 'formula', label: 'BMI healthy band' },
  { id: 'limits', label: 'Limits' },
  { id: 'hw-faq', label: 'Frequently Asked Questions' },
];

export const HEALTHY_WEIGHT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the healthy weight range calculated?',
    answer:
      'For adults, this tool uses the educational BMI band 18.5 ≤ BMI < 25 kg/m². Weight (kg) = BMI × height in meters squared. The upper bound is exclusive (below BMI 25).',
  },
  {
    question: 'Why is the upper limit “below 25” instead of 24.9?',
    answer:
      'The reference screenshot and acceptance criteria specify adult BMI from 18.5 to below 25. At 1.80 m that makes the unrounded upper weight boundary 81.00 kg exclusive.',
  },
  {
    question: 'Can I use this for children?',
    answer:
      'No. Adult BMI cutoffs do not apply to pediatric growth charts. Use age- and sex-specific BMI percentiles for children and teens.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only — not your height.',
  },
];
