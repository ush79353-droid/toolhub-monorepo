import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DOL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ol', label: 'What Is Operating Leverage?' },
  { id: 'dol-formula', label: 'Degree of Operating Leverage Formula' },
  { id: 'cm-formula', label: 'Contribution Margin Formula for DOL' },
  { id: 'what-dol-says', label: 'What Does Degree of Operating Leverage Say?' },
  { id: 'vs-financial', label: 'Operating Leverage vs Financial Leverage' },
  { id: 'how-to-calculate', label: 'How to Calculate Degree of Operating Leverage' },
  { id: 'worked-example', label: 'Operating Leverage Calculation Example' },
  { id: 'fixed-costs', label: 'How Fixed Costs Affect Operating Leverage' },
  { id: 'advantages', label: 'Advantages of Operating Leverage' },
  { id: 'disadvantages', label: 'Disadvantages of Operating Leverage' },
  { id: 'vs-cm', label: 'DOL vs Contribution Margin' },
  { id: 'mistakes', label: 'Common DOL Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of Degree of Operating Leverage' },
  { id: 'dol-faq', label: 'Frequently Asked Questions' },
];

export const DOL_FAQS: readonly FAQItem[] = [
  {
    question: 'What is degree of operating leverage?',
    answer:
      'DOL measures how sensitive operating earnings (EBIT) are to changes in sales, given the operating cost structure or observed period percentage changes.',
  },
  {
    question: 'How do I calculate DOL?',
    answer:
      'Period method: DOL = %ΔEBIT / %ΔSales. Contribution-margin method: DOL = CM / EBIT under linear CVP assumptions.',
  },
  {
    question: 'What does DOL of 3 mean?',
    answer:
      'Under the stated assumptions, a 1% sales change corresponds to approximately a 3% EBIT change for small moves around the relevant operating level.',
  },
  {
    question: 'Can DOL be negative?',
    answer:
      'Yes. Observed opposite-direction sales and EBIT changes produce a negative coefficient. Negative EBIT with positive contribution margin can also yield a signed negative DOL that needs careful interpretation.',
  },
  {
    question: 'Can DOL equal zero?',
    answer:
      'Yes, when EBIT percentage change is zero and sales percentage change is nonzero.',
  },
  {
    question: 'What happens when sales do not change?',
    answer:
      'The sales-change denominator is zero, so DOL is undefined. This calculator does not show Infinity.',
  },
  {
    question: 'What is the difference between operating leverage and financial leverage?',
    answer:
      'Operating leverage concerns EBIT sensitivity to sales from the operating cost structure. Financial leverage concerns earnings sensitivity to financing costs.',
  },
  {
    question: 'What is the contribution margin method for DOL?',
    answer:
      'DOL = CM / EBIT, where CM = Sales − Variable costs and EBIT = CM − Fixed operating costs, under linear CVP assumptions.',
  },
  {
    question: 'Does high DOL always mean high profitability?',
    answer:
      'No. High DOL means high sensitivity. Profitability still depends on sales levels, margins, and many other factors.',
  },
  {
    question: 'Why is DOL higher near break-even?',
    answer:
      'Near break-even, EBIT is small, so CM / EBIT (or observed ratios) can become very large even for modest sales changes.',
  },
  {
    question: 'How do I calculate EBIT percentage change?',
    answer:
      '%ΔEBIT = (EBIT₂ − EBIT₁) / EBIT₁ × 100 when starting EBIT is nonzero. A zero base makes the percentage undefined.',
  },
  {
    question: 'What is DOL when sales increase by 10% and EBIT increases by 25%?',
    answer: 'DOL = 25 / 10 = 2.50.',
  },
  {
    question: 'What is DOL when sales decline by 5% and EBIT declines by 20%?',
    answer: 'DOL = −20 / −5 = 4.00.',
  },
  {
    question: 'What is the difference between high and low operating leverage?',
    answer:
      'Higher DOL typically reflects greater fixed operating costs relative to variable costs and stronger EBIT sensitivity to sales; lower DOL reflects the opposite — context still matters.',
  },
  {
    question: 'Can two businesses with the same revenue have different DOL values?',
    answer:
      'Yes. Different mixes of fixed and variable operating costs produce different operating leverage at the same revenue.',
  },
];
