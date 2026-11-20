import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EARNEST_MONEY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-earnest-money', label: 'What Is Earnest Money?' },
  { id: 'how-it-works', label: 'How the Earnest Money Calculator Works' },
  { id: 'toward-down-payment', label: 'Does Earnest Money Go Toward the Down Payment?' },
  { id: 'vs-down-payment', label: 'Earnest Money vs. Down Payment' },
  { id: 'how-much-is-typical', label: 'How Much Earnest Money Is Typical?' },
  { id: 'is-refundable', label: 'Is Earnest Money Refundable?' },
  { id: 'when-paid', label: 'When Is Earnest Money Paid?' },
  { id: 'how-to-use', label: 'How to Use the Earnest Money Calculator' },
  { id: 'earnest-money-formula', label: 'Earnest Money Formula' },
  { id: 'important-considerations', label: 'Important Considerations' },
  { id: 'earnest-money-faq', label: 'Frequently Asked Questions' },
];

export const EARNEST_MONEY_FAQS: readonly FAQItem[] = [
  {
    question: 'Is earnest money refundable?',
    answer:
      'Refundability depends on the purchase agreement, contingencies, deadlines, and applicable law. Some cancellations within contingency periods return the deposit; others may allow forfeiture. Read the contract carefully.',
  },
  {
    question: 'How much is the earnest money for a property worth $600,000?',
    answer:
      'At an illustrative 2% deposit: 600,000 × 0.02 = $12,000. Actual percentages vary by market and negotiation.',
  },
  {
    question: 'What is a common earnest money percentage?',
    answer:
      'There is no universal standard. Amounts depend on location, competition, property price, financing, and the seller’s requirements. Use this calculator to compare deposit scenarios, not as a legal requirement.',
  },
  {
    question: 'How do I calculate the earnest money needed?',
    answer:
      'Earnest Money = Property Price × (Earnest Money Percentage / 100). Example: $300,000 × 3% = $9,000.',
  },
  {
    question: 'Does earnest money count toward a down payment?',
    answer:
      'When a sale closes, earnest money is commonly credited toward the buyer’s funds due at closing, which may include down payment and other charges. Exact treatment depends on the settlement statement and contract.',
  },
  {
    question: 'What happens to earnest money if a buyer cancels?',
    answer:
      'Outcome depends on contingencies, notice deadlines, and contract language. Missing a deadline or canceling without a contractual right can risk the deposit. Seek local professional guidance for specific deals.',
  },
  {
    question: 'Is earnest money the same as a down payment?',
    answer:
      'No. Earnest money is typically an early deposit showing commitment. The down payment is the buyer’s larger contribution to the purchase price, usually finalized at closing. The deposit may be credited toward closing funds.',
  },
  {
    question: 'When do buyers pay earnest money?',
    answer:
      'Often after an offer is accepted or within the timeframe stated in the purchase agreement. Timing varies by market and contract.',
  },
  {
    question: 'Can earnest money be zero?',
    answer:
      'Some transactions may not require an earnest money deposit, subject to the agreement and local practice. Sellers in competitive markets often expect a meaningful deposit.',
  },
  {
    question: 'Who holds the earnest money deposit?',
    answer:
      'An authorized escrow agent, title company, brokerage, attorney, or other party named in the agreement may hold the funds, depending on jurisdiction and contract terms.',
  },
];
