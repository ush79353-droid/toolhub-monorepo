import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANC_ABSOLUTE_NEUTROPHIL_COUNT_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'ANC Calculator' },
    { id: 'formula', label: 'How ANC Is Calculated' },
    { id: 'units', label: 'Unit Conventions' },
    { id: 'clinical', label: 'Clinical Context' },
    { id: 'anc-faq', label: 'Frequently Asked Questions' },
  ];

export const ANC_ABSOLUTE_NEUTROPHIL_COUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the absolute neutrophil count (ANC)?',
    answer:
      'ANC is the actual number of neutrophils per unit volume of blood, derived from the total white blood cell count and the neutrophil differential (segmented neutrophils plus band forms) on the CBC.',
  },
  {
    question: 'What formula does this calculator use?',
    answer:
      'ANC (×10³/µL) = WBC (×10³/µL) × ((segs % + bands %) ÷ 100). Example: WBC 5, segs 40%, and bands 2% give ANC 2.1 ×10³/µL.',
  },
  {
    question: 'Why must segs and bands together be ≤ 100%?',
    answer:
      'Both percentages are fractions of the same total white blood cell differential. Their sum cannot exceed 100% without contradictory lab entries.',
  },
  {
    question: 'Why are ×10³/µL and ×10⁹/L the same number here?',
    answer:
      'Lab reports often label WBC and ANC in thousands per microliter (×10³/µL) or billions per liter (×10⁹/L). For these conventional CBC units the numeric value is identical—only the unit label changes.',
  },
  {
    question: 'Are my lab values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only, not your numbers.',
  },
];