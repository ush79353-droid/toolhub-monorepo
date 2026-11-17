import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEALS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-context', label: 'Historical Context' },
  { id: 'verified-payment-rules', label: 'Verified Payment Rules' },
  { id: 'phaseout-and-dependents', label: 'Phase-Out & Dependents' },
  { id: 'heroes-act-comparison', label: 'HEROES Act Comparison' },
  { id: 'important-limitations', label: 'Important Limitations' },
  { id: 'heals-faq', label: 'Frequently Asked Questions' },
];

export const HEALS_FAQS: readonly FAQItem[] = [
  {
    question: 'Was the HEALS Act second stimulus check ever paid?',
    answer:
      'No. The July 2020 Senate Republican HEALS Act package proposed another round of recovery rebates, but that bill was not enacted as written. Later COVID relief used different legislation and formulas. This tool is a historical estimator only.',
  },
  {
    question: 'How much would the proposed HEALS Act check have been?',
    answer:
      'Contemporaneous summaries of the proposal used a $1,200 base for single and head-of-household filers and $2,400 for married joint filers, plus $500 for each dependent of any age, with a 5% phase-out above $75,000 / $112,500 / $150,000 AGI respectively.',
  },
  {
    question: 'How did HEALS differ from the first CARES Act stimulus?',
    answer:
      'Base amounts and income phase-out thresholds mirrored the first CARES Act economic impact payments. A key difference was expanding the $500 dependent amount beyond qualifying children under 17 to dependents of any age, with no dependent-count cap in the HEALS proposal.',
  },
  {
    question: 'Can I claim a HEALS Act payment today?',
    answer:
      'No. There is no active HEALS Act rebate claim. Any figure shown here is a historical, hypothetical reconstruction of a 2020 proposal and must not be treated as IRS guidance or a payable benefit.',
  },
  {
    question: 'Where can I compare the Democratic HEROES Act proposal?',
    answer:
      'The House-passed HEROES Act used larger per-dependent amounts (commonly summarized as $1,200 per dependent, capped at three) while keeping similar income phase-outs. See the linked HEROES Act calculator reference on this page for a side-by-side historical view.',
  },
];
