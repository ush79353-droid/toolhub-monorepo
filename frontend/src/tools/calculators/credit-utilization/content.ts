import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREDIT_UTILIZATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cu', label: 'What Is Credit Utilization?' },
  { id: 'benefits', label: 'Benefits of Knowing Your Ratio' },
  { id: 'formula', label: 'Credit Utilization Formula' },
  { id: 'example', label: 'Credit Card Utilization Example' },
  { id: 'multiple-cards', label: 'Utilization for Multiple Cards' },
  { id: 'scores', label: 'How Utilization Can Affect Scores' },
  { id: 'good-ratio', label: 'What Is a Good Ratio?' },
  { id: 'reduce', label: 'How to Reduce Utilization' },
  { id: 'vs-dti', label: 'Utilization vs. Debt-to-Income' },
  { id: 'per-card', label: 'Per-Card vs. Overall Utilization' },
  { id: 'over-100', label: 'When Utilization Exceeds 100%' },
  { id: 'limit-increase', label: 'Does a Limit Increase Help?' },
  { id: 'how-often', label: 'How Often Does It Change?' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'cu-faq', label: 'Frequently Asked Questions' },
];

export const CREDIT_UTILIZATION_FAQS: readonly FAQItem[] = [
  {
    question:
      'What is my credit utilization if I use $500 with a limit of $2,000?',
    answer:
      '500 ÷ 2,000 × 100 = 25%. That is one revolving line; with multiple cards, add all balances and all limits first, then divide.',
  },
  {
    question: 'How does the credit utilization ratio affect my credit score?',
    answer:
      'Many scoring models treat revolving utilization as one of several factors. Higher reported balances relative to limits can weigh against a score, but no calculator can promise a specific point change.',
  },
  {
    question: 'Is a low credit utilization ratio always good?',
    answer:
      'Lower revolving utilization is generally viewed favorably, yet creditworthiness also depends on payment history, credit mix, inquiries, age of accounts, and other profile details.',
  },
  {
    question: 'How do I calculate credit utilization across all my credit cards?',
    answer:
      'Sum every revolving balance, sum every revolving limit, then CU = total used ÷ total limit × 100. Do not average the individual card percentages.',
  },
  {
    question: 'What happens if my credit utilization exceeds 100%?',
    answer:
      'Balances above total limits produce utilization over 100%. This calculator shows the true percentage and the over-limit amount instead of capping at 100%.',
  },
  {
    question: 'Is 30% credit utilization good?',
    answer:
      '30% is a common rule of thumb, not a universal scoring cutoff. Many people aim lower when possible; lenders and models differ.',
  },
  {
    question: 'Is 0% credit utilization possible?',
    answer:
      'Yes, if the revolving balances that are reported are zero. Some people still keep a small active balance for other reasons; this tool only measures math, not strategy.',
  },
  {
    question: 'Does paying off a credit card reduce utilization?',
    answer:
      'Reducing the outstanding revolving balance lowers the numerator (total used) and therefore can lower utilization once that balance is reflected in the calculation or on a credit report.',
  },
  {
    question: 'Does increasing a credit limit reduce utilization?',
    answer:
      'If balances stay the same, a higher limit increases the denominator and can lower the ratio. Limit increases depend on lender approval and may have other credit implications.',
  },
  {
    question: 'Does closing a credit card affect utilization?',
    answer:
      'Closing a revolving account can remove its limit from available credit. If balances remain, overall utilization may rise. Exact reporting depends on how accounts are treated.',
  },
  {
    question: 'What is the difference between per-card and overall utilization?',
    answer:
      'Per-card utilization is each balance ÷ that card’s limit. Overall utilization uses the sum of balances ÷ the sum of limits. A maxed-out small card can coexist with a low overall ratio.',
  },
  {
    question: 'Can credit utilization be negative?',
    answer:
      'Under the standard nonnegative-balance formula, utilization is not negative. Available credit can be negative when balances exceed limits (over-limit).',
  },
  {
    question: 'What is a high credit utilization rate?',
    answer:
      'Using a large share of revolving limits is often described as high utilization. There is no single official cutoff that every scoring model uses.',
  },
  {
    question: 'How can I calculate the payment needed to reach 30% utilization?',
    answer:
      'Target used = 0.30 × total limit. Required reduction = max(0, current used − target used). That is a balance target, not a guaranteed score outcome.',
  },
  {
    question: 'Does the credit utilization ratio include mortgages?',
    answer:
      'Standard revolving utilization focuses on revolving accounts such as credit cards and lines of credit, not installment mortgages.',
  },
  {
    question: 'Does credit utilization include personal loans?',
    answer:
      'Installment personal loans are generally treated differently from revolving utilization. This calculator is for revolving balances and limits.',
  },
  {
    question: 'How often should I check my utilization?',
    answer:
      'Many people review balances monthly or before large applications. Reported utilization can lag behind your current statement balance.',
  },
  {
    question: 'Does credit utilization affect all scoring models equally?',
    answer:
      'No. Different models and lenders weigh revolving utilization differently, and not every account appears on every report.',
  },
];
