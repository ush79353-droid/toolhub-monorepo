import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRESCRIPTION_REFILL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Prescription Refill Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formula', label: 'Date Arithmetic' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'prescription-refill-faq', label: 'Frequently Asked Questions' },
];

export const PRESCRIPTION_REFILL_FAQS: readonly FAQItem[] = [
  {
    question: 'How are days supplied calculated?',
    answer:
      'Days supplied = dispensed quantity ÷ units taken per day on a fixed schedule. Example: 30 tablets at 1 per day → 30 days.',
  },
  {
    question: 'What is the last covered day vs next supply date?',
    answer:
      'Last covered day is fill date + days supplied − 1 (the final calendar day the supply is expected to last). Next supply date is fill date + days supplied — the day after the last covered day.',
  },
  {
    question: 'Does this work for PRN (as-needed) prescriptions?',
    answer:
      'No. PRN use has no fixed daily rate, so days supplied and refill dates cannot be projected from quantity alone. Use only fixed prescribed schedules.',
  },
  {
    question: 'What about partial days?',
    answer:
      'This educational tool requires a whole number of supply days (quantity must divide evenly by units per day). Fractional days are rejected rather than guessed.',
  },
  {
    question: 'Can I share my prescription details in the link?',
    answer:
      'No. Share uses the public tool page URL only — fill dates and quantities stay in your browser.',
  },
  {
    question: 'Is this medical or pharmacy advice?',
    answer:
      'No. It is an educational date worksheet. Pharmacy, insurer, and controlled-substance refill rules can differ — confirm with your pharmacist.',
  },
];
