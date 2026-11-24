import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FENA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What is FENa?' },
  { id: 'required-labs', label: 'Required lab test results' },
  { id: 'formula', label: 'FENa formula' },
  { id: 'interpretation', label: 'Interpretation of results' },
  { id: 'fena-faq', label: 'Frequently Asked Questions' },
];

export const FENA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is FENa?',
    answer:
      'Fractional excretion of sodium (FENa) estimates the percentage of filtered sodium that is excreted in urine. It uses paired serum and urine sodium and creatinine.',
  },
  {
    question: 'Which units does this calculator use?',
    answer:
      'Serum and urine creatinine in mg/dL; serum and urine sodium in mmol/L (equivalent to mEq/L). Match units between serum and urine for each analyte.',
  },
  {
    question: 'What does FENa <1% or >2% mean?',
    answer:
      'Classic teaching maps <1% toward a prerenal pattern and >2% toward intrinsic renal injury when diuretics are absent and CKD is not advanced. These bands are educational only and do not diagnose AKI by themselves.',
  },
  {
    question: 'When is FENa unreliable?',
    answer:
      'Loop or thiazide diuretics, advanced chronic kidney disease, and mixed or evolving injuries can make classic thresholds misleading. Clinical context always comes first.',
  },
  {
    question: 'Are lab values stored?',
    answer:
      'No. Values stay in your browser; share uses the public page URL only — never the entered labs.',
  },
];
