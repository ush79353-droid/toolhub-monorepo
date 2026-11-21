import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IS_BMI_PREGNANCY_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BMI and Pregnancy Weight Gain' },
  { id: 'what-bmi-does', label: 'What Pre-Pregnancy BMI Does' },
  { id: 'what-bmi-does-not', label: 'What BMI Does Not Measure' },
  { id: 'how-to-use', label: 'How to Use This Widget' },
  { id: 'sources', label: 'Sources' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'is-bmi-pregnancy-faq', label: 'Frequently Asked Questions' },
];

export const IS_BMI_PREGNANCY_FAQS: readonly FAQItem[] = [
  {
    question: 'Is BMI a direct measure of pregnancy weight gain?',
    answer:
      'No. Pre-pregnancy BMI classifies starting weight status so clinicians can pick an IOM gestational weight-gain band. Gain itself is change in weight over pregnancy—not the BMI number alone.',
  },
  {
    question: 'Why show min/max weight and gain?',
    answer:
      'Those fields apply the same IOM / CDC guideline bands used by the Pregnancy Weight Gain Calculator, keyed off your pre-pregnancy BMI, week, and twins selection.',
  },
  {
    question: 'Are the numbers the same as Pregnancy Weight Gain?',
    answer:
      'Yes. This article tool reuses that canonical engine so results stay numerically identical for the same inputs.',
  },
  {
    question: 'Is personal data stored?',
    answer:
      'No. Inputs stay in your browser for this session. Share uses only the public page URL.',
  },
];
