import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MSD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Mean Sac Diameter Calculator' },
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'formula', label: 'Formulas and Dating Window' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'msd-faq', label: 'Frequently Asked Questions' },
];

export const MSD_FAQS: readonly FAQItem[] = [
  {
    question: 'How is mean sac diameter calculated?',
    answer:
      'MSD is the arithmetic mean of three orthogonal inner gestational-sac diameters after converting each measurement to millimeters: (length + width + height) ÷ 3.',
  },
  {
    question: 'How is gestational age estimated?',
    answer:
      'When MSD is in the early educational window (about 2–15 mm), approximate menstrual age in days ≈ MSD (mm) + 30 (Hellman/Nyberg teaching). The result is labeled approximate and is blank outside that window.',
  },
  {
    question: 'Does this confirm a viable pregnancy or set my due date?',
    answer:
      'No. MSD sizing does not assess viability and should not replace clinical dating once a crown–rump length is measurable.',
  },
  {
    question: 'Are my ultrasound numbers stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public page URL only.',
  },
];
