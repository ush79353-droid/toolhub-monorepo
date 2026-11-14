import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LABOR_COST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-labor-cost', label: 'What Is Labor Cost?' },
  { id: 'labor-cost-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'labor-cost-faq', label: 'Frequently Asked Questions' },
];

export const LABOR_COST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is gross pay calculated?',
    answer: 'Gross hours per year = weekly hours × 52. Gross pay = gross hours per year × hourly pay rate.',
  },
  {
    question: 'How are net hours worked calculated?',
    answer:
      'Hours not worked = absent days × (weekly hours ÷ 5). Net hours = gross hours per year − hours not worked.',
  },
  {
    question: 'What are additional annual costs?',
    answer:
      'Optional employer costs such as taxes, insurance, benefits, overtime, and supplies. They are added to gross pay for annual payroll labor cost.',
  },
  {
    question: 'How is hourly labor cost calculated?',
    answer:
      'Hourly labor cost = annual payroll labor cost ÷ net hours worked. If net hours are zero or negative, the hourly rate stays blank.',
  },
  {
    question: 'How is labor cost percentage calculated?',
    answer:
      'Open the Labor cost percentage section and enter revenue. Percentage = (annual payroll labor cost ÷ revenue) × 100.',
  },
];
