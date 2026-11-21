import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VTE_RISK_PREGNANCY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is This VTE Score?' },
  { id: 'scoring', label: 'How Scoring Works' },
  { id: 'thresholds', label: 'Antenatal and Postnatal Bands' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'vte-risk-pregnancy-faq', label: 'Frequently Asked Questions' },
];

export const VTE_RISK_PREGNANCY_FAQS: readonly FAQItem[] = [
  {
    question: 'Which guideline does this calculator follow?',
    answer:
      'It implements the educational point totals from RCOG Green-top Guideline No. 37a (April 2015) Appendix III, as commonly reproduced in NICE NG89 supporting material. It does not issue treatment orders.',
  },
  {
    question: 'Does a high score mean I need LMWH?',
    answer:
      'No. Score bands mirror RCOG appendix numerical thresholds for clinician consideration only. Prophylaxis decisions require a qualified clinician and full clinical context.',
  },
  {
    question: 'Why are previous VTE and surgery-provoked VTE exclusive?',
    answer:
      'RCOG lists them as separate prior-event categories (4 vs 3 points). Selecting both would double-count the same history, so this tool scores the non-surgery previous VTE category when both are ticked.',
  },
  {
    question: 'Why are ART/IVF and OHSS disabled postpartum?',
    answer:
      'Under RCOG Appendix III, ART/IVF contributes antenatally only, and OHSS is scored in the first trimester only. Postpartum situation excludes those points.',
  },
  {
    question: 'Is currency conversion involved?',
    answer: 'No. This calculator uses clinical risk factors and optional anthropometrics only.',
  },
];
