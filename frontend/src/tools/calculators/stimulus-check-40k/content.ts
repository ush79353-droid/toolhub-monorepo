import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STIMULUS_40K_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-context', label: 'Historical Context' },
  { id: 'how-this-estimate-works', label: 'How This Estimate Works' },
  { id: 'payment-assumptions', label: 'Payment Assumptions' },
  { id: 'what-this-is-not', label: 'What This Is Not' },
  { id: 'stimulus-40k-faq', label: 'Frequently Asked Questions' },
];

export const STIMULUS_40K_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I claim a stimulus check under this $40,000 rule today?',
    answer:
      'No. This calculator models a 2020 proposal discussion only. There is no active federal program paying checks under a McConnell $40,000 income cap, and this page does not help you file or claim any payment.',
  },
  {
    question: 'Where do the $1,200 / $2,400 / $1,200-per-dependent amounts come from?',
    answer:
      'Those dollar amounts come from the House-passed HEROES Act (H.R. 6800) second-round payment structure, as summarized in Congressional Research Service comparisons of 2020 proposals: $1,200 per eligible individual ($2,400 for most joint filers) plus $1,200 for each of up to three dependents.',
  },
  {
    question: 'Why is the income cut-off $40,000 (or $80,000 if married)?',
    answer:
      'On July 6, 2020, Senate Majority Leader Mitch McConnell publicly suggested a second round of checks would likely focus on people making about $40,000 a year or less. Public “40k Cap” calculators doubled that figure to $80,000 for married joint filers. That cut-off was never enacted as written legislation with a complete phase-out schedule.',
  },
  {
    question: 'Is there a gradual phase-out above $40,000?',
    answer:
      'No verified phase-out schedule exists for a hard $40,000 regime. The original HEROES Act used a 5% phase-out above $75,000 / $112,500 / $150,000. Because McConnell did not specify a replacement phase-out, this historical model uses a hard cut-off: at or below the cap you see the full HEROES payment; above the cap the estimate is $0.',
  },
  {
    question: 'Does head of household use a different income cap?',
    answer:
      'No separate head-of-household threshold was stated for the $40,000 idea. This calculator therefore applies the same $40,000 AGI cap to single and head-of-household filers, and $80,000 to married filers.',
  },
];

/** Verified legislative destination for the original HEROES Act proposal text. */
export const HEROES_ACT_BILL_URL =
  'https://www.congress.gov/bill/116th-congress/house-bill/6800';
