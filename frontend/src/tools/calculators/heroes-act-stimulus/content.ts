import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEROES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-context', label: 'Historical Context' },
  { id: 'verified-payment-rules', label: 'Verified Payment Rules' },
  { id: 'phaseout-and-dependents', label: 'Phase-Out & Dependents' },
  { id: 'additional-provisions', label: 'Additional Provisions' },
  { id: 'important-limitations', label: 'Important Limitations' },
  { id: 'heroes-faq', label: 'Frequently Asked Questions' },
];

export const HEROES_FAQS: readonly FAQItem[] = [
  {
    question: 'Was the HEROES Act second stimulus check ever paid?',
    answer:
      'No. The House passed H.R. 6800 (the HEROES Act) on May 15, 2020, but the Senate did not enact that bill as written. Later COVID relief used different statutes and payment formulas. This tool is a historical estimator only.',
  },
  {
    question: 'How much would the proposed HEROES Act check have been?',
    answer:
      'Congressional Research Service summaries of H.R. 6800 describe $1,200 per eligible individual ($2,400 for most married joint filers) plus $1,200 for each of up to three dependents, with a 5% phase-out of AGI above $75,000 / $112,500 / $150,000. A married couple with three dependents could receive up to $6,000 before phase-out.',
  },
  {
    question: 'How did HEROES differ from the first CARES Act stimulus?',
    answer:
      'Base amounts and income phase-out thresholds matched the first CARES Act economic impact payments. The key differences were raising the dependent add-on to $1,200, covering dependents of any age under IRC §152 (not only children under 17), and capping dependents at three for the household payment.',
  },
  {
    question: 'How did HEROES differ from the HEALS Act proposal?',
    answer:
      'Both proposals used the same $1,200 / $2,400 bases and the same AGI phase-out bands. HEALS (Senate GOP, July 2020) used $500 per dependent of any age with no dependent-count cap, while HEROES used $1,200 per dependent capped at three.',
  },
  {
    question: 'Can I claim a HEROES Act payment today?',
    answer:
      'No. There is no active HEROES Act rebate claim. Any figure shown here is a historical, hypothetical reconstruction of a 2020 House-passed proposal and must not be treated as IRS guidance or a payable benefit.',
  },
];

/** House-passed HEROES Act bill text. */
export const HEROES_ACT_BILL_URL =
  'https://www.congress.gov/bill/116th-congress/house-bill/6800';

/** CRS comparison of 2020 second-round direct-payment proposals. */
export const HEROES_CRS_COMPARISON_URL =
  'https://www.everycrsreport.com/reports/IN11513.html';

/**
 * Contemporaneous overview of HEROES Act unemployment, hazard-pay, and student-loan
 * provisions referenced by the screenshot’s “additional payments” note.
 */
export const HEROES_ADDITIONAL_PAYMENTS_URL =
  'https://www.cnbc.com/make-it/2020/05/16/what-you-need-to-know-about-the-heroes-act.html';

/** Historical HEALS vs HEROES unemployment-benefit comparison reference. */
export const UNEMPLOYMENT_HEALS_VS_HEROES_URL =
  'https://www.omnicalculator.com/finance/unemployment-benefit-heals';
