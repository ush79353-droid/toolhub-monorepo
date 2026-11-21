import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FORWARD_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Forward Rate Calculator' },
  { id: 'what-is', label: 'What Is a Forward Rate?' },
  { id: 'formula', label: 'Forward Rate Formula' },
  { id: 'how-to', label: 'How to Calculate' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'spot-vs-forward', label: 'Spot Rate vs Forward Rate' },
  { id: 'compounding', label: 'Annual Compounding Convention' },
  { id: 'interpretation', label: 'How to Interpret Results' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'forward-rate-faq', label: 'Frequently Asked Questions' },
];

export const FORWARD_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a forward rate?',
    answer:
      'A forward rate is the interest rate implied for a future period by today’s spot rates of different maturities. Under annual compounding it is the break-even reinvestment rate between two spot maturities.',
  },
  {
    question: 'What is the forward rate formula?',
    answer:
      'With annually compounded spot rates S₁ and S₂ (as decimals) for times n₁ and n₂ years (n₂ > n₁): f = [ ((1+S₂)^n₂ / (1+S₁)^n₁ )^(1/(n₂−n₁)) − 1 ]. Multiply by 100 to express f as a percent.',
  },
  {
    question: 'Why must n₂ be greater than n₁?',
    answer:
      'The forward covers the interval from n₁ to n₂. If n₂ ≤ n₁ the exponent 1/(n₂−n₁) is undefined or non-positive in this setup, so the calculator requires a strictly longer second maturity.',
  },
  {
    question: 'Are spot rates entered as percents or decimals?',
    answer:
      'Enter percentages in the form (5 means 5%). The engine divides by 100 before applying (1+S)^n. Displayed results are percentages again.',
  },
  {
    question: 'What compounding convention does this calculator use?',
    answer:
      'Annual compounding, matching the prompt formula. Continuous or m-times-per-year forwards use different identities and are not applied here.',
  },
  {
    question: 'Can spot rates be negative?',
    answer:
      'Yes, as long as 1 + S/100 > 0 (S > −100%). Rates at or below −100% make (1+S) non-positive and are rejected.',
  },
  {
    question: 'How do months convert to years?',
    answer:
      'When the unit is months, the engine uses years = months ÷ 12 before computing the forward. Mixed units are allowed as long as the converted n₂ > n₁.',
  },
  {
    question: 'Is this the same as a currency forward rate?',
    answer:
      'No. This tool implies an interest forward from two bond (or deposit) spot rates. Currency forwards use interest-rate parity on an FX spot and are covered by the Currency Forward Calculator.',
  },
  {
    question: 'Worked example: 1y 5% and 2y 6%?',
    answer:
      'f = ((1.06)^2 / (1.05)^1)^(1/(2−1)) − 1 ≈ 0.070095, or about 7.01% annually compounded.',
  },
  {
    question: 'Does a higher forward mean rates will rise?',
    answer:
      'Not necessarily. The implied forward is a break-even from today’s curve under the chosen compounding. Realized future spots can differ because of risk premia, liquidity, and expectation errors.',
  },
];
