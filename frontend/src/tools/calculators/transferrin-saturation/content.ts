import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TSAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What is transferrin saturation?' },
  { id: 'formula', label: 'Transferrin saturation formula' },
  { id: 'reference', label: 'Transferrin saturation reference values' },
  { id: 'interpretation', label: 'Interpretation of saturation values' },
  { id: 'tsat-faq', label: 'FAQs' },
];

export const TSAT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is transferrin saturation calculated from TIBC?',
    answer:
      'TSAT (%) = (serum iron ÷ TIBC) × 100, with both values in the same iron units (e.g. µg/dL). Example: Fe 100 µg/dL and TIBC 400 µg/dL → 25%.',
  },
  {
    question: 'How is transferrin saturation calculated from serum transferrin?',
    answer:
      'TSAT (%) = (serum iron ÷ transferrin) × 70.9 when Fe is in µg/dL and transferrin in mg/dL (StatPearls / Omni factor from two Fe atoms per transferrin).',
  },
  {
    question: 'Are the two methods identical?',
    answer:
      'They estimate the same concept but can differ slightly because TIBC is chemical and transferrin is immunologic. Each panel works independently.',
  },
  {
    question: 'Are my lab values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
