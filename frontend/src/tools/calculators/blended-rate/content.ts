import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BLENDED_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-blended', label: 'What Is a Blended Rate?' },
  { id: 'how-to-calculate', label: 'How to Calculate the Blended Rate' },
  { id: 'formula', label: 'Blended Rate Formula' },
  { id: 'vs-average', label: 'Blended Rate vs. Average Interest Rate' },
  { id: 'samples', label: 'Sample Calculations' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'why-important', label: 'Why Is the Blended Rate Important?' },
  { id: 'mortgages', label: 'Blended Rate for Multiple Mortgages' },
  { id: 'business', label: 'Blended Rate for Business Loans' },
  { id: 'consolidation', label: 'Blended Rate and Debt Consolidation' },
  { id: 'vs-refi', label: 'Blended Rate vs. Refinancing Rate' },
  { id: 'balances-effect', label: 'How Loan Balances Affect the Rate' },
  { id: 'rates-effect', label: 'How Rate Changes Affect the Blend' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'br-faq', label: 'Frequently Asked Questions' },
];

export const BLENDED_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a blended interest rate?',
    answer:
      'A balance-weighted average of the annual interest rates on multiple loans or balances. Larger principals influence the result more than smaller ones.',
  },
  {
    question: 'How do I calculate a blended rate?',
    answer:
      'Multiply each balance by its rate, add those products, then divide by the total of all balances: R = Σ(B×R) / Σ(B).',
  },
  {
    question: 'What is the blended rate formula?',
    answer:
      'R_blended = (B₁R₁ + B₂R₂ + … + BₙRₙ) / (B₁ + B₂ + … + Bₙ), with rates in percent if balances are in the same units.',
  },
  {
    question: 'Is a blended rate the same as an average interest rate?',
    answer:
      'No. A simple average of rates ignores balance sizes. The blended rate weights each rate by its principal.',
  },
  {
    question: 'How do loan balances affect the blended rate?',
    answer:
      'A larger balance pulls the blended rate toward that loan’s rate. Equal balances make the blend equal to the arithmetic mean of the rates.',
  },
  {
    question: 'Can I calculate a blended rate for three loans?',
    answer:
      'Yes. Sum all balance×rate products and divide by the sum of balances. This calculator supports many loans.',
  },
  {
    question: 'Can a blended rate include more than three loans?',
    answer:
      'Yes. Add as many amortization sections as you need (up to the calculator’s limit).',
  },
  {
    question: 'Can the blended rate be lower than all the individual rates?',
    answer:
      'No. With non-negative balances it lies between the lowest and highest component rates (inclusive).',
  },
  {
    question: 'Can the blended rate be higher than the highest individual rate?',
    answer:
      'No, not when balances are positive and rates are the ones being averaged.',
  },
  {
    question: 'What happens if one loan has a 0% interest rate?',
    answer:
      'It still contributes to total balance but adds zero to the weighted rate sum, which lowers the blend relative to the other rates.',
  },
  {
    question: 'How is a blended rate used in mortgage calculations?',
    answer:
      'It summarizes the overall interest rate across multiple mortgage balances with different rates, useful for portfolio context, not a replacement for amortization schedules.',
  },
  {
    question: 'What is a blended mortgage rate?',
    answer:
      'Often the same idea: a weighted average of mortgage rates by outstanding principal. Lender “blend-and-extend” products may use different contractual formulas.',
  },
  {
    question: 'How is a blended rate used in debt consolidation?',
    answer:
      'It can serve as a baseline for the average cost of existing debts before comparing a consolidation offer’s rate, fees, and term.',
  },
  {
    question: 'Does a blended rate include loan fees?',
    answer:
      'Not in this calculator. Fees, points, and APR adjustments are separate from the principal-weighted rate average.',
  },
  {
    question: 'Does a blended rate calculate monthly payments?',
    answer:
      'No. It averages rates. Payment estimates need term, amortization method, and fees, use a loan or amortization calculator for that.',
  },
  {
    question: 'Can a blended rate change over time?',
    answer:
      'Yes. As balances amortize at different speeds, or rates reset, the weighted average shifts.',
  },
  {
    question: 'What is the difference between a blended rate and APR?',
    answer:
      'APR reflects the cost of a specific credit product including certain finance charges. A blended rate only averages stated rates by balance across multiple loans.',
  },
  {
    question: 'Can I use a blended rate to compare refinancing offers?',
    answer:
      'As a rough baseline for your current weighted cost, Yes: but also compare fees, term, cash flow, and APR of the new loan.',
  },
  {
    question: 'How do I calculate annual interest from a blended rate?',
    answer:
      'Approximate annual interest ≈ total balance × blended rate / 100 if balances stayed constant for a year. Real interest depends on payments and compounding.',
  },
  {
    question: 'What is the blended rate of $10,000 at 10% and $200 at 5%?',
    answer:
      'R = (10000×10 + 200×5) / 10200 = 101000 / 10200 ≈ 9.90%.',
  },
];
