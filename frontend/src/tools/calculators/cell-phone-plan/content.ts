import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CELL_PHONE_PLAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'costs-outright', label: 'Costs of buying a phone outright' },
  { id: 'costs-carrier', label: 'Costs of a phone-buying carrier plan' },
  { id: 'comparison-example', label: 'Cell phone plan comparison: an example' },
  { id: 'which-cheaper', label: 'Which is cheaper?' },
  { id: 'interest-rates', label: 'How interest rates affect your phone plan' },
  { id: 'how-to-choose', label: 'How to choose the best cell phone plan' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'cell-phone-plan-faq', label: 'Frequently asked questions' },
];

export const CELL_PHONE_PLAN_FAQS: readonly FAQItem[] = [
  {
    question: 'Is it cheaper to buy a phone outright or through a carrier?',
    answer:
      'It depends on the phone price, both monthly bills, contract length, and the savings interest you could earn on the upfront phone price. This calculator compares those cash flows under a shared set of assumptions — it does not guarantee which option is best for every shopper.',
  },
  {
    question: 'How do I calculate the total cost of a phone plan?',
    answer:
      'For an outright purchase, add the phone price to the SIM-only monthly bill times the contract months. For a carrier phone plan, multiply the carrier monthly bill by the contract months, then subtract any interest earned from investing the phone price under the savings strategy modeled here.',
  },
  {
    question: 'What is a SIM-only phone plan?',
    answer:
      'A SIM-only (or bring-your-own-device) plan provides mobile service without financing a handset. You already own the phone and typically pay a lower monthly service charge than a bundled phone-buying plan.',
  },
  {
    question: 'How does interest affect the cost of a phone plan?',
    answer:
      'If you finance the phone through a carrier, you can keep the retail phone price in savings and withdraw only the extra monthly cost of the carrier plan. Monthly compounding on the remaining balance creates interest that reduces the carrier plan’s effective total cost in this model.',
  },
  {
    question: 'Should I buy a phone outright?',
    answer:
      'Buying outright can mean clearer ownership, simpler switching later, and no device installment. It also requires cash up front. Compare total contract cost, flexibility, and whether you would actually invest the money you would otherwise spend on the phone.',
  },
  {
    question: 'Is a carrier phone-buying plan worth it?',
    answer:
      'It can be when the effective cost (payments minus realistic savings interest) is lower and the contract terms fit your needs. Watch for higher monthly bills, early termination fees, and whether the phone’s retail price is inflated in the deal.',
  },
  {
    question: 'How does contract duration affect phone plan costs?',
    answer:
      'Longer contracts multiply monthly payments and change how long invested cash can earn interest while supporting withdrawals. Always compare options over the same duration.',
  },
  {
    question: 'What is the difference between a phone installment and a monthly carrier bill?',
    answer:
      'A phone installment repays the device; the service portion pays for voice, data, and related features. Many carrier “phone plans” quote one combined monthly amount — enter that combined figure as the carrier monthly bill here.',
  },
  {
    question: 'Can I change my phone carrier during a contract?',
    answer:
      'It depends on carrier terms, device locks, and early termination fees. Leaving early can erase any modeled savings. Review your agreement before counting on a mid-contract switch.',
  },
  {
    question: 'Does this calculator include phone depreciation?',
    answer:
      'No. It compares payments and modeled savings interest only. Resale value and depreciation are separate considerations.',
  },
  {
    question: 'What interest rate should I use?',
    answer:
      'Enter the expected annual rate of the savings account or investment where you would park the phone price — not the carrier’s financing APR.',
  },
  {
    question: 'Is the investment interest guaranteed?',
    answer:
      'No. Actual returns depend on the institution, account type, rate changes, and whether you follow the withdrawal pattern. Treat the interest figure as an estimate under the stated assumptions.',
  },
];
