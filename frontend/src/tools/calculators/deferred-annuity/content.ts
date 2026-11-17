import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEFERRED_ANNUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-deferred-annuity', label: 'What Is a Deferred Annuity?' },
  { id: 'deferred-annuity-formulas', label: 'Accumulation and Payout Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'deferred-annuity-faq', label: 'Frequently Asked Questions' },
];

export const DEFERRED_ANNUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the balance at first withdrawal calculated?',
    answer:
      'The lump sum and ordinary end-of-month contributions grow at the accumulation rate for the deferral months: FV = PV(1+r)^n + PMT × ((1+r)^n − 1) / r, with r = annual rate / 12. If the rate is zero, FV = PV + PMT × n.',
  },
  {
    question: 'How is the monthly withdrawal calculated?',
    answer:
      'In “how much I can withdraw” mode, the ordinary annuity payment that depletes the balance over the payout months is PMT = PV × r / (1 − (1+r)^(−n)). Zero payout rate uses PV / n.',
  },
  {
    question: 'What does Total contribution include?',
    answer:
      'The results table’s total contribution is the sum of monthly deposits during deferral (PMT × months). The lump sum is separate. Total return = total withdrawals − lump sum − monthly deposits.',
  },
  {
    question: 'Does changing currency convert the amounts?',
    answer:
      'Yes. Lump sum, monthly contribution, and (in duration mode) fixed withdrawal each have their own currency and are normalized into the lump-sum currency before math. The results currency only re-expresses money outputs. Rates and durations are never converted.',
  },
];
