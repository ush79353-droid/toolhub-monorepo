import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FFP_DOSE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'dosing', label: 'Published dosing ranges' },
  { id: 'assumptions', label: 'Assumptions & limits' },
  { id: 'faq', label: 'FAQ' },
];

export const FFP_DOSE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total plasma dose calculated?',
    answer:
      'Total plasma volume (mL) = patient weight (kg) × ordered dose (mL/kg). The default 15 mL/kg matches the AABB Circular of Information “standard dose of plasma (~15 mL/kg)” reference; pediatric plasma is often cited as 10–15 mL/kg. Your ordered rate may differ—enter the mL/kg your clinician specified.',
  },
  {
    question: 'What do “units needed” mean?',
    answer:
      'Equivalent units = total plasma mL ÷ unit (bag) volume mL. The value is left fractional (for example 5.25). It is an arithmetic equivalent, not a blood-bank issue quantity—do not silently round or treat it as an order.',
  },
  {
    question: 'Why is unit volume editable?',
    answer:
      'AABB notes average FFP units contain about 200–250 mL, while apheresis units may be 400–600 mL. Enter the labeled bag volume you are using.',
  },
  {
    question: 'Are patient details stored or shared?',
    answer:
      'No. Inputs stay in the browser. Share copies only the public calculator page URL—never weight or dose values.',
  },
];
