import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INTEREST_PER_DAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-interest-per-day', label: 'What Is Interest Per Day?' },
  { id: 'interest-per-day-formula', label: 'Interest Per Day Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'interest-per-day-faq', label: 'Frequently Asked Questions' },
];

export const INTEREST_PER_DAY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is interest per day calculated?',
    answer:
      'Simple daily interest on a 365-day year: Interest Per Day = Loan Balance × (Annual Interest Rate / 100) / 365. The daily rate percent is Annual Interest Rate / 365.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan balance and interest per day each have independent currencies. Changing the loan currency converts that amount using MongoDB-backed rates. Changing the result currency only re-expresses daily interest. Annual and daily percentage rates are never FX-converted.',
  },
  {
    question: 'Is compounding included?',
    answer:
      'No. This calculator uses simple daily interest only. It does not compound within the day or invent alternate day-count modes beyond the 365-day year.',
  },
  {
    question: 'What rate units are supported?',
    answer:
      'The reference UI shows percent (%) for both annual and daily rates. No alternate rate units are confirmed for this tool.',
  },
];
