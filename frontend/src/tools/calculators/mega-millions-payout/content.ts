import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MEGA_MILLIONS_PAYOUT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'mm-purpose', label: 'Mega Millions calculator purpose' },
  { id: 'mm-what-is-payout', label: 'What is the Mega Millions payout?' },
  { id: 'mm-cash-value', label: 'Mega Millions cash value calculator' },
  { id: 'mm-how-to-use', label: 'How to use the Mega Millions payout calculator' },
  { id: 'mm-disclaimer', label: 'Mega Millions winnings calculator disclaimer' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'mm-faq', label: 'Frequently asked questions' },
];

export const MEGA_MILLIONS_PAYOUT_FAQS: readonly FAQItem[] = [
  {
    question: 'How much is the Mega Millions payout?',
    answer:
      'The advertised jackpot can be taken as a lump-sum cash option or as an annuity. The cash payment is lower than the advertised jackpot. The annuity pays the advertised jackpot through graduated installments. The official cash value depends on how the jackpot is funded and on lottery calculations.',
  },
  {
    question:
      'What is the difference between the cash lump-sum and annuity payout options?',
    answer:
      'Lump sum is a one-time payment based on the official cash value. Annuity spreads graduated payments over the scheduled period. Lump sum gives immediate access to cash; annuity spreads payments and tax timing across many years. Neither option is universally better.',
  },
  {
    question: 'Why is the annuity payout for Mega Millions delayed for 30 years?',
    answer:
      'The annuity option distributes the jackpot through annual payments rather than paying the full advertised amount immediately. The standard jackpot annuity generally has 30 payments over 29 years.',
  },
  {
    question: 'Is the annuity payout the same for Mega Millions jackpot?',
    answer:
      'The advertised jackpot is the total nominal annuity value. Under the standard graduated structure, payments increase each year (commonly by 5%), so early payments are smaller than later ones even though the sum equals the advertised jackpot.',
  },
  {
    question: 'Will my Mega Millions winnings impact my taxes?',
    answer:
      'Lottery winnings are generally taxable for federal purposes and may also be taxed by your state. Actual liability depends on tax year, filing status, other income, deductions, and jurisdiction. This calculator provides estimates only.',
  },
  {
    question:
      'What happens if I win the Mega Millions jackpot in a state different from where I live?',
    answer:
      'You may have tax obligations in both the ticket state and your residence state. Selecting one state in this calculator does not resolve every possible multi-state tax obligation. Review the rules for both jurisdictions or consult a tax professional.',
  },
  {
    question: 'Is the cash option better than the annuity option?',
    answer:
      'It depends on liquidity needs, investment plans, inflation expectations, tax timing, spending discipline, and tolerance for long-term payment schedules. This tool compares estimated net amounts; it does not recommend one option.',
  },
  {
    question:
      'What is the disadvantage of the annuity payout option for Mega Millions jackpot?',
    answer:
      'Annuity limits immediate access to the full jackpot, locks you into a long payment schedule, can be affected by personal circumstances or future tax-law changes, and reduces immediate investment flexibility compared with a cash option.',
  },
  {
    question: 'How to calculate Mega Millions payout?',
    answer:
      'Enter the advertised jackpot, apply the cash-option percentage (or official cash value), estimate federal and state taxes on the lump sum, build the graduated 30-payment annuity schedule, estimate tax on each payment, then compare net lump-sum and net annuity totals.',
  },
];
