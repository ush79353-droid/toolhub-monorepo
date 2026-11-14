import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANNUALIZED_RATE_OF_RETURN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-annualized-rate-of-return', label: 'What Is Annualized Rate of Return?' },
  { id: 'annualized-rate-of-return-formula', label: 'Annualized Rate of Return Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'annualized-rate-of-return-faq', label: 'Frequently Asked Questions' },
];

export const ANNUALIZED_RATE_OF_RETURN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is annualized rate of return?',
    answer:
      'Annualized rate of return converts a return measured over a shorter (or annual) period into an equivalent yearly compounded rate.',
  },
  {
    question: 'How do you calculate annualized rate of return?',
    answer:
      'Annualized Return (%) = ((1 + period rate ÷ 100)^N − 1) × 100. N is 1 (annual), 4 (quarterly), 12 (monthly), 52 (weekly), or 365 (daily).',
  },
  {
    question: 'Can the period rate be negative?',
    answer:
      'Yes. Zero and negative rates down to −100% are allowed. Rates below −100% are rejected because they make compounding undefined for this formula.',
  },
  {
    question: 'Why is monthly 2% about 26.82% annualized?',
    answer:
      'Because of compounding: (1.02^12 − 1) × 100 ≈ 26.82%, which is higher than 2% × 12 = 24%.',
  },
];
