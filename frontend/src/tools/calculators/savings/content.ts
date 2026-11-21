import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SAVINGS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-savings-calculator', label: 'What This Calculator Does' },
  { id: 'savings-formulas', label: 'Formulas' },
  { id: 'savings-example', label: 'Example' },
  { id: 'savings-faq', label: 'Frequently Asked Questions' },
];

export const SAVINGS_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the final savings balance calculated?',
    answer:
      'The balance compounds at your selected frequency. Recurring deposits are applied at the beginning or end of each deposit period, then interest is credited on the compounding schedule. Final balance equals initial savings plus additional deposits plus interest earned.',
  },
  {
    question: 'What is the difference between interest rate and APY?',
    answer:
      'The annual nominal interest rate is divided by the compounding frequency. APY is the effective yearly yield: APY = (1 + r/m)^m − 1. You can enter either; the other is derived for the selected compounding frequency.',
  },
  {
    question: 'Does changing currency convert amounts?',
    answer:
      'Yes. Initial savings, additional deposits, and the result currency use stored exchange rates. Rates, APY, time length, and frequencies are never converted.',
  },
  {
    question: 'What does inflation adjustment do?',
    answer:
      'When enabled, an annual deposit growth rate scales recurring deposits over time, and the reported real final balance divides the nominal ending balance by (1 + inflation)^years to estimate purchasing power.',
  },
];
