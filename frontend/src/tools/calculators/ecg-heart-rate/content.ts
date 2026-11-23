import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ECG_HR_SOURCE_NOTE =
  'BPM = 60 / (R–R distance_mm ÷ paper speed mm/s). Small box = 1 mm; big box = 5 mm. Becker DE. Anesth Prog. 2006; standard ECG paper teaching conventions.';

export const ECG_HR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'ECG Heart Rate Calculator' },
  { id: 'formula', label: 'How BPM Is Calculated' },
  { id: 'boxes', label: 'Millimeters vs Boxes' },
  { id: 'irregular', label: 'Irregular Rhythms' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ecg-hr-faq', label: 'Frequently Asked Questions' },
];

export const ECG_HR_FAQS: readonly FAQItem[] = [
  {
    question: 'How does this ECG heart rate calculator work?',
    answer:
      'It converts an R–R distance on the strip into seconds using the selected paper speed, then computes BPM = 60 ÷ seconds. You can enter millimeters (or seconds/milliseconds) or count small/big boxes; the fields stay synchronized.',
  },
  {
    question: 'What is the difference between small and big boxes?',
    answer:
      'On standard ECG paper a small (fine) box is 1 mm wide and a big (bold) box is 5 mm wide. Four big boxes equal 20 mm.',
  },
  {
    question: 'Why can I choose mm, s, or ms for the R–R interval?',
    answer:
      'Millimeters are physical distance on the paper. Seconds and milliseconds are time. Time entries are converted to distance with the selected paper speed so boxes and BPM stay consistent.',
  },
  {
    question: 'Does this work for irregular rhythms?',
    answer:
      'No. A single R–R interval only estimates instantaneous rate. For irregular rhythms, use a timed strip count (for example a 6-second strip × 10). This tool does not perform that method.',
  },
  {
    question: 'Are my measurements stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public page URL only.',
  },
];
