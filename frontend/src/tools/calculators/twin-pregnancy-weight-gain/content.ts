import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TWIN_PWG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Twin Pregnancy Weight Gain?' },
  { id: 'iom', label: 'IOM Twin Guidelines' },
  { id: 'how', label: 'How to Use' },
  { id: 'limits', label: 'Limits' },
  { id: 'twin-pwg-faq', label: 'Frequently Asked Questions' },
];

export const TWIN_PWG_FAQS: readonly FAQItem[] = [
  {
    question: 'Why does this tool start with Twins = Yes?',
    answer:
      'This catalog page is the twin-focused variant. You can still switch to No to see singleton IOM bands from the same shared engine.',
  },
  {
    question: 'When are twin results unavailable?',
    answer:
      'IOM did not publish an underweight twin total band. Provisional twin totals are shown only from week 37 onward; mid-pregnancy twin weeks are not extrapolated.',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. Measurements stay in your browser. Share uses the public page URL without height, weight, or BMI.',
  },
];
