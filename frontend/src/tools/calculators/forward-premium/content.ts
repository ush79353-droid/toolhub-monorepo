import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FORWARD_PREMIUM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Forward Premium Calculator' },
  { id: 'definition', label: 'What Is Forward Premium?' },
  { id: 'formula', label: 'Forward Premium Formula' },
  { id: 'annualized', label: 'Annualized Forward Premium' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'premium-vs-discount', label: 'Premium vs Discount' },
  { id: 'day-count', label: 'Day-Count Basis' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'forward-premium-faq', label: 'Frequently Asked Questions' },
];

export const FORWARD_PREMIUM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a forward premium?',
    answer:
      'A forward premium means the forward exchange rate is higher than the spot rate under the same quote convention: ((F − S) / S) × 100 is positive. The base currency is more expensive for future delivery than for spot in quote terms.',
  },
  {
    question: 'What is a forward discount?',
    answer:
      'A forward discount means F < S, so ((F − S) / S) × 100 is negative. The forward quote is cheaper than spot for the base currency in quote terms.',
  },
  {
    question: 'How do I calculate forward premium?',
    answer:
      'Forward premium % = ((forward rate − spot rate) / spot rate) × 100. Example: S = 1.25, F = 1.28 → ((1.28 − 1.25) / 1.25) × 100 = 2.4%.',
  },
  {
    question: 'How is annualized forward premium calculated?',
    answer:
      'Annualized premium % = period premium % × (day-count basis / contract days). This calculator uses a 365-day basis. Example: 2.4% over 90 days → 2.4 × (365 / 90) ≈ 9.7333%.',
  },
  {
    question: 'Why use 365 days?',
    answer:
      'When the interface does not offer a day-count selector, Omega Calculators annualizes with a 365-day year. Some money-market conventions use 360; convert explicitly if your quote sheet requires Actual/360.',
  },
  {
    question: 'Can forward premium be negative?',
    answer:
      'Yes. A negative period or annualized premium is a forward discount. The calculator allows negative results when F < S.',
  },
  {
    question: 'Does this use covered interest parity?',
    answer:
      'No. This tool only converts quoted spot and forward rates into period and annualized premiums. Covered interest parity (interest differentials → theoretical forward) is handled by the Currency Forward Calculator.',
  },
  {
    question: 'Do spot and forward need the same quote convention?',
    answer:
      'Yes. Both rates must be in the same units (for example, quote currency per one unit of base). Mixing inverted pairs produces a meaningless premium.',
  },
  {
    question: 'Is annualized premium an interest rate?',
    answer:
      'It is a simple annualization of the period FX premium for comparison across tenors. It is not a yield, LIBOR/SOFR fixing, or funding rate.',
  },
  {
    question: 'What inputs does this calculator need?',
    answer:
      'Spot rate, forward rate, and forward contract duration in days. You can also edit the premium or annualized premium to reverse-solve linked fields.',
  },
];
