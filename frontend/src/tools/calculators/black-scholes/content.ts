import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BLACK_SCHOLES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Black Scholes Calculator' },
  { id: 'definition', label: 'What Is the Black–Scholes Model?' },
  { id: 'formula', label: 'Black–Scholes–Merton Formulas' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'inputs', label: 'Inputs Explained' },
  { id: 'example', label: 'Worked Example' },
  { id: 'boundaries', label: 'Zero Time and Zero Volatility' },
  { id: 'currency', label: 'Currencies and FX' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bs-faq', label: 'Frequently Asked Questions' },
];

export const BLACK_SCHOLES_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the Black Scholes Calculator compute?',
    answer:
      'European call and put option prices under the Black–Scholes–Merton model with continuous compounding and a continuous dividend yield.',
  },
  {
    question: 'What is d1 and d2?',
    answer:
      'd1 and d2 are the standardized arguments to the normal CDF in the model. Call uses N(d1) and N(d2); put uses N(−d1) and N(−d2).',
  },
  {
    question: 'How are percentages entered?',
    answer:
      'Dividend yield, volatility, and the risk-free rate are entered as percents (20 means 20%) and converted to decimals inside the engine.',
  },
  {
    question: 'What happens when time to maturity is zero?',
    answer:
      'Prices become European intrinsic values: call = max(S − K, 0) and put = max(K − S, 0).',
  },
  {
    question: 'What happens when volatility is zero?',
    answer:
      'With T > 0 and σ = 0 the calculator uses the discounted forward intrinsic: max(S e^(−qT) − K e^(−rT), 0) for the call and the opposite for the put.',
  },
  {
    question: 'Does this price American options?',
    answer:
      'No. Black–Scholes–Merton prices European exercise only. Early-exercise American options need a different numerical method.',
  },
  {
    question: 'Can stock and strike use different currencies?',
    answer:
      'Yes. The strike is converted into the stock currency before pricing when rates are available. Call and put results can display in independent currencies.',
  },
  {
    question: 'What is a typical ATM example?',
    answer:
      'S = K = 100, T = 1 year, q = 0%, σ = 20%, r = 5% yields a call near 10.45 and a put near 5.57 in the same currency units.',
  },
  {
    question: 'Is the risk-free rate continuously compounded?',
    answer:
      'Yes. The model uses continuous compounding for r and for the continuous dividend yield q.',
  },
  {
    question: 'Why can results be unavailable when currencies differ?',
    answer:
      'Cross-currency conversion needs the shared Omega FX snapshot. If a required rate is missing, conversion is blocked instead of silently using 1:1.',
  },
];
