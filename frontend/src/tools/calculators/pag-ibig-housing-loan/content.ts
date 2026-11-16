import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAG_IBIG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pag-ibig', label: 'What Is a Pag-IBIG Housing Loan?' },
  { id: 'pag-ibig-formula', label: 'What This Calculator Computes' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'pag-ibig-faq', label: 'Frequently Asked Questions' },
];

export const PAG_IBIG_FAQS: readonly FAQItem[] = [
  {
    question: 'Is 9.750% the current official Pag-IBIG rate?',
    answer:
      'No claim is made. The calculator preserves the screenshot option “30 years (9.750%)” as a fixed-pricing example for principal-and-interest math. Official circular rates must come from Pag-IBIG Fund publications.',
  },
  {
    question: 'Why is loanable amount blank?',
    answer:
      'Property-based Pag-IBIG loanable limits depend on official program brackets. This repository has no verified LTV schedule, so no percentage was invented.',
  },
  {
    question: 'Why is monthly insurance blank?',
    answer:
      'The reference does not disclose MRI, fire, or other premium formulas. Without a verified rate or editable-premium confirmation, the field stays unavailable instead of showing a fabricated zero.',
  },
  {
    question: 'What happens when “Show other calculated values” is Yes?',
    answer:
      'The screenshot does not reveal the expanded fields, and no project specification lists them. Selecting Yes shows that limitation instead of inventing affordability or eligibility cards.',
  },
];
