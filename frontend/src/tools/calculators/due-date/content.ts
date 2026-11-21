import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DUE_DATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is a Due Date Calculator?' },
  { id: 'acog', label: 'ACOG-Style Dating Methods' },
  { id: 'how-to', label: 'How to Use This Calculator' },
  { id: 'limits', label: 'Limitations' },
  { id: 'due-date-faq', label: 'Frequently Asked Questions' },
];

export const DUE_DATE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the due date calculated from my last period?',
    answer:
      'For a typical 28-day cycle, the estimate adds 280 days (40 weeks) to the first day of your last menstrual period — the classic Naegele-style rule discussed in ACOG guidance on estimating due dates. If your average cycle is longer or shorter, the estimate adds (cycle − 28) days.',
  },
  {
    question: 'What if I know the conception date instead?',
    answer:
      'Choose “Date I conceived.” The estimate adds 266 days (about 38 weeks) from that conception date. Cycle length is hidden in this mode because it is not used.',
  },
  {
    question: 'Is this the same as an ultrasound due date?',
    answer:
      'No. Ultrasound dating and clinical obstetric dating can differ from calendar LMP or conception estimates. This tool is educational only and does not replace prenatal care.',
  },
  {
    question: 'Which cycle lengths are supported?',
    answer:
      'Regular cycles from 21 to 45 days. Extremely irregular cycles need clinician guidance rather than a simple cycle adjustment.',
  },
  {
    question: 'Is my date stored or shared?',
    answer:
      'No. Dates stay in your browser session. Share uses the public calculator page URL without embedding your dates.',
  },
];
