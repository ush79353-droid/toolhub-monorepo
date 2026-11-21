import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WAGE_TO_SALARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-wage-to-salary', label: 'What Is Wage to Salary Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'wage-conversion-formulas', label: 'Wage Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'wage-to-salary-faq', label: 'Frequently Asked Questions' },
];

export const WAGE_TO_SALARY_FAQS: readonly FAQItem[] = [
  {
    question: 'Which wage field should I fill in?',
    answer:
      'Enter any one of hourly, daily, or weekly wage. The last field you edit is authoritative. The other wage inputs sync from that source so calculations stay non-circular.',
  },
  {
    question: 'How are monthly and yearly salary calculated?',
    answer:
      'First compute weekly wage from the authoritative input (hourly × hours/week, daily × days/week, or the weekly amount itself). Yearly = weekly × 52. Monthly = weekly × 52 ÷ 12. The 52-week year is disclosed on the page.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each wage input and each salary result has an independent currency. Math runs in the authoritative wage currency at full precision; other amounts convert for display. Hours and days per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Hourly to Annual Salary or Salary to Hourly?',
    answer:
      'No. Those tools focus on hourly↔annual (and related period) conversions. This calculator accepts hourly, daily, or weekly wage and returns monthly and yearly salary only — no taxes, overtime, or bonuses.',
  },
];
