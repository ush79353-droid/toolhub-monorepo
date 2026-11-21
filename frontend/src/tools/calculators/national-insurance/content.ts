import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is National Insurance?' },
  { id: 'how-calculated', label: 'How This Calculator Works' },
  { id: 'class-1', label: 'Employee Class 1' },
  { id: 'class-4', label: 'Self-Employed Class 4' },
  { id: 'tax-years', label: 'Supported Tax Years' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'ni-faq', label: 'Frequently Asked Questions' },
];

export const NI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is National Insurance calculated for employees?',
    answer:
      'For standard category A employees, Class 1 is charged on employment earnings above the Primary Threshold (£12,570 a year in 2024/25–2026/27) at 8% up to the Upper Earnings Limit (£50,270), then 2% above that limit. This tool uses annual figures.',
  },
  {
    question: 'How is self-employed National Insurance calculated?',
    answer:
      'Class 4 is charged on annual profits above the Lower Profits Limit (£12,570) at 6% up to the Upper Profits Limit (£50,270), then 2% above. From 2024/25, Class 2 is generally not payable when profits are at or above the small profits threshold (treated as paid).',
  },
  {
    question: 'Why are employment and self-employment not added before banding?',
    answer:
      'Class 1 and Class 4 each have their own earnings or profits base. Combining them first would apply the wrong thresholds. This calculator computes each class separately and then adds the results.',
  },
  {
    question: 'Why are 2021/22 and 2022/23 not listed?',
    answer:
      'Those screenshot years are obsolete for a current estimate. The tool offers HMRC-published 2024/25, 2025/26, and 2026/27 rates instead.',
  },
  {
    question: 'Does this include employer National Insurance?',
    answer:
      'No. Only employee Class 1 (category A) and self-employed Class 4 are estimated. Employer secondary contributions are out of scope.',
  },
  {
    question: 'Is this official HMRC advice?',
    answer:
      'No. It is an educational estimate using published HMRC rates and annual thresholds. Directors, reduced-rate categories, deferment, and payroll-period rounding can differ.',
  },
];
