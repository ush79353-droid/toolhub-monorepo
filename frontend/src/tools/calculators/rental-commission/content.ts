import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RENTAL_COMMISSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rental-commission', label: 'What Is Rental Commission?' },
  { id: 'rental-commission-formulas', label: 'Formulas' },
  { id: 'currency-notes', label: 'Currency Notes' },
  { id: 'rental-commission-faq', label: 'Frequently Asked Questions' },
];

export const RENTAL_COMMISSION_FAQS: readonly FAQItem[] = [
  {
    question: 'How are the preset commission amounts calculated?',
    answer:
      'Preset rows use exact month fractions of monthly rent: ½ month = monthly × 0.5, 1 month = monthly × 1, and 1½ months = monthly × 1.5. The percentages shown in labels (4.17%, 8.33%, 12.5%) are annual-rent approximations for display only and are not used in the math.',
  },
  {
    question: 'How does custom commission work?',
    answer:
      'Custom amount = annual rent × (custom percentage ÷ 100). The percentage is never currency-converted. Enter 0 for a zero commission.',
  },
  {
    question: 'Can I enter annual or monthly rent?',
    answer:
      'Yes. Edit either field and the other is derived: annual = monthly × 12, monthly = annual ÷ 12. The last field you change is the source to avoid circular updates.',
  },
  {
    question: 'Do the PKR selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Mixed currencies are normalized with MongoDB-backed rates before calculating, then results are expressed in each output currency. Percentages are never FX-converted. Stale or missing rates keep the last usable conversion path messaging on the form.',
  },
];
