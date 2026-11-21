import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SAVINGS_GOAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-savings-goal', label: 'What This Calculator Does' },
  { id: 'savings-goal-formulas', label: 'Formulas' },
  { id: 'savings-goal-example', label: 'Example' },
  { id: 'savings-goal-faq', label: 'Frequently Asked Questions' },
];

export const SAVINGS_GOAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the required periodic contribution calculated?',
    answer:
      'The calculator grows your starting savings at the selected compounding schedule, inflates today’s goal into a nominal future target when inflation is non-zero, then solves for the initial recurring deposit whose future value fills the remaining gap. Contribution timing (beginning or end of each period) and optional deposit growth are included.',
  },
  {
    question: 'How does inflation affect the goal?',
    answer:
      'The entered goal is treated as today’s purchasing power. The nominal target becomes Goal × (1 + inflation)^years. The interest rate stays nominal. With 0% inflation the nominal target equals the entered goal.',
  },
  {
    question: 'Can I set both annual and periodic contribution growth?',
    answer:
      'No. Use one growth rate only so deposits are not double-counted. Annual growth is converted to an equivalent per-period rate for your contribution frequency. Periodic growth applies directly each contribution period.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Goal and starting savings each have their own currency and are normalized into the goal currency before the formulas run using stored exchange rates. Ages, years, interest, inflation, and growth percents are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
