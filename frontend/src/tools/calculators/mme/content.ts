import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MME_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'MME Calculator' },
  { id: 'cdc-factors', label: 'CDC 2022 conversion factors' },
  { id: 'mme-faq', label: 'Frequently Asked Questions' },
];

export const MME_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'Educational morphine milligram equivalents (MME) per day using the CDC 2022 Clinical Practice Guideline conversion table: MME/day = daily dose × factor. Fentanyl transdermal uses mcg/hr × 2.4. It is not a tool for choosing a replacement opioid dose.',
  },
  {
    question: 'Which opioids are included?',
    answer:
      'Only agents with a published CDC 2022 table factor: codeine, fentanyl transdermal, hydrocodone, hydromorphone, methadone, morphine, oxycodone, oxymorphone, tapentadol, and tramadol. Buprenorphine and other formulations without a CDC table factor are omitted on purpose.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Opioid and dose stay in the browser. Share copies only the public calculator page URL — never clinical inputs.',
  },
];
