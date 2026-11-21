import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PARACETAMOL_DOSAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What This Calculator Does' },
  { id: 'formula', label: 'mg/kg Formula' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'limits', label: 'Age Gates and Caps' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'faq', label: 'Frequently Asked Questions' },
];

export const PARACETAMOL_DOSAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the single dose calculated?',
    answer:
      'Educational single dose = 15 mg × body weight in kilograms, then capped at 1,000 mg. Example: 21 kg → 315 mg.',
  },
  {
    question: 'How is the daily maximum calculated?',
    answer:
      'Educational daily maximum = 60 mg × kilograms (equivalent to four single doses when uncapped), capped at 4,000 mg/day. Wait at least 4 hours between doses.',
  },
  {
    question: 'Why is age required if dosing is by weight?',
    answer:
      'Age gates infants under 3 months (seek a clinician) and keeps this tool in the pediatric educational range (through 17 years). Product leaflets may still use age bands by formulation.',
  },
  {
    question: 'Is this the same as NHS age-band volumes?',
    answer:
      'No. NHS/BNFC often publish age-band mL doses for specific strengths (e.g. 120 mg/5 mL). This tool shows a weight-based mg ceiling. Use the Infant Tylenol Dosage Calculator for US OTC label forms, and always follow your product leaflet.',
  },
];
