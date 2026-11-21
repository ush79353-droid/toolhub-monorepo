import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INFANT_TYLENOL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Infant Tylenol Dosage Calculator' },
  { id: 'products', label: 'Supported Products' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'warnings', label: 'Acetaminophen Warnings' },
  { id: 'infant-tylenol-faq', label: 'Frequently Asked Questions' },
];

export const INFANT_TYLENOL_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this medical advice?',
    answer:
      'No. This is an educational lookup of published US OTC Drug Facts / brand dosing charts. Always confirm the carton in hand and ask a clinician or pharmacist when unsure.',
  },
  {
    question: 'Why prefer weight over age?',
    answer:
      'Tylenol® pediatric labels say: if possible, use weight to dose; otherwise use age. This calculator follows weight bands from the published charts.',
  },
  {
    question: 'What concentration is used for liquids?',
    answer:
      'Infant’s and Children’s oral suspensions use acetaminophen 160 mg per 5 mL (32 mg/mL). Chart doses are given in mL; milligram equivalents use mL × 32.',
  },
  {
    question: 'Can tablets or packets be split arbitrarily?',
    answer:
      'Only label-authorized steps are shown (for example, 1½ chewable tablets). Dissolve packs are whole packets only.',
  },
  {
    question: 'What about combining with other acetaminophen products?',
    answer:
      'Do not use with any other drug containing acetaminophen. Duplicate acetaminophen is a major overdose risk.',
  },
];
