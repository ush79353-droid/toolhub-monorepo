import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COMMERCIAL_LEASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-commercial-lease', label: 'What Is This Calculator?' },
  { id: 'commercial-lease-formulas', label: 'Formulas' },
  { id: 'currency-and-units', label: 'Currency & Units' },
  { id: 'commercial-lease-faq', label: 'Frequently Asked Questions' },
];

export const COMMERCIAL_LEASE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total rental rate calculated?',
    answer:
      'Total rental rate = base rental rate + operating expenses after both are normalized to the same currency, area unit, and yearly period. Expenses are not double-counted.',
  },
  {
    question: 'How is rent calculated from area?',
    answer:
      'Annual rent = total rental rate per square metre per year × area in square metres. Changing the rent period selector only rescales the displayed rent (yearly ↔ monthly); it does not invent escalations.',
  },
  {
    question: 'How is the rental agent’s fee calculated?',
    answer:
      'Total fee = annual rent × equivalent years of rent × agent percentage ÷ 100. A 0% agent fee is allowed. Area units and percentages are never FX-converted.',
  },
  {
    question: 'Do the PKR selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Mixed currencies are normalized with MongoDB-backed rates before calculating, then results are shown in each output currency. Stale or missing rates surface a conversion warning instead of inventing rates.',
  },
];
