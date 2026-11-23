import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ABSOLUTE_LYMPHOCYTE_COUNT_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Absolute Lymphocyte Count Calculator' },
    { id: 'formula', label: 'How ALC Is Calculated' },
    { id: 'units', label: 'Unit Conventions' },
    { id: 'clinical', label: 'Clinical Context' },
    { id: 'alc-faq', label: 'Frequently Asked Questions' },
  ];

export const ABSOLUTE_LYMPHOCYTE_COUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the absolute lymphocyte count?',
    answer:
      'It is the actual number of lymphocytes per unit volume of blood, derived from the total white blood cell count and the lymphocyte percentage on the CBC differential.',
  },
  {
    question: 'What formula does this calculator use?',
    answer:
      'ALC (×10³/µL) = WBC (×10³/µL) × (lymphocyte % ÷ 100). Example: WBC 6 and lymphocytes 25% give 1.5 ×10³/µL (1500 cells/µL).',
  },
  {
    question: 'What is the difference between ×10³/µL and cells/µL?',
    answer:
      '×10³/µL means thousands of cells per microliter. Multiply by 1000 to get cells/µL: 1.5 ×10³/µL = 1500 cells/µL. Do not enter WBC already scaled to cells/µL into a field labeled ×10³/µL.',
  },
  {
    question: 'Why are ×10³/µL and ×10⁹/L the same number here?',
    answer:
      'Lab reports often label WBC and ALC in thousands per microliter (×10³/µL) or billions per liter (×10⁹/L). For these conventional CBC units the numeric value is identical—only the unit label changes.',
  },
  {
    question: 'Are my lab values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only, not your numbers.',
  },
];