import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Educational square-wave mean airway pressure approximation: Pmean = PEEP + k × (PIP − PEEP) × (Ti / Ttot). Frequency mode uses Ttot = 60 / f (seconds). Waveform factor k depends on inspiratory flow pattern.';

export const DISCLAIMER =
  'Educational ventilator worksheet only. It does not set ventilator orders or replace bedside waveform interpretation.';

export const MAP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What is mean airway pressure?' },
  { id: 'inspiratory-time', label: 'How to calculate inspiratory time?' },
  { id: 'formula', label: 'How to calculate mean airway pressure?' },
  { id: 'how-to', label: 'How to use the mean airway pressure calculator?' },
  { id: 'normal', label: 'What is the normal mean airway pressure?' },
  { id: 'map-faq', label: 'Frequently Asked Questions' },
];

export const MAP_FAQS: readonly FAQItem[] = [
  {
    question: 'What formula does this calculator use?',
    answer:
      'Pmean = PEEP + k × (PIP − PEEP) × (Ti / Ttot). In frequency mode, Ttot = 60 / respiratory rate (breaths/min).',
  },
  {
    question: 'What is k?',
    answer:
      'A waveform factor. Square-wave inspiratory flow often uses k = 1; other waveforms may use different educational factors.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Share uses the public page URL only.',
  },
];
