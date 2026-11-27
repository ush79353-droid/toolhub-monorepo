import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM. Assessment of alcohol withdrawal: the revised clinical institute withdrawal assessment for alcohol scale (CIWA-Ar). British Journal of Addiction. 1989;84:1353–1357. Educational severity bands commonly discussed with CIWA-Ar totals (<10 / 10–20 / >20) are literature framing only — not dosing protocols.';

export const DISCLAIMER =
  'Educational CIWA-Ar scoring worksheet only. It does not diagnose alcohol withdrawal, replace bedside assessment, or prescribe benzodiazepines or any other medication. Use only in appropriate clinical contexts by trained clinicians. Seek emergency care for severe or worsening symptoms.';

export const CIWA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'CIWA Calculator' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'ciwa-ar', label: 'CIWA-Ar Items' },
  { id: 'scoring', label: 'Scoring' },
  { id: 'limits', label: 'Limits' },
  { id: 'ciwa-faq', label: 'Frequently Asked Questions' },
];

export const CIWA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is CIWA-Ar?',
    answer:
      'CIWA-Ar is the revised Clinical Institute Withdrawal Assessment for Alcohol (Sullivan et al., 1989): ten items that quantify alcohol-withdrawal symptom severity. Nine items score 0–7; orientation scores 0–4; maximum total 67.',
  },
  {
    question: 'What is the difference between 0 and Not assessed?',
    answer:
      '0 means the rater observed absence of that symptom. “Not assessed” means the item was not rated; the total stays incomplete until all ten items are scored.',
  },
  {
    question: 'Does a high score tell me which medicine to give?',
    answer:
      'No. This worksheet never issues medication doses or automatic treatment orders. Severity bands are educational context only.',
  },
];
