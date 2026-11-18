import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-margin-interest', label: 'What Is Margin Interest?' },
  { id: 'margin-interest-formula', label: 'Margin Interest Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'margin-interest-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'What day count does this calculator use?',
    answer:
      'Simple margin interest here uses a 360-day year: interest accrues as Amount × (Rate / 100) × (Days / 360). Some brokers use 365 days; check your margin agreement.',
  },
  {
    question: 'Is margin interest the same as compound interest?',
    answer:
      'No. This tool computes simple interest for the holding period. It does not compound unpaid interest into the debit balance.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'Borrowed amount and margin interest each have their own currency. Changing the borrowed currency converts that amount using the stored exchange-rate snapshot. Changing the result currency only re-expresses the calculated interest; rate and days are never converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
