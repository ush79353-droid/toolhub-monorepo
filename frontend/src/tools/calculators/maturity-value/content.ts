import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Maturity Value?' },
  { id: 'formula', label: 'Maturity Value Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Maturity Value' },
  { id: 'compound-vs-simple', label: 'Compound Interest vs Simple Interest' },
  { id: 'factors', label: 'Factors Affecting Maturity Value' },
  { id: 'duration-matters', label: 'Why Investment Duration Matters' },
  { id: 'where-used', label: 'Where Maturity Value Calculations Are Used' },
  { id: 'limitations', label: 'Limitations of a Basic Maturity Value Calculator' },
  { id: 'mv-faq', label: 'Frequently Asked Questions' },
];

export const MV_FAQS: readonly FAQItem[] = [
  {
    question: 'Can the maturity value be negative?',
    answer:
      'Under the standard model with a nonnegative principal and nonnegative interest rate, maturity value cannot be negative. It is at least the principal when the rate and time are nonnegative.',
  },
  {
    question: 'How do I find the maturity value?',
    answer:
      'Enter principal, annual interest rate (%), and investment duration. This calculator uses MV = P × (1 + r)^t with annual compounding, where r is the decimal rate and t is years.',
  },
  {
    question:
      'What is the maturity value of a $1,000 one-year investment at 5% interest?',
    answer: 'MV = 1,000 × (1.05)^1 = $1,050.',
  },
  {
    question: 'What is the interest rate in a bond investment?',
    answer:
      'Bonds often quote a coupon rate (periodic interest relative to face value) and trade at a yield that reflects price and remaining cash flows. Coupon rate and yield are related but not always interchangeable with a simple maturity-value rate.',
  },
  {
    question: 'Is maturity value the same as future value?',
    answer:
      'They are closely related. Future value is the general term for an amount grown forward in time. Maturity value usually means the amount available or payable when a specific investment reaches maturity.',
  },
  {
    question: 'What is the difference between maturity value and principal?',
    answer:
      'Principal is the starting amount. Maturity value is principal plus accumulated interest (under this compound model). Interest earned = maturity value − principal.',
  },
  {
    question: 'How does compounding affect maturity value?',
    answer:
      'Compounding applies interest to previously earned interest. Over longer periods, compound growth rises faster than simple interest at the same stated annual rate.',
  },
  {
    question: 'How do you calculate maturity value for monthly compounding?',
    answer:
      'A common generalization is MV = P × (1 + r/n)^(n×t), where n is compounding periods per year (12 for monthly). This calculator defaults to annual compounding (n = 1).',
  },
  {
    question: 'What happens when the interest rate is zero?',
    answer: 'Maturity value equals the principal for any nonnegative duration.',
  },
  {
    question: 'Can the maturity value be lower than the principal?',
    answer:
      'Not under this nonnegative-rate model. Real investments can lose value through fees, taxes, negative returns, or credit events that this simple calculator does not model.',
  },
];
