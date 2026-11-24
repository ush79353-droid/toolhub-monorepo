import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HYDROXYCHLOROQUINE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Hydroxychloroquine Dose Checker' },
  { id: 'fda-threshold', label: 'FDA threshold & labeled ranges' },
  { id: 'hydroxychloroquine-faq', label: 'Frequently Asked Questions' },
];

export const HYDROXYCHLOROQUINE_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this calculator prescribe a dose from my weight?',
    answer:
      'No. You must enter a custom daily dose. The tool only converts that regimen to mg/kg/day using actual body weight and compares it with FDA labeling. It never invents milligrams per day from weight alone.',
  },
  {
    question: 'Which body weight definition is used?',
    answer:
      'Actual body weight. FDA PLAQUENIL labeling discusses retinopathy risk for daily hydroxychloroquine sulfate dosages ≥5 mg/kg of actual body weight. Ideal body weight is not used in this checker.',
  },
  {
    question: 'What absolute daily ranges appear on the label?',
    answer:
      'For adults, DailyMed/FDA lists rheumatoid arthritis initial 400–600 mg daily and chronic 200–400 mg daily; systemic lupus erythematosus and chronic discoid lupus erythematosus 200 mg once daily or 400 mg once daily (or in two divided doses). Those absolute ranges are educational context alongside the mg/kg/day comparison.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only — weight and dose are not put in the link.',
  },
];
