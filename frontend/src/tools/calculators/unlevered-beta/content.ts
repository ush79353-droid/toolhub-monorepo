import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Unlevered Beta?' },
  { id: 'levered-vs-unlevered', label: 'Levered Beta vs. Unlevered Beta' },
  { id: 'formula', label: 'Unlevered Beta Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Unlevered Beta' },
  { id: 'levered-beta', label: 'What Is Levered Beta?' },
  { id: 'debt-equity', label: 'What Is Debt-to-Equity Ratio?' },
  { id: 'tax-rate', label: 'Corporate Tax Rate in Unlevered Beta' },
  { id: 'interpret', label: 'How to Interpret Unlevered Beta' },
  { id: 'importance', label: 'Why Is Unlevered Beta Important?' },
  { id: 'relever', label: 'How to Relever Beta' },
  { id: 'capm', label: 'Unlevered Beta and CAPM' },
  { id: 'limitations', label: 'Limitations of Unlevered Beta' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ub-faq', label: 'Frequently Asked Questions' },
];

export const UB_FAQS: readonly FAQItem[] = [
  {
    question: 'What is unlevered beta?',
    answer:
      'Unlevered beta (asset beta) estimates a company’s systematic business risk after removing the financial leverage effect embedded in equity beta, under a chosen unlevering model and tax/capital-structure assumptions.',
  },
  {
    question: 'How do you calculate unlevered beta?',
    answer:
      'Divide levered equity beta by 1 + (1 − T) × (D/E), where T is the tax rate as a decimal and D/E is the debt-to-equity ratio. Example: βL 1.20, T 20%, D/E 2 → βU ≈ 0.4615.',
  },
  {
    question: 'What is the unlevered beta formula?',
    answer:
      'βU = βL / [1 + (1 − T)(D/E)]. This Hamada-style form assumes debt beta is negligible and that the tax shield of debt is reflected through T.',
  },
  {
    question: 'What is the difference between levered and unlevered beta?',
    answer:
      'Levered beta is equity beta and includes financial leverage. Unlevered beta adjusts that leverage out to approximate business/asset systematic risk for comparison or valuation work.',
  },
  {
    question: 'Is unlevered beta the same as asset beta?',
    answer:
      'In common usage, Yes: asset beta and unlevered beta refer to the same concept of business systematic risk stripped of (or adjusted for) financial leverage, though formula conventions can differ.',
  },
  {
    question: 'Why is unlevered beta important?',
    answer:
      'It helps compare operating risk across firms with different debt levels, supports peer beta analysis, and feeds into relevering for a target capital structure before cost-of-equity estimates.',
  },
  {
    question: 'Can unlevered beta be negative?',
    answer:
      'Yes, if levered beta is negative. That indicates estimated inverse linear market sensitivity. It still requires context and does not by itself define investment safety.',
  },
  {
    question: 'Can unlevered beta be greater than 1?',
    answer:
      'Yes. Values above 1 suggest estimated business systematic sensitivity greater than the market under the model assumptions. Estimation error and period choice still matter.',
  },
  {
    question: 'What does an unlevered beta of 0.5 mean?',
    answer:
      'Roughly, the estimated asset systematic return moves about half as much as the market in the linear CAPM sense under the selected assumptions; not a guarantee of low total risk.',
  },
  {
    question: 'How does debt affect beta?',
    answer:
      'Higher debt typically increases equity beta for a given asset beta because leverage amplifies equity residual risk. Unlevering reverses that amplification in the Hamada formula.',
  },
  {
    question: 'How does the corporate tax rate affect unlevered beta?',
    answer:
      'A higher tax rate increases the (1 − T) term’s reduction of the leverage adjustment, so for the same βL and D/E the formula yields a higher βU. Effective and statutory rates can differ.',
  },
  {
    question: 'What happens when a company has no debt?',
    answer:
      'D/E = 0, so βU = βL under this model. With zero debt there is no leverage adjustment to remove.',
  },
  {
    question: 'How do you relever beta?',
    answer:
      'βL = βU × [1 + (1 − T)(D/E)] using a target D/E and tax rate. Analysts often unlever peer betas, average them, then relever to the subject company’s target structure.',
  },
  {
    question: 'How is unlevered beta used in CAPM?',
    answer:
      'CAPM uses equity (levered) beta: Re = Rf + βL × market risk premium. Practitioners may derive βL by relevering an industry unlevered beta before applying CAPM.',
  },
  {
    question: 'What is a good unlevered beta?',
    answer:
      'There is no universal good value. Compare peers in the same industry, check estimation windows, and judge whether the beta fits the business’s operating risk; not a single “safe” cutoff.',
  },
  {
    question: 'Can unlevered beta be used for private companies?',
    answer:
      'Yes, indirectly: estimate unlevered betas from public peers, then relever to the private firm’s target capital structure. Peer selection and adjustments remain judgmental.',
  },
  {
    question: 'Should I use book equity or market equity?',
    answer:
      'Valuation work usually prefers market-value debt and equity weights. This calculator accepts the figures you enter (often book totals from statements); use market values when your model requires them.',
  },
  {
    question: 'What are the limitations of unlevered beta?',
    answer:
      'Historical estimation noise, changing leverage, debt-beta assumptions, tax-rate choices, book vs market measures, and different formula conventions all limit precision. Treat βU as an analytical estimate, not a guaranteed future risk measure.',
  },
];
