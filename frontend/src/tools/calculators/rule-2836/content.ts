import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RULE_2836_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-2836', label: 'What Is the 28/36 Rule?' },
  { id: 'front-end-ratio', label: 'What Is the Front-End Ratio?' },
  { id: 'back-end-ratio', label: 'What Is the Back-End Ratio?' },
  { id: 'housing-expenses', label: 'What Counts as Housing Expenses?' },
  { id: 'other-debt', label: 'What Counts as Other Monthly Debt?' },
  { id: 'formulas', label: '28/36 Rule Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate the 28/36 Rule' },
  { id: 'example', label: '28/36 Rule Calculation Example' },
  { id: 'housing-share', label: 'How Much Income Toward Housing?' },
  { id: 'total-debt-share', label: 'How Much Total Debt Is Acceptable?' },
  { id: 'house-price', label: 'What House Price Can I Afford?' },
  { id: 'mortgage-budget', label: 'How to Estimate a Mortgage Budget' },
  { id: 'above-28', label: 'Front-End Ratio Above 28%' },
  { id: 'above-36', label: 'Back-End Ratio Above 36%' },
  { id: 'above-limits', label: 'Mortgage Above 28/36 Limits?' },
  { id: 'improve-dti', label: 'How to Improve Debt-to-Income' },
  { id: 'vs-dti', label: '28/36 vs Debt-to-Income Ratio' },
  { id: 'vs-affordability', label: '28/36 vs Affordability Calculator' },
  { id: 'limitations', label: 'Limitations of the 28/36 Rule' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'rule-2836-faq', label: 'Frequently Asked Questions' },
];

export const RULE_2836_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the 28/36 rule?',
    answer:
      'A common mortgage affordability guideline: housing expenses generally should not exceed 28% of gross monthly income (front-end), and total monthly debt including housing generally should not exceed 36% (back-end).',
  },
  {
    question: 'What does 28/36 mean in mortgage lending?',
    answer:
      '28 refers to the front-end housing ratio limit; 36 refers to the back-end total debt-to-income limit. Lenders may use these as reference points, but programs and underwriting standards vary.',
  },
  {
    question: 'How do I calculate the 28/36 rule?',
    answer:
      'Divide monthly housing costs by gross monthly income and multiply by 100 for the front-end ratio. Add other monthly debts to housing, divide by income, and multiply by 100 for the back-end ratio. Compare to 28% and 36%.',
  },
  {
    question: 'What is the front-end ratio?',
    answer:
      'Housing costs divided by gross monthly income, expressed as a percentage. It focuses only on the housing payment burden.',
  },
  {
    question: 'What is the back-end ratio?',
    answer:
      'Total monthly debt obligations (housing plus other qualifying debts) divided by gross monthly income, expressed as a percentage.',
  },
  {
    question: 'What is a good debt-to-income ratio?',
    answer:
      'Lower is generally safer for household budgets. The traditional 36% back-end guideline is a common reference, but “good” depends on lender program, credit, reserves, and other factors.',
  },
  {
    question: 'Is the 28/36 rule mandatory?',
    answer:
      'No. It is a guideline, not a universal legal requirement. Individual lenders and loan programs set their own debt-to-income and payment criteria.',
  },
  {
    question: 'Do all mortgage lenders use the 28/36 rule?',
    answer:
      'Not all. Some lean on overall DTI, residual income, or automated underwriting models with different thresholds. Treat 28/36 as a planning benchmark.',
  },
  {
    question: 'Can I qualify for a mortgage above 36% DTI?',
    answer:
      'Sometimes, depending on compensating factors (credit, reserves, stable income) and the loan program. Approval is never guaranteed by this calculator.',
  },
  {
    question: 'Does the rule use gross or net income?',
    answer:
      'Gross monthly income before taxes and most payroll deductions. Using take-home pay understates ratios relative to the classic guideline.',
  },
  {
    question: 'Are property taxes included?',
    answer:
      'Yes, in the housing side of the guideline when you estimate total housing costs or itemize taxes separately.',
  },
  {
    question: 'Is homeowners insurance included?',
    answer:
      'Yes. Monthly homeowners insurance is typically part of housing expenses for front-end calculations.',
  },
  {
    question: 'Are HOA fees included?',
    answer:
      'Required HOA or condominium fees are commonly included in housing costs when lenders count them. Optional amenity fees may differ by underwriter.',
  },
  {
    question: 'Are credit card payments included?',
    answer:
      'Minimum monthly credit card payments are typically counted in other debts for the back-end ratio; not as housing.',
  },
  {
    question: 'Are car loan payments included?',
    answer:
      'Yes, recurring auto loan payments usually count toward other monthly debts in the back-end ratio.',
  },
  {
    question: 'Are student loan payments included?',
    answer:
      'Yes, qualifying student loan payments are generally included in other debts. How the payment is calculated can vary by lender rules.',
  },
  {
    question: 'Does the down payment affect the 28/36 rule?',
    answer:
      'Indirectly. A larger down payment can lower the mortgage payment (and thus ratios), but down payment itself is not a line in the 28/36 formulas.',
  },
  {
    question: 'Does my credit score affect mortgage approval?',
    answer:
      'Yes. Credit, income documentation, reserves, and property details all matter. The 28/36 rule alone does not approve or deny a loan.',
  },
  {
    question: 'Can I use household income?',
    answer:
      'Yes: use combined gross monthly household income that would be considered for the mortgage application, consistent with how you report debts.',
  },
  {
    question: 'How do I calculate my maximum housing payment?',
    answer:
      'Under a strict 28% front-end guideline: income × 0.28. Under both guidelines together: min(0.28 × income, 0.36 × income − other debts), floored at zero. Example: $6,000 income → 28% housing = $1,680; 36% total debt = $2,160.',
  },
  {
    question: 'What happens if housing expenses exceed 28%?',
    answer:
      'You are above the traditional front-end guideline. Some lenders may still proceed if overall DTI and other factors are strong; others may require a smaller payment or different product.',
  },
  {
    question: 'What happens if total debt exceeds 36%?',
    answer:
      'You are above the traditional back-end guideline. Reducing other debts, increasing qualifying income, or lowering housing costs can bring the ratio down.',
  },
  {
    question: 'How can I reduce my debt-to-income ratio?',
    answer:
      'Pay down revolving and installment debt, avoid new obligations before applying, increase documented income when eligible, or choose a lower housing payment.',
  },
  {
    question: 'What is the difference between front-end and back-end ratios?',
    answer:
      'Front-end looks only at housing versus income. Back-end looks at housing plus other monthly debts versus income.',
  },
  {
    question: 'Is the 28/36 rule suitable for first-time homebuyers?',
    answer:
      'It is a useful planning tool for first-time buyers, but pair it with full affordability analysis, cash reserves, and lender quotes. It is not a substitute for underwriting.',
  },
];
