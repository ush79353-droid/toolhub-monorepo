import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BALLOON_PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-balloon-payment', label: 'What Is a Balloon Payment?' },
  { id: 'balloon-payment-formulas', label: 'Balloon Payment Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'balloon-payment-faq', label: 'Frequently Asked Questions' },
];

export const BALLOON_PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the balloon payment calculated?',
    answer:
      'The calculator first finds the fully amortizing monthly payment over the full amortization length N, then computes the remaining principal after K months as the balloon. With monthly rate r: M = P×r/(1−(1+r)^(−N)); Balloon = P(1+r)^K − M×((1+r)^K − 1)/r. When r = 0, M = P/N and Balloon = P − M×K.',
  },
  {
    question: 'What does compounding method change?',
    answer:
      'The selected compounding frequency derives the effective monthly rate used for payments and the balloon balance: r = (1 + i/m)^(m/12) − 1. Payments remain monthly; only the effective rate changes.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'Yes. Changing the loan currency converts the loan amount using MongoDB-backed exchange rates, then recalculates. Results stay in that currency. Interest rate, amortization length, and balloon timing are never FX-converted. Missing rates block conversion; stale rates still convert with a warning.',
  },
  {
    question: 'What happens when the balloon date equals the full term?',
    answer:
      'When K = N the loan is fully amortized by the regular payments, so the balloon is approximately zero (treated as zero within a tiny numerical tolerance).',
  },
];
