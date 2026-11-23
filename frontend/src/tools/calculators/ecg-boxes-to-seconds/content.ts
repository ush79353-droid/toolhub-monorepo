import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ECG_BOXES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'ECG Boxes to Seconds Calculator' },
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'formula', label: 'Formula and Paper Standards' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Examples' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ecg-boxes-faq', label: 'Frequently Asked Questions' },
];

export const ECG_BOXES_FAQS: readonly FAQItem[] = [
  {
    question: 'How do ECG boxes convert to seconds?',
    answer:
      'On standard ECG paper, time = (number of boxes × box width in mm) ÷ paper speed in mm/s. Small boxes are 1 mm wide; big boxes are 5 mm (five small boxes). At 25 mm/s, one small box is 0.04 s and one big box is 0.20 s.',
  },
  {
    question: 'What paper speeds are supported?',
    answer:
      '25 mm/s (default, most adult ECGs) and 50 mm/s. At 50 mm/s, one small box is 0.02 s and one big box is 0.10 s.',
  },
  {
    question: 'Can I change the duration unit?',
    answer:
      'Yes. Choose sec, ms, or min. The calculator keeps the same physical interval and only reformats the display (for example 0.04 sec = 40 ms).',
  },
  {
    question: 'Does this measure heart rate?',
    answer:
      'No. This tool only converts a counted grid span into time. Heart-rate estimation from R–R intervals is a separate calculator.',
  },
  {
    question: 'Are my measurements stored?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public tool page URL only—never box counts or durations.',
  },
];
