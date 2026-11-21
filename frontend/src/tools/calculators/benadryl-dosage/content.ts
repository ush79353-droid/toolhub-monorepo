import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BENADRYL_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Benadryl Dosage Calculator' },
  { id: 'how-it-works', label: 'How Label Dosing Works' },
  { id: 'products', label: 'Supported Products' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'examples', label: 'Label Examples' },
  { id: 'limitations', label: 'Limitations & Safety' },
  { id: 'benadryl-faq', label: 'Frequently Asked Questions' },
];

export const BENADRYL_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this medical advice?',
    answer:
      'No. This calculator restates published US OTC Drug Facts / DailyMed age bands for selected Benadryl® (diphenhydramine HCl) oral products. Always follow the carton in hand and ask a clinician or pharmacist when unsure.',
  },
  {
    question: 'Why is age blank by default?',
    answer:
      'Medically actionable ages are not pre-filled. With age empty you can still read the product indication and the 24-hour maximum-dose note; enter age to map the matching label band.',
  },
  {
    question: 'Why can ULTRATAB show a maximum of 6 doses?',
    answer:
      'The ULTRATAB Drug Facts directions say take every 4 to 6 hours and do not take more than 6 times in 24 hours. That limit is label-derived, not invented.',
  },
  {
    question: 'Can children under 6 use ULTRATAB?',
    answer:
      'No. ULTRATAB directions list children under 6 years as “do not use.” Children’s liquid products have separate bands (under 2 do not use; ages 2–5 only if a doctor directs).',
  },
  {
    question: 'Does Share send my age or dose?',
    answer:
      'No. Share/copy uses only the public calculator page link so entered ages stay out of share payloads, URLs, and logs.',
  },
  {
    question: 'What if my package looks different?',
    answer:
      'Markets, generics, and combination products differ. Confirm active ingredient strength and the age table printed on your package before dosing.',
  },
];
