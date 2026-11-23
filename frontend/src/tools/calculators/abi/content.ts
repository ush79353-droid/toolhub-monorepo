import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ABI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Ankle-Brachial Index' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'formula', label: 'Formula & Reporting' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'abi-faq', label: 'Frequently Asked Questions' },
];

export const ABI_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a PAD diagnosis?',
    answer:
      'No. It computes the ABI ratio from the pressures you enter. Diagnosis and management belong with a qualified clinician using proper Doppler technique.',
  },
  {
    question: 'How is each leg calculated?',
    answer:
      'ABI = highest foot (pedal) systolic pressure ÷ highest arm (brachial) systolic pressure. Each leg uses the shared higher arm value and its own higher foot value.',
  },
  {
    question: 'What do guideline categories say?',
    answer:
      'ACC/AHA PAD guidance commonly reports ≤0.90 abnormal, 0.91–0.99 borderline, 1.00–1.40 normal, and >1.40 noncompressible. This tool shows the ratio only.',
  },
  {
    question: 'Does Share send my pressures?',
    answer:
      'No. Share/copy uses only the public calculator page URL.',
  },
];
