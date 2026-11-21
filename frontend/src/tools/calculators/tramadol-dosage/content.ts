import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TRAMADOL_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'conversion', label: 'Prescribed Amount Conversion' },
  { id: 'ceilings', label: 'Educational Ceilings' },
  { id: 'limits', label: 'Age and Organ Limits' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'faq', label: 'Frequently Asked Questions' },
];

export const TRAMADOL_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Why is there no recommended starting dose?',
    answer:
      'The project prompt forbids public prescribing/titration for this opioid. Enter only a daily milligram amount your clinician already prescribed, then convert to whole extended-release tablets.',
  },
  {
    question: 'Can I split extended-release tablets?',
    answer:
      'No. Daily mg must be an exact multiple of the selected tablet strength. Fractional tablets are rejected.',
  },
  {
    question: 'What do the educational maxima mean?',
    answer:
      'They are teaching ceilings for common adult scenarios (e.g., chronic ~300 mg/day; acute teaching max ~400 mg/day; ~200 mg/day when CrCl <30 or cirrhosis is flagged). They are not a prescription.',
  },
];
