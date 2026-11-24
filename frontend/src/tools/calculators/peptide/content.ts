import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PEPTIDE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Peptide Calculator' },
  { id: 'formula', label: 'Formula' },
  { id: 'faq', label: 'FAQ' },
];

export const PEPTIDE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'Concentration = labeled vial mass ÷ diluent volume; draw volume = dose ÷ concentration; syringe marks = volume × marks per mL.',
  },
  {
    question: 'What are syringe “units”?',
    answer:
      'Barrel graduation marks only. You must enter the syringe’s marks-per-mL calibration. They are not peptide activity units.',
  },
];
