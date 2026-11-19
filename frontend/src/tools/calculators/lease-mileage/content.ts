import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LEASE_MILEAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-lease-mileage', label: 'What Is This Calculator?' },
  { id: 'lease-mileage-formulas', label: 'Formulas' },
  { id: 'lease-mileage-units', label: 'Distance & Currency' },
  { id: 'lease-mileage-faq', label: 'Frequently Asked Questions' },
];

export const LEASE_MILEAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is excess mileage predicted?',
    answer:
      'The tool assumes you continue driving at your historical average rate: estimated annual rate = current distance × 12 ÷ elapsed months. Predicted total distance scales that rate over the full lease term. Allowed distance is annual allowance × total months ÷ 12. Excess is max(0, predicted total − allowed).',
  },
  {
    question: 'What if the lease just started?',
    answer:
      'If remaining time equals the full term (nothing has elapsed), the projection divides by zero. The calculator shows that an estimate is unavailable until some lease time has passed and current miles are recorded.',
  },
  {
    question: 'How do km/mi and currencies work?',
    answer:
      'Distance fields convert with the international mile (1 mi = 1.609344 km). The excess fee’s / km or / mi unit is normalized before multiplying. Money fields use stored Phase 2 FX rates; distance and months are never FX-converted.',
  },
];
