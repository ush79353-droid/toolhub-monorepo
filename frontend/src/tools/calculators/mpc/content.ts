import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MPC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'MPC Calculator' },
  { id: 'what-is-mpc', label: 'What Is the Marginal Propensity to Consume?' },
  { id: 'consumption-function', label: 'What Is the Consumption Function?' },
  { id: 'mpc-formula', label: 'Marginal Propensity to Consume Formula' },
  { id: 'how-to-use', label: 'How to Use the MPC Calculator' },
  { id: 'calculate-spending', label: 'How to Calculate Consumer Spending' },
  { id: 'mpc-vs-apc', label: 'MPC vs. APC' },
  { id: 'mpc-vs-mps', label: 'MPC vs. MPS' },
  { id: 'good-mpc', label: 'What Is a Good MPC?' },
  { id: 'mpc-gt-one', label: 'Can MPC Be Greater Than One?' },
  { id: 'mpc-negative', label: 'Can MPC Be Negative?' },
  { id: 'multiplier', label: 'MPC and the Keynesian Multiplier' },
  { id: 'macro', label: 'Macroeconomic Implications of MPC' },
  { id: 'policy', label: 'How Government Policies Affect Consumption' },
  { id: 'forecasting', label: 'Why MPC Matters in Economic Forecasting' },
  { id: 'limitations', label: 'Limitations of the MPC Model' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'mpc-faq', label: 'Frequently Asked Questions' },
];

export const MPC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is MPC in economics?',
    answer:
      'Marginal propensity to consume (MPC) is the share of an extra unit of disposable income that is spent on consumption over the interval measured: MPC = ΔC / ΔYd.',
  },
  {
    question: 'How do you calculate MPC?',
    answer:
      'Divide the change in consumer spending by the change in disposable income. If ΔYd is zero, MPC is undefined.',
  },
  {
    question: 'What is the MPC formula?',
    answer: 'MPC = ΔC / ΔYd.',
  },
  {
    question: 'What does MPC of 0.6 mean?',
    answer:
      'Roughly $0.60 of each additional $1 of disposable income is spent on consumption over that interval (and about $0.40 is not spent, under a simple saving residual).',
  },
  {
    question: 'What does MPC of 0.8 mean?',
    answer:
      'About $0.80 of each extra $1 of disposable income is consumed in the measured change; the simplified MPS is 0.2.',
  },
  {
    question: 'What is the relationship between MPC and consumption?',
    answer:
      'In the linear consumption function C = a + MPC × Yd, MPC is the slope: how steeply predicted consumption rises with disposable income.',
  },
  {
    question: 'What is autonomous consumption?',
    answer:
      'The intercept a in C = a + bYd; predicted consumption when disposable income is zero in the model. It is theoretical, not a literal household budget at zero income.',
  },
  {
    question: 'How do you calculate consumer spending?',
    answer:
      'Using the linear model: C = autonomous consumption + MPC × disposable income.',
  },
  {
    question: 'What is the consumption function?',
    answer:
      'A relationship mapping disposable income to consumption. The teaching form used here is the straight line C = a + bYd.',
  },
  {
    question: 'What is the difference between MPC and APC?',
    answer:
      'MPC is the marginal change ΔC/ΔYd. APC is the average C/Yd. They differ whenever autonomous consumption is nonzero or behavior is nonlinear.',
  },
  {
    question: 'What is the difference between MPC and MPS?',
    answer:
      'Under the simplified split of income changes into consumption and saving, MPS = 1 − MPC.',
  },
  {
    question: 'Can MPC be negative?',
    answer:
      'Yes in observed data if spending and income move opposite ways. This calculator allows it and shows a warning; textbooks often assume 0 ≤ MPC ≤ 1.',
  },
  {
    question: 'Can MPC be greater than one?',
    answer:
      'Yes over some intervals (credit, timing, wealth effects). The tool does not clamp MPC and warns when MPC > 1.',
  },
  {
    question: 'Can MPC equal zero?',
    answer:
      'Yes: if consumption does not change when income changes, MPC = 0. The simplified multiplier is then 1.',
  },
  {
    question: 'What happens when MPC equals one?',
    answer:
      'All of the measured income change is consumed. The simplified multiplier 1/(1−MPC) is undefined (unbounded) at MPC = 1.',
  },
  {
    question: 'What is a good MPC?',
    answer:
      'There is no universal ideal. “Good” depends on income, credit, confidence, and the policy question; higher MPC can amplify stimulus but also imply less saving.',
  },
  {
    question: 'Does a higher MPC mean more spending?',
    answer:
      'It means a larger spending response per dollar of income change in the model. Total spending also depends on income levels and autonomous consumption.',
  },
  {
    question: 'How does MPC affect aggregate demand?',
    answer:
      'In Keynesian teaching models, a higher MPC strengthens induced consumption responses that feed into aggregate demand, all else equal.',
  },
  {
    question: 'How does MPC affect GDP?',
    answer:
      'Via demand: stronger consumption responses can raise output when spare capacity exists. Real outcomes depend on supply, prices, and policy.',
  },
  {
    question: 'How does MPC affect the government spending multiplier?',
    answer:
      'In the simplest closed-economy model without taxes, k = 1/(1−MPC). Higher MPC raises k; real multipliers are usually smaller.',
  },
  {
    question: 'How do tax cuts affect consumption?',
    answer:
      'If disposable income rises, consumption may rise by roughly MPC × ΔYd in the linear model, subject to expectations, credit, and timing.',
  },
  {
    question: 'Why do households have different MPC values?',
    answer:
      'Income, wealth, liquidity constraints, demographics, and preferences differ, so measured MPCs vary across groups and over time.',
  },
  {
    question: 'What is the relationship between income and consumption?',
    answer:
      'Consumption generally rises with disposable income, but not dollar-for-dollar; the slope of that relationship is summarized by MPC in the linear model.',
  },
  {
    question: 'How do you calculate MPS from MPC?',
    answer: 'MPS = 1 − MPC under the simplified consumption–saving split.',
  },
  {
    question: 'What is the multiplier if MPC is 0.6?',
    answer: 'In the simplest model, k = 1/(1−0.6) = 2.5.',
  },
  {
    question: 'How do you calculate break-even disposable income?',
    answer:
      'Set C = Yd in C = a + bYd to get Yd = a/(1−b), when b ≠ 1.',
  },
  {
    question: 'What happens to consumption when disposable income decreases?',
    answer:
      'In the linear model, predicted C falls by MPC × |ΔYd| when income falls (for positive MPC). Observed short-run responses can differ.',
  },
  {
    question: 'Why is MPC important in macroeconomics?',
    answer:
      'It links disposable income to consumption, shapes simple fiscal multipliers, and organizes how analysts discuss household spending responses.',
  },
];
