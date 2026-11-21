import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RULE_OF_72_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Rule of 72 Calculator' },
  { id: 'formula', label: 'Formulas' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'notes', label: 'Approximation vs Exact' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'rule-of-72-faq', label: 'Frequently Asked Questions' },
];

export const RULE_OF_72_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Rule of 72?',
    answer:
      'The Rule of 72 is a mental-math shortcut that estimates how many periods it takes for an investment (or other quantity) to double at a constant percentage growth rate: periods ≈ 72 ÷ rate%. It is an approximation, not an exact compound-interest formula.',
  },
  {
    question: 'How do you calculate doubling time with the Rule of 72?',
    answer:
      'Divide 72 by the percent increase per period. Example: at 8% per period, 72 ÷ 8 ≈ 9 periods.',
  },
  {
    question: 'Can I solve for the required growth rate instead?',
    answer:
      'Yes. If you know the target doubling time in periods, the implied approximate rate is 72 ÷ periods. Example: to double in 9 periods, 72 ÷ 9 ≈ 8% per period.',
  },
  {
    question: 'How accurate is the Rule of 72?',
    answer:
      'It is most useful as a quick estimate for moderate rates (roughly mid-single digits to low teens). Exact discrete compounding uses T = ln(2) / ln(1 + r). This calculator shows that exact comparison when the rate allows it.',
  },
  {
    question: 'Does this use currency conversion?',
    answer:
      'No. The Rule of 72 works on percentage rates and periods only. There are no money amounts or foreign-exchange conversions.',
  },
];
