import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ADDERALL_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'About This Tool' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'ir-label', label: 'IR Label Context' },
  { id: 'custom-math', label: 'Prescribed-Dose Tablet Math' },
  { id: 'limits', label: 'Safety Limits' },
  { id: 'adderall-faq', label: 'Frequently Asked Questions' },
];

export const ADDERALL_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator prescribe Adderall?',
    answer:
      'No. ADHD and Narcolepsy modes show educational immediate-release label/chart context only. Custom mode converts a dose already specified by a licensed prescriber into tablet quantity arithmetic. It never starts, increases, or changes therapy.',
  },
  {
    question: 'Which strengths are supported?',
    answer:
      'DailyMed-listed Adderall immediate-release tablet strengths: 5, 7.5, 10, 12.5, 15, 20, and 30 mg. Adderall XR (extended-release) is intentionally out of scope for this tool.',
  },
  {
    question: 'What if the tablet quantity is fractional?',
    answer:
      'The tool shows the mathematical value and warns that tablets must not be assumed split-able. Confirm formulation and dispensing with the prescribing clinician or pharmacist — never round into a different dose on your own.',
  },
];
