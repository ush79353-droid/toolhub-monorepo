import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { EQUITY_OPTION_CONTRACT_MULTIPLIER } from './types';

export const CALL_OPTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is a Call or Put Option?' },
  { id: 'formula', label: 'Total Premium Formula' },
  { id: 'how-to', label: 'How to Use This Calculator' },
  { id: 'break-even', label: 'Break-Even and Intrinsic Value' },
  { id: 'multiplier', label: 'Why Multiply by 100?' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'call-option-faq', label: 'Frequently Asked Questions' },
];

export const CALL_OPTION_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate the total cost of call options?',
    answer: `Multiply the quoted premium per share by ${EQUITY_OPTION_CONTRACT_MULTIPLIER} (shares per standard equity contract), then by the number of contracts. Example: premium 5 × ${EQUITY_OPTION_CONTRACT_MULTIPLIER} × 1 contract = 500.`,
  },
  {
    question: 'What is the difference between a call and a put?',
    answer:
      'A call gives the right to buy the underlying at the strike; a put gives the right to sell at the strike. This tool estimates total premium paid and simple break-even/intrinsic figures for either mode.',
  },
  {
    question: 'Is the option price per share or per contract?',
    answer: `Listed equity option quotes are typically per share. One standard contract usually covers ${EQUITY_OPTION_CONTRACT_MULTIPLIER} shares, so total premium multiplies the per-share quote by ${EQUITY_OPTION_CONTRACT_MULTIPLIER} and by the contract count.`,
  },
  {
    question: 'What is break-even for a long call or put?',
    answer:
      'Ignoring fees and taxes, a long call breaks even near strike + premium per share. A long put breaks even near strike − premium per share. Real trading adds commissions and may use different multipliers.',
  },
  {
    question: 'Does this use the Black-Scholes model?',
    answer:
      'No. This calculator multiplies a quoted premium by the contract size. It does not solve for theoretical option value from volatility, rates, or time to expiration.',
  },
  {
    question: 'Can time value be negative?',
    answer:
      'If the quoted premium is below intrinsic value, the displayed time value is negative. That can happen with stale quotes, wide spreads, or early-exercise situations; verify live market data before trading.',
  },
  {
    question: 'Does changing currency convert my amounts?',
    answer:
      'No. The currency control only changes denomination and formatting. Amounts are not converted with live exchange rates.',
  },
];
