import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EFFECTIVE_INTEREST_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-eir', label: 'What Is Effective Interest Rate?' },
  { id: 'eir-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'eir-faq', label: 'Frequently Asked Questions' },
];

export const EFFECTIVE_INTEREST_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'It converts a nominal annual interest rate and compounding frequency into the periodic rate and the annual effective interest rate (EIR).',
  },
  {
    question: 'What formulas are used?',
    answer:
      'Periodic Rate (%) = Annual Interest Rate (%) / n. EIR (%) = [(1 + Annual Interest Rate / (100 × n))^n − 1] × 100, where n is compounds per year.',
  },
  {
    question: 'What compounding frequencies are supported?',
    answer: 'Annually (1), Semiannually (2), Quarterly (4), Monthly (12), and Daily (365).',
  },
  {
    question: 'Can the interest rate be zero or negative?',
    answer:
      'Yes, when the math stays finite. Extreme negative rates that make the compounding base zero or negative are rejected.',
  },
];
