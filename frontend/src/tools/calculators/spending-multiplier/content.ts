import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SPENDING_MULTIPLIER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Spending Multiplier Calculator' },
  { id: 'what-is', label: 'What Is a Spending Multiplier?' },
  { id: 'formula', label: 'Spending Multiplier Formula' },
  { id: 'mpc', label: 'What Is Marginal Propensity to Consume?' },
  { id: 'mps', label: 'What Is Marginal Propensity to Save?' },
  { id: 'mpc-mps', label: 'Relationship Between MPC and MPS' },
  { id: 'how-to-calculate', label: 'How to Calculate the Spending Multiplier' },
  { id: 'example', label: 'Spending Multiplier Example' },
  { id: 'how-it-works', label: 'How the Spending Multiplier Works' },
  { id: 'gdp', label: 'The Spending Multiplier and GDP' },
  { id: 'vs-money', label: 'Spending vs. Money Multiplier' },
  { id: 'government', label: 'Government Spending Multiplier' },
  { id: 'investment', label: 'Investment Multiplier' },
  { id: 'tax', label: 'Tax Multiplier' },
  { id: 'what-affects', label: 'What Affects Multiplier Size?' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'when-useful', label: 'When Is It Useful?' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'spending-multiplier-faq', label: 'Frequently Asked Questions' },
];

export const SPENDING_MULTIPLIER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a spending multiplier?',
    answer:
      'The spending multiplier (Keynesian multiplier) is the factor by which an initial autonomous spending change is magnified into a larger change in equilibrium aggregate output under simplified assumptions: k = 1/(1−MPC) = 1/MPS.',
  },
  {
    question: 'How do you calculate the spending multiplier?',
    answer:
      'From MPC: k = 1/(1−MPC). From MPS: k = 1/MPS. Example: MPC = 0.6 → MPS = 0.4 → k = 2.5. Never display Infinity when MPC = 1 or MPS = 0; the simple multiplier is undefined/unbounded.',
  },
  {
    question: 'What is the Keynesian multiplier formula?',
    answer:
      'In the basic closed-economy model without taxes or imports, k = 1/(1−MPC). With a simple tax or import leakage, the denominator expands; this calculator uses the textbook one-leakage saving form.',
  },
  {
    question: 'What is marginal propensity to consume?',
    answer:
      'MPC = ΔC / ΔYd — the fraction of an extra unit of disposable income spent on consumption. Example: $800 of $1,000 additional income consumed → MPC = 0.8.',
  },
  {
    question: 'What is marginal propensity to save?',
    answer:
      'MPS = ΔS / ΔYd — the fraction of an extra unit of disposable income saved. In the simple split, MPS = 1 − MPC.',
  },
  {
    question: 'What is the relationship between MPC and MPS?',
    answer:
      'Under the simplified assumption that additional disposable income is allocated only between consumption and saving, MPC + MPS = 1.',
  },
  {
    question: 'What is the spending multiplier if MPC is 0.8?',
    answer: 'k = 1/(1−0.8) = 5. Equivalently MPS = 0.2 and k = 1/0.2 = 5.',
  },
  {
    question: 'What is the spending multiplier if MPS is 0.25?',
    answer: 'k = 1/0.25 = 4. Then MPC = 1 − 0.25 = 0.75.',
  },
  {
    question: 'Can the spending multiplier be less than 1?',
    answer:
      'In the standard 0 ≤ MPC < 1 model, k ≥ 1. Multipliers below 1 appear in richer models with strong leakages or when measuring different fiscal concepts — not in this basic calculator.',
  },
  {
    question: 'What happens when MPC equals 1?',
    answer:
      'The simple multiplier is undefined/unbounded because the denominator 1−MPC is zero. This calculator reports that state and never shows Infinity.',
  },
  {
    question: 'Why does a higher MPC increase the multiplier?',
    answer:
      'A higher MPC means a larger share of each income round is re-spent, so leakages into saving are smaller and the geometric series of spending rounds sums to a larger total.',
  },
  {
    question: 'How does the spending multiplier affect GDP?',
    answer:
      'In the model, ΔY = k × ΔA. That is a theoretical equilibrium-output change under the model’s assumptions — not a guaranteed observed GDP print. Distinguish real vs nominal GDP separately.',
  },
  {
    question: 'What is autonomous spending?',
    answer:
      'Autonomous spending is an initial expenditure change not driven by current income — for example a rise in government purchases, investment, or autonomous consumption in textbook setups.',
  },
  {
    question: 'What is the difference between the spending multiplier and money multiplier?',
    answer:
      'The Keynesian spending multiplier links autonomous spending to output via MPC/MPS. The simplified bank money multiplier links reserve ratios to deposit expansion. They answer different questions.',
  },
  {
    question: 'What is the government spending multiplier?',
    answer:
      'In the simplest textbook case it equals 1/(1−MPC) when government purchases are the autonomous impulse. Empirical fiscal multipliers differ with monetary policy, openness, and capacity utilization.',
  },
  {
    question: 'What is the tax multiplier?',
    answer:
      'A simple lump-sum tax multiplier is often written k_T = −MPC/(1−MPC). It rests on restrictive assumptions and should not be applied automatically to real tax-policy packages.',
  },
  {
    question: 'Can autonomous spending decrease GDP?',
    answer:
      'Yes in the model: a negative ΔA yields a negative theoretical ΔY = k×ΔA (for example MPC 0.5 and ΔA = −1,000 → ΔY = −2,000).',
  },
  {
    question: 'Why might the real-world multiplier differ from the theoretical value?',
    answer:
      'Taxes, imports, interest-rate responses, inflation, spare capacity, expectations, and timing all alter measured multipliers. The textbook k is a teaching device, not a forecast.',
  },
  {
    question: 'What is the role of saving in the multiplier process?',
    answer:
      'Saving is the leakage that ends the geometric series of re-spending. Higher MPS lowers k because less of each income increment returns as consumption demand.',
  },
  {
    question: 'How do you calculate the required spending change for a target GDP increase?',
    answer:
      'ΔA = ΔY / k. Example: target ΔY = 10,000 and k = 4 → required autonomous spending increase = 2,500. Use the calculator’s Required spending mode.',
  },
];
