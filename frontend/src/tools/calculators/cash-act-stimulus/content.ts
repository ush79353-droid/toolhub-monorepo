import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CASH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-context', label: 'Historical Context' },
  { id: 'verified-payment-rules', label: 'Verified Payment Rules' },
  { id: 'additional-vs-enacted', label: 'Additional vs Enacted $600' },
  { id: 'phaseout-and-dependents', label: 'Phase-Out & Dependents' },
  { id: 'important-limitations', label: 'Important Limitations' },
  { id: 'cash-faq', label: 'Frequently Asked Questions' },
];

export const CASH_FAQS: readonly FAQItem[] = [
  {
    question: 'Was the CASH Act second stimulus check ever paid?',
    answer:
      'No. The House passed H.R.9051 (the CASH Act of 2020) on December 28, 2020 to raise the second-round Economic Impact Payment from $600 to $2,000, but the Senate did not enact that amendment. Households received the enacted $600 round (and later a separate third payment under the American Rescue Plan). This tool is a historical estimator only.',
  },
  {
    question: 'How much would the proposed CASH Act check have been?',
    answer:
      'The bill text replaced $600 with $2,000 and $1,200 with $4,000 in IRC §6428A, and expanded the dependent amount to $2,000 for dependents under IRC §152 (any age). Payments phased out at 5% of AGI above $75,000 (single), $112,500 (head of household), or $150,000 (married filing jointly).',
  },
  {
    question: 'What does “How much more will you get?” mean?',
    answer:
      'It subtracts the enacted December 2020 $600 EIP estimate ($600 / $1,200 base plus $600 per qualifying child under 17, with the same AGI phase-out) from the proposed CASH Act total. The difference is floored at $0 and labeled historical / hypothetical.',
  },
  {
    question: 'Can I claim a CASH Act payment today?',
    answer:
      'No. There is no active CASH Act rebate claim. Any figure shown here is a historical, hypothetical reconstruction of a 2020 House-passed proposal and must not be treated as IRS guidance or a payable benefit.',
  },
  {
    question: 'Why can dependents under 17 not exceed total dependents?',
    answer:
      'Qualifying children under 17 are a subset of the household’s dependents. The CASH Act counted all dependents; the enacted $600 EIP counted only under-17 qualifying children. Entering more under-17 dependents than total dependents is invalid.',
  },
];
