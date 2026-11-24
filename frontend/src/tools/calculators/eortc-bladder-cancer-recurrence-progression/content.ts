import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Sylvester RJ et al. Predicting Recurrence and Progression in Individual Patients with Stage Ta T1 Bladder Cancer Using EORTC Risk Tables: A Combined Analysis of 2596 Patients from Seven EORTC Trials. Eur Urol. 2006;49:466–477. WHO 1973 grading.';

export const DISCLAIMER =
  'Educational EORTC NMIBC risk-table worksheet only. It does not diagnose cancer, order surveillance or intravesical therapy, or replace multidisciplinary urologic care. Derivation-era treatment differs from contemporary BCG/maintenance pathways.';

export const EORTC_BLADDER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'EORTC Bladder Cancer Calculator' },
  { id: 'about-nmibc', label: 'About NMIBC' },
  { id: 'how-tables-work', label: 'How the Risk Tables Work' },
  { id: 'weights', label: 'Point Weights' },
  { id: 'probabilities', label: 'Probability Bins' },
  { id: 'limits', label: 'Limits and Contemporary Care' },
  { id: 'eortc-bladder-faq', label: 'Frequently Asked Questions' },
];

export const EORTC_BLADDER_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'It applies the Sylvester 2006 EORTC risk tables for non–muscle-invasive bladder cancer (Ta/T1 ± CIS) after TUR, reporting separate recurrence and progression point totals with published 1- and 5-year probability bins. It does not recommend therapy.',
  },
  {
    question: 'Which grading system is used?',
    answer:
      'The original tables use the 1973 WHO grades G1, G2, and G3. Contemporary 2004/2016 WHO low/high-grade labels are not remapped here—enter the grade as reported on the pathology used with these tables.',
  },
  {
    question: 'Why are results blank until every question is answered?',
    answer:
      'All six factors are required for a valid EORTC total. Incomplete answers do not produce a score or probability.',
  },
  {
    question: 'Does this apply after modern BCG or early single-dose chemotherapy?',
    answer:
      'The derivation cohort (1979–1989 EORTC trials) largely received older intravesical chemotherapy patterns and little BCG maintenance. Risks can overestimate outcomes under contemporary NMIBC pathways. Use only as educational framing with a clinician.',
  },
  {
    question: 'Are my answers stored or shared?',
    answer:
      'No. Share and copy use the public page URL only—never tumor answers or numeric scores.',
  },
];
