import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORATORIUM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Moratorium Calculator' },
  { id: 'what-is-moratorium', label: 'What Is a Moratorium Period?' },
  { id: 'what-is-calculator', label: 'What Is a Loan Moratorium Calculator?' },
  { id: 'how-it-works', label: 'How Does a Loan Moratorium Work?' },
  { id: 'interest', label: 'How to Calculate Moratorium Interest' },
  { id: 'capitalized', label: 'What Is Capitalized Interest?' },
  { id: 'types', label: 'Types of Loan Moratorium' },
  { id: 'emi-impact', label: 'How Does a Moratorium Affect EMI?' },
  { id: 'vs-restructuring', label: 'Moratorium vs. Restructuring' },
  { id: 'emi-after', label: 'How to Calculate EMI After Moratorium' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'pros-cons', label: 'Advantages and Disadvantages' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'moratorium-faq', label: 'Frequently Asked Questions' },
];

export const MORATORIUM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a loan moratorium?',
    answer:
      'A temporary pause or reduction of scheduled principal (and sometimes interest) repayments under agreed terms. Interest often continues to accrue unless the lender states otherwise.',
  },
  {
    question: 'What is an EMI moratorium?',
    answer:
      'A moratorium applied to equated monthly installments—typically deferring principal repayments for a set number of months while the loan remains outstanding.',
  },
  {
    question: 'Does interest accrue during a moratorium?',
    answer:
      'Usually yes. This calculator models either capitalization into principal or monthly interest-only payments. Actual lender contracts may differ.',
  },
  {
    question: 'How do I calculate moratorium interest?',
    answer:
      'For monthly compounding with no payments: B_m = P(1+r)^m and interest = B_m − P. For interest-only: pay P×r each month while principal stays P.',
  },
  {
    question: 'What happens to EMI after the moratorium?',
    answer:
      'Depending on the plan, EMI may rise to keep the original maturity, be recalculated on an extended term, or stay the same with a longer tenure.',
  },
  {
    question: 'Does a loan moratorium increase total interest?',
    answer:
      'Often yes, because the balance stays higher for longer or grows via capitalization. Compare original vs revised total interest in the summary.',
  },
  {
    question: 'What is capitalized interest?',
    answer:
      'Interest added to the outstanding principal so future EMIs are calculated on a larger balance.',
  },
  {
    question: 'Can interest be paid during the moratorium?',
    answer:
      'Yes. The interest-only option models paying monthly interest while postponing principal. Confirm whether your lender allows this.',
  },
  {
    question: 'Can I keep the same EMI after a moratorium?',
    answer:
      'Use Same payment – extended term. If EMI ≤ monthly interest on the post-moratorium balance, amortization is impossible under a positive rate.',
  },
  {
    question: 'Can I extend my loan tenure?',
    answer:
      'Yes via the extended-term plans. The calculator estimates a new maturity date based on remaining payments after the moratorium.',
  },
  {
    question: 'Does a moratorium reduce loan principal?',
    answer:
      'Not by itself. Principal falls only when principal portions of payments are made. Capitalization can increase principal.',
  },
  {
    question: 'What is the difference between deferment and forgiveness?',
    answer:
      'Deferment postpones payment obligations; forgiveness cancels debt. Moratoriums are typically deferments, not write-offs.',
  },
  {
    question: 'How is EMI recalculated after a moratorium?',
    answer:
      'Using the standard amortizing formula on the post-moratorium balance over the remaining (or extended) number of months.',
  },
  {
    question: 'Can a moratorium be applied to a home loan?',
    answer:
      'Many mortgage products have offered deferment options historically, but eligibility and interest treatment depend on the lender and regulations.',
  },
  {
    question: 'Can a moratorium be applied to a personal loan?',
    answer:
      'Possibly under lender policy. Model the cash-flow impact here, then verify the actual offer documents.',
  },
  {
    question: 'Does a moratorium affect the maturity date?',
    answer:
      'Same-term plans keep the original maturity (with higher EMI). Extended-term plans push maturity later.',
  },
  {
    question: 'What happens if the moratorium extends beyond loan maturity?',
    answer:
      'Same-term restructuring then has no remaining periods and cannot produce a standard EMI. Choose an extended-term plan or balloon arrangement.',
  },
  {
    question: 'Can a moratorium increase the monthly payment?',
    answer:
      'Yes—especially when keeping the original maturity after capitalization.',
  },
  {
    question: 'What is the difference between capitalized and non-capitalized interest?',
    answer:
      'Capitalized interest joins the principal. Non-capitalized interest-only payments settle interest monthly without growing principal under the standard model.',
  },
  {
    question: 'Does a moratorium affect credit scores?',
    answer:
      'Reporting depends on jurisdiction and whether the arrangement is coded as deferred or delinquent. This tool does not score credit.',
  },
  {
    question: 'Is a moratorium always beneficial?',
    answer:
      'It can ease short-term cash flow but often raises lifetime interest. Compare additional financing cost before deciding.',
  },
  {
    question: 'How can I calculate the total additional interest?',
    answer:
      'This calculator subtracts original-schedule interest from revised-schedule interest (including moratorium accruals/payments).',
  },
  {
    question: 'What happens if interest rates change during the moratorium?',
    answer:
      'This model assumes a fixed nominal rate. Floating-rate resets require recalculating with the new rate.',
  },
  {
    question: 'Can I make partial payments during a moratorium?',
    answer:
      'Some lenders allow it. The base model uses either zero principal payments (capitalized) or interest-only; partial principal is not auto-modeled.',
  },
  {
    question: 'How accurate is a moratorium calculator?',
    answer:
      'It is accurate for the disclosed formulas and assumptions. Real loans may add fees, day-count conventions, or different capitalization rules.',
  },
];
