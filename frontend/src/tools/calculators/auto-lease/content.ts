import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AUTO_LEASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-auto-lease-calculator', label: 'What Is This Calculator?' },
  { id: 'auto-lease-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'auto-lease-faq', label: 'Frequently Asked Questions' },
];

export const AUTO_LEASE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between the Total Price and Monthly Payment tabs?',
    answer:
      'Total Price starts from the vehicle price and estimates the tax-inclusive monthly payment. Monthly Payment starts from a target payment and solves for the maximum auto price that fits the same lease assumptions.',
  },
  {
    question: 'How are money factor and APR related?',
    answer:
      'This calculator uses the common retail approximation Money Factor = APR (%) / 2400 (and the reverse). Dealers may quote either form; the finance charge still uses the money-factor formula.',
  },
  {
    question: 'How is sales tax handled?',
    answer:
      'Sales tax is applied to the monthly payment: Payment = Base × (1 + tax/100). Some states tax capitalized cost, residual value, or due-at-signing amounts differently. Treat the tax line as an estimate for the selected assumption only.',
  },
  {
    question: 'What is included in total lease cost?',
    answer:
      'Total lease cost = total of monthly payments + down payment. Trade-in value reduces capitalized cost and is not added again as cash due. Acquisition, registration, and disposition fees are not modeled.',
  },
  {
    question: 'How is this different from Lease Calculator or Car Lease Calculator?',
    answer:
      'Auto Lease Calculator is the auto-specific money-factor tool on slug auto-lease-calculator. Lease Calculator and Car Lease Calculator are separate catalog rows and remain independent.',
  },
];
