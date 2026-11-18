import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AFTER_TAX_COST_OF_DEBT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-after-tax-cost-of-debt', label: 'What Is After-Tax Cost of Debt?' },
  { id: 'after-tax-cost-of-debt-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'after-tax-cost-of-debt-faq', label: 'Frequently Asked Questions' },
];

export const AFTER_TAX_COST_OF_DEBT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the marginal corporate tax rate calculated?',
    answer:
      'From incomes: Marginal Tax Rate (%) = (1 − Net Income / Pre-tax Income) × 100. Mixed-currency incomes are normalized into the net-income currency first. This estimates an effective tax rate from the income statement; it is not necessarily the firm’s statutory marginal corporate tax bracket. You can also enter the tax rate manually.',
  },
  {
    question: 'How is the after-tax cost of debt calculated?',
    answer:
      'After-tax Cost of Debt (%) = Cost of Debt (%) × (1 − Tax Rate (%) / 100). Interest is typically tax-deductible, so the effective borrowing cost is lower than the before-tax yield.',
  },
  {
    question: 'Does changing currency convert the amounts?',
    answer:
      'Yes. Net income and pre-tax income each have their own currency. Changing a currency converts that money amount using stored MongoDB rates. The tax rate and after-tax cost of debt percentages stay the same for a given real income pair and cost of debt. Percentages are never converted.',
  },
  {
    question: 'What if pre-tax income is zero?',
    answer:
      'The income-based tax-rate formula divides by pre-tax income, so zero pre-tax income cannot derive a rate. Enter a non-zero pre-tax income, or type the tax rate manually and provide the cost of debt.',
  },
];
