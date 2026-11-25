import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_NOTE =
  'BODE Index (Celli BR et al., N Engl J Med 2004;350:1005-12): BMI ≤21; FEV1 % predicted; 6-minute walk distance; mMRC dyspnea. Educational COPD prognostic worksheet only.';

export const DISCLAIMER =
  'Educational worksheet only — not a prognosis order, treatment plan, or substitute for clinical judgment. Confirm with the original publication and local COPD pathways.';

export const BODE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'BODE Index Calculator' },
  { id: 'what-is-bode', label: 'What is the BODE Index?' },
  { id: 'how-to-score', label: 'How to calculate BODE score' },
  { id: 'interpretation', label: 'BODE Index interpretation' },
  { id: 'bode-faq', label: 'Frequently Asked Questions' },
];

export const BODE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does BODE stand for?',
    answer:
      'Body-mass index, airflow Obstruction (FEV1 % predicted), Dyspnea (mMRC), and Exercise capacity (6-minute walk). Celli et al., NEJM 2004.',
  },
  {
    question: 'How is BMI scored?',
    answer:
      'BMI ≤ 21 scores 1 point; BMI > 21 scores 0. The checkbox means “BMI over 21.” Leaving it unanswered is not treated as low BMI.',
  },
  {
    question: 'Are walk-distance cutoffs inclusive?',
    answer:
      'Yes, per the publication table: ≥350 m = 0; 250–349 = 1; 150–249 = 2; ≤149 = 3. So 350 m is the zero-point band and 349 m is one point.',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Values stay in your browser. Share uses the public page URL only — never the score inputs.',
  },
];
