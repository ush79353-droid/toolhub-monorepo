import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ABSOLUTE_EOSINOPHIL_COUNT_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Absolute Eosinophil Count Calculator' },
    { id: 'formula', label: 'How AEC Is Calculated' },
    { id: 'units', label: 'Unit Conventions' },
    { id: 'clinical', label: 'Clinical Context' },
    { id: 'aec-faq', label: 'Frequently Asked Questions' },
  ];

export const ABSOLUTE_EOSINOPHIL_COUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the absolute eosinophil count?',
    answer:
      'It is the actual number of eosinophils per unit volume of blood, derived from the total white blood cell count and the eosinophil percentage on the CBC differential.',
  },
  {
    question: 'What formula does this calculator use?',
    answer:
      'AEC (×10³/µL) = WBC (×10³/µL) × (eosinophil % ÷ 100). Example: WBC 8 and eosinophils 5% give 0.4 ×10³/µL.',
  },
  {
    question: 'Why are ×10³/µL and ×10⁹/L the same number here?',
    answer:
      'Lab reports often label WBC and AEC in thousands per microliter (×10³/µL) or billions per liter (×10⁹/L). For these conventional CBC units the numeric value is identical—only the unit label changes.',
  },
  {
    question: 'Are my lab values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only, not your numbers.',
  },
];