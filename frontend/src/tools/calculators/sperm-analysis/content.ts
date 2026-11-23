import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SPERM_ANALYSIS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Sperm Analysis Calculator' },
  { id: 'formula', label: 'Total and Functional Sperm' },
  { id: 'motility', label: 'Motility Input' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'sa-faq', label: 'Frequently Asked Questions' },
];

export const SPERM_ANALYSIS_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total sperm calculated?',
    answer:
      'Total sperm (million) = ejaculate volume in mL × sperm concentration in million/mL. Example: 3 mL × 20 million/mL = 60 million.',
  },
  {
    question: 'How is functional sperm estimated?',
    answer:
      'This tool uses a product-based educational estimate: total × (motility/100) × (vitality/100) × (morphology/100). Separate lab percentages do not prove the true overlap of living, motile, and normally shaped sperm, so the result is labeled as an estimate—not a WHO patient diagnosis.',
  },
  {
    question: 'What does “Normal motility %” mean here?',
    answer:
      'It matches the screenshot field and is used as the motility fraction in the product model (teaching calculators often use progressive motility). It is not a graded WHO motility class report (A/B/C/D).',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Inputs stay in the browser. Share and copy use the public page URL only—never the semen parameters.',
  },
];
