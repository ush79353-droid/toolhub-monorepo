import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_TAXES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mortgage-taxes-insurance', label: 'What Is a Mortgage with Taxes & Insurance?' },
  { id: 'mortgage-taxes-insurance-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mortgage-taxes-insurance-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_TAXES_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the loan amount calculated?',
    answer:
      'Loan amount = Home value − Down payment. The down payment percentage is Down payment ÷ Home value × 100. Editing either the amount or the percentage updates the other without circular loops.',
  },
  {
    question: 'What interest calculation methods are supported?',
    answer:
      'Monthly (US & UK) uses the nominal annual rate divided by the payment frequency. Semi-annually (Canada) compounds twice per year and converts that into an effective period rate for your payment schedule.',
  },
  {
    question: 'When does PMI stop?',
    answer:
      'When the starting loan-to-value is above 80%, periodic PMI is charged while the post-payment balance still exceeds 80% of the original home value. The default annual PMI rate is 0.5% of the original loan.',
  },
  {
    question: 'How are property tax and homeowners insurance handled?',
    answer:
      'Under Further specifications, annual property tax (% of home value) and annual homeowners insurance (money) convert to per-payment amounts. They are included in total payment with additional costs and the Other costs pie slice. They are not added into the Payment (P&I) field and are not double-counted as interest.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Monetary fields use stored FX rates. Values are normalized into the home-value currency before amortization. Percentages, term, and dates are never converted.',
  },
];
