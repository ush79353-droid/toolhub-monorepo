import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  LONGEVITY_SOURCE,
  US_AVG_RETIRED_WORKER_BENEFIT_MONTHLY,
  US_PENSION_SOURCE,
} from './longevity-defaults';

export const RETIREMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Retirement Calculator' },
  { id: 'definition', label: 'What It Estimates' },
  { id: 'formula', label: 'Formulas and Timing' },
  { id: 'defaults', label: 'Life Expectancy and Pension Defaults' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'example', label: 'Worked Example' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'retirement-faq', label: 'Frequently Asked Questions' },
];

export const RETIREMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'Are results inflation-adjusted?',
    answer:
      'No. All money figures are nominal. Enter savings, government pension, and cost of living on the same price basis (today’s dollars or retirement-year dollars).',
  },
  {
    question: 'How are savings projected to retirement?',
    answer:
      'Existing savings grow as a lump sum with annual compounding. Ongoing contributions are converted to an annual amount and treated as an end-of-year ordinary annuity at the same return.',
  },
  {
    question: 'How is income from savings calculated?',
    answer:
      'The calculator solves for a constant annual withdrawal that amortizes the nest egg from retirement through life expectancy while the remaining balance continues to earn the assumed return — not a simple division of the nest egg by years retired.',
  },
  {
    question: 'What do sex and country change?',
    answer: `They only suggest defaults. Life expectancy uses ${LONGEVITY_SOURCE} You can override the age freely. For the United States, government pension defaults to about $${US_AVG_RETIRED_WORKER_BENEFIT_MONTHLY.toLocaleString('en-US')}/mo (${US_PENSION_SOURCE}). Other countries start at 0.`,
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. Currency is denomination only (formatting and symbol). This tool does not perform foreign-exchange conversion.',
  },
  {
    question: 'What if I am already retired?',
    answer:
      'Years to retirement become zero. The nest egg is the amount already saved (no further contribution growth years), and withdrawals amortize from your current age through life expectancy.',
  },
];
