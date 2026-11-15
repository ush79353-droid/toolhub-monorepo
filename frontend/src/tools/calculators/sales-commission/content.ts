import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SALES_COMMISSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-sales-commission', label: 'What Sales Commission Means' },
  { id: 'commission-bases', label: 'Commission Bases' },
  { id: 'margin-and-base-pay', label: 'Gross Margin and Base Pay Target' },
  { id: 'profit-metrics', label: 'Profit and Margin Metrics' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'sales-commission-faq', label: 'Frequently Asked Questions' },
];

export const SALES_COMMISSION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a sales commission?',
    answer:
      'A sales commission is variable pay tied to a defined base—such as gross sales, profit after selected costs, or sales above a threshold. It is added to base salary for the period modeled here.',
  },
  {
    question: 'How is the gross-margin and base-pay threshold calculated?',
    answer:
      'Threshold H = (base salary × margin target) ÷ (base-pay target × actual gross-margin rate), with rates as decimals. Commission applies only to sales above that threshold. This matches the combined-target convention used by common sales-commission references.',
  },
  {
    question: 'What is total labor cost or OTE?',
    answer:
      'Total labor cost here is base salary plus the modeled commission. Calling that figure on-target earnings (OTE) is only accurate when the entered sales represent the plan’s target performance.',
  },
  {
    question: 'Are discounts counted twice?',
    answer:
      'No. Discount is revenue × discount rate and enters operational cost once. Gross sales margin is gross profit minus discount and selling expenses, before labor.',
  },
  {
    question: 'Does changing currency convert amounts?',
    answer:
      'No. The currency selector changes the symbol and grouping only. Enter every money field in one currency.',
  },
];
