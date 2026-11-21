import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BALANCE_TRANSFER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bt', label: 'What Is a Balance Transfer?' },
  { id: 'bt-fee', label: 'What Is a Balance Transfer Fee?' },
  { id: 'how-it-works', label: 'How Does a Balance Transfer Work?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'promo-calc', label: 'Promotional Period Calculation' },
  { id: 'long-term-calc', label: 'Long-Term Calculation' },
  { id: 'fee-calc', label: 'How to Calculate Transfer Fees' },
  { id: 'monthly-interest', label: 'Monthly Credit Card Interest' },
  { id: 'savings-calc', label: 'How to Calculate Savings' },
  { id: 'break-even', label: 'Break-Even Point' },
  { id: 'worth-it', label: 'Is a Balance Transfer Worth It?' },
  { id: 'pros', label: 'Pros of Balance Transfers' },
  { id: 'cons', label: 'Cons of Balance Transfers' },
  { id: 'vs-personal-loan', label: 'Balance Transfer vs. Personal Loan' },
  { id: 'vs-consolidation', label: 'Balance Transfer vs. Consolidation' },
  { id: 'after-promo', label: 'When the Promotional APR Expires' },
  { id: 'pay-before-end', label: 'Pay Off Before Promotion Ends' },
  { id: 'payments-interest', label: 'How Payments Affect Interest' },
  { id: 'examples', label: 'Calculation Examples' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'bt-faq', label: 'Frequently Asked Questions' },
];

export const BALANCE_TRANSFER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a balance transfer?',
    answer:
      'Moving an existing credit card balance to another card, often to use a lower introductory APR for a limited time.',
  },
  {
    question: 'What is a balance transfer credit card?',
    answer:
      'A card that advertises promotional APRs (sometimes 0%) on transferred balances for a set number of months, usually with a transfer fee.',
  },
  {
    question: 'How does a balance transfer work?',
    answer:
      'The new issuer pays off (or accepts) the transferred amount, you owe the new card instead, and you repay under the new card’s promotional then regular rates, plus any transfer fee.',
  },
  {
    question: 'What is a balance transfer fee?',
    answer:
      'A charge for moving the balance, commonly a percentage of the transferred amount (for example 3%) or a fixed fee. It can be financed into the new balance or paid upfront.',
  },
  {
    question: 'How much does a 3% balance transfer fee cost?',
    answer:
      'Fee = transfer amount × 0.03. On $10,000, a 3% fee is $300.',
  },
  {
    question: 'Is a balance transfer worth it?',
    answer:
      'Only if interest savings exceed the fee and you can repay under realistic payments before (or despite) the post-promo APR. This calculator estimates that trade-off under stated assumptions.',
  },
  {
    question: 'Can a balance transfer save money?',
    answer:
      'Yes, when promotional interest is low enough and you maintain payments. Fees, short promos, and high regular APRs can erase the benefit.',
  },
  {
    question: 'Does a 0% APR balance transfer mean no fees?',
    answer:
      'No. Many 0% offers still charge a transfer fee. 0% means no interest during the promo window, not a free transfer.',
  },
  {
    question: 'How long do promotional balance transfer offers last?',
    answer:
      'Common windows are 6–21 months, but terms vary by issuer and offer. Enter the months from your specific offer.',
  },
  {
    question: 'What happens after a promotional APR ends?',
    answer:
      'Any remaining transferred balance typically begins accruing interest at the card’s regular APR, which can be much higher.',
  },
  {
    question: 'How much should I pay monthly to clear a balance transfer?',
    answer:
      'Use “Pay off during promotion” to estimate the payment that clears the new starting balance within the intro months (for 0%: balance ÷ months).',
  },
  {
    question: 'Can I transfer only part of my credit card balance?',
    answer:
      'Often yes, subject to issuer rules and credit limits. This calculator supports partial transfers and keeps the remainder on the old card in the transfer scenario.',
  },
  {
    question: 'Can I transfer a balance between cards from the same issuer?',
    answer:
      'Sometimes restricted. Many offers disallow transfers between cards from the same bank. Check the offer terms.',
  },
  {
    question: 'Does a balance transfer affect credit scores?',
    answer:
      'It can: new accounts, utilization changes, and hard inquiries may affect scores. Effects depend on your full credit profile.',
  },
  {
    question: 'Can a balance transfer be rejected?',
    answer:
      'Yes. Approvals, credit limits, and eligible transfer amounts are issuer decisions.',
  },
  {
    question: 'Can I use a balance transfer card for new purchases?',
    answer:
      'Often yes, but new purchases may use a different APR and can complicate payoff. This model assumes no new purchases.',
  },
  {
    question: 'Is a balance transfer better than a personal loan?',
    answer:
      'It depends. Transfers can offer temporary 0% interest with fees; personal loans may have fixed payments and different rates. Compare total cost and discipline required.',
  },
  {
    question: 'Can I transfer multiple credit card balances?',
    answer:
      'Many offers allow multiple transfers up to a limit. Model each amount and fee carefully against one payment budget.',
  },
  {
    question: 'What happens if I miss a payment?',
    answer:
      'You may lose the promotional APR, owe penalty rates, and incur fees. This calculator assumes on-time payments.',
  },
  {
    question: 'When is a balance transfer not worth it?',
    answer:
      'When the fee exceeds interest savings, the promo is too short for your payment, the regular APR is high with a large leftover, or you would keep spending on the cards.',
  },
  {
    question: 'Is a 3% balance transfer fee worth paying?',
    answer:
      'It can be if you avoid enough interest. On $10,000, 3% costs $300, compare that with old-card interest over the same horizon.',
  },
  {
    question: 'How do I compare balance transfer offers?',
    answer:
      'Align transfer amount, fee, promo rate/months, regular APR, and your monthly payment. Compare total cost and leftover after the promo.',
  },
  {
    question: 'Can a transfer fee be added to the new card balance?',
    answer:
      'Yes: many issuers finance the fee. This tool’s “Added to balance” treatment models that case.',
  },
  {
    question: 'How do I calculate balance transfer savings?',
    answer:
      'Estimate old-card total cost minus new-card total cost (interest + fee, same principal assumptions). Positive means the transfer looks cheaper under the model.',
  },
  {
    question:
      'What monthly payment clears a $5,000 balance in 12 months at 0% interest?',
    answer:
      'At 0% APR: 5000 ÷ 12 ≈ $416.67 per month, ignoring fees. Add any financed fee to the starting balance first.',
  },
];
