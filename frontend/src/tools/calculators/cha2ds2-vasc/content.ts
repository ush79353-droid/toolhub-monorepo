import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CHA2DS2_VASC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'CHA₂DS₂-VASc Score' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'scoring', label: 'Scoring & Rates' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'cha2-faq', label: 'Frequently Asked Questions' },
];

export const CHA2DS2_VASC_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this decide anticoagulation?',
    answer:
      'No. It shows an educational score and published cohort annual rates. Therapy choices belong with a clinician familiar with the patient and current guidelines.',
  },
  {
    question: 'Where do the annual percentages come from?',
    answer:
      'Friberg et al., European Heart Journal 2012 — Swedish AF patients who never used warfarin. Unadjusted ischaemic stroke and stroke/TIA/peripheral embolism rates by score.',
  },
  {
    question: 'What about female sex alone?',
    answer:
      'Female sex contributes 1 point. Many guidelines treat score 1 from sex alone similarly to score 0 in men for risk banding; this calculator still displays the Friberg score-1 rate row and notes the nuance.',
  },
  {
    question: 'Does Share send clinical answers?',
    answer: 'No. Share/copy uses only the public page URL.',
  },
];
