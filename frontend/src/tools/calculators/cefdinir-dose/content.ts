import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CEFDINIR_DOSE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cefdinir Dose Calculator' },
  { id: 'regimens', label: 'Labeled regimens' },
  { id: 'cefdinir-faq', label: 'Frequently Asked Questions' },
];

export const CEFDINIR_DOSE_FAQS: readonly FAQItem[] = [
  {
    question: 'What age groups does Omnicef labeling use?',
    answer:
      'Capsule regimens apply to adults and adolescents age 13 years and older. Oral suspension regimens apply to children 6 months through 12 years.',
  },
  {
    question: 'Why is weight required for children?',
    answer:
      'Pediatric doses are 7 mg/kg every 12 hours (14 mg/kg/day, maximum 600 mg/day). The tool needs weight in kilograms to compute the milligram dose per administration.',
  },
  {
    question: 'Is community-acquired pneumonia labeled for children?',
    answer:
      'No. CAP is listed for adults and adolescents ≥13 years only. Pediatric labeled uses include otitis media, sinusitis, pharyngitis/tonsillitis, and uncomplicated skin infections.',
  },
  {
    question: 'Are patient details stored or shared?',
    answer:
      'No. Selections stay in the browser. Share copies only the public calculator page URL—never clinical inputs.',
  },
];