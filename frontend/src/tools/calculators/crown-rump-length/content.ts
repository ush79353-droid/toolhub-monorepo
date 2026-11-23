import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CRL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Crown-rump Length Calculator' },
  { id: 'what-is-crl', label: 'What Is CRL?' },
  { id: 'formula', label: 'Robinson–Fleming Formula' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'examples', label: 'Worked Examples' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'crl-faq', label: 'Frequently Asked Questions' },
];

export const CRL_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this crown–rump length calculator do?',
    answer:
      'It estimates menstrual gestational age from a first-trimester ultrasound CRL using the Robinson–Fleming equation. It is educational only and does not replace a clinical report.',
  },
  {
    question: 'Which formula is used?',
    answer:
      'GA (days) = 8.052 × √(CRL in mm) + 23.73, then rounded to the nearest whole day and split into weeks and remainder days (Robinson HP, Fleming JE, 1975).',
  },
  {
    question: 'What CRL range is supported?',
    answer:
      'Educational bounds are 5–84 mm. Shorter lengths are outside the validated teaching range used here; longer lengths typically need other biometry after about 14 weeks.',
  },
  {
    question: 'Can I enter centimeters or inches?',
    answer:
      'Yes. Choose mm, cm, or in; the engine converts to millimeters before applying Robinson–Fleming and preserves the physical length when you switch units.',
  },
  {
    question: 'Are my measurements stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public tool URL only — never the CRL or gestational age.',
  },
];
