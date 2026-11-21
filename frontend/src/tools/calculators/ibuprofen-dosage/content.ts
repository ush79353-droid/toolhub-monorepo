import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IBUPROFEN_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Ibuprofen Dosage Calculator' },
  { id: 'products', label: 'Supported Products' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'examples', label: 'Weight Examples' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'ibuprofen-dosage-faq', label: 'Frequently Asked Questions' },
];

export const IBUPROFEN_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this medical advice?',
    answer:
      'No. This calculator restates published US OTC Infants’ and Children’s MOTRIN® (ibuprofen) oral suspension weight charts for education. Always follow the carton in hand and ask a clinician or pharmacist before giving medicine.',
  },
  {
    question: 'Why is weight blank by default?',
    answer:
      'Medically actionable weights are not pre-filled. The “6+ months” checkbox alone never unlocks a dose — you must enter a validated weight that maps to a labeled chart band.',
  },
  {
    question: 'Which products are supported?',
    answer:
      'Infants’ MOTRIN® Oral Suspension Drops (50 mg/1.25 mL) for roughly 12–23 lb, and Children’s MOTRIN® Oral Suspension (100 mg/5 mL) for roughly 24–95 lb, per DailyMed / FDA Drug Facts weight tables.',
  },
  {
    question: 'How often can a dose be repeated?',
    answer:
      'Label directions: if needed, every 6–8 hours; do not use more than 4 times in 24 hours. Use only the enclosed dosing device.',
  },
  {
    question: 'Does Share send the child’s weight or dose?',
    answer:
      'No. Share/copy uses only the public calculator page link so entered weights and calculated doses stay out of share payloads, URLs, and logs.',
  },
];
