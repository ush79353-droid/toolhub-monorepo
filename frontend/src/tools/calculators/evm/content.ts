import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EVM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-evm', label: 'What is Earned Value Management?' },
  { id: 'evm-formulas', label: 'Formulas' },
  { id: 'evm-example', label: 'Worked example' },
  { id: 'evm-faq', label: 'Frequently asked questions' },
];

export interface EvmGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const EVM_GUIDE_SECTIONS: readonly EvmGuideSection[] = [
  {
    id: 'what-evm',
    title: 'What is Earned Value Management?',
    paragraphs: [
      'Earned Value Management (EVM) compares the work you planned to complete, the work you actually completed, and the money you spent. Planned Value, Earned Value, and Actual Cost are the three building blocks.',
      'Variances and performance indices tell you whether the task is over or under budget and ahead of or behind schedule. Negative cost or schedule variance is unfavorable.',
    ],
  },
  {
    id: 'evm-formulas',
    title: 'EVM formulas',
    paragraphs: [
      'Planned Value scales the budget by scheduled progress. Earned Value scales the same budget by actual progress. Actual Cost is the amount spent so far.',
      'Cost Variance and Schedule Variance subtract those bases. CPI and SPI divide Earned Value by Actual Cost or Planned Value. When a denominator is zero, this calculator leaves the index blank instead of showing Infinity or NaN.',
    ],
    formula:
      'PV = Budget × Scheduled Progress / 100\nEV = Budget × Actual Progress / 100\nAC = Costs\nCV = EV − AC\nSV = EV − PV\nCPI = EV / AC\nSPI = EV / PV',
  },
  {
    id: 'evm-example',
    title: 'Worked example',
    paragraphs: [
      'Scheduled progress 60%, actual progress 50%, budget 100,000, costs 60,000. PV = 60,000, EV = 50,000, AC = 60,000. CV = −10,000 and SV = −10,000 (both unfavorable). CPI = 0.83 and SPI = 0.83.',
    ],
  },
];

export const EVM_FAQS: readonly FAQItem[] = [
  {
    question: 'What do negative CV and SV mean?',
    answer:
      'Negative Cost Variance means you have spent more than the value earned (over budget). Negative Schedule Variance means earned value is behind planned value (behind schedule). Both are unfavorable.',
  },
  {
    question: 'When are CPI or SPI blank?',
    answer:
      'CPI is omitted when Actual Cost is zero. SPI is omitted when Planned Value is zero. That keeps the report free of Infinity and NaN.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the symbol and grouping. Enter every amount in the same denomination.',
  },
];
