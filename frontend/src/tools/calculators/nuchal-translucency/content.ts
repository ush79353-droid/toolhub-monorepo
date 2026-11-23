import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Nuchal Translucency Calculator' },
  { id: 'what-is-nt', label: 'What Is NT?' },
  { id: 'formulas', label: 'Formulas and Tables' },
  { id: 'discrepancies', label: 'Reference vs Screenshot' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'nt-faq', label: 'Frequently Asked Questions' },
];

export const NT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this nuchal translucency calculator do?',
    answer:
      'It estimates expected median NT from CRL (Chung), maps measured NT to an educational centile band by CRL, and plots NT vs gestational age. It does not replace combined first-trimester screening or genetic counseling.',
  },
  {
    question: 'Why is gestational age 78 days for CRL 45 mm, not 79?',
    answer:
      'This tool uses Robinson–Fleming GA (days) = 8.052×√CRL + 23.73 with a single round to the nearest whole day. That yields 78 days for 45 mm. Some UI references show 79 days without that rounding rule.',
  },
  {
    question: 'Why is NT 1.34 mm not labeled as exactly 75th percentile?',
    answer:
      'At CRL 45 mm the interpolated 75th centile NT is about 1.1 mm and the 95th about 1.8 mm. Measured 1.34 mm falls between them (~82nd on this table). We do not force a 75th label to match third-party screenshots.',
  },
  {
    question: 'Are my ultrasound values stored?',
    answer:
      'No. Entries stay in your browser. Share and copy use the public tool URL only — never CRL, NT, or gestational age.',
  },
];