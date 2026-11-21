import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Beta of a Portfolio?' },
  { id: 'how-to-calculate', label: 'How to Calculate the Beta of a Portfolio' },
  { id: 'example', label: 'Portfolio Beta Calculation Example' },
  { id: 'interpret', label: 'How to Interpret Portfolio Beta' },
  { id: 'why-important', label: 'Why Is Portfolio Beta Important?' },
  { id: 'reduce', label: 'How to Reduce Portfolio Beta' },
  { id: 'limitations', label: 'Limitations of Portfolio Beta' },
  { id: 'pb-faq', label: 'Frequently Asked Questions' },
];

export const PB_FAQS: readonly FAQItem[] = [
  {
    question: 'What is portfolio beta?',
    answer:
      'Portfolio beta is the weighted average of the betas of the holdings, measuring estimated systematic sensitivity of the portfolio to a chosen benchmark.',
  },
  {
    question: 'How do you calculate portfolio beta?',
    answer:
      'Convert each weight to a decimal (or divide percent by 100), multiply by that stock’s beta, and sum: βp = Σ (wi × βi). Weights should total 100% for a fully invested long-only portfolio.',
  },
  {
    question: 'What is a good beta for a portfolio?',
    answer:
      'There is no universally ideal beta. Target sensitivity depends on risk tolerance, horizon, and strategy. Higher beta implies more estimated market sensitivity, not automatically better or worse returns.',
  },
  {
    question: 'Is a portfolio beta of 1.2 high?',
    answer:
      'It is above the benchmark’s beta of 1, so the portfolio has greater estimated systematic sensitivity. Whether that is appropriate depends on investor objectives and risk capacity.',
  },
  {
    question: 'Can portfolio beta be negative?',
    answer:
      'Yes, if weighted holdings include enough negative-beta exposures. That implies historically inverse estimated co-movement with the benchmark under the model.',
  },
  {
    question: 'Can portfolio beta be zero?',
    answer:
      'Approximately, if weighted betas cancel or holdings have near-zero betas. That means little estimated linear market sensitivity; not zero total risk.',
  },
  {
    question: 'How do portfolio weights affect beta?',
    answer:
      'Each holding contributes weight × beta. Raising the weight of a high-beta stock increases portfolio beta; lowering it reduces the contribution.',
  },
  {
    question: 'Does diversification reduce portfolio beta?',
    answer:
      'Diversification can change portfolio beta by mixing different betas, but it does not automatically reduce systematic risk. Market-wide shocks can still move a diversified portfolio.',
  },
  {
    question: 'What is the difference between portfolio beta and stock beta?',
    answer:
      'Stock beta is one security’s sensitivity to the benchmark. Portfolio beta aggregates those sensitivities by portfolio weights.',
  },
  {
    question: 'How is beta used in CAPM?',
    answer:
      'Under CAPM, expected return is often written E(Ri) = Rf + βi(E(Rm) − Rf). Beta scales the equity risk premium under the model’s assumptions.',
  },
  {
    question: 'Can portfolio beta change over time?',
    answer:
      'Yes. Weights change with rebalancing and price moves, and individual beta estimates and benchmark relationships can drift.',
  },
  {
    question: 'Can a portfolio have beta greater than 2?',
    answer:
      'Yes, concentrated high-beta holdings or leverage can produce portfolio betas well above 1, including above 2.',
  },
];
