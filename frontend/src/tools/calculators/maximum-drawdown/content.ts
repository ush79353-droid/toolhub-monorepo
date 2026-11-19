import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MAXIMUM_DRAWDOWN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mdd', label: 'What is maximum drawdown?' },
  { id: 'how-to-calculate', label: 'How to calculate maximum drawdown' },
  { id: 'why-important', label: 'Why is maximum drawdown important?' },
  { id: 'mdd-vs-volatility', label: 'Maximum drawdown vs. volatility' },
  { id: 'recovery-gains', label: 'How much return is needed to recover?' },
  { id: 'step-by-step', label: 'Step-by-step calculation' },
  { id: 'recovery-time', label: 'How much time does recovery take?' },
  { id: 'mdd-markets', label: 'Maximum drawdown in different markets' },
  { id: 'limitations', label: 'Limitations of maximum drawdown' },
  { id: 'strategies', label: 'Strategies for managing drawdown' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'mdd-faq', label: 'Frequently asked questions' },
];

export const MAXIMUM_DRAWDOWN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is portfolio maximum drawdown?',
    answer:
      'Portfolio maximum drawdown measures the largest percentage decline from a portfolio’s previous peak to a subsequent trough over a selected period.',
  },
  {
    question: 'What is a good maximum drawdown?',
    answer:
      'It depends on asset class, strategy, risk tolerance, and horizon. There is no universal “good” drawdown threshold that fits every investor.',
  },
  {
    question: 'What is the worst possible maximum drawdown?',
    answer:
      'For a conventional long-only investment with a nonnegative value, a complete loss corresponds to a 100% drawdown.',
  },
  {
    question: 'How much time does it take to recover from drawdowns?',
    answer:
      'Recovery time depends on the loss size and subsequent compound growth. This calculator estimates t = −ln(1 − D) / ln(1 + g) under a constant annual growth assumption.',
  },
  {
    question: 'How do you calculate maximum drawdown?',
    answer:
      'MDD = (Peak − Lowest subsequent value) / Peak × 100. Example: peak $15,000 and trough $12,500 → absolute loss $2,500 → MDD ≈ 16.67%.',
  },
  {
    question: 'What is the difference between maximum drawdown and loss?',
    answer:
      'A loss can describe any decline. Maximum drawdown specifically measures the largest peak-to-trough percentage decline over the chosen window.',
  },
  {
    question: 'Can maximum drawdown be more than 100%?',
    answer:
      'For a conventional nonnegative long-only portfolio without leveraged liabilities, MDD cannot exceed 100%. Leveraged positions need a different risk model.',
  },
  {
    question: 'What is recovery gain?',
    answer:
      'Recovery gain is the percentage increase required to return from the trough back to the previous peak: D / (1 − D) × 100.',
  },
  {
    question: 'Why does a 50% loss require a 100% gain?',
    answer:
      'After a 50% decline, half the capital remains. Doubling that remaining capital (a 100% gain) is required to restore the original peak.',
  },
  {
    question: 'Does maximum drawdown measure volatility?',
    answer:
      'No. Volatility measures return variability; maximum drawdown measures the worst peak-to-trough decline. Both are useful and complementary.',
  },
  {
    question: 'Is maximum drawdown a good risk measure?',
    answer:
      'It is useful for downside risk and capital-preservation context, but it depends on the sample period and does not alone describe future risk.',
  },
  {
    question: 'Does maximum drawdown predict future losses?',
    answer:
      'No. Historical drawdown does not guarantee or forecast future investment performance.',
  },
];
