import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BUN_CREATININE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Blood urea nitrogen (BUN) vs creatinine' },
  {
    id: 'how-to-calculate',
    label: 'BUN creatinine ratio calculator — how to calculate',
  },
  { id: 'high-low', label: 'BUN creatinine ratio — high and low values' },
  { id: 'bun-levels', label: 'Blood urea nitrogen — levels and definition' },
  { id: 'bun-cr-faq', label: 'Frequently Asked Questions' },
];

export const BUN_CREATININE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the BUN/creatinine ratio calculated?',
    answer:
      'Convert both values to mg/dL, then divide BUN by serum creatinine. The result is dimensionless. Example: BUN 20 mg/dL ÷ creatinine 1 mg/dL = 20.',
  },
  {
    question: 'What is the difference between BUN and urea?',
    answer:
      'BUN reports only the nitrogen portion of urea. Many labs outside the U.S. report whole urea (often mmol/L). This calculator converts urea units to BUN mg/dL before computing the ratio.',
  },
  {
    question: 'What ratio band is commonly taught?',
    answer:
      'A conventional adult teaching band is about 10–20 (mg/dL ÷ mg/dL), with >20 often labeled high/prerenal-pattern and <10 low — educational only, not a diagnosis (Acute Care Testing; common textbook cut-offs).',
  },
  {
    question: 'Are lab values stored or shared?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only — never the numbers you typed.',
  },
];
