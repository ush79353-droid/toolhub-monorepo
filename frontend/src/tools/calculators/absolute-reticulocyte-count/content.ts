import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ABSOLUTE_RETICULOCYTE_COUNT_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Absolute Reticulocyte Count Calculator' },
    { id: 'formula', label: 'How ARC Is Calculated' },
    { id: 'corrected', label: 'Corrected vs Absolute' },
    { id: 'clinical', label: 'Clinical Context' },
    { id: 'arc-faq', label: 'Frequently Asked Questions' },
  ];

export const ABSOLUTE_RETICULOCYTE_COUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the absolute reticulocyte count?',
    answer:
      'It is the number of reticulocytes per microliter of blood (cells/µL), computed as red blood cell count × (reticulocyte percentage ÷ 100).',
  },
  {
    question: 'What formula does this calculator use?',
    answer:
      'True ARC = RBC (cells/µL) × (retic % ÷ 100). When RBC is not entered, RBC is estimated as 5,000,000 cells/µL × (patient Hct ÷ normal Hct). Example at Hct 45%, normal Hct 45%, retic 1%: estimated RBC 5,000,000 and ARC 50,000 cells/µL.',
  },
  {
    question: 'What is corrected reticulocyte percentage?',
    answer:
      'Corrected retic % = reticulocyte % × (patient Hct ÷ normal Hct). It adjusts the reported percentage for anemia. It is not the same as absolute reticulocyte count.',
  },
  {
    question: 'Why is RBC estimated from hematocrit?',
    answer:
      'Hematocrit alone does not uniquely determine RBC count (MCV varies). This tool uses a teaching reference—5 million RBC/µL at normal Hct—scaled by the Hct ratio. Use measured RBC from the CBC when you need a true ARC.',
  },
  {
    question: 'Are my lab values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only, not your numbers.',
  },
];