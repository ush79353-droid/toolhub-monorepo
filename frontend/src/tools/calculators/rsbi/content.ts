import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Yang KL, Tobin MJ. A prospective study of indexes predicting the outcome of trials of weaning from mechanical ventilation. N Engl J Med. 1991;324(21):1445-1450. RSBI = f / VT with VT in liters.';

export const DISCLAIMER =
  'Educational RSBI worksheet only. A single threshold does not equal readiness for extubation. Interpret with clinical context, measurement conditions, and local weaning protocols.';

export const RSBI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'RSBI Calculator - Rapid Shallow Breathing Index' },
  { id: 'rsbi-formula', label: 'RSBI formula – rapid shallow breathing index' },
  { id: 'how-to', label: 'RSBI calculator – how to calculate RSBI?' },
  { id: 'limits', label: 'Limits' },
  { id: 'rsbi-faq', label: 'Frequently Asked Questions' },
];

export const RSBI_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'RSBI = respiratory rate (breaths/min) ÷ tidal volume in liters. Enter tidal volume in mL; the worksheet converts to liters (÷1000) before dividing.',
  },
  {
    question: 'Does RSBI alone mean the patient is ready for extubation?',
    answer:
      'No. Thresholds are educational context only and must not be equated with extubation readiness without bedside assessment and protocol.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Share uses the public page URL only.',
  },
];
