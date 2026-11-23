import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CLOMID_OVULATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Clomid Ovulation Calculator' },
  { id: 'what-it-does', label: 'What This Calculator Does' },
  { id: 'formula', label: 'Timing Formula' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'clomid-faq', label: 'Frequently Asked Questions' },
];

export const CLOMID_OVULATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Clomid ovulation calculator show?',
    answer:
      'It maps an educational approximate ovulation window from a prescribed clomiphene course start date and inclusive duration. It does not confirm that ovulation occurred.',
  },
  {
    question: 'How is the window calculated?',
    answer:
      'Last treatment day = start + duration − 1 (inclusive course). The approximate window is 5–10 calendar days after that last day, matching DailyMed labeling language for clomiphene citrate.',
  },
  {
    question: 'Why is the “ovulation date” a range?',
    answer:
      'There is no single clinically approved predicted ovulation day from calendar math alone. The screenshot keeps an “Ovulation date” label; this tool fills it with the approximate window so a single date is not presented as confirmation.',
  },
  {
    question: 'Does this set my Clomid dose?',
    answer:
      'No. Dose, start cycle day, monitoring, and trigger decisions belong with the prescribing clinician. Enter only the dates and duration from an existing prescription.',
  },
  {
    question: 'Are my dates stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public tool URL only — never treatment dates or the window.',
  },
];
